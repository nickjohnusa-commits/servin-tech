import { WebSocket } from "ws";
import OpenAI from "openai";
import { LeadExtractor } from "./lead-extractor";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type TwilioMessage =
  | { event: "start"; start: { streamSid: string; customParameters: Record<string, string> } }
  | { event: "media"; media: { payload: string; timestamp: string; track: string } }
  | { event: "stop"; stop: { accountSid: string } };

type TranscriptEntry = {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

export class StreamHandler {
  private twilioWs: WebSocket;
  private orgId: string;
  private streamSid: string = "";
  private businessName: string = "";
  private language: string = "AUTO";
  private testMode: boolean = false;
  private realtimeWs: WebSocket | null = null;
  private transcript: TranscriptEntry[] = [];
  private callSid: string = "";
  private callerPhone: string = "";
  private startTime: number = Date.now();
  private audioBuffer: Buffer[] = [];

  constructor(twilioWs: WebSocket, orgId: string) {
    this.twilioWs = twilioWs;
    this.orgId = orgId;
  }

  start() {
    this.twilioWs.on("message", (raw: Buffer) => {
      try {
        const msg = JSON.parse(raw.toString()) as TwilioMessage;
        this.handleTwilioMessage(msg);
      } catch {
        // ignore parse errors
      }
    });

    this.twilioWs.on("close", () => {
      this.handleCallEnd();
    });
  }

  private handleTwilioMessage(msg: TwilioMessage) {
    switch (msg.event) {
      case "start":
        this.streamSid = msg.start.streamSid;
        this.businessName = decodeURIComponent(
          msg.start.customParameters.businessName ?? ""
        );
        this.language = msg.start.customParameters.language ?? "AUTO";
        this.testMode = msg.start.customParameters.testMode === "true";
        this.callSid = msg.start.customParameters.callSid ?? this.streamSid;
        this.callerPhone = msg.start.customParameters.from ?? "";
        this.connectToOpenAI();
        break;

      case "media":
        if (this.realtimeWs?.readyState === WebSocket.OPEN) {
          this.realtimeWs.send(
            JSON.stringify({
              type: "input_audio_buffer.append",
              audio: msg.media.payload,
            })
          );
        }
        break;

      case "stop":
        this.handleCallEnd();
        break;
    }
  }

  private connectToOpenAI() {
    this.realtimeWs = new WebSocket(
      "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01",
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "OpenAI-Beta": "realtime=v1",
        },
      }
    );

    this.realtimeWs.on("open", () => {
      this.sendSessionConfig();
    });

    this.realtimeWs.on("message", (raw: Buffer) => {
      try {
        const event = JSON.parse(raw.toString());
        this.handleRealtimeEvent(event);
      } catch {
        // ignore
      }
    });

    this.realtimeWs.on("error", (err) => {
      console.error("[voice-server] OpenAI Realtime error:", err.message);
    });
  }

  private sendSessionConfig() {
    if (!this.realtimeWs) return;

    const systemPrompt = this.buildSystemPrompt();

    this.realtimeWs.send(
      JSON.stringify({
        type: "session.update",
        session: {
          modalities: ["text", "audio"],
          instructions: systemPrompt,
          voice: "alloy",
          input_audio_format: "g711_ulaw",
          output_audio_format: "g711_ulaw",
          input_audio_transcription: { model: "whisper-1" },
          turn_detection: {
            type: "server_vad",
            threshold: 0.5,
            prefix_padding_ms: 300,
            silence_duration_ms: 800,
          },
        },
      })
    );
  }

  private buildSystemPrompt(): string {
    const lang = this.language;
    const name = this.businessName;

    if (lang === "ES") {
      return `Eres la recepcionista de IA de ${name}. Responde siempre en español.
Recopila: tipo de trabajo, urgencia (1-10), dirección, presupuesto aproximado, horario preferido.
Sé breve y amigable. Al final diles que el equipo les contactará pronto.`;
    }

    return `You are the AI receptionist for ${name}, a home services contractor.
Language: ${lang === "AUTO" ? "detect from caller, respond in same language" : "English only"}.
Collect in order: 1) job type, 2) urgency 1-10, 3) address, 4) budget range, 5) preferred appointment.
Keep responses under 3 sentences. After collecting all info, summarize and say the team will follow up shortly.
If caller speaks Spanish, switch to Spanish immediately.`;
  }

  private handleRealtimeEvent(event: { type: string; [key: string]: unknown }) {
    switch (event.type) {
      case "response.audio.delta": {
        const delta = event.delta as string;
        if (this.twilioWs.readyState === WebSocket.OPEN) {
          this.twilioWs.send(
            JSON.stringify({
              event: "media",
              streamSid: this.streamSid,
              media: { payload: delta },
            })
          );
        }
        break;
      }

      case "conversation.item.input_audio_transcription.completed": {
        const transcript = event.transcript as string;
        if (transcript) {
          this.transcript.push({
            role: "user",
            content: transcript,
            timestamp: new Date().toISOString(),
          });
        }
        break;
      }

      case "response.audio_transcript.done": {
        const transcript = event.transcript as string;
        if (transcript) {
          this.transcript.push({
            role: "assistant",
            content: transcript,
            timestamp: new Date().toISOString(),
          });
        }
        break;
      }
    }
  }

  private async handleCallEnd() {
    if (this.realtimeWs) {
      this.realtimeWs.close();
      this.realtimeWs = null;
    }

    if (this.transcript.length === 0) return;

    const durationSecs = Math.floor((Date.now() - this.startTime) / 1000);
    const extractor = new LeadExtractor(openai);

    try {
      const [qualData, summary, language] = await Promise.all([
        extractor.extractQualificationData(this.transcript),
        extractor.generateSummary(this.transcript, this.businessName),
        extractor.detectLanguage(this.transcript),
      ]);

      const appUrl = process.env.NEXT_APP_URL ?? "http://localhost:3000";

      await fetch(`${appUrl}/api/internal/call-complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-internal-secret": process.env.INTERNAL_API_SECRET ?? "",
        },
        body: JSON.stringify({
          orgId: this.orgId,
          callSid: this.callSid,
          callerPhone: this.callerPhone,
          transcript: this.transcript,
          qualificationData: qualData,
          durationSecs,
          languageDetected: language,
          aiSummary: summary,
        }),
      });
    } catch (err) {
      console.error("[voice-server] Failed to post call-complete:", err);
    }
  }
}

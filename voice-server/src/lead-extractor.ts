import OpenAI from "openai";

type TranscriptEntry = { role: "user" | "assistant"; content: string; timestamp: string };

export type QualificationData = {
  jobType?: string;
  urgency?: number;
  address?: string;
  budgetRange?: string;
  preferredAppointment?: string;
};

export class LeadExtractor {
  constructor(private openai: OpenAI) {}

  async extractQualificationData(
    transcript: TranscriptEntry[]
  ): Promise<QualificationData> {
    const text = transcript.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n");

    const result = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Extract these fields from the conversation (null if not mentioned):
{ "jobType": string|null, "urgency": number|null, "address": string|null, "budgetRange": string|null, "preferredAppointment": string|null }

Conversation:
${text}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0,
    });

    try {
      return JSON.parse(result.choices[0].message.content ?? "{}");
    } catch {
      return {};
    }
  }

  async generateSummary(transcript: TranscriptEntry[], businessName: string): Promise<string> {
    const text = transcript.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n");

    const result = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Summarize this customer call for ${businessName} in 2 sentences. Be concise, include job type and urgency if mentioned.\n\n${text}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 100,
    });

    return result.choices[0].message.content ?? "";
  }

  async detectLanguage(transcript: TranscriptEntry[]): Promise<"EN" | "ES"> {
    const userMessages = transcript
      .filter((m) => m.role === "user")
      .map((m) => m.content)
      .join(" ");

    const spanishPattern =
      /\b(hola|buenos|buenas|necesito|tengo|quiero|ayuda|servicio|problema|urgente|gracias|por favor|cómo|qué|cuándo|dónde|sí|no)\b/i;
    return spanishPattern.test(userMessages) ? "ES" : "EN";
  }
}

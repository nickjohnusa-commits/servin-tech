import { openai } from "@/lib/openai";
import { SYSTEM_PROMPT_EN } from "./script-en";
import { SYSTEM_PROMPT_ES } from "./script-es";

export type SmsState =
  | "GREETING"
  | "JOB_TYPE"
  | "URGENCY"
  | "ADDRESS"
  | "PHOTO_REQUEST"
  | "BUDGET"
  | "APPOINTMENT"
  | "COMPLETE";

export type TranscriptMessage = {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

export type SmsConversation = {
  state: SmsState;
  language: "EN" | "ES" | "AUTO";
  transcript: TranscriptMessage[];
  collectedData: {
    jobType?: string;
    urgency?: number;
    address?: string;
    budgetRange?: string;
    preferredAppointment?: string;
    photoRequested?: boolean;
  };
};

export function createNewConversation(): SmsConversation {
  return {
    state: "GREETING",
    language: "AUTO",
    transcript: [],
    collectedData: {},
  };
}

function detectLanguage(text: string): "EN" | "ES" {
  const spanishWords = /\b(hola|buenos|buenas|necesito|tengo|quiero|ayuda|servicio|problema|urgente|gracias|por favor|cómo|qué|cuándo|dónde)\b/i;
  return spanishWords.test(text) ? "ES" : "EN";
}

export async function processMessage(
  conversation: SmsConversation,
  incomingMessage: string,
  businessName: string
): Promise<{ reply: string; conversation: SmsConversation; isComplete: boolean }> {
  const updated = { ...conversation };

  if (updated.language === "AUTO") {
    updated.language = detectLanguage(incomingMessage);
  }

  updated.transcript.push({
    role: "user",
    content: incomingMessage,
    timestamp: new Date().toISOString(),
  });

  const systemPrompt =
    updated.language === "ES"
      ? SYSTEM_PROMPT_ES(businessName)
      : SYSTEM_PROMPT_EN(businessName);

  const messages = [
    { role: "system" as const, content: systemPrompt },
    ...updated.transcript.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  ];

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,
    temperature: 0.7,
    max_tokens: 300,
  });

  const reply = completion.choices[0].message.content ?? "";

  updated.transcript.push({
    role: "assistant",
    content: reply,
    timestamp: new Date().toISOString(),
  });

  // Extract structured data from full conversation
  const extractionPrompt = `
Based on this conversation, extract the following in JSON (null if not mentioned):
{ "jobType": string|null, "urgency": number|null, "address": string|null, "budgetRange": string|null, "preferredAppointment": string|null }

Conversation:
${updated.transcript.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n")}
  `;

  const extraction = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: extractionPrompt }],
    response_format: { type: "json_object" },
    temperature: 0,
  });

  try {
    const data = JSON.parse(extraction.choices[0].message.content ?? "{}");
    if (data.jobType) updated.collectedData.jobType = data.jobType;
    if (data.urgency) updated.collectedData.urgency = data.urgency;
    if (data.address) updated.collectedData.address = data.address;
    if (data.budgetRange) updated.collectedData.budgetRange = data.budgetRange;
    if (data.preferredAppointment)
      updated.collectedData.preferredAppointment = data.preferredAppointment;
  } catch {
    // extraction failed — continue without structured data
  }

  // Mark complete when we have at least job type + urgency + address
  const isComplete = Boolean(
    updated.collectedData.jobType &&
      updated.collectedData.urgency &&
      updated.collectedData.address &&
      updated.transcript.length >= 8
  );

  if (isComplete) updated.state = "COMPLETE";

  return { reply, conversation: updated, isComplete };
}

export async function generateAiSummary(
  conversation: SmsConversation,
  businessName: string
): Promise<string> {
  const prompt = `Summarize this customer inquiry for ${businessName} in 2 sentences. Include job type, urgency, and any key details. Be concise.\n\nConversation:\n${conversation.transcript.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n")}`;

  const result = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
    max_tokens: 150,
  });

  return result.choices[0].message.content ?? "";
}

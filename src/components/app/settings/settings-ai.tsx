"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  defaultLanguage: "EN" | "ES" | "AUTO";
  aiGreetingEn: string | null;
  aiGreetingEs: string | null;
};

export function SettingsAi({ defaultLanguage, aiGreetingEn, aiGreetingEs }: Props) {
  const router = useRouter();
  const [lang, setLang] = useState<"EN" | "ES" | "AUTO">(defaultLanguage);
  const [greetingEn, setGreetingEn] = useState(aiGreetingEn ?? "");
  const [greetingEs, setGreetingEs] = useState(aiGreetingEs ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/organizations/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        defaultLanguage: lang,
        aiGreetingEn: greetingEn || null,
        aiGreetingEs: greetingEs || null,
      }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    router.refresh();
  }

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-xl p-6">
      <h2 className="text-sm font-semibold text-[#0f172a] mb-1">AI receptionist configuration</h2>
      <p className="text-xs text-[#64748b] mb-5">
        Customize how your AI greets and interacts with callers. Leave blank to use smart defaults.
      </p>
      <form onSubmit={save} className="space-y-5">
        <div>
          <label className="block text-xs font-medium text-[#64748b] mb-2">Default language</label>
          <div className="flex gap-2">
            {(["AUTO", "EN", "ES"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                className={`flex-1 py-2 rounded-md text-sm font-medium border transition-colors ${
                  lang === l
                    ? "bg-[#1b3a6b] text-white border-[#1b3a6b]"
                    : "bg-white text-[#64748b] border-[#e2e8f0] hover:border-[#1b3a6b]"
                }`}
              >
                {l === "AUTO" ? "🌐 Auto" : l === "EN" ? "🇺🇸 English" : "🇲🇽 Spanish"}
              </button>
            ))}
          </div>
          <p className="text-xs text-[#94a3b8] mt-1">
            Auto-detect responds in whichever language the customer uses first.
          </p>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#64748b] mb-1.5">
            English greeting <span className="font-normal">(optional override)</span>
          </label>
          <textarea
            rows={3}
            value={greetingEn}
            onChange={(e) => setGreetingEn(e.target.value)}
            placeholder={`Default: "Thank you for calling [Business Name]. I'm your AI assistant — how can I help you today?"`}
            className="w-full border border-[#e2e8f0] rounded-md px-3 py-2 text-sm bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb] resize-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#64748b] mb-1.5">
            Spanish greeting <span className="font-normal">(optional override)</span>
          </label>
          <textarea
            rows={3}
            value={greetingEs}
            onChange={(e) => setGreetingEs(e.target.value)}
            placeholder={`Default: "Gracias por llamar a [Business Name]. Soy su asistente de IA — ¿en qué le puedo ayudar?"`}
            className="w-full border border-[#e2e8f0] rounded-md px-3 py-2 text-sm bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb] resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-[#1b3a6b] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#162e55] disabled:opacity-50 transition-colors"
        >
          {saved ? "✓ Saved" : saving ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}

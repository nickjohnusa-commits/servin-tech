"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { STATUS_LABELS, STATUS_COLORS, type LeadStatus } from "@/types";

type Lead = {
  id: string;
  status: string;
  notes: string | null;
};

const STATUS_ORDER: LeadStatus[] = [
  "NEW", "CONTACTED", "ESTIMATE_SCHEDULED", "ESTIMATE_SENT", "WON", "LOST",
];

export function LeadActions({ lead }: { lead: Lead }) {
  const router = useRouter();
  const [status, setStatus] = useState<LeadStatus>(lead.status as LeadStatus);
  const [notes, setNotes] = useState(lead.notes ?? "");
  const [saving, setSaving] = useState(false);

  async function updateStatus(newStatus: LeadStatus) {
    setSaving(true);
    setStatus(newStatus);
    await fetch(`/api/leads/${lead.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setSaving(false);
    router.refresh();
  }

  async function saveNotes() {
    setSaving(true);
    await fetch(`/api/leads/${lead.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes }),
    });
    setSaving(false);
  }

  return (
    <div className="flex flex-col gap-3 min-w-48">
      {/* Status */}
      <div>
        <p className="text-xs text-[#64748b] font-medium mb-1.5">Status</p>
        <select
          value={status}
          onChange={(e) => updateStatus(e.target.value as LeadStatus)}
          className="w-full border border-[#e2e8f0] rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
          style={{ color: STATUS_COLORS[status] }}
        >
          {STATUS_ORDER.map((s) => (
            <option key={s} value={s} style={{ color: STATUS_COLORS[s] }}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      {/* Notes */}
      <div>
        <p className="text-xs text-[#64748b] font-medium mb-1.5">Notes</p>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes…"
          className="w-full border border-[#e2e8f0] rounded-md px-3 py-2 text-sm bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb] resize-none"
        />
        <button
          onClick={saveNotes}
          disabled={saving}
          className="w-full mt-1.5 bg-[#1b3a6b] text-white py-1.5 rounded-md text-xs font-medium hover:bg-[#162e55] disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving…" : "Save notes"}
        </button>
      </div>
    </div>
  );
}

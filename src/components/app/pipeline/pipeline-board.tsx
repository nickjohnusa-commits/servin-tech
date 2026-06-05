"use client";

import { useState, useOptimistic } from "react";
import Link from "next/link";
import { formatRelative, urgencyColor } from "@/lib/utils";
import { LanguageBadge } from "@/components/shared/language-badge";
import { STATUS_LABELS, STATUS_COLORS, type Lead, type LeadStatus } from "@/types";

const COLUMNS: LeadStatus[] = [
  "NEW", "CONTACTED", "ESTIMATE_SCHEDULED", "ESTIMATE_SENT", "WON", "LOST",
];

type Props = { leads: Lead[] };

export function PipelineBoard({ leads: initialLeads }: Props) {
  const [leads, setLeads] = useState(initialLeads);

  async function moveCard(leadId: string, newStatus: LeadStatus) {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );
    await fetch(`/api/leads/${leadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
  }

  const byStatus = COLUMNS.reduce(
    (acc, s) => {
      acc[s] = leads.filter((l) => l.status === s);
      return acc;
    },
    {} as Record<LeadStatus, Lead[]>
  );

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 min-h-[calc(100vh-120px)]">
      {COLUMNS.map((col) => (
        <PipelineColumn
          key={col}
          status={col}
          leads={byStatus[col]}
          onMove={moveCard}
        />
      ))}
    </div>
  );
}

function PipelineColumn({
  status,
  leads,
  onMove,
}: {
  status: LeadStatus;
  leads: Lead[];
  onMove: (id: string, status: LeadStatus) => void;
}) {
  const color = STATUS_COLORS[status];
  const label = STATUS_LABELS[status];

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const leadId = e.dataTransfer.getData("leadId");
    if (leadId) onMove(leadId, status);
  }

  return (
    <div
      className="flex-shrink-0 w-64 flex flex-col"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div
        className="flex items-center gap-2 mb-3 px-1"
        style={{ borderLeft: `3px solid ${color}`, paddingLeft: "8px" }}
      >
        <span className="text-xs font-semibold text-[#0f172a]">{label}</span>
        <span
          className="text-xs font-semibold px-1.5 py-0.5 rounded-full"
          style={{ background: `${color}20`, color }}
        >
          {leads.length}
        </span>
      </div>

      <div className="flex-1 space-y-2 min-h-24">
        {leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
        {leads.length === 0 && (
          <div className="h-16 border-2 border-dashed border-[#e2e8f0] rounded-lg flex items-center justify-center">
            <p className="text-xs text-[#94a3b8]">Drop here</p>
          </div>
        )}
      </div>
    </div>
  );
}

function LeadCard({ lead }: { lead: Lead }) {
  function handleDragStart(e: React.DragEvent) {
    e.dataTransfer.setData("leadId", lead.id);
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="bg-white border border-[#e2e8f0] rounded-lg p-3 cursor-grab active:cursor-grabbing hover:shadow-sm transition-shadow"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <Link
          href={`/leads/${lead.id}`}
          className="text-sm font-medium text-[#0f172a] hover:text-[#2563eb] truncate leading-tight"
          onClick={(e) => e.stopPropagation()}
        >
          {lead.callerName ?? lead.callerPhone}
        </Link>
        <LanguageBadge
          language={lead.languageDetected as "EN" | "ES" | "AUTO"}
          className="shrink-0"
        />
      </div>
      {lead.jobType && (
        <p className="text-xs text-[#64748b] truncate mb-2">{lead.jobType}</p>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-[#94a3b8]">
            {lead.channel === "VOICE" ? "📞" : "💬"}
          </span>
          {lead.urgency && (
            <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${urgencyColor(lead.urgency)}`}>
              {lead.urgency}
            </span>
          )}
        </div>
        <span className="text-[10px] text-[#94a3b8]">
          {formatRelative(lead.createdAt)}
        </span>
      </div>
    </div>
  );
}

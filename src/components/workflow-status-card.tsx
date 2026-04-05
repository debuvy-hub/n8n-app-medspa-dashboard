"use client";

import { useState } from "react";
import {
  Play,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Webhook,
  Calendar,
  AlertCircle,
  Zap,
} from "lucide-react";
import type { WorkflowInfo } from "@/lib/types";
import { formatRelativeDate } from "@/lib/utils";

const TRIGGER_ICONS = {
  manual:   <Zap className="w-3.5 h-3.5" />,
  webhook:  <Webhook className="w-3.5 h-3.5" />,
  schedule: <Calendar className="w-3.5 h-3.5" />,
  error:    <AlertCircle className="w-3.5 h-3.5" />,
};

const STATUS_CONFIG = {
  active:   { color: "#10B981", label: "Active",   dot: true },
  inactive: { color: "#6B6B8A", label: "Inactive", dot: false },
  error:    { color: "#EF4444", label: "Error",     dot: true },
};

interface WorkflowCardProps {
  workflow: WorkflowInfo;
}

export function WorkflowStatusCard({ workflow: wf }: WorkflowCardProps) {
  const [triggering, setTriggering] = useState(false);
  const [triggerResult, setTriggerResult] = useState<"success" | "error" | null>(null);

  const statusCfg = STATUS_CONFIG[wf.status];

  async function handleTrigger() {
    setTriggering(true);
    setTriggerResult(null);
    // In production: POST to /api/trigger/[workflow-id] → n8n webhook
    await new Promise((r) => setTimeout(r, 1500));
    setTriggering(false);
    setTriggerResult("success");
    setTimeout(() => setTriggerResult(null), 3000);
  }

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4 transition-all"
      style={{
        background: "#0F0F1A",
        border: `1px solid ${wf.status === "error" ? "rgba(239,68,68,0.25)" : "#1E1E30"}`,
        boxShadow: wf.status === "error" ? "0 0 20px rgba(239,68,68,0.06)" : "none",
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs font-mono px-1.5 py-0.5 rounded"
                  style={{ background: "#14142A", color: "#6B6B8A" }}>
              {wf.slug.toUpperCase()}
            </span>
            <div className="flex items-center gap-1.5">
              {statusCfg.dot && (
                <div className="w-1.5 h-1.5 rounded-full animate-pulse"
                     style={{ background: statusCfg.color }} />
              )}
              <span className="text-xs font-medium" style={{ color: statusCfg.color }}>
                {statusCfg.label}
              </span>
            </div>
          </div>
          <p className="text-sm font-semibold truncate" style={{ color: "#E8E8F0" }}>{wf.name}</p>
        </div>

        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg flex-shrink-0"
             style={{ background: "#14142A", color: "#6B6B8A" }}>
          {TRIGGER_ICONS[wf.triggerType]}
          <span className="text-xs capitalize">{wf.triggerType}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs leading-relaxed" style={{ color: "#6B6B8A" }}>
        {wf.description}
      </p>

      {/* Metadata */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span style={{ color: "#6B6B8A" }}>Last run</span>
          <div className="flex items-center gap-1.5">
            {wf.lastRunResult === "success" && <CheckCircle className="w-3 h-3" style={{ color: "#10B981" }} />}
            {wf.lastRunResult === "error"   && <XCircle    className="w-3 h-3" style={{ color: "#EF4444" }} />}
            <span className="tabular-nums" style={{ color: "#9999B8" }}>
              {formatRelativeDate(wf.lastRunAt)}
            </span>
          </div>
        </div>

        {wf.schedule && (
          <div className="flex items-center justify-between text-xs">
            <span style={{ color: "#6B6B8A" }}>Schedule</span>
            <span style={{ color: "#9999B8" }}>{wf.schedule}</span>
          </div>
        )}

        {wf.nextRunAt && (
          <div className="flex items-center justify-between text-xs">
            <span style={{ color: "#6B6B8A" }}>Next run</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" style={{ color: "#3B82F6" }} />
              <span style={{ color: "#3B82F6" }}>
                {new Date(wf.nextRunAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Error message */}
      {wf.lastErrorMessage && (
        <div className="px-3 py-2 rounded-lg text-xs"
             style={{ background: "rgba(239,68,68,0.08)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.15)" }}>
          {wf.lastErrorMessage}
        </div>
      )}

      {/* Trigger button */}
      {wf.canTrigger && (
        <button
          onClick={handleTrigger}
          disabled={triggering}
          className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-sm font-medium transition-all w-full"
          style={
            triggerResult === "success"
              ? { background: "rgba(16,185,129,0.1)", color: "#10B981", border: "1px solid rgba(16,185,129,0.2)" }
              : triggerResult === "error"
              ? { background: "rgba(239,68,68,0.1)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" }
              : { background: "rgba(99,102,241,0.1)", color: "#A5B4FC", border: "1px solid rgba(99,102,241,0.2)" }
          }
        >
          {triggering ? (
            <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Running…</>
          ) : triggerResult === "success" ? (
            <><CheckCircle className="w-3.5 h-3.5" /> Triggered</>
          ) : triggerResult === "error" ? (
            <><XCircle className="w-3.5 h-3.5" /> Failed</>
          ) : (
            <><Play className="w-3.5 h-3.5" /> Run Now</>
          )}
        </button>
      )}

      {!wf.canTrigger && (
        <p className="text-center text-xs" style={{ color: "#6B6B8A" }}>
          Triggered by {wf.triggerType}
        </p>
      )}
    </div>
  );
}

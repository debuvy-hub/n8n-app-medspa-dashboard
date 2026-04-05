"use client";

import { AlertTriangle, MessageSquare, UserX, UserPlus, RefreshCw } from "lucide-react";
import Link from "next/link";
import type { Lead, WorkflowInfo } from "@/lib/types";

interface ActionItem {
  icon: React.ReactNode;
  label: string;
  count: number;
  color: string;
}

export function NeedsActionCard({
  leads,
  workflows,
}: {
  leads: Lead[];
  workflows: WorkflowInfo[];
}) {
  const needsHuman = leads.filter(
    (l) => l.status === "Replied" && l.aiFallbackUsed
  ).length;

  const noShowRecovery = leads.filter((l) => l.status === "NoShow").length;

  const newNotContacted = leads.filter(
    (l) => l.status === "New" && !l.lastContactDate
  ).length;

  const reOptInPending = leads.filter(
    (l) => l.status === "ReOptInPending"
  ).length;

  const workflowErrors = workflows.filter(
    (w) => w.status === "error" || w.lastRunResult === "error"
  ).length;

  const items: ActionItem[] = [
    {
      icon: <MessageSquare className="w-3.5 h-3.5" />,
      label: "Need human reply",
      count: needsHuman,
      color: "#EF4444",
    },
    {
      icon: <UserX className="w-3.5 h-3.5" />,
      label: "No-show recovery",
      count: noShowRecovery,
      color: "#F59E0B",
    },
    {
      icon: <UserPlus className="w-3.5 h-3.5" />,
      label: "New, not contacted",
      count: newNotContacted,
      color: "#3B82F6",
    },
    {
      icon: <RefreshCw className="w-3.5 h-3.5" />,
      label: "Re-opt-in pending",
      count: reOptInPending,
      color: "#8B5CF6",
    },
  ].filter((item) => item.count > 0);

  const totalActions = items.reduce((sum, i) => sum + i.count, 0) + workflowErrors;

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "#0F0F1A",
        border: `1px solid ${totalActions > 0 ? "rgba(239,68,68,0.25)" : "#1E1E30"}`,
        boxShadow: totalActions > 0 ? "0 0 20px rgba(239,68,68,0.06)" : "none",
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-semibold" style={{ color: "#E8E8F0" }}>
            Needs Attention
          </p>
          <p className="text-xs mt-0.5" style={{ color: "#6B6B8A" }}>
            {totalActions === 0
              ? "All clear — nothing urgent"
              : `${totalActions} item${totalActions !== 1 ? "s" : ""} need action`}
          </p>
        </div>
        {totalActions > 0 && (
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(239,68,68,0.12)", color: "#EF4444" }}
          >
            <AlertTriangle className="w-4 h-4" />
          </div>
        )}
      </div>

      {totalActions === 0 ? (
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
          style={{ background: "rgba(16,185,129,0.08)", color: "#10B981" }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-current" />
          All leads and workflows are in good shape
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between px-3 py-2 rounded-lg"
              style={{ background: "#14142A" }}
            >
              <div className="flex items-center gap-2" style={{ color: item.color }}>
                {item.icon}
                <span className="text-xs" style={{ color: "#9999B8" }}>
                  {item.label}
                </span>
              </div>
              <span
                className="text-xs font-bold tabular-nums px-1.5 py-0.5 rounded"
                style={{ background: `${item.color}18`, color: item.color }}
              >
                {item.count}
              </span>
            </div>
          ))}

          {workflowErrors > 0 && (
            <div
              className="flex items-center justify-between px-3 py-2 rounded-lg"
              style={{ background: "#14142A" }}
            >
              <div className="flex items-center gap-2" style={{ color: "#F59E0B" }}>
                <AlertTriangle className="w-3.5 h-3.5" />
                <span className="text-xs" style={{ color: "#9999B8" }}>
                  Workflow error
                </span>
              </div>
              <span
                className="text-xs font-bold tabular-nums px-1.5 py-0.5 rounded"
                style={{ background: "rgba(245,158,11,0.18)", color: "#F59E0B" }}
              >
                {workflowErrors}
              </span>
            </div>
          )}

          <Link
            href="/dashboard/leads"
            className="block text-center text-xs py-1.5 rounded-lg mt-1 transition-colors hover:bg-white/5"
            style={{ color: "#6366F1" }}
          >
            View lead queue →
          </Link>
        </div>
      )}
    </div>
  );
}

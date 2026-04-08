"use client";

import { useState } from "react";
import { AlertTriangle, MessageSquare, UserX, UserPlus, RefreshCw, ChevronDown } from "lucide-react";
import Link from "next/link";
import type { Lead, WorkflowInfo } from "@/lib/types";

interface ActionBucket {
  icon: React.ReactNode;
  label: string;
  color: string;
  leads: Lead[];
  actionHint: string;
}

export function NeedsActionCard({
  leads,
  workflows,
}: {
  leads: Lead[];
  workflows: WorkflowInfo[];
}) {
  const [openLabel, setOpenLabel] = useState<string | null>(null);

  const needsHumanLeads   = leads.filter((l) => l.status === "Replied" && l.aiFallbackUsed);
  const noShowLeads        = leads.filter((l) => l.status === "NoShow");
  const newNotContactedLeads = leads.filter((l) => l.status === "New" && !l.lastContactDate);
  const reOptInLeads       = leads.filter((l) => l.status === "ReOptInPending");

  const workflowErrors = workflows.filter(
    (w) => w.status === "error" || w.lastRunResult === "error"
  ).length;

  const buckets: ActionBucket[] = [
    {
      icon: <MessageSquare className="w-3.5 h-3.5" />,
      label: "Need human reply",
      color: "#EF4444",
      leads: needsHumanLeads,
      actionHint: "Call or text back now",
    },
    {
      icon: <UserX className="w-3.5 h-3.5" />,
      label: "No-show recovery",
      color: "#F59E0B",
      leads: noShowLeads,
      actionHint: "Offer rebooking — use discount",
    },
    {
      icon: <UserPlus className="w-3.5 h-3.5" />,
      label: "New, not contacted",
      color: "#3B82F6",
      leads: newNotContactedLeads,
      actionHint: "Send first outreach",
    },
    {
      icon: <RefreshCw className="w-3.5 h-3.5" />,
      label: "Re-opt-in pending",
      color: "#8B5CF6",
      leads: reOptInLeads,
      actionHint: "Awaiting consent re-confirm",
    },
  ].filter((b) => b.leads.length > 0);

  const totalActions = buckets.reduce((sum, b) => sum + b.leads.length, 0) + workflowErrors;

  function toggle(label: string) {
    setOpenLabel((prev) => (prev === label ? null : label));
  }

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
        <div className="space-y-1.5">
          {buckets.map((bucket) => {
            const isOpen = openLabel === bucket.label;
            return (
              <div key={bucket.label}>
                <button
                  onClick={() => toggle(bucket.label)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors hover:bg-white/5"
                  style={{ background: "#14142A" }}
                >
                  <div className="flex items-center gap-2" style={{ color: bucket.color }}>
                    {bucket.icon}
                    <span className="text-xs" style={{ color: "#9999B8" }}>
                      {bucket.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-bold tabular-nums px-1.5 py-0.5 rounded"
                      style={{ background: `${bucket.color}18`, color: bucket.color }}
                    >
                      {bucket.leads.length}
                    </span>
                    <ChevronDown
                      className="w-3 h-3 transition-transform"
                      style={{
                        color: "#6B6B8A",
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    />
                  </div>
                </button>

                {isOpen && (
                  <div className="mt-1 ml-3 space-y-1">
                    {bucket.leads.map((lead) => (
                      <div
                        key={lead.id}
                        className="flex items-center justify-between px-3 py-2 rounded-lg"
                        style={{ background: "#0C0C18", borderLeft: `2px solid ${bucket.color}40` }}
                      >
                        <span className="text-xs font-medium" style={{ color: "#E8E8F0" }}>
                          {lead.firstName} {lead.lastName}
                        </span>
                        <span className="text-xs" style={{ color: "#6B6B8A" }}>
                          {bucket.actionHint}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

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

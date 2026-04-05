import { MessageSquare, Activity, Bot, BarChart2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { KpiCard } from "@/components/kpi-card";
import { TrendChart } from "@/components/trend-chart";
import { CompliancePanel } from "@/components/compliance-gauge";
import { formatRelativeDate } from "@/lib/utils";
import type { DashboardData, Lead, WorkflowInfo } from "@/lib/types";

const PRIORITY_ORDER = [
  "Replied",
  "NoShow",
  "New",
  "ReOptInPending",
  "Contacted",
] as const;

type PriorityStatus = (typeof PRIORITY_ORDER)[number];

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  Replied:        { label: "Replied — needs human",   color: "#EF4444" }, // red
  NoShow:         { label: "No-show — recovery",       color: "#F59E0B" }, // amber
  New:            { label: "New — not contacted",      color: "#3B82F6" }, // blue
  ReOptInPending: { label: "Re-opt-in pending",        color: "#8B5CF6" }, // purple
  Contacted:      { label: "Stale — follow-up needed", color: "#6366F1" }, // indigo
};

function LeadWorkQueue({ leads }: { leads: Lead[] }) {
  // Sort by priority, then filter to actionable statuses
  const actionable = leads
    .filter(
      (l) =>
        PRIORITY_ORDER.includes(l.status as PriorityStatus) &&
        !l.dnc &&
        l.status !== "OptedOut"
    )
    .sort((a, b) => {
      const ai = PRIORITY_ORDER.indexOf(a.status as PriorityStatus);
      const bi = PRIORITY_ORDER.indexOf(b.status as PriorityStatus);
      return ai - bi;
    })
    .slice(0, 5);

  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "#0F0F1A", border: "1px solid #1E1E30" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-semibold" style={{ color: "#E8E8F0" }}>
            Lead Work Queue
          </p>
          <p className="text-xs mt-0.5" style={{ color: "#6B6B8A" }}>
            Priority order — needs action
          </p>
        </div>
        <Link
          href="/dashboard/leads"
          className="flex items-center gap-1 text-xs transition-colors hover:opacity-80"
          style={{ color: "#6366F1" }}
        >
          All leads
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {actionable.length === 0 ? (
        <p className="text-xs" style={{ color: "#6B6B8A" }}>
          No leads currently need action.
        </p>
      ) : (
        <div className="space-y-2">
          {actionable.map((lead) => {
            const meta = STATUS_LABELS[lead.status] ?? { label: lead.status, color: "#9999B8" };
            return (
              <div
                key={lead.id}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl"
                style={{ background: "#14142A" }}
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "#E8E8F0" }}>
                    {lead.firstName} {lead.lastName}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: meta.color }}>
                    {meta.label}
                  </p>
                </div>
                <span
                  className="text-xs tabular-nums ml-3 shrink-0"
                  style={{ color: "#6B6B8A" }}
                >
                  {formatRelativeDate(lead.lastContactDate)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function OperatorView({
  data,
  leads,
}: {
  data: DashboardData;
  leads: Lead[];
  workflows: WorkflowInfo[];
}) {
  const { kpis, weeklyTrends } = data;

  return (
    <div className="space-y-6">
      {/* KPI grid — operator: activity + AI health */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Messages Sent"
          metric={kpis.messagesSent}
          accentColor="#3B82F6"
          icon={<MessageSquare className="w-4 h-4" />}
        />
        <KpiCard
          label="Reply Rate"
          metric={kpis.replyRate}
          accentColor="#10B981"
          icon={<Activity className="w-4 h-4" />}
        />
        <KpiCard
          label="Qualification Rate"
          metric={kpis.reactivationRate}
          accentColor="#8B5CF6"
          icon={<BarChart2 className="w-4 h-4" />}
        />
        <KpiCard
          label="AI Fallback Rate"
          metric={kpis.aiFallbackRate}
          accentColor="#06B6D4"
          icon={<Bot className="w-4 h-4" />}
          invertTrend
          alertThreshold={{ value: 30, direction: "above", message: "Review AI prompts" }}
        />
      </div>

      {/* Charts + compliance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TrendChart data={weeklyTrends} />
        <CompliancePanel
          optOutRate={kpis.optOutRate.value}
          aiFallbackRate={kpis.aiFallbackRate.value}
        />
      </div>

      {/* Lead work queue */}
      <LeadWorkQueue leads={leads} />
    </div>
  );
}

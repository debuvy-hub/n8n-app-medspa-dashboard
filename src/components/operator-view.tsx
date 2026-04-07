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

const STATUS_META: Record<string, {
  color: string;
  badge: string;
  badgeBg: string;
  action: string;
}> = {
  Replied:        { color: "#EF4444", badge: "HOT",       badgeBg: "rgba(239,68,68,0.15)",    action: "Call or text back now" },
  NoShow:         { color: "#F59E0B", badge: "RECOVERY",  badgeBg: "rgba(245,158,11,0.15)",   action: "Offer rebooking — use discount" },
  New:            { color: "#3B82F6", badge: "NEW",       badgeBg: "rgba(59,130,246,0.15)",   action: "Send first outreach" },
  ReOptInPending: { color: "#8B5CF6", badge: "PENDING",   badgeBg: "rgba(139,92,246,0.15)",   action: "Awaiting consent re-confirm" },
  Contacted:      { color: "#6366F1", badge: "FOLLOW-UP", badgeBg: "rgba(99,102,241,0.15)",   action: "Send follow-up message" },
};

function getTimeSinceColor(dateStr: string | null): string {
  if (!dateStr) return "#6B6B8A";
  const hoursAgo = (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60);
  if (hoursAgo < 2) return "#EF4444";
  if (hoursAgo < 8) return "#F59E0B";
  return "#6B6B8A";
}

function LeadWorkQueue({ leads }: { leads: Lead[] }) {
  const actionable = leads
    .filter(
      (l) =>
        PRIORITY_ORDER.includes(l.status as PriorityStatus) &&
        !l.dnc
    )
    .sort((a, b) => {
      const ai = PRIORITY_ORDER.indexOf(a.status as PriorityStatus);
      const bi = PRIORITY_ORDER.indexOf(b.status as PriorityStatus);
      return ai - bi;
    })
    .slice(0, 8);

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
            Priority order — {actionable.length} need action
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
            const meta = STATUS_META[lead.status] ?? {
              color: "#9999B8",
              badge: lead.status,
              badgeBg: "rgba(153,153,184,0.15)",
              action: "",
            };
            const timeColor = getTimeSinceColor(lead.lastContactDate);
            return (
              <div
                key={lead.id}
                className="px-3 py-2.5 rounded-xl"
                style={{ background: "#14142A" }}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="text-xs font-bold px-1.5 py-0.5 rounded shrink-0"
                      style={{ background: meta.badgeBg, color: meta.color, letterSpacing: "0.04em" }}
                    >
                      {meta.badge}
                    </span>
                    <p className="text-sm font-medium truncate" style={{ color: "#E8E8F0" }}>
                      {lead.firstName} {lead.lastName}
                    </p>
                  </div>
                  <span
                    className="text-xs tabular-nums ml-3 shrink-0"
                    style={{ color: timeColor }}
                  >
                    {formatRelativeDate(lead.lastContactDate)}
                  </span>
                </div>
                {meta.action && (
                  <p className="text-xs pl-0.5" style={{ color: "#6B6B8A" }}>
                    → {meta.action}
                  </p>
                )}
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
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "#6B6B8A" }}>Activity</p>
        <span className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: "rgba(255,255,255,0.05)", color: "#6B6B8A" }}>
          {weeklyTrends.length >= 2
            ? `${weeklyTrends[0].week} – ${weeklyTrends[weeklyTrends.length - 1].week}`
            : "Current period"}
        </span>
      </div>
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
          label="Response Rate"
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
          consentCoverage={kpis.consentCoverage.value}
        />
      </div>

      {/* Lead work queue */}
      <LeadWorkQueue leads={leads} />
    </div>
  );
}

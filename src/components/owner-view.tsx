import {
  CalendarCheck,
  Users,
  DollarSign,
  Star,
  ShieldCheck,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  TrendingDown,
  ShoppingCart,
} from "lucide-react";
import { KpiCard } from "@/components/kpi-card";
import { RevenueChart } from "@/components/revenue-chart";
import { FunnelChart } from "@/components/funnel-chart";
import { NeedsActionCard } from "@/components/needs-action-card";
import { LeadPoolBreakdown } from "@/components/lead-pool-breakdown";
import { formatCurrency, getDelta } from "@/lib/utils";
import type { DashboardData, KpiMetric, Lead, WorkflowInfo } from "@/lib/types";

function SystemHealthCard({ workflows }: { workflows: WorkflowInfo[] }) {
  const errorWorkflows = workflows.filter(
    (w) => w.status === "error" || w.lastRunResult === "error"
  );
  const hasErrors = errorWorkflows.length > 0;

  const lastSuccessAt = workflows
    .filter((w) => w.lastRunResult === "success" && w.lastRunAt)
    .map((w) => new Date(w.lastRunAt!).getTime())
    .sort((a, b) => b - a)[0];

  const lastSuccessLabel = lastSuccessAt
    ? new Date(lastSuccessAt).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "Unknown";

  const automated = workflows.filter(
    (w) => w.triggerType === "webhook" || w.triggerType === "schedule"
  );
  const automatedActive = automated.filter((w) => w.status === "active").length;

  const onDemand = workflows.filter((w) => w.triggerType === "manual");
  const onDemandReady = onDemand.filter((w) => w.lastRunResult === "success").length;

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "#0F0F1A",
        border: `1px solid ${hasErrors ? "rgba(245,158,11,0.25)" : "#1E1E30"}`,
      }}
    >
      <p className="text-sm font-semibold mb-1" style={{ color: "#E8E8F0" }}>
        System Health
      </p>
      <p className="text-xs mb-4" style={{ color: "#6B6B8A" }}>
        Automation status overview
      </p>

      <div className="flex items-center gap-2 mb-4">
        {hasErrors ? (
          <XCircle className="w-5 h-5" style={{ color: "#F59E0B" }} />
        ) : (
          <CheckCircle className="w-5 h-5" style={{ color: "#10B981" }} />
        )}
        <span
          className="text-sm font-semibold"
          style={{ color: hasErrors ? "#F59E0B" : "#10B981" }}
        >
          {hasErrors
            ? `${errorWorkflows.length} workflow error${errorWorkflows.length !== 1 ? "s" : ""}`
            : "All systems healthy"}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span style={{ color: "#6B6B8A" }}>Automated running</span>
          <span className="font-medium" style={{ color: automatedActive === automated.length ? "#10B981" : "#F59E0B" }}>
            {automatedActive} / {automated.length}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span style={{ color: "#6B6B8A" }}>On-demand ready</span>
          <span className="font-medium" style={{ color: "#E8E8F0" }}>
            {onDemandReady} / {onDemand.length}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5" style={{ color: "#6B6B8A" }}>
            <Clock className="w-3 h-3" />
            Last successful run
          </div>
          <span className="font-medium tabular-nums" style={{ color: "#9999B8" }}>
            {lastSuccessLabel}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Revenue Strip ────────────────────────────────────────────────────────────

function TrendRow({ delta, suffix }: { delta: number; suffix: string }) {
  const isUp = delta >= 0;
  const color = isUp ? "#10B981" : "#EF4444";
  const Icon = isUp ? TrendingUp : TrendingDown;
  return (
    <div className="flex items-center gap-1 mt-1">
      <Icon className="w-3 h-3" style={{ color }} />
      <span className="text-xs" style={{ color }}>
        {isUp ? "+" : ""}{delta.toFixed(1)}{suffix} vs prior
      </span>
    </div>
  );
}

function RevenueStrip({ collected, projected, netRoi, lastUpdated }: {
  collected: KpiMetric;
  projected: KpiMetric;
  netRoi: KpiMetric;
  lastUpdated?: string;
}) {
  const collectedDelta = getDelta(collected.value, collected.previousValue);
  const projectedDelta = getDelta(projected.value, projected.previousValue);
  const roiDelta = netRoi.value - netRoi.previousValue;

  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "#0F0F1A", border: "1px solid #1E1E30" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4" style={{ color: "#34D399" }} />
          <p className="text-sm font-semibold" style={{ color: "#E8E8F0" }}>Revenue</p>
        </div>
        {lastUpdated && (
          <span className="text-xs tabular-nums" style={{ color: "#4A4A6A" }}>
            Updated{" "}
            {new Date(lastUpdated).toLocaleString(undefined, {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 divide-x" style={{ borderColor: "#1E1E30" }}>
        <div className="pr-4">
          <p className="text-xs mb-1" style={{ color: "#6B6B8A" }}>Collected</p>
          <p className="text-2xl font-bold tabular-nums" style={{ color: "#34D399" }}>
            {formatCurrency(collected.value)}
          </p>
          <TrendRow delta={collectedDelta} suffix="%" />
          <p className="text-xs mt-1.5" style={{ color: "#4A4A6A" }}>mock · POS Phase 2</p>
        </div>

        <div className="px-4">
          <p className="text-xs mb-1" style={{ color: "#6B6B8A" }}>Projected</p>
          <p className="text-2xl font-bold tabular-nums" style={{ color: "#E8E8F0" }}>
            {formatCurrency(projected.value)}
          </p>
          <TrendRow delta={projectedDelta} suffix="%" />
          <p className="text-xs mt-1.5" style={{ color: "#4A4A6A" }}>from booked pipeline</p>
        </div>

        <div className="pl-4">
          <p className="text-xs mb-1" style={{ color: "#6B6B8A" }}>Net ROI</p>
          <p className="text-2xl font-bold tabular-nums" style={{ color: "#F59E0B" }}>
            {netRoi.value.toFixed(1)}x
          </p>
          <TrendRow delta={roiDelta} suffix="x" />
          <p className="text-xs mt-1.5" style={{ color: "#4A4A6A" }}>return on spend</p>
        </div>
      </div>
    </div>
  );
}

export function OwnerView({
  data,
  leads,
  workflows,
}: {
  data: DashboardData;
  leads: Lead[];
  workflows: WorkflowInfo[];
}) {
  const { kpis, weeklyTrends, leadPipeline } = data;

  // Derive showed metric from pipeline + previous values
  const showedMetric: KpiMetric = {
    value: leadPipeline.showed,
    previousValue: Math.round(
      kpis.bookings.previousValue * (kpis.showRate.previousValue / 100)
    ),
    unit: "count",
  };

  // Sold metric — treatments purchased from showed patients
  const soldMetric: KpiMetric = {
    value: leadPipeline.sold ?? 0,
    previousValue: Math.round(showedMetric.previousValue * 0.70),
    unit: "count",
  };

  return (
    <div className="space-y-6">
      {/* Revenue strip — hero section */}
      <RevenueStrip
        collected={kpis.collectedRevenue}
        projected={kpis.estimatedRevenue}
        netRoi={kpis.netRoi}
        lastUpdated={data.lastUpdated}
      />

      {/* KPI grid — outcome metrics */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "#6B6B8A" }}>Performance</p>
        <span className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: "rgba(255,255,255,0.05)", color: "#6B6B8A" }}>
          {weeklyTrends.length >= 2
            ? `${weeklyTrends[0].week} – ${weeklyTrends[weeklyTrends.length - 1].week}`
            : "Current period"}
        </span>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <KpiCard
          label="Booked This Period"
          metric={kpis.bookings}
          accentColor="#F59E0B"
          icon={<CalendarCheck className="w-4 h-4" />}
        />
        <KpiCard
          label="Showed"
          metric={showedMetric}
          accentColor="#10B981"
          icon={<Users className="w-4 h-4" />}
        />
        <KpiCard
          label="Show Rate"
          metric={kpis.showRate}
          accentColor="#06B6D4"
          icon={<Star className="w-4 h-4" />}
        />
        <KpiCard
          label="Sold"
          metric={soldMetric}
          accentColor="#34D399"
          icon={<ShoppingCart className="w-4 h-4" />}
        />
        <KpiCard
          label="Opt-Out Rate"
          metric={kpis.optOutRate}
          accentColor="#6366F1"
          icon={<ShieldCheck className="w-4 h-4" />}
          invertTrend
          alertThreshold={{ value: 5, direction: "above", message: "Carrier filter risk" }}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RevenueChart data={weeklyTrends} />
        <FunnelChart data={leadPipeline} />
      </div>

      {/* Lead pool breakdown */}
      <LeadPoolBreakdown leads={leads} />

      {/* Bottom row: Needs Action + System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <NeedsActionCard leads={leads} workflows={workflows} />
        <SystemHealthCard workflows={workflows} />
      </div>
    </div>
  );
}

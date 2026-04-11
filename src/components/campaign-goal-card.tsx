import { Target } from "lucide-react";
import type { CampaignGoal } from "@/lib/types";

const METRIC_LABEL: Record<CampaignGoal["metric"], string> = {
  bookings: "bookings",
  showed:   "showed",
  sold:     "sold",
};

function progressColor(pct: number): string {
  if (pct >= 80) return "#10B981"; // green
  if (pct >= 50) return "#3B82F6"; // blue
  return "#F59E0B";                 // amber
}

export function CampaignGoalCard({ goal }: { goal: CampaignGoal }) {
  const pct = goal.target > 0
    ? Math.min(100, Math.round((goal.achieved / goal.target) * 100))
    : 0;
  const color = progressColor(pct);
  const label = goal.label ?? "Campaign Goal";
  const metricLabel = METRIC_LABEL[goal.metric];

  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "#0F0F1A", border: "1px solid #1E1E30" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4" style={{ color }} />
          <p className="text-sm font-semibold" style={{ color: "#E8E8F0" }}>{label}</p>
        </div>
        <span
          className="text-xs px-2 py-0.5 rounded-full font-semibold tabular-nums"
          style={{ background: `${color}22`, color }}
        >
          {pct}%
        </span>
      </div>

      <div className="flex items-end gap-1.5 mb-3">
        <span className="text-3xl font-bold tabular-nums" style={{ color }}>
          {goal.achieved}
        </span>
        <span className="text-lg font-medium mb-0.5" style={{ color: "#4A4A6A" }}>
          / {goal.target}
        </span>
        <span className="text-sm mb-0.5 ml-1" style={{ color: "#6B6B8A" }}>
          {metricLabel}
        </span>
      </div>

      {/* Progress bar */}
      <div className="rounded-full overflow-hidden" style={{ height: 6, background: "#1E1E30" }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>

      <p className="text-xs mt-2" style={{ color: "#4A4A6A" }}>
        {goal.target - goal.achieved > 0
          ? `${goal.target - goal.achieved} more to hit target`
          : "Target reached"}
      </p>
    </div>
  );
}

"use client";

import type { LeadPipeline } from "@/lib/types";

interface FunnelChartProps {
  data: LeadPipeline;
}

const BASE_STAGES = [
  { key: "totalLeads", label: "Total Leads", color: "#6366F1" },
  { key: "qualified",  label: "Qualified",   color: "#8B5CF6" },
  { key: "booked",     label: "Booked",      color: "#F59E0B" },
  { key: "showed",     label: "Showed",      color: "#10B981" },
  { key: "sold",       label: "Sold",        color: "#34D399" },
] as const;

type StageKey = (typeof BASE_STAGES)[number]["key"];

export function FunnelChart({ data }: FunnelChartProps) {
  const max = data.totalLeads;

  // Only show Sold stage if the data includes it
  const stages = BASE_STAGES.filter(
    (s) => s.key !== "sold" || (data.sold ?? 0) > 0
  );

  return (
    <div className="rounded-2xl p-5"
         style={{ background: "#0F0F1A", border: "1px solid #1E1E30" }}>
      <p className="text-sm font-semibold mb-1" style={{ color: "#E8E8F0" }}>Lead Pipeline</p>
      <p className="text-xs mb-5" style={{ color: "#6B6B8A" }}>Conversion funnel — current period</p>

      <div className="space-y-3">
        {stages.map(({ key, label, color }, index) => {
          const value = (data[key as StageKey] ?? 0) as number;
          const pct = max > 0 ? (value / max) * 100 : 0;
          const prevKey = index > 0 ? stages[index - 1].key : null;
          const prevValue = prevKey ? ((data[prevKey as StageKey] ?? 0) as number) : 0;
          const conversionFromPrev = index > 0 && prevValue > 0
            ? ((value / prevValue) * 100).toFixed(0)
            : null;

          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                  <span className="text-xs font-medium" style={{ color: "#9999B8" }}>{label}</span>
                  {conversionFromPrev && (
                    <span className="text-xs px-1.5 py-0.5 rounded"
                          style={{ background: "rgba(255,255,255,0.05)", color: "#6B6B8A" }}>
                      {conversionFromPrev}% converted
                    </span>
                  )}
                </div>
                <span className="text-sm font-bold tabular-nums" style={{ color: "#E8E8F0" }}>
                  {value.toLocaleString()}
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "#14142A" }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, ${color}, ${color}88)`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary stat — show Sold rate if available, else Showed rate */}
      <div className="mt-4 pt-4 flex items-center justify-between"
           style={{ borderTop: "1px solid #1E1E30" }}>
        {data.sold !== undefined && data.sold > 0 ? (
          <>
            <span className="text-xs" style={{ color: "#6B6B8A" }}>Lead-to-sale rate</span>
            <span className="text-sm font-bold tabular-nums" style={{ color: "#34D399" }}>
              {max > 0 ? ((data.sold / max) * 100).toFixed(1) : "0"}%
            </span>
          </>
        ) : (
          <>
            <span className="text-xs" style={{ color: "#6B6B8A" }}>Overall conversion rate</span>
            <span className="text-sm font-bold tabular-nums" style={{ color: "#10B981" }}>
              {max > 0 ? ((data.showed / max) * 100).toFixed(1) : "0"}%
            </span>
          </>
        )}
      </div>
    </div>
  );
}

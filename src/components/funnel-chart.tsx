"use client";

import type { LeadPipeline } from "@/lib/types";

interface FunnelChartProps {
  data: LeadPipeline;
}

const STAGES = [
  { key: "totalLeads", label: "Total Leads",  color: "#6366F1" },
  { key: "qualified",  label: "Qualified",    color: "#8B5CF6" },
  { key: "booked",     label: "Booked",       color: "#F59E0B" },
  { key: "showed",     label: "Showed",       color: "#10B981" },
] as const;

export function FunnelChart({ data }: FunnelChartProps) {
  const max = data.totalLeads;

  return (
    <div className="rounded-2xl p-5"
         style={{ background: "#0F0F1A", border: "1px solid #1E1E30" }}>
      <p className="text-sm font-semibold mb-1" style={{ color: "#E8E8F0" }}>Lead Pipeline</p>
      <p className="text-xs mb-5" style={{ color: "#6B6B8A" }}>Conversion funnel — current period</p>

      <div className="space-y-3">
        {STAGES.map(({ key, label, color }, index) => {
          const value = data[key];
          const pct = max > 0 ? (value / max) * 100 : 0;
          const conversionFromPrev = index > 0
            ? data[STAGES[index - 1].key] > 0
              ? ((value / data[STAGES[index - 1].key]) * 100).toFixed(0)
              : "0"
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

      {/* Summary stat */}
      <div className="mt-4 pt-4 flex items-center justify-between"
           style={{ borderTop: "1px solid #1E1E30" }}>
        <span className="text-xs" style={{ color: "#6B6B8A" }}>Overall conversion rate</span>
        <span className="text-sm font-bold tabular-nums" style={{ color: "#10B981" }}>
          {max > 0 ? ((data.showed / max) * 100).toFixed(1) : "0"}%
        </span>
      </div>
    </div>
  );
}

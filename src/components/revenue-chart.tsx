"use client";

import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { WeeklyDataPoint } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface RevenueChartProps {
  data: WeeklyDataPoint[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const rev = payload.find((p: { dataKey: string }) => p.dataKey === "revenue");
  return (
    <div className="rounded-xl border p-3 text-xs shadow-xl"
         style={{ background: "#14142A", borderColor: "#1E1E30", minWidth: "160px" }}>
      <p className="font-semibold mb-2" style={{ color: "#9999B8" }}>{label}</p>
      {rev && (
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: "#8B5CF6" }} />
            <span style={{ color: "#9999B8" }}>Revenue</span>
          </div>
          <span className="font-semibold tabular-nums" style={{ color: "#E8E8F0" }}>
            {formatCurrency(rev.value)}
          </span>
        </div>
      )}
    </div>
  );
}

export function RevenueChart({ data }: RevenueChartProps) {
  // Simple 3-week rolling average as baseline
  const withBaseline = data.map((d, i) => {
    const window = data.slice(Math.max(0, i - 2), i + 1);
    const avg = window.reduce((sum, w) => sum + w.revenue, 0) / window.length;
    return { ...d, baseline: Math.round(avg) };
  });

  return (
    <div className="rounded-2xl p-5 h-full"
         style={{ background: "#0F0F1A", border: "1px solid #1E1E30" }}>
      <p className="text-sm font-semibold mb-1" style={{ color: "#E8E8F0" }}>Estimated Revenue</p>
      <p className="text-xs mb-5" style={{ color: "#6B6B8A" }}>Weekly with 3-week rolling average</p>

      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart data={withBaseline} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E1E30" vertical={false} />
          <XAxis
            dataKey="week"
            tick={{ fill: "#6B6B8A", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#6B6B8A", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="revenue"
            fill="#8B5CF6"
            radius={[4, 4, 0, 0]}
            fillOpacity={0.7}
          />
          <Line
            type="monotone"
            dataKey="baseline"
            stroke="#6366F1"
            strokeWidth={2}
            dot={false}
            strokeDasharray="4 3"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

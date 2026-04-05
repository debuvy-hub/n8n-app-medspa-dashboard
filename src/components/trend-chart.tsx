"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import type { WeeklyDataPoint } from "@/lib/types";

interface TrendChartProps {
  data: WeeklyDataPoint[];
}

const SERIES = [
  { key: "messagesSent", label: "Messages Sent", color: "#6366F1" },
  { key: "replies",      label: "Replies",        color: "#10B981" },
  { key: "bookings",     label: "Bookings",       color: "#F59E0B" },
] as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border p-3 text-xs shadow-xl"
         style={{ background: "#14142A", borderColor: "#1E1E30", minWidth: "160px" }}>
      <p className="font-semibold mb-2" style={{ color: "#9999B8" }}>{label}</p>
      {payload.map((entry: { color: string; name: string; value: number }) => (
        <div key={entry.name} className="flex items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span style={{ color: "#9999B8" }}>{entry.name}</span>
          </div>
          <span className="font-semibold tabular-nums" style={{ color: "#E8E8F0" }}>{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export function TrendChart({ data }: TrendChartProps) {
  return (
    <div className="rounded-2xl p-5 h-full"
         style={{ background: "#0F0F1A", border: "1px solid #1E1E30" }}>
      <p className="text-sm font-semibold mb-1" style={{ color: "#E8E8F0" }}>Engagement Trends</p>
      <p className="text-xs mb-5" style={{ color: "#6B6B8A" }}>Last 8 weeks</p>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
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
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => (
              <span style={{ color: "#9999B8", fontSize: "11px" }}>{value}</span>
            )}
          />
          {SERIES.map(({ key, label, color }) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              name={label}
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

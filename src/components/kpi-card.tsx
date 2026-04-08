"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { formatCurrency, formatPercent, getDelta } from "@/lib/utils";
import type { KpiMetric } from "@/lib/types";

interface KpiCardProps {
  label: string;
  metric: KpiMetric;
  accentColor?: string;
  icon?: React.ReactNode;
  alertThreshold?: { value: number; direction: "above" | "below"; message: string };
  invertTrend?: boolean; // true for metrics where lower is better (e.g. opt-out rate)
}

function formatValue(metric: KpiMetric): string {
  if (metric.unit === "currency") return formatCurrency(metric.value);
  if (metric.unit === "percent") return formatPercent(metric.value);
  return metric.value.toLocaleString();
}

export function KpiCard({ label, metric, accentColor = "#6366F1", icon, alertThreshold, invertTrend = false }: KpiCardProps) {
  const delta = getDelta(metric.value, metric.previousValue);
  const isGood = invertTrend ? delta < 0 : delta > 0;
  const isPositive = delta > 0;
  const isNeutral = Math.abs(delta) < 0.5;

  const isAlerting = alertThreshold
    ? alertThreshold.direction === "above"
      ? metric.value > alertThreshold.value
      : metric.value < alertThreshold.value
    : false;

  return (
    <div
      className="relative rounded-2xl p-5 overflow-hidden group transition-all hover:translate-y-[-1px]"
      style={{
        background: "#0F0F1A",
        border: `1px solid ${isAlerting ? "rgba(245,158,11,0.3)" : "#1E1E30"}`,
        boxShadow: isAlerting ? "0 0 20px rgba(245,158,11,0.08)" : "none",
      }}
    >
      {/* Glow blob */}
      <div
        className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-2xl"
        style={{ background: accentColor }}
      />

      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "#6B6B8A" }}>
            {label}
          </p>
          {icon && (
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                 style={{ background: `${accentColor}18`, color: accentColor }}>
              {icon}
            </div>
          )}
        </div>

        <div className="flex items-baseline gap-2 mt-1">
          <p
            className="text-3xl font-bold tracking-tight tabular-nums"
            style={{ color: isAlerting ? "#F59E0B" : "#E8E8F0" }}
          >
            {formatValue(metric)}
          </p>
          <div className="flex items-center gap-1">
            {isNeutral ? (
              <Minus className="w-3 h-3" style={{ color: "#6B6B8A" }} />
            ) : isPositive ? (
              <TrendingUp className="w-3 h-3" style={{ color: isGood ? "#10B981" : "#EF4444" }} />
            ) : (
              <TrendingDown className="w-3 h-3" style={{ color: isGood ? "#10B981" : "#EF4444" }} />
            )}
            <span
              className="text-xs font-medium tabular-nums"
              style={{ color: isNeutral ? "#6B6B8A" : isGood ? "#10B981" : "#EF4444" }}
            >
              {isNeutral ? "—" : `${isPositive ? "+" : ""}${delta.toFixed(1)}%`}
            </span>
          </div>
        </div>

        {isAlerting && alertThreshold && (
          <div className="mt-2 text-xs px-2 py-1 rounded-md inline-block"
               style={{ background: "rgba(245,158,11,0.1)", color: "#F59E0B" }}>
            ⚠ {alertThreshold.message}
          </div>
        )}

        {/* Accent bar */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, ${accentColor}60, transparent)` }}
        />
      </div>
    </div>
  );
}

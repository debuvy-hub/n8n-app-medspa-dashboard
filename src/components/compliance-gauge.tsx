"use client";

interface GaugeProps {
  label: string;
  value: number;
  thresholdWarning: number;
  thresholdDanger: number;
  unit?: string;
  description?: string;
}

function getGaugeColor(value: number, warn: number, danger: number): string {
  if (value >= danger) return "#EF4444";
  if (value >= warn)   return "#F59E0B";
  return "#10B981";
}

function GaugeBar({ value, warn, danger }: { value: number; warn: number; danger: number }) {
  const color = getGaugeColor(value, warn, danger);
  const pct = Math.min((value / (danger * 1.5)) * 100, 100);

  return (
    <div className="relative h-2 rounded-full overflow-hidden" style={{ background: "#14142A" }}>
      {/* Threshold markers */}
      <div className="absolute top-0 bottom-0 w-px"
           style={{ left: `${(warn / (danger * 1.5)) * 100}%`, background: "#F59E0B44" }} />
      <div className="absolute top-0 bottom-0 w-px"
           style={{ left: `${(danger / (danger * 1.5)) * 100}%`, background: "#EF444444" }} />
      {/* Fill */}
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}

export function CompliancePanel({
  optOutRate,
  aiFallbackRate,
}: {
  optOutRate: number;
  aiFallbackRate: number;
}) {
  const gauges: GaugeProps[] = [
    {
      label: "Opt-Out Rate",
      value: optOutRate,
      thresholdWarning: 2,
      thresholdDanger: 5,
      unit: "%",
      description: "Carrier filtering risk above 5%",
    },
    {
      label: "AI Fallback Rate",
      value: aiFallbackRate,
      thresholdWarning: 20,
      thresholdDanger: 30,
      unit: "%",
      description: "Conversations escalated to human review",
    },
  ];

  return (
    <div className="rounded-2xl p-5"
         style={{ background: "#0F0F1A", border: "1px solid #1E1E30" }}>
      <p className="text-sm font-semibold mb-1" style={{ color: "#E8E8F0" }}>Compliance & AI Health</p>
      <p className="text-xs mb-5" style={{ color: "#6B6B8A" }}>Current period thresholds</p>

      <div className="space-y-5">
        {gauges.map(({ label, value, thresholdWarning, thresholdDanger, unit, description }) => {
          const color = getGaugeColor(value, thresholdWarning, thresholdDanger);
          const status = value >= thresholdDanger ? "Alert" : value >= thresholdWarning ? "Caution" : "Good";

          return (
            <div key={label}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-xs font-medium" style={{ color: "#9999B8" }}>{label}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#6B6B8A" }}>{description}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold tabular-nums" style={{ color }}>
                    {value.toFixed(1)}{unit}
                  </p>
                  <p className="text-xs font-medium" style={{ color }}>
                    {status}
                  </p>
                </div>
              </div>
              <GaugeBar value={value} warn={thresholdWarning} danger={thresholdDanger} />
              <div className="flex justify-between mt-1">
                <span className="text-xs" style={{ color: "#6B6B8A" }}>0{unit}</span>
                <span className="text-xs" style={{ color: "#F59E0B" }}>
                  {thresholdWarning}{unit} caution
                </span>
                <span className="text-xs" style={{ color: "#EF4444" }}>
                  {thresholdDanger}{unit} alert
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import type { Lead } from "@/lib/types";

const BUCKETS = [
  {
    key: "actionable",
    label: "Actionable",
    sublabel: "Leads that can be worked right now",
    statuses: ["New", "Replied", "NoShow", "ReOptInPending"],
    color: "#6366F1",
    bgColor: "rgba(99,102,241,0.12)",
  },
  {
    key: "inProgress",
    label: "In Progress",
    sublabel: "Moving through the funnel",
    statuses: ["Contacted", "Qualified", "Booked", "Showed"],
    color: "#F59E0B",
    bgColor: "rgba(245,158,11,0.12)",
  },
  {
    key: "closed",
    label: "Closed",
    sublabel: "Opted out, DNC, or bad number",
    statuses: ["OptedOut", "DNC", "BadNumber"],
    color: "#6B6B8A",
    bgColor: "rgba(107,107,138,0.10)",
  },
] as const;

const STATUS_LABELS: Record<string, string> = {
  New:             "New",
  Replied:         "Replied",
  NoShow:          "No-Show",
  ReOptInPending:  "Re-Opt-In Pending",
  Contacted:       "Contacted",
  Qualified:       "Qualified",
  Booked:          "Booked",
  Showed:          "Showed",
  OptedOut:        "Opted Out",
  DNC:             "Do Not Contact",
  BadNumber:       "Bad Number",
};

export function LeadPoolBreakdown({ leads }: { leads: Lead[] }) {
  const total = leads.length;
  if (total === 0) return null;

  const bucketCounts = BUCKETS.map((bucket) => {
    const count = leads.filter((l) => bucket.statuses.includes(l.status as never)).length;
    const pct = Math.round((count / total) * 100);

    // Per-status breakdown for tooltip/detail row
    const detail = bucket.statuses
      .map((s) => ({ status: s, count: leads.filter((l) => l.status === s).length }))
      .filter((d) => d.count > 0);

    return { ...bucket, count, pct, detail };
  });

  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "#0F0F1A", border: "1px solid #1E1E30" }}
    >
      {/* Header */}
      <div className="mb-5">
        <p className="text-sm font-semibold" style={{ color: "#E8E8F0" }}>
          Eligible Lead Pool
        </p>
        <p className="text-xs mt-0.5" style={{ color: "#6B6B8A" }}>
          {total} total leads — where they stand right now
        </p>
      </div>

      {/* Stacked bar */}
      <div className="flex rounded-lg overflow-hidden h-3 mb-6 gap-px">
        {bucketCounts.map((b) =>
          b.count > 0 ? (
            <div
              key={b.key}
              style={{ width: `${b.pct}%`, background: b.color, minWidth: b.count > 0 ? "2px" : "0" }}
              title={`${b.label}: ${b.count}`}
            />
          ) : null
        )}
      </div>

      {/* Bucket rows */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {bucketCounts.map((b) => (
          <div
            key={b.key}
            className="rounded-xl p-4"
            style={{ background: b.bgColor, border: `1px solid ${b.color}22` }}
          >
            {/* Bucket header */}
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold" style={{ color: b.color }}>
                {b.label}
              </span>
              <span className="text-lg font-bold tabular-nums" style={{ color: "#E8E8F0" }}>
                {b.count}
              </span>
            </div>
            <p className="text-xs mb-3" style={{ color: "#6B6B8A" }}>
              {b.pct}% of pool
            </p>

            {/* Per-status detail */}
            <div className="space-y-1.5">
              {b.detail.map((d) => (
                <div key={d.status} className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: "#9999B8" }}>
                    {STATUS_LABELS[d.status] ?? d.status}
                  </span>
                  <span
                    className="text-xs font-medium tabular-nums px-1.5 py-0.5 rounded"
                    style={{ background: "#14142A", color: "#E8E8F0" }}
                  >
                    {d.count}
                  </span>
                </div>
              ))}
              {b.detail.length === 0 && (
                <p className="text-xs" style={{ color: "#6B6B8A" }}>None</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

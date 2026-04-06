"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { TrendingUp, Download, Printer, Table, Activity, ChevronDown, ChevronLeft, ChevronRight, DollarSign } from "lucide-react";
import { mockLeads, mockExecutionLog, mockDashboard } from "@/data/mock";
import { exportLeads, exportExecutionLog, exportWeeklyReport, exportRoiReport } from "@/lib/export";
import { formatPercent } from "@/lib/utils";
import { STATUS_COLORS } from "@/lib/status-colors";
import type { LeadStatus } from "@/lib/status-colors";

// ─── Custom dropdown ──────────────────────────────────────────────────────────

function CustomSelect<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { label: string; value: T }[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? value;

  return (
    <div ref={ref} className="relative flex-1">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs"
        style={{ background: "#14142A", border: "1px solid #2E2E50", color: "#E8E8F0" }}
      >
        <span>{selectedLabel}</span>
        <ChevronDown className="w-3 h-3 shrink-0" style={{ color: "#6B6B8A" }} />
      </button>

      {open && (
        <div
          className="absolute z-20 mt-1 rounded-xl py-1 w-full"
          style={{ background: "#0F0F1A", border: "1px solid #1E1E30", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}
        >
          {options.map((o) => (
            <button
              key={o.value}
              onClick={() => { onChange(o.value); setOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs hover:bg-white/5 transition-colors"
              style={{ color: value === o.value ? "#E8E8F0" : "#9999B8" }}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterSelect<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { label: string; value: T }[];
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs w-16 shrink-0" style={{ color: "#6B6B8A" }}>{label}</span>
      <CustomSelect value={value} onChange={onChange} options={options} />
    </div>
  );
}

// ─── Multi-status select ──────────────────────────────────────────────────────

const ALL_LEAD_STATUSES: LeadStatus[] = [
  "New", "Contacted", "Replied", "Qualified", "Booked", "Showed",
  "NoShow", "ReOptInPending", "OptedOut", "DNC",
];

const STATUS_DISPLAY: Record<LeadStatus, string> = {
  New: "New", Contacted: "Contacted", Replied: "Replied",
  Qualified: "Qualified", Booked: "Booked", Showed: "Showed", Sold: "Sold",
  NoShow: "No Show", ReOptInPending: "Re-Opt-In Pending",
  OptedOut: "Opted Out", DNC: "DNC",
};

function MultiStatusSelect({
  selected,
  onChange,
}: {
  selected: LeadStatus[];
  onChange: (v: LeadStatus[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  function toggle(s: LeadStatus) {
    onChange(selected.includes(s) ? selected.filter((x) => x !== s) : [...selected, s]);
  }

  const label =
    selected.length === 0
      ? "All statuses"
      : selected.length === 1
      ? STATUS_DISPLAY[selected[0]]
      : `${selected.length} statuses`;

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs w-16 shrink-0" style={{ color: "#6B6B8A" }}>Status</span>
      <div ref={ref} className="relative flex-1">
        <button
          onClick={() => setOpen((o) => !o)}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs"
          style={{ background: "#14142A", border: "1px solid #2E2E50", color: "#E8E8F0" }}
        >
          <span>{label}</span>
          <ChevronDown className="w-3 h-3 shrink-0" style={{ color: "#6B6B8A" }} />
        </button>

        {open && (
          <div
            className="absolute z-20 mt-1 rounded-xl py-1 w-full"
            style={{ background: "#0F0F1A", border: "1px solid #1E1E30", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}
          >
            {/* Clear all */}
            <button
              onClick={() => onChange([])}
              className="w-full text-left px-3 py-2 text-xs hover:bg-white/5 transition-colors"
              style={{ color: selected.length === 0 ? "#E8E8F0" : "#9999B8", borderBottom: "1px solid #1E1E30" }}
            >
              All statuses
            </button>

            {ALL_LEAD_STATUSES.map((s) => {
              const color = STATUS_COLORS[s].text;
              const isOn  = selected.includes(s);
              return (
                <button
                  key={s}
                  onClick={() => toggle(s)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-white/5 transition-colors"
                  style={{ color: isOn ? "#E8E8F0" : "#9999B8" }}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
                    {STATUS_DISPLAY[s]}
                  </span>
                  {isOn && (
                    <span className="text-xs" style={{ color }}>✓</span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Custom date picker ───────────────────────────────────────────────────────

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function DatePicker({
  label,
  value,
  onChange,
  accentColor = "#10B981",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  accentColor?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = value ? new Date(value + "T12:00:00") : null;
  const [viewYear,  setViewYear]  = useState(() => selected?.getFullYear()  ?? new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(() => selected?.getMonth()     ?? new Date().getMonth());

  // Sync calendar view when value is set externally
  useEffect(() => {
    if (value) {
      const d = new Date(value + "T12:00:00");
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
    }
  }, [value]);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  }

  function selectDay(day: number) {
    const iso = new Date(viewYear, viewMonth, day).toISOString().split("T")[0];
    onChange(iso);
    setOpen(false);
  }

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const startOffset = new Date(viewYear, viewMonth, 1).getDay();
  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const today = new Date();
  const isToday = (d: number) =>
    today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === d;
  const isSelected = (d: number) =>
    !!selected &&
    selected.getFullYear() === viewYear &&
    selected.getMonth() === viewMonth &&
    selected.getDate() === d;

  const displayValue = selected
    ? selected.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "";

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs w-16 shrink-0" style={{ color: "#6B6B8A" }}>{label}</span>
      <div ref={ref} className="relative flex-1">
        <button
          onClick={() => setOpen((o) => !o)}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs"
          style={{
            background: "#14142A",
            border: "1px solid #2E2E50",
            color: displayValue ? "#E8E8F0" : "#6B6B8A",
          }}
        >
          <span>{displayValue || "Select date"}</span>
          <ChevronDown className="w-3 h-3 shrink-0" style={{ color: "#6B6B8A" }} />
        </button>

        {open && (
          <div
            className="absolute z-30 mt-1 rounded-xl p-3"
            style={{
              background: "#0F0F1A",
              border: "1px solid #1E1E30",
              boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
              width: "15rem",
            }}
          >
            {/* Month / year nav */}
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={prevMonth}
                className="p-1 rounded-lg hover:bg-white/5 transition-colors"
                style={{ color: "#9999B8" }}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-semibold" style={{ color: "#E8E8F0" }}>
                {MONTH_NAMES[viewMonth]} {viewYear}
              </span>
              <button
                onClick={nextMonth}
                className="p-1 rounded-lg hover:bg-white/5 transition-colors"
                style={{ color: "#9999B8" }}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Day-of-week headers */}
            <div className="grid grid-cols-7 mb-1">
              {DAY_NAMES.map((d) => (
                <span
                  key={d}
                  className="text-center text-xs pb-1"
                  style={{ color: "#4A4A6A" }}
                >
                  {d}
                </span>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 gap-y-0.5">
              {cells.map((day, i) => (
                <button
                  key={i}
                  onClick={() => day !== null && selectDay(day)}
                  disabled={day === null}
                  className="flex items-center justify-center rounded-lg text-xs transition-colors"
                  style={{
                    height: "1.75rem",
                    width: "1.75rem",
                    margin: "0 auto",
                    cursor: day !== null ? "pointer" : "default",
                    color: day === null
                      ? "transparent"
                      : isSelected(day)
                      ? "#0F0F1A"
                      : isToday(day)
                      ? accentColor
                      : "#C8C8E0",
                    background: day !== null && isSelected(day) ? accentColor : "transparent",
                    fontWeight: day !== null && isToday(day) && !isSelected(day) ? 600 : undefined,
                  }}
                  onMouseEnter={(e) => {
                    if (day !== null && !isSelected(day)) {
                      (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (day !== null && !isSelected(day)) {
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                    }
                  }}
                >
                  {day ?? ""}
                </button>
              ))}
            </div>

            {/* Clear */}
            {value && (
              <button
                onClick={() => { onChange(""); setOpen(false); }}
                className="mt-2 w-full text-xs py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                style={{ color: "#6B6B8A", borderTop: "1px solid #1E1E30", paddingTop: "0.5rem", marginTop: "0.5rem" }}
              >
                Clear date
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Report card ─────────────────────────────────────────────────────────────

interface ReportCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  accentColor: string;
  filters?: React.ReactNode;
  stats?: { label: string; value: string }[];
  onDownload: () => void;
  onPrint?: () => void;
  downloadLabel?: string;
  downloadCount?: number;
}

function ReportCard({
  icon, title, description, accentColor, filters, stats,
  onDownload, onPrint, downloadLabel = "Download CSV", downloadCount,
}: ReportCardProps) {
  return (
    <div className="rounded-2xl p-6 flex flex-col gap-4"
         style={{ background: "#0F0F1A", border: "1px solid #1E1E30" }}>
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
             style={{ background: `${accentColor}18`, color: accentColor }}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="font-semibold" style={{ color: "#E8E8F0" }}>{title}</p>
          <p className="text-sm mt-0.5" style={{ color: "#6B6B8A" }}>{description}</p>
        </div>
      </div>

      {filters && (
        <div className="space-y-2 pt-3 border-t" style={{ borderColor: "#1E1E30" }}>
          {filters}
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-2 gap-3">
          {stats.map(({ label, value }) => (
            <div key={label} className="rounded-xl px-3 py-2.5" style={{ background: "#14142A" }}>
              <p className="text-xs" style={{ color: "#6B6B8A" }}>{label}</p>
              <p className="text-base font-bold tabular-nums mt-0.5" style={{ color: "#E8E8F0" }}>{value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-auto">
        <button
          onClick={onDownload}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80"
          style={{ background: `${accentColor}15`, color: accentColor, border: `1px solid ${accentColor}30` }}
        >
          <Download className="w-3.5 h-3.5" />
          {downloadLabel}
          {downloadCount !== undefined && (
            <span className="px-1.5 py-0.5 rounded text-xs" style={{ background: `${accentColor}25` }}>
              {downloadCount}
            </span>
          )}
        </button>
        {onPrint && (
          <button
            onClick={onPrint}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80"
            style={{ background: "rgba(255,255,255,0.04)", color: "#9999B8", border: "1px solid #1E1E30" }}
          >
            <Printer className="w-3.5 h-3.5" />
            Print / PDF
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

// ─── Print report ────────────────────────────────────────────────────────────

function printCampaignReport(
  weeks: typeof mockDashboard.weeklyTrends,
  fromDate: string,
  toDate: string,
) {
  const fmt = (d: string) => {
    const [y, m, day] = d.split("-").map(Number);
    return new Date(y, m - 1, day).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const dateRange =
    fromDate || toDate
      ? `${fromDate ? fmt(fromDate) : "Beginning"} — ${toDate ? fmt(toDate) : "Present"}`
      : weeks.length > 0
      ? `${weeks[0].week} — ${weeks[weeks.length - 1].week}`
      : "All weeks";

  const totalMessages  = weeks.reduce((s, w) => s + w.messagesSent, 0);
  const totalReplies   = weeks.reduce((s, w) => s + w.replies, 0);
  const totalBookings  = weeks.reduce((s, w) => s + w.bookings, 0);
  const totalOptOuts   = weeks.reduce((s, w) => s + w.optOuts, 0);
  const totalFallbacks = weeks.reduce((s, w) => s + (w.aiFallbacks ?? 0), 0);

  const pct = (n: number, d: number) => (d > 0 ? ((n / d) * 100).toFixed(1) + "%" : "—");

  const rows = weeks
    .map(
      (w) => `
      <tr>
        <td>${w.week}</td>
        <td class="r">${w.messagesSent.toLocaleString()}</td>
        <td class="r">${w.replies.toLocaleString()}</td>
        <td class="r">${pct(w.replies, w.messagesSent)}</td>
        <td class="r">${w.bookings}</td>
        <td class="r">${w.optOuts}</td>
        <td class="r">${w.aiFallbacks ?? 0}</td>
      </tr>`,
    )
    .join("");

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Campaign Performance Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #111; padding: 48px; font-size: 13px; line-height: 1.5; }

    header { margin-bottom: 32px; }
    h1 { font-size: 22px; font-weight: 700; letter-spacing: -0.3px; }
    .meta { font-size: 12px; color: #666; margin-top: 4px; }

    .range-bar { display: flex; gap: 40px; padding: 16px 0; border-top: 2px solid #111; border-bottom: 1px solid #ddd; margin-bottom: 28px; }
    .range-bar dt { font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; color: #888; margin-bottom: 2px; }
    .range-bar dd { font-size: 14px; font-weight: 600; }

    .summary { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin-bottom: 32px; }
    .stat { border: 1px solid #e0e0e0; border-radius: 8px; padding: 14px 16px; }
    .stat-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; color: #888; margin-bottom: 6px; }
    .stat-value { font-size: 20px; font-weight: 700; }

    h2 { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #444; margin-bottom: 10px; }

    table { width: 100%; border-collapse: collapse; }
    thead tr { border-bottom: 2px solid #111; }
    th { text-align: left; padding: 8px 10px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; color: #555; font-weight: 600; }
    td { padding: 9px 10px; border-bottom: 1px solid #ebebeb; font-variant-numeric: tabular-nums; }
    tr:last-child td { border-bottom: none; }
    tr:nth-child(even) td { background: #fafafa; }
    .r { text-align: right; }

    footer { margin-top: 40px; padding-top: 14px; border-top: 1px solid #e0e0e0; font-size: 11px; color: #999; }

    @media print {
      body { padding: 24px; }
      .stat { border-color: #ccc; }
    }
  </style>
</head>
<body>
  <header>
    <h1>Campaign Performance Report</h1>
    <p class="meta">Premier Central MI MedSpa &nbsp;·&nbsp; Generated ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
  </header>

  <div class="range-bar">
    <dl><dt>Date Range</dt><dd>${dateRange}</dd></dl>
    <dl><dt>Weeks Included</dt><dd>${weeks.length}</dd></dl>
  </div>

  <div class="summary">
    <div class="stat">
      <div class="stat-label">Messages Sent</div>
      <div class="stat-value">${totalMessages.toLocaleString()}</div>
    </div>
    <div class="stat">
      <div class="stat-label">Replies</div>
      <div class="stat-value">${totalReplies.toLocaleString()}</div>
    </div>
    <div class="stat">
      <div class="stat-label">Reply Rate</div>
      <div class="stat-value">${pct(totalReplies, totalMessages)}</div>
    </div>
    <div class="stat">
      <div class="stat-label">Bookings</div>
      <div class="stat-value">${totalBookings.toLocaleString()}</div>
    </div>
    <div class="stat">
      <div class="stat-label">Opt-Out Rate</div>
      <div class="stat-value">${pct(totalOptOuts, totalMessages)}</div>
    </div>
  </div>

  <h2>Week-by-Week Breakdown</h2>
  <table>
    <thead>
      <tr>
        <th>Week</th>
        <th class="r">Messages</th>
        <th class="r">Replies</th>
        <th class="r">Reply Rate</th>
        <th class="r">Bookings</th>
        <th class="r">Opt-Outs</th>
        <th class="r">AI Fallbacks</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  <footer>
    Premier Central MI MedSpa · AI Reactivation System ·
    Data reflects SMS outreach activity only. Revenue is excluded — figures require PMS integration to verify.
    AI Fallbacks: ${totalFallbacks} total (${pct(totalFallbacks, totalMessages)} of messages sent).
  </footer>
</body>
</html>`;

  const win = window.open("", "_blank", "width=960,height=720");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 400);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ReportsPage() {
  const { kpis, weeklyTrends } = mockDashboard;
  const collectedFmt = `$${kpis.collectedRevenue.value.toLocaleString()}`;
  const roiFmt = `${kpis.netRoi.value.toFixed(1)}x`;

  // ── Campaign Performance ──
  const [roiFrom, setRoiFrom] = useState("");
  const [roiTo,   setRoiTo]   = useState("");

  const filteredWeeks = useMemo(() => {
    return weeklyTrends.filter((w) => {
      const weekDate = new Date(w.week + " 2026");
      if (roiFrom && weekDate < new Date(roiFrom)) return false;
      if (roiTo   && weekDate > new Date(roiTo + "T23:59:59")) return false;
      return true;
    });
  }, [roiFrom, roiTo, weeklyTrends]);

  const campMessages   = filteredWeeks.reduce((s, w) => s + w.messagesSent, 0);
  const campReplies    = filteredWeeks.reduce((s, w) => s + w.replies, 0);
  const campBookings   = filteredWeeks.reduce((s, w) => s + w.bookings, 0);
  const campOptOuts    = filteredWeeks.reduce((s, w) => s + w.optOuts, 0);
  const campFallbacks  = filteredWeeks.reduce((s, w) => s + (w.aiFallbacks ?? 0), 0);

  // ── Lead Export ──
  const [leadStatuses, setLeadStatuses] = useState<LeadStatus[]>([]);
  const [leadDnc,     setLeadDnc]     = useState<"all" | "dnc" | "no-dnc">("all");
  const [leadReplied, setLeadReplied] = useState<"all" | "yes">("all");
  const [leadTime,    setLeadTime]    = useState<"all" | "30d" | "90d" | "180d">("all");

  const filteredLeads = useMemo(() => {
    const dayMap: Record<string, number | null> = { all: null, "30d": 30, "90d": 90, "180d": 180 };
    const cutoff = dayMap[leadTime] != null ? daysAgo(dayMap[leadTime]!) : null;
    return mockLeads.filter((l) => {
      if (leadStatuses.length > 0 && !leadStatuses.includes(l.status as LeadStatus)) return false;
      if (leadDnc === "dnc" && !l.dnc)                     return false;
      if (leadDnc === "no-dnc" && l.dnc)                   return false;
      if (leadReplied === "yes" && !l.smsHistory?.some((m) => m.direction === "inbound")) return false;
      if (cutoff && l.lastContactDate && new Date(l.lastContactDate) < cutoff) return false;
      return true;
    });
  }, [leadStatuses, leadDnc, leadReplied, leadTime]);

  // ── Execution Log ──
  const [logFrom,   setLogFrom]   = useState("");
  const [logTo,     setLogTo]     = useState("");
  const [logStatus, setLogStatus] = useState<"all" | "success" | "error">("all");

  const filteredLog = useMemo(() => {
    return mockExecutionLog.filter((e) => {
      if (logStatus !== "all" && e.status !== logStatus) return false;
      const date = new Date(e.startedAt);
      if (logFrom && date < new Date(logFrom)) return false;
      if (logTo   && date > new Date(logTo + "T23:59:59")) return false;
      return true;
    });
  }, [logStatus, logFrom, logTo]);

  const logAvgDuration = filteredLog.length > 0
    ? (filteredLog.reduce((s, e) => s + e.duration, 0) / filteredLog.length / 1000).toFixed(0)
    : "—";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "#E8E8F0" }}>Reports</h1>
        <p className="text-sm mt-0.5" style={{ color: "#6B6B8A" }}>
          Filter and download reports for any time period
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

        {/* ── ROI Summary ── */}
        <ReportCard
          icon={<DollarSign className="w-5 h-5" />}
          title="ROI Summary"
          description="Collected revenue, projected pipeline, cost per outcome, and net return"
          accentColor="#34D399"
          stats={[
            { label: "Collected revenue",  value: collectedFmt },
            { label: "Net ROI",            value: roiFmt },
            { label: "Cost per booked",    value: `$${kpis.costPerBooked.value}` },
            { label: "Cost per showed",    value: `$${kpis.costPerShowed.value}` },
          ]}
          onDownload={() => exportRoiReport(weeklyTrends, kpis)}
          downloadLabel="Download CSV"
          downloadCount={weeklyTrends.length}
        />

        {/* ── Campaign Performance ── */}
        <ReportCard
          icon={<TrendingUp className="w-5 h-5" />}
          title="Campaign Performance"
          description="Actual outreach activity — messages, replies, opt-outs, and bookings triggered"
          accentColor="#8B5CF6"
          filters={
            <>
              <DatePicker label="From" value={roiFrom} onChange={setRoiFrom} accentColor="#8B5CF6" />
              <DatePicker label="To"   value={roiTo}   onChange={setRoiTo}   accentColor="#8B5CF6" />
            </>
          }
          stats={[
            { label: "Messages sent",    value: campMessages.toLocaleString() },
            { label: "Bookings",         value: campBookings.toString() },
            { label: "Reply rate",       value: campMessages > 0 ? formatPercent((campReplies / campMessages) * 100) : "—" },
            { label: "Opt-out rate",     value: campMessages > 0 ? formatPercent((campOptOuts / campMessages) * 100) : "—" },
          ]}
          onDownload={() => exportWeeklyReport(filteredWeeks)}
          onPrint={() => printCampaignReport(filteredWeeks, roiFrom, roiTo)}
          downloadCount={filteredWeeks.length}
        />

        {/* ── Lead Export ── */}
        <ReportCard
          icon={<Table className="w-5 h-5" />}
          title="Lead Export"
          description="Full lead list with status, consent, AI confidence, DNC flags"
          accentColor="#6366F1"
          filters={
            <>
              <MultiStatusSelect selected={leadStatuses} onChange={setLeadStatuses} />
              <FilterSelect
                label="DNC"
                value={leadDnc}
                onChange={setLeadDnc}
                options={[
                  { label: "All leads", value: "all"    },
                  { label: "DNC only",  value: "dnc"    },
                  { label: "No DNC",    value: "no-dnc" },
                ]}
              />
              <FilterSelect
                label="Replied"
                value={leadReplied}
                onChange={setLeadReplied}
                options={[
                  { label: "All leads",   value: "all" },
                  { label: "Has replied", value: "yes" },
                ]}
              />
              <FilterSelect
                label="Period"
                value={leadTime}
                onChange={setLeadTime}
                options={[
                  { label: "All time",      value: "all"  },
                  { label: "Last 30 days",  value: "30d"  },
                  { label: "Last 90 days",  value: "90d"  },
                  { label: "Last 6 months", value: "180d" },
                ]}
              />
            </>
          }
          stats={[
            { label: "Matching leads", value: filteredLeads.length.toString() },
            { label: "Active",         value: filteredLeads.filter((l) => !l.dnc && l.status !== "OptedOut").length.toString() },
            { label: "DNC",            value: filteredLeads.filter((l) => l.dnc).length.toString() },
            { label: "Has replied",    value: filteredLeads.filter((l) => l.smsHistory?.some((m) => m.direction === "inbound")).length.toString() },
          ]}
          onDownload={() => exportLeads(filteredLeads)}
          downloadCount={filteredLeads.length}
        />

        {/* ── Execution Log ── */}
        <ReportCard
          icon={<Activity className="w-5 h-5" />}
          title="Execution Log"
          description="n8n workflow execution history with durations and errors"
          accentColor="#10B981"
          filters={
            <>
              <DatePicker label="From" value={logFrom} onChange={setLogFrom} accentColor="#10B981" />
              <DatePicker label="To"   value={logTo}   onChange={setLogTo}   accentColor="#10B981" />
              <FilterSelect
                label="Status"
                value={logStatus}
                onChange={setLogStatus}
                options={[
                  { label: "All runs", value: "all"     },
                  { label: "Success",  value: "success" },
                  { label: "Error",    value: "error"   },
                ]}
              />
            </>
          }
          stats={[
            { label: "Runs",         value: filteredLog.length.toString() },
            { label: "Successful",   value: filteredLog.filter((e) => e.status === "success").length.toString() },
            { label: "Errors",       value: filteredLog.filter((e) => e.status === "error").length.toString() },
            { label: "Avg duration", value: `${logAvgDuration}s` },
          ]}
          onDownload={() => exportExecutionLog(filteredLog)}
          downloadCount={filteredLog.length}
        />
      </div>

    </div>
  );
}

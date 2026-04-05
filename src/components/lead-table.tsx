"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Search,
  MessageSquare,
  ShieldOff,
  ShieldCheck,
  X,
} from "lucide-react";
import type { Lead, LeadStatus } from "@/lib/types";
import { formatRelativeDate, getDaysSince } from "@/lib/utils";
import { useLeads } from "@/providers/leads-provider";
import { STATUS_COLORS } from "@/lib/status-colors";

const ALL_STATUSES: LeadStatus[] = [
  // Active funnel — in order of progression
  "New", "Contacted", "Replied", "Qualified", "Booked", "Showed",
  // Off-path outcomes
  "NoShow", "ReOptInPending", "OptedOut", "DNC",
];

const STATUS_DISPLAY: Record<LeadStatus, string> = {
  New:            "New",
  Contacted:      "Contacted",
  Replied:        "Replied",
  Qualified:      "Qualified",
  Booked:         "Booked",
  Showed:         "Showed",
  NoShow:         "No Show",
  OptedOut:       "Opted Out",
  DNC:            "DNC",
  ReOptInPending: "Re-Opt-In Pending",
};

interface SmsDrawerProps {
  lead: Lead;
  onClose: () => void;
}

function SmsDrawer({ lead, onClose }: SmsDrawerProps) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md h-full flex flex-col"
           style={{ background: "#0F0F1A", borderLeft: "1px solid #1E1E30" }}>
        <div className="flex items-center justify-between px-5 py-4"
             style={{ borderBottom: "1px solid #1E1E30" }}>
          <div>
            <p className="font-semibold" style={{ color: "#E8E8F0" }}>
              {lead.firstName} {lead.lastName}
            </p>
            <p className="text-xs" style={{ color: "#6B6B8A" }}>{lead.phone}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5"
                  style={{ color: "#6B6B8A" }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {lead.smsHistory?.length ? (
            lead.smsHistory.map((msg, i) => (
              <div key={i} className={`flex ${msg.direction === "outbound" ? "justify-end" : "justify-start"}`}>
                <div
                  className="max-w-xs px-3 py-2 rounded-xl text-sm"
                  style={msg.direction === "outbound"
                    ? { background: "rgba(99,102,241,0.2)", color: "#E8E8F0", borderBottomRightRadius: "4px" }
                    : { background: "#14142A", color: "#E8E8F0", border: "1px solid #1E1E30", borderBottomLeftRadius: "4px" }
                  }
                >
                  <p>{msg.body}</p>
                  <p className="text-xs mt-1 opacity-60">
                    {new Date(msg.timestamp).toLocaleString()}
                    {msg.wasAiFallback && " · AI escalated"}
                    {msg.aiConfidence !== undefined && ` · ${(msg.aiConfidence * 100).toFixed(0)}% conf`}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-sm" style={{ color: "#6B6B8A" }}>No SMS history</p>
          )}
        </div>
      </div>
    </div>
  );
}

interface LeadTableProps {
  leads?: Lead[];
}

function StatusDropdown({
  value,
  onChange,
}: {
  value: LeadStatus | "all";
  onChange: (v: LeadStatus | "all") => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const selected = value !== "all" ? STATUS_COLORS[value] : null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm outline-none"
        style={{ background: "#0F0F1A", border: "1px solid #1E1E30", color: selected ? selected.text : "#E8E8F0", minWidth: "9rem" }}
      >
        {selected && (
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: selected.text }} />
        )}
        <span className="flex-1 text-left">
          {value === "all" ? "All statuses" : STATUS_DISPLAY[value]}
        </span>
        <ChevronDown className="w-3.5 h-3.5 shrink-0" style={{ color: "#6B6B8A" }} />
      </button>

      {open && (
        <div
          className="absolute z-20 mt-1 rounded-xl py-1 min-w-full"
          style={{ background: "#0F0F1A", border: "1px solid #1E1E30", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}
        >
          <button
            onClick={() => { onChange("all"); setOpen(false); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-white/5 transition-colors"
            style={{ color: value === "all" ? "#E8E8F0" : "#6B6B8A" }}
          >
            All statuses
          </button>
          {ALL_STATUSES.map((s) => {
            const colors = STATUS_COLORS[s];
            return (
              <button
                key={s}
                onClick={() => { onChange(s); setOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-white/5 transition-colors"
                style={{ color: value === s ? colors.text : "#9999B8" }}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: colors.text }}
                />
                {STATUS_DISPLAY[s]}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function LeadTable(_props: LeadTableProps) {
  const { leads, markQualified, markDnc, removeDnc } = useLeads();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [dncFilter, setDncFilter] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (dncFilter && !l.dnc) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !l.firstName.toLowerCase().includes(q) &&
          !l.lastName.toLowerCase().includes(q) &&
          !l.phone.includes(q)
        ) return false;
      }
      return true;
    });
  }, [leads, statusFilter, dncFilter, search]);

  const columns = useMemo<ColumnDef<Lead>[]>(() => [
    {
      accessorFn: (r) => `${r.firstName} ${r.lastName}`,
      id: "name",
      header: "Name",
      cell: ({ row }) => {
        const days = getDaysSince(row.original.lastContactDate);
        const stale = days !== null && days > 30;
        return (
          <div className="flex items-center gap-2">
            {stale && <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ background: "#F59E0B" }} />}
            <div>
              <p className="text-sm font-medium" style={{ color: "#E8E8F0" }}>
                {row.original.firstName} {row.original.lastName}
              </p>
              <p className="text-xs" style={{ color: "#6B6B8A" }}>{row.original.phone}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const s = getValue() as LeadStatus;
        const colors = STATUS_COLORS[s];
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium"
                style={{ background: colors.bg, color: colors.text }}>
            {s}
          </span>
        );
      },
    },
    {
      accessorKey: "lastContactDate",
      header: "Last Contact",
      cell: ({ getValue }) => (
        <span className="text-sm tabular-nums" style={{ color: "#9999B8" }}>
          {formatRelativeDate(getValue() as string | null)}
        </span>
      ),
    },
    {
      id: "daysSince",
      header: "Days Since",
      accessorFn: (r) => getDaysSince(r.lastContactDate) ?? 9999,
      cell: ({ row }) => {
        const days = getDaysSince(row.original.lastContactDate);
        if (days === null) return <span style={{ color: "#6B6B8A" }}>—</span>;
        return (
          <span className="text-sm tabular-nums font-medium"
                style={{ color: days > 30 ? "#F59E0B" : "#9999B8" }}>
            {days}d
          </span>
        );
      },
    },
    {
      accessorKey: "aiConfidence",
      header: "AI Confidence",
      cell: ({ getValue }) => {
        const v = getValue() as number | null;
        if (v === null) return <span style={{ color: "#6B6B8A" }}>—</span>;
        const pct = Math.round(v * 100);
        const color = v < 0.7 ? "#F59E0B" : "#10B981";
        return (
          <span className="text-xs font-medium tabular-nums px-2 py-0.5 rounded"
                style={{ background: `${color}18`, color }}>
            {pct}%
          </span>
        );
      },
    },
    {
      accessorKey: "dnc",
      header: "DNC",
      cell: ({ getValue }) =>
        getValue() ? (
          <span className="text-xs" style={{ color: "#EF4444" }}>⛔ DNC</span>
        ) : (
          <span style={{ color: "#6B6B8A" }}>—</span>
        ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSelectedLead(row.original)}
            className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
            title="View SMS history"
            style={{ color: "#6B6B8A" }}
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </button>
          {!row.original.dnc && row.original.status !== "Qualified" && (
            <button
              onClick={() => markQualified(row.original.id)}
              className="px-2 py-1 rounded-lg text-xs hover:bg-white/5 transition-colors"
              title="Mark Qualified"
              style={{ color: "#8B5CF6" }}
            >
              Qualify
            </button>
          )}
          {row.original.dnc ? (
            <button
              onClick={() => removeDnc(row.original.id)}
              className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
              title="Remove DNC"
              style={{ color: "#10B981" }}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => markDnc(row.original.id)}
              className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
              title="Mark DNC"
              style={{ color: "#6B6B8A" }}
            >
              <ShieldOff className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ),
    },
  ], []);

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <>
      {selectedLead && (
        <SmsDrawer lead={selectedLead} onClose={() => setSelectedLead(null)} />
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
                  style={{ color: "#6B6B8A" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or phone…"
            className="pl-8 pr-4 py-2 rounded-xl text-sm outline-none w-56"
            style={{ background: "#0F0F1A", border: "1px solid #1E1E30", color: "#E8E8F0" }}
          />
        </div>

        <StatusDropdown value={statusFilter} onChange={setStatusFilter} />

        <label className="flex items-center gap-2 text-sm cursor-pointer"
               style={{ color: "#9999B8" }}>
          <input
            type="checkbox"
            checked={dncFilter}
            onChange={(e) => setDncFilter(e.target.checked)}
            className="rounded"
          />
          DNC only
        </label>

        <span className="text-xs ml-auto" style={{ color: "#6B6B8A" }}>
          {filtered.length} of {leads.length} leads
        </span>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #1E1E30" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} style={{ background: "#0F0F1A", borderBottom: "1px solid #1E1E30" }}>
                  {hg.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider select-none"
                      style={{
                        color: "#6B6B8A",
                        cursor: header.column.getCanSort() ? "pointer" : "default",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          header.column.getIsSorted() === "asc" ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : header.column.getIsSorted() === "desc" ? (
                            <ChevronDown className="w-3 h-3" />
                          ) : (
                            <ChevronsUpDown className="w-3 h-3 opacity-30" />
                          )
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, i) => {
                const stale = (getDaysSince(row.original.lastContactDate) ?? 0) > 30;
                return (
                  <tr
                    key={row.id}
                    style={{
                      background: i % 2 === 0 ? "#08080F" : "#0B0B16",
                      borderBottom: "1px solid #16162A",
                      borderLeft: stale && !row.original.dnc ? "2px solid #F59E0B" : "none",
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                );
              })}
              {table.getRowModel().rows.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="py-12 text-center text-sm"
                      style={{ color: "#6B6B8A" }}>
                    No leads match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

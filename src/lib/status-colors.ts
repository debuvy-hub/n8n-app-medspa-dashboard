/**
 * Unified status color system — urgency-ordered.
 * Import this everywhere a lead status needs a color so they stay in sync.
 */
export const STATUS_COLORS = {
  Replied:        { bg: "rgba(239,68,68,0.12)",   text: "#EF4444" }, // red   — needs human immediately
  NoShow:         { bg: "rgba(245,158,11,0.12)",  text: "#F59E0B" }, // amber — recovery needed
  DNC:            { bg: "rgba(239,68,68,0.15)",   text: "#EF4444" }, // red   — hard stop
  ReOptInPending: { bg: "rgba(139,92,246,0.12)",  text: "#8B5CF6" }, // purple — compliance pending
  New:            { bg: "rgba(59,130,246,0.12)",  text: "#3B82F6" }, // blue  — needs first contact
  Contacted:      { bg: "rgba(99,102,241,0.12)",  text: "#6366F1" }, // indigo — stale, follow-up
  Qualified:      { bg: "rgba(6,182,212,0.12)",   text: "#06B6D4" }, // cyan  — positive progress
  Booked:         { bg: "rgba(16,185,129,0.12)",  text: "#10B981" }, // green — good outcome
  Showed:         { bg: "rgba(16,185,129,0.12)",  text: "#10B981" }, // green — best outcome
  OptedOut:       { bg: "rgba(107,107,138,0.12)", text: "#6B6B8A" }, // gray  — terminal, no action
} as const;

export type LeadStatus = keyof typeof STATUS_COLORS;

// ─── KPI & Dashboard ────────────────────────────────────────────────────────

export interface KpiMetric {
  value: number;
  previousValue: number;
  unit?: "count" | "percent" | "currency";
}

export interface WeeklyDataPoint {
  week: string; // e.g. "Apr 7"
  messagesSent: number;
  replies: number;
  bookings: number;
  revenue: number;
  optOuts: number;
  aiFallbacks: number;
}

export interface LeadPipeline {
  totalLeads: number;
  qualified: number;
  booked: number;
  showed: number;
}

export interface DashboardKpis {
  totalLeads: KpiMetric;
  messagesSent: KpiMetric;
  replyRate: KpiMetric;       // percent
  reactivationRate: KpiMetric; // percent
  bookings: KpiMetric;
  showRate: KpiMetric;        // percent
  estimatedRevenue: KpiMetric; // currency
  aiFallbackRate: KpiMetric;  // percent
  optOutRate: KpiMetric;      // percent
}

export interface DashboardData {
  kpis: DashboardKpis;
  weeklyTrends: WeeklyDataPoint[];
  leadPipeline: LeadPipeline;
  lastUpdated: string; // ISO timestamp
}

// ─── Leads ──────────────────────────────────────────────────────────────────

export type LeadStatus =
  | "New"
  | "Contacted"
  | "Replied"
  | "Qualified"
  | "Booked"
  | "Showed"
  | "NoShow"
  | "OptedOut"
  | "DNC"
  | "ReOptInPending";

export interface SmsMessage {
  direction: "inbound" | "outbound";
  body: string;
  timestamp: string;
  aiConfidence?: number;
  wasAiFallback?: boolean;
}

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  status: LeadStatus;
  lastContactDate: string | null; // ISO date
  optInSource: string;
  optInTimestamp: string | null;
  consentMethod: string;
  dnc: boolean;
  staleLeadFlag: boolean;
  aiConfidence: number | null;
  aiFallbackUsed: boolean;
  aiFallbackReason: string | null;
  smsHistory?: SmsMessage[];
  notes?: string;
}

// ─── Workflows ──────────────────────────────────────────────────────────────

export type WorkflowTriggerType = "manual" | "webhook" | "schedule" | "error";
export type WorkflowStatus = "active" | "inactive" | "error";

export interface WorkflowInfo {
  id: string;         // n8n workflow ID
  slug: string;       // e.g. "wf-01"
  name: string;
  description: string;
  status: WorkflowStatus;
  triggerType: WorkflowTriggerType;
  schedule?: string;  // human-readable, e.g. "Mondays 7am"
  lastRunAt: string | null;
  lastRunResult: "success" | "error" | "pending" | null;
  lastErrorMessage?: string;
  nextRunAt?: string | null;
  canTrigger: boolean;
}

// ─── Execution Log ──────────────────────────────────────────────────────────

export interface ExecutionLogEntry {
  id: string;
  workflowId: string;
  workflowName: string;
  startedAt: string;
  finishedAt: string;
  status: "success" | "error" | "running";
  errorMessage?: string;
  duration: number; // ms
}

// ─── Auth ───────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  clientName: string;
  role: "owner" | "manager";
}

import Papa from "papaparse";
import type { Lead, ExecutionLogEntry, WeeklyDataPoint } from "./types";

export function downloadCsv(filename: string, data: Record<string, unknown>[]) {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.click();
  URL.revokeObjectURL(url);
}

export function exportLeads(leads: Lead[]) {
  const rows = leads.map((l) => ({
    "First Name":       l.firstName,
    "Last Name":        l.lastName,
    "Phone":            l.phone,
    "Email":            l.email ?? "",
    "Status":           l.status,
    "Last Contact":     l.lastContactDate ?? "",
    "Opt-In Source":    l.optInSource,
    "Consent Method":   l.consentMethod,
    "DNC":              l.dnc ? "Yes" : "No",
    "Stale":            l.staleLeadFlag ? "Yes" : "No",
    "AI Confidence":    l.aiConfidence !== null ? `${(l.aiConfidence * 100).toFixed(0)}%` : "",
    "AI Fallback Used": l.aiFallbackUsed ? "Yes" : "No",
    "Fallback Reason":  l.aiFallbackReason ?? "",
  }));
  downloadCsv("leads-export.csv", rows);
}

export function exportExecutionLog(log: ExecutionLogEntry[]) {
  const rows = log.map((e) => ({
    "Workflow":    e.workflowName,
    "Started":     e.startedAt,
    "Finished":    e.finishedAt,
    "Duration (s)": (e.duration / 1000).toFixed(1),
    "Status":      e.status,
    "Error":       e.errorMessage ?? "",
  }));
  downloadCsv("execution-log.csv", rows);
}

export function exportWeeklyReport(data: WeeklyDataPoint[]) {
  const rows = data.map((d) => ({
    "Week":          d.week,
    "Messages Sent": d.messagesSent,
    "Replies":       d.replies,
    "Reply Rate":    d.messagesSent > 0 ? `${((d.replies / d.messagesSent) * 100).toFixed(1)}%` : "0%",
    "Bookings":      d.bookings,
    "Est. Revenue":  `$${d.revenue.toLocaleString()}`,
    "Opt-Outs":      d.optOuts,
    "AI Fallbacks":  d.aiFallbacks,
  }));
  downloadCsv("weekly-report.csv", rows);
}

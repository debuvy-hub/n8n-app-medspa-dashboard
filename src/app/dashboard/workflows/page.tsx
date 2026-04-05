import { WorkflowStatusCard } from "@/components/workflow-status-card";
import { mockWorkflows, mockExecutionLog } from "@/data/mock";
import { CheckCircle, XCircle, Clock } from "lucide-react";

export default function WorkflowsPage() {
  const totalActive = mockWorkflows.filter((w) => w.status === "active").length;
  const totalErrors = mockWorkflows.filter((w) => w.status === "error").length;
  const recentErrors = mockExecutionLog.filter((e) => e.status === "error").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "#E8E8F0" }}>Workflows</h1>
        <p className="text-sm mt-0.5" style={{ color: "#6B6B8A" }}>
          Monitor and manually trigger your n8n automation workflows
        </p>
      </div>

      {/* Summary bar */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
             style={{ background: "#0F0F1A", border: "1px solid #1E1E30" }}>
          <CheckCircle className="w-4 h-4" style={{ color: "#10B981" }} />
          <span className="text-sm" style={{ color: "#9999B8" }}>
            <span className="font-semibold tabular-nums" style={{ color: "#E8E8F0" }}>{totalActive}</span> active
          </span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
             style={{ background: "#0F0F1A", border: "1px solid #1E1E30" }}>
          <XCircle className="w-4 h-4" style={{ color: totalErrors > 0 ? "#EF4444" : "#6B6B8A" }} />
          <span className="text-sm" style={{ color: "#9999B8" }}>
            <span className="font-semibold tabular-nums"
                  style={{ color: totalErrors > 0 ? "#EF4444" : "#E8E8F0" }}>{totalErrors}</span> with errors
          </span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
             style={{ background: "#0F0F1A", border: "1px solid #1E1E30" }}>
          <Clock className="w-4 h-4" style={{ color: "#6B6B8A" }} />
          <span className="text-sm" style={{ color: "#9999B8" }}>
            <span className="font-semibold tabular-nums" style={{ color: "#E8E8F0" }}>
              {mockWorkflows.length}
            </span> total workflows
          </span>
        </div>
        {recentErrors > 0 && (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
               style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
            <XCircle className="w-4 h-4" style={{ color: "#EF4444" }} />
            <span className="text-sm" style={{ color: "#EF4444" }}>
              {recentErrors} recent execution error{recentErrors !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      {/* Workflow grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {mockWorkflows.map((wf) => (
          <WorkflowStatusCard key={wf.id} workflow={wf} />
        ))}
      </div>

      {/* Execution log */}
      <div>
        <h2 className="text-base font-semibold mb-4" style={{ color: "#E8E8F0" }}>
          Recent Executions
        </h2>
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #1E1E30" }}>
          <table className="w-full">
            <thead>
              <tr style={{ background: "#0F0F1A", borderBottom: "1px solid #1E1E30" }}>
                {["Workflow", "Started", "Duration", "Status"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: "#6B6B8A" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockExecutionLog.map((entry, i) => (
                <tr key={entry.id}
                    style={{ background: i % 2 === 0 ? "#08080F" : "#0B0B16", borderBottom: "1px solid #16162A" }}>
                  <td className="px-4 py-3 text-sm" style={{ color: "#E8E8F0" }}>{entry.workflowName}</td>
                  <td className="px-4 py-3 text-sm tabular-nums" style={{ color: "#9999B8" }}>
                    {new Date(entry.startedAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm tabular-nums" style={{ color: "#9999B8" }}>
                    {entry.duration >= 60000
                      ? `${(entry.duration / 60000).toFixed(1)}m`
                      : `${(entry.duration / 1000).toFixed(1)}s`}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full"
                          style={entry.status === "success"
                            ? { background: "rgba(16,185,129,0.1)", color: "#10B981" }
                            : entry.status === "error"
                            ? { background: "rgba(239,68,68,0.1)", color: "#EF4444" }
                            : { background: "rgba(59,130,246,0.1)", color: "#3B82F6" }
                          }>
                      {entry.status === "success" && <CheckCircle className="w-3 h-3" />}
                      {entry.status === "error"   && <XCircle     className="w-3 h-3" />}
                      {entry.status}
                      {entry.errorMessage && (
                        <span className="ml-1 opacity-75 truncate max-w-xs hidden lg:inline">
                          — {entry.errorMessage}
                        </span>
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

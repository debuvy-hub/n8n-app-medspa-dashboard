import { Download } from "lucide-react";
import { LeadTable } from "@/components/lead-table";

export const dynamic = "force-dynamic";

export default function LeadsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#E8E8F0" }}>Leads</h1>
          <p className="text-sm mt-0.5" style={{ color: "#6B6B8A" }}>
            Manage and track lead status — amber border = 30+ days uncontacted
          </p>
        </div>
        <a
          href="/dashboard/reports"
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80"
          style={{ background: "rgba(99,102,241,0.1)", color: "#A5B4FC", border: "1px solid rgba(99,102,241,0.2)" }}
        >
          <Download className="w-4 h-4" />
          Export
        </a>
      </div>

      <LeadTable />
    </div>
  );
}

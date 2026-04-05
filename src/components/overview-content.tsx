"use client";

import { useState, useEffect } from "react";
import { mockDashboard, mockLeads, mockWorkflows } from "@/data/mock";
import { OwnerView } from "@/components/owner-view";
import { OperatorView } from "@/components/operator-view";

type ViewMode = "owner" | "operator";

const STORAGE_KEY = "dashboardView";

export function OverviewContent() {
  // Start with "owner" to match server render, then hydrate from localStorage
  const [viewMode, setViewMode] = useState<ViewMode>("owner");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ViewMode | null;
    if (stored === "owner" || stored === "operator") {
      setViewMode(stored);
    }
    setHydrated(true);
  }, []);

  function handleToggle(mode: ViewMode) {
    setViewMode(mode);
    localStorage.setItem(STORAGE_KEY, mode);
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#E8E8F0" }}>
            Overview
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#6B6B8A" }}>
            Premier Central MI MedSpa — Reactivation Campaign
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Demo mode indicator */}
          <div className="hidden sm:flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: "#6B6B8A" }} />
            <span className="text-xs" style={{ color: "#6B6B8A" }}>Demo mode</span>
          </div>

          {/* View toggle — only shown after hydration to avoid flicker */}
          {hydrated && (
            <div
              className="flex items-center rounded-lg p-0.5"
              style={{ background: "#14142A", border: "1px solid #1E1E30" }}
            >
              {(["owner", "operator"] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => handleToggle(mode)}
                  className="px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all"
                  style={
                    viewMode === mode
                      ? { background: "#1E1E38", color: "#E8E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.4)" }
                      : { color: "#6B6B8A" }
                  }
                >
                  {mode === "owner" ? "Owner" : "Operator"}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* View content */}
      {viewMode === "owner" ? (
        <OwnerView
          data={mockDashboard}
          leads={mockLeads}
          workflows={mockWorkflows}
        />
      ) : (
        <OperatorView
          data={mockDashboard}
          leads={mockLeads}
          workflows={mockWorkflows}
        />
      )}
    </div>
  );
}

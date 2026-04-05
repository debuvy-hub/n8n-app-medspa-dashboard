"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { LeadsProvider } from "@/providers/leads-provider";

export function DashboardShell({
  children,
  clientName,
}: {
  children: React.ReactNode;
  clientName?: string;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-full min-h-screen" style={{ background: "#08080F" }}>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-60 lg:fixed lg:inset-y-0">
        <Sidebar clientName={clientName} />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-64 h-full">
            <Sidebar clientName={clientName} onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:pl-60">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b"
             style={{ background: "#0F0F1A", borderColor: "#1E1E30" }}>
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-white/5"
            style={{ color: "#9999B8" }}
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium" style={{ color: "#E8E8F0" }}>Premier Dashboard</span>
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <LeadsProvider>{children}</LeadsProvider>
        </main>
      </div>
    </div>
  );
}

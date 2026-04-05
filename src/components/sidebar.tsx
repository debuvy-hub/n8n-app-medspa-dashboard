"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  Workflow,
  FileBarChart,
  LogOut,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard",           label: "Overview",   icon: LayoutDashboard },
  { href: "/dashboard/leads",     label: "Leads",      icon: Users },
  { href: "/dashboard/workflows", label: "Workflows",  icon: Workflow },
  { href: "/dashboard/reports",   label: "Reports",    icon: FileBarChart },
];

interface SidebarProps {
  clientName?: string;
  onClose?: () => void;
}

export function Sidebar({ clientName, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full"
         style={{ background: "#0F0F1A", borderRight: "1px solid #1E1E30" }}>
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5"
           style={{ borderBottom: "1px solid #1E1E30" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
               style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}>
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: "#E8E8F0" }}>Premier</p>
            <p className="text-xs truncate" style={{ color: "#6B6B8A" }}>
              {clientName ?? "Dashboard"}
            </p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 rounded-md hover:bg-white/5 lg:hidden"
                  style={{ color: "#6B6B8A" }}>
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="px-3 mb-2 text-xs font-medium uppercase tracking-wider"
           style={{ color: "#6B6B8A" }}>
          Menu
        </p>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                active
                  ? "text-white"
                  : "hover:bg-white/5"
              )}
              style={active ? {
                background: "rgba(99,102,241,0.15)",
                color: "#A5B4FC",
                boxShadow: "inset 1px 0 0 #6366F1",
              } : { color: "#9999B8" }}
            >
              <Icon className={cn("w-4 h-4 flex-shrink-0", active ? "text-indigo-400" : "")} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="px-3 pb-5" style={{ borderTop: "1px solid #1E1E30", paddingTop: "16px" }}>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-white/5"
          style={{ color: "#6B6B8A" }}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Sign out
        </button>
      </div>
    </div>
  );
}

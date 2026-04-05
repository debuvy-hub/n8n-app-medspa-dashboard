"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { mockLeads } from "@/data/mock";
import type { Lead, LeadStatus } from "@/lib/types";

interface LeadsContextValue {
  leads: Lead[];
  markQualified: (id: string) => void;
  markDnc: (id: string) => void;
  removeDnc: (id: string) => void;
}

const LeadsContext = createContext<LeadsContextValue | null>(null);

export function LeadsProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);

  function markQualified(id: string) {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: "Qualified" as LeadStatus } : l))
    );
  }

  function markDnc(id: string) {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, dnc: true, status: "DNC" as LeadStatus } : l))
    );
  }

  function removeDnc(id: string) {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, dnc: false, status: "Contacted" as LeadStatus } : l))
    );
  }

  return (
    <LeadsContext.Provider value={{ leads, markQualified, markDnc, removeDnc }}>
      {children}
    </LeadsContext.Provider>
  );
}

export function useLeads(): LeadsContextValue {
  const ctx = useContext(LeadsContext);
  if (!ctx) throw new Error("useLeads must be used within LeadsProvider");
  return ctx;
}

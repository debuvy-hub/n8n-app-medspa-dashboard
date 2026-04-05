import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  mockDashboard,
  mockLeads,
  mockWorkflows,
  mockExecutionLog,
} from "@/data/mock";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Phase 1: return mock data
  // Phase 2: replace with fetch(process.env.NEXT_PUBLIC_WEBHOOK_URL + '/dashboard')
  return NextResponse.json({
    dashboard: mockDashboard,
    leads: mockLeads,
    workflows: mockWorkflows,
    executionLog: mockExecutionLog,
  });
}

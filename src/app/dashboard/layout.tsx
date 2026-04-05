import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardShell } from "./shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const clientName = (session.user as Record<string, unknown>)?.clientName as string | undefined;

  return <DashboardShell clientName={clientName}>{children}</DashboardShell>;
}

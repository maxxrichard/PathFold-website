import type { Metadata } from "next";
import { requireSession } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = { title: { default: "Admin", template: "%s · PathFold Admin" }, robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();
  return <AdminShell user={session}>{children}</AdminShell>;
}

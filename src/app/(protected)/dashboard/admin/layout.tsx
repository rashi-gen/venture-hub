// app/(protected)/dashboard/admin/layout.tsx
import { ReactNode } from "react";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
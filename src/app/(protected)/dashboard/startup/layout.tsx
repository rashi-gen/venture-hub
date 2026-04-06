// app/(protected)/dashboard/startup/layout.tsx
import { ReactNode } from "react";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";

export default function StartupLayout({ children }: { children: ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
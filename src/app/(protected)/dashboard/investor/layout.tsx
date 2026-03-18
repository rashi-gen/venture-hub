// app/(protected)/dashboard/investor/layout.tsx
import { ReactNode } from "react";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";

export default function InvestorLayout({ children }: { children: ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
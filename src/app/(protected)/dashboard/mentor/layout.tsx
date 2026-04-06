// app/(protected)/dashboard/mentor/layout.tsx
import { ReactNode } from "react";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";

export default function MentorLayout({ children }: { children: ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
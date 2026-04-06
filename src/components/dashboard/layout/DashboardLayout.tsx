// src/components/dashboard/layout/DashboardLayout.tsx
"use client";

import { ReactNode, useState } from "react";
import { useCurrentRole, useCurrentUser } from "@/hooks/auth";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const role = useCurrentRole();
  const user = useCurrentUser();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (!role || !user) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ backgroundColor: "var(--cream, #F9F7F2)" }}
      >
        <div className="text-center space-y-3">
          {/* Spinner using VentureHub forest color */}
          <div
            className="w-9 h-9 mx-auto rounded-full border-4 border-t-transparent animate-spin"
            style={{ borderColor: "rgba(26,54,43,0.2)", borderTopColor: "#1A362B" }}
          />
          <p className="text-sm text-muted-foreground" style={{ fontFamily: "'Satoshi', sans-serif" }}>
            Loading dashboard…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--cream, #F9F7F2)" }}
    >
      {/* Sticky header with mobile toggle */}
      <DashboardHeader
        user={user}
        role={role}
        onMobileMenuToggle={() => setMobileSidebarOpen(true)}
      />

      <div className="flex">
        {/* Sidebar — handles both desktop and mobile drawer internally */}
        <DashboardSidebar
          role={role}
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />

        {/* Main content */}
        <main
          className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-auto"
          style={{ backgroundColor: "var(--cream, #F9F7F2)" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
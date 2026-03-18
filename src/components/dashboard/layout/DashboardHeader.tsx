// src/components/dashboard/layout/DashboardHeader.tsx
"use client";

import { User, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface DashboardHeaderProps {
  user: any;
  role: string;
  onMobileMenuToggle?: () => void;
}

// Role badge config — matches UserRole enum
const ROLE_BADGES: Record<string, { label: string; classes: string }> = {
  ADMIN: {
    label: "Admin",
    classes:
      "bg-[#4A5D4E]/15 text-[#1A362B] border border-[#4A5D4E]/20",
  },
  STARTUP: {
    label: "Startup",
    classes:
      "bg-emerald-50 text-emerald-800 border border-emerald-200",
  },
  INVESTOR: {
    label: "Investor",
    classes:
      "bg-blue-50 text-blue-800 border border-blue-200",
  },
  MENTOR: {
    label: "Mentor",
    classes:
      "bg-amber-50 text-amber-800 border border-amber-200",
  },
};

export default function DashboardHeader({
  user,
  role,
  onMobileMenuToggle,
}: DashboardHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/auth/login");
  };

  const roleInfo = ROLE_BADGES[role] ?? ROLE_BADGES.STARTUP;

  return (
    <header
      className="bg-card border-b border-border shadow-sm sticky top-0 z-30"
      style={{ backgroundColor: "var(--cream, #F9F7F2)" }}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 py-3.5">
        {/* Left: Hamburger (mobile) + Logo/Title */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger — only visible on small screens */}
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 -ml-1 rounded-lg text-muted-foreground hover:bg-secondary/20 hover:text-foreground transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Logo mark */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#1A362B" }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-4 h-4 text-[#F9F7F2]"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="flex items-center gap-2">
              <h1
                className="text-base sm:text-lg font-semibold hidden sm:block"
                style={{ fontFamily: "'Gambetta', serif", color: "#1A362B" }}
              >
                VentureHub
              </h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide ${roleInfo.classes}`}
              >
                {roleInfo.label}
              </span>
            </div>
          </div>
        </div>

        {/* Right: User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-9 w-9 rounded-full hover:bg-secondary/20 transition-colors p-0"
            >
              <Avatar className="h-9 w-9 border-2" style={{ borderColor: "rgba(26,54,43,0.15)" }}>
                <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
                <AvatarFallback
                  className="text-xs font-semibold"
                  style={{ backgroundColor: "#1A362B", color: "#F9F7F2" }}
                >
                  {user?.name
                    ? user.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()
                    : <User className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 bg-card border-border shadow-lg"
            align="end"
            forceMount
          >
            <DropdownMenuLabel className="font-normal py-2">
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-semibold text-foreground leading-tight">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-muted-foreground leading-tight truncate">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.push("/dashboard/profile")}
              className="cursor-pointer text-sm"
            >
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-sm font-medium text-destructive focus:text-destructive"
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
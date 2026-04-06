// app/(protected)/dashboard/page.tsx
// Server component — uses auth() + redirect() for zero-latency role routing.
// Middleware guarantees the user is authenticated before reaching here.

import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user?.role) {
    redirect("/auth/login");
  }

  switch (session.user.role) {
    case "ADMIN":
      redirect("/dashboard/admin");
    case "STARTUP":
      redirect("/dashboard/startup");
    case "INVESTOR":
      redirect("/dashboard/investor");
    case "MENTOR":
      redirect("/dashboard/mentor");
    default:
      redirect("/auth/login");
  }
}
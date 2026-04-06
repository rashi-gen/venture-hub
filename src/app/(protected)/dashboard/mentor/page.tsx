// app/(protected)/dashboard/mentor/page.tsx
"use client";

import {
  GraduationCap, Calendar, DollarSign, Star,
  ArrowUpRight, Clock, CheckCircle2, ChevronRight,
  TrendingUp, User,
} from "lucide-react";

const stats = [
  { label: "Sessions This Month", value: "18", sub: "3 this week", icon: <Calendar className="h-5 w-5" />, color: "bg-[#1A362B]" },
  { label: "Total Earnings", value: "₹54,000", sub: "after 15% commission", icon: <DollarSign className="h-5 w-5" />, color: "bg-amber-600" },
  { label: "Avg. Rating", value: "4.8", sub: "from 47 reviews", icon: <Star className="h-5 w-5" />, color: "bg-blue-600" },
  { label: "Startups Helped", value: "29", sub: "unique founders", icon: <GraduationCap className="h-5 w-5" />, color: "bg-emerald-600" },
];

const upcomingSessions = [
  { startup: "NeuralCart AI", founder: "Asha Mehta", domain: "Product Strategy", date: "Fri 21 Mar", time: "3:00 PM", status: "confirmed" },
  { startup: "GreenVault", founder: "Rohan Iyer", domain: "Fundraising", date: "Sat 22 Mar", time: "11:00 AM", status: "confirmed" },
  { startup: "FinEdge", founder: "Kiran Shah", domain: "Go-to-Market", date: "Mon 24 Mar", time: "5:00 PM", status: "pending" },
];

const recentSessions = [
  { startup: "MediSync", rating: 5, amount: "₹3,000", date: "16 Mar" },
  { startup: "UrbanNest", rating: 4, amount: "₹3,000", date: "14 Mar" },
  { startup: "SkyLogic", rating: 5, amount: "₹3,000", date: "12 Mar" },
];

const earningsBreakdown = [
  { label: "Session Revenue", value: "₹63,600" },
  { label: "Platform Commission (15%)", value: "−₹9,540" },
  { label: "Net Earnings", value: "₹54,060" },
];

export default function MentorDashboardPage() {
  return (
    <div className="space-y-8" style={{ fontFamily: "'Satoshi', sans-serif" }}>
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <GraduationCap className="h-5 w-5 text-[#1A362B]" />
          <span className="text-xs font-semibold uppercase tracking-widest text-[#4A5D4E]">Mentor Dashboard</span>
        </div>
        <h1 className="text-2xl font-bold text-[#1A362B]" style={{ fontFamily: "'Gambetta', serif" }}>
          Welcome, Priya Nair 👋
        </h1>
        <p className="text-sm text-[#4A5D4E] mt-1">You have 2 confirmed sessions this week. Your availability is set to active.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-[#1A362B]/8 p-5 hover:shadow-md transition-shadow">
            <div className={`inline-flex p-2 rounded-xl text-white mb-3 ${s.color}`}>{s.icon}</div>
            <p className="text-3xl font-bold text-[#1A362B]">{s.value}</p>
            <p className="text-sm font-medium text-[#2D2D2D] mt-0.5">{s.label}</p>
            <p className="text-xs text-[#4A5D4E] mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Sessions */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#1A362B]/8 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#EFEBE3]">
            <h2 className="text-sm font-semibold text-[#1A362B] uppercase tracking-wider">Upcoming Sessions</h2>
            <a href="/dashboard/mentor/sessions" className="text-xs text-[#4A5D4E] hover:text-[#1A362B] flex items-center gap-1">
              All sessions <ChevronRight className="h-3.5 w-3.5" />
            </a>
          </div>
          <div className="divide-y divide-[#EFEBE3]">
            {upcomingSessions.map((s) => (
              <div key={s.startup} className="flex items-center justify-between px-6 py-4 hover:bg-[#F9F7F2] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
                    {s.startup[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#2D2D2D]">{s.startup}</p>
                    <p className="text-xs text-[#4A5D4E]">
                      <User className="h-3 w-3 inline mr-0.5" />{s.founder} · {s.domain}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-right">
                  <div>
                    <p className="text-xs font-semibold text-[#2D2D2D]">{s.date}</p>
                    <p className="text-xs text-[#4A5D4E]">{s.time}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium border flex items-center gap-1 ${
                    s.status === "confirmed"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}>
                    {s.status === "confirmed"
                      ? <CheckCircle2 className="h-3 w-3" />
                      : <Clock className="h-3 w-3" />
                    }
                    {s.status === "confirmed" ? "Confirmed" : "Pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right col */}
        <div className="space-y-4">
          {/* Earnings breakdown */}
          <div className="bg-[#1A362B] rounded-2xl p-5 text-white relative overflow-hidden">
            <div className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full bg-white/5" />
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-4 w-4 opacity-70" />
              <span className="text-xs font-semibold uppercase tracking-wider opacity-70">March Earnings</span>
            </div>
            <div className="space-y-2.5">
              {earningsBreakdown.map((e, i) => (
                <div key={e.label} className={`flex justify-between items-center text-sm ${i === earningsBreakdown.length - 1 ? "border-t border-white/20 pt-2.5 font-bold" : "opacity-80"}`}>
                  <span className="text-xs">{e.label}</span>
                  <span className="font-semibold">{e.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent completed */}
          <div className="bg-white rounded-2xl border border-[#1A362B]/8 overflow-hidden">
            <div className="px-5 py-4 border-b border-[#EFEBE3]">
              <h2 className="text-sm font-semibold text-[#1A362B] uppercase tracking-wider">Recent Completed</h2>
            </div>
            <div className="divide-y divide-[#EFEBE3]">
              {recentSessions.map((r) => (
                <div key={r.startup} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-[#2D2D2D]">{r.startup}</p>
                    <p className="text-xs text-[#4A5D4E]">{r.date}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${i < r.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`}
                        />
                      ))}
                    </div>
                    <p className="text-xs font-semibold text-emerald-600 mt-0.5">{r.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "All Sessions", icon: <Calendar className="h-4 w-4" />, href: "/dashboard/mentor/sessions" },
          { label: "Set Availability", icon: <Clock className="h-4 w-4" />, href: "/dashboard/mentor/availability" },
          { label: "View Earnings", icon: <DollarSign className="h-4 w-4" />, href: "/dashboard/mentor/earnings" },
          { label: "Edit Profile", icon: <GraduationCap className="h-4 w-4" />, href: "/dashboard/mentor/profile" },
        ].map((a) => (
          <a
            key={a.label}
            href={a.href}
            className="flex items-center gap-2.5 px-4 py-3 bg-white rounded-xl border border-[#1A362B]/10 text-xs font-medium text-[#1A362B] hover:bg-[#1A362B] hover:text-white transition-all duration-200 group"
          >
            <span className="group-hover:scale-110 transition-transform">{a.icon}</span>
            {a.label}
            <ArrowUpRight className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        ))}
      </div>
    </div>
  );
}
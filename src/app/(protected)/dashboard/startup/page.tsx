// app/(protected)/dashboard/startup/page.tsx
"use client";

import {
  TrendingUp, Eye, MessageSquare, FileText,
  CheckCircle2, Clock, GraduationCap, ArrowUpRight,
  Rocket, Star, ChevronRight,
} from "lucide-react";

const stats = [
  { label: "Profile Score", value: "74%", sub: "26% to full visibility", icon: <TrendingUp className="h-5 w-5" />, color: "bg-[#1A362B]", progress: 74 },
  { label: "Profile Views", value: "312", sub: "by investors this week", icon: <Eye className="h-5 w-5" />, color: "bg-blue-600", progress: null },
  { label: "EOIs Received", value: "9", sub: "3 awaiting your response", icon: <FileText className="h-5 w-5" />, color: "bg-amber-600", progress: null },
  { label: "Active Chats", value: "5", sub: "with investors", icon: <MessageSquare className="h-5 w-5" />, color: "bg-emerald-600", progress: null },
];

const eois = [
  { investor: "Sequoia Surge", type: "VC", stage: "Due Diligence", time: "2h ago", status: "active" },
  { investor: "Anand Mehta", type: "Angel", stage: "Discussion", time: "1d ago", status: "active" },
  { investor: "Blume Ventures", type: "VC", stage: "EOI Sent", time: "2d ago", status: "pending" },
];

const profileTasks = [
  { task: "Add pitch deck URL", done: true },
  { task: "Fill traction metrics", done: true },
  { task: "Upload financial projections", done: false },
  { task: "Add co-founder details", done: false },
  { task: "Set funding ask amount", done: true },
];

const upcomingSession = {
  mentor: "Priya Nair",
  domain: "Growth & Marketing",
  date: "Fri, 21 Mar · 3:00 PM IST",
  duration: "45 min",
};

export default function StartupDashboardPage() {
  return (
    <div className="space-y-8" style={{ fontFamily: "'Satoshi', sans-serif" }}>
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Rocket className="h-5 w-5 text-[#1A362B]" />
          <span className="text-xs font-semibold uppercase tracking-widest text-[#4A5D4E]">Startup Dashboard</span>
        </div>
        <h1 className="text-2xl font-bold text-[#1A362B]" style={{ fontFamily: "'Gambetta', serif" }}>
          Welcome back, NeuralCart AI 👋
        </h1>
        <p className="text-sm text-[#4A5D4E] mt-1">Your profile is visible to investors. Keep your traction updated.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-[#1A362B]/8 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-xl text-white ${s.color}`}>{s.icon}</div>
            </div>
            <p className="text-3xl font-bold text-[#1A362B]">{s.value}</p>
            <p className="text-sm font-medium text-[#2D2D2D] mt-0.5">{s.label}</p>
            <p className="text-xs text-[#4A5D4E] mt-1">{s.sub}</p>
            {s.progress !== null && (
              <div className="mt-3 h-1.5 bg-[#EFEBE3] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#1A362B] rounded-full transition-all"
                  style={{ width: `${s.progress}%` }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* EOI Pipeline */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#1A362B]/8 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#EFEBE3]">
            <h2 className="text-sm font-semibold text-[#1A362B] uppercase tracking-wider">Investor Interest (EOIs)</h2>
            <a href="/dashboard/startup/eoi" className="text-xs text-[#4A5D4E] hover:text-[#1A362B] flex items-center gap-1">
              View all <ChevronRight className="h-3.5 w-3.5" />
            </a>
          </div>
          <div className="divide-y divide-[#EFEBE3]">
            {eois.map((e) => (
              <div key={e.investor} className="flex items-center justify-between px-6 py-4 hover:bg-[#F9F7F2] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#1A362B] text-white flex items-center justify-center font-bold text-sm">
                    {e.investor[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#2D2D2D]">{e.investor}</p>
                    <p className="text-xs text-[#4A5D4E]">{e.type} · {e.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
                    e.status === "active"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}>
                    {e.stage}
                  </span>
                  <MessageSquare className="h-4 w-4 text-[#4A5D4E] hover:text-[#1A362B] cursor-pointer" />
                </div>
              </div>
            ))}
          </div>
          {/* empty nudge if needed */}
          <div className="px-6 py-3 bg-[#F9F7F2] border-t border-[#EFEBE3]">
            <p className="text-xs text-[#4A5D4E]">
              <span className="font-semibold text-amber-600">3 EOIs</span> awaiting your response — accept or decline to unlock messaging.
            </p>
          </div>
        </div>

        {/* Right col: Profile + Session */}
        <div className="space-y-4">
          {/* Profile Checklist */}
          <div className="bg-white rounded-2xl border border-[#1A362B]/8 overflow-hidden">
            <div className="px-5 py-4 border-b border-[#EFEBE3]">
              <h2 className="text-sm font-semibold text-[#1A362B] uppercase tracking-wider">Profile Checklist</h2>
              <p className="text-xs text-[#4A5D4E] mt-0.5">Complete to 100% for max investor reach</p>
            </div>
            <div className="p-4 space-y-2.5">
              {profileTasks.map((t) => (
                <div key={t.task} className="flex items-center gap-2.5">
                  {t.done
                    ? <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    : <Clock className="h-4 w-4 text-amber-400 flex-shrink-0" />
                  }
                  <span className={`text-xs ${t.done ? "text-[#4A5D4E] line-through" : "text-[#2D2D2D] font-medium"}`}>
                    {t.task}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Mentor Session */}
          <div className="bg-[#1A362B] rounded-2xl p-5 text-white relative overflow-hidden">
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/5" />
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="h-4 w-4 opacity-70" />
              <span className="text-xs font-semibold uppercase tracking-wider opacity-70">Upcoming Session</span>
            </div>
            <p className="font-bold text-lg" style={{ fontFamily: "'Gambetta', serif" }}>{upcomingSession.mentor}</p>
            <p className="text-xs opacity-70 mt-0.5">{upcomingSession.domain}</p>
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
              <div>
                <p className="text-xs opacity-60">When</p>
                <p className="text-xs font-semibold mt-0.5">{upcomingSession.date}</p>
              </div>
              <div className="flex items-center gap-1 bg-white/10 rounded-lg px-3 py-1.5 text-xs font-medium">
                <Star className="h-3 w-3" /> {upcomingSession.duration}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Edit Profile", icon: <Rocket className="h-4 w-4" />, href: "/dashboard/startup/profile" },
          { label: "Browse Mentors", icon: <GraduationCap className="h-4 w-4" />, href: "/dashboard/startup/mentors" },
          { label: "View Messages", icon: <MessageSquare className="h-4 w-4" />, href: "/dashboard/startup/messages" },
          { label: "Upload Documents", icon: <FileText className="h-4 w-4" />, href: "/dashboard/startup/profile" },
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
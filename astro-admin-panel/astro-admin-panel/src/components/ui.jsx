import React from "react";
import { Sparkles, Phone, Video, MessageCircle } from "lucide-react";

export function initials(name) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export function Avatar({ name, size = "h-9 w-9" }) {
  return (
    <div className={`${size} shrink-0 rounded-full bg-indigo-500/15 border border-indigo-400/30 flex items-center justify-center text-indigo-200 text-xs font-semibold`}>
      {initials(name)}
    </div>
  );
}

export const TONE_STYLES = {
  amber: "bg-amber-400/10 text-amber-300 border-amber-400/30",
  emerald: "bg-emerald-400/10 text-emerald-300 border-emerald-400/30",
  rose: "bg-rose-400/10 text-rose-300 border-rose-400/30",
  violet: "bg-violet-400/10 text-violet-300 border-violet-400/30",
  slate: "bg-slate-400/10 text-slate-300 border-slate-400/30",
};

export function Badge({ tone = "slate", children }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${TONE_STYLES[tone]}`}>
      {children}
    </span>
  );
}

export function statusTone(status) {
  return (
    {
      active: "emerald",
      confirmed: "emerald",
      completed: "violet",
      pending: "amber",
      draft: "amber",
      inactive: "slate",
      rejected: "rose",
      cancelled: "rose",
    }[status] || "slate"
  );
}

export function StatCard({ label, value, sub, icon: Icon }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-50 tracking-tight">{value}</p>
        </div>
        <div className="h-9 w-9 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
          <Icon className="text-amber-300" size={18} />
        </div>
      </div>
      {sub && <p className="mt-3 text-xs text-slate-500">{sub}</p>}
    </div>
  );
}

export function EndpointNote({ children }) {
  return <p className="mt-1 font-mono text-[11px] text-slate-600">{children}</p>;
}

export function ModeIcon({ mode }) {
  const map = { call: Phone, video: Video, chat: MessageCircle };
  const Icon = map[mode] || Phone;
  return <Icon size={14} className="text-slate-400" />;
}

export function EmptyState({ text }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-800 py-16 flex flex-col items-center text-center">
      <Sparkles size={20} className="text-slate-700 mb-3" />
      <p className="text-sm text-slate-500 max-w-xs">{text}</p>
    </div>
  );
}

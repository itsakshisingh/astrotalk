import React, { useEffect } from "react";
import { useApp } from "../context/AppContext";
import { Avatar, EmptyState, TONE_STYLES, statusTone } from "../components/ui";

const STATUS_OPTIONS = ["pending", "confirmed", "completed", "cancelled"];

const statusColor = {
  pending: "bg-amber-400/15 text-amber-300 border-amber-500/40",
  confirmed: "bg-blue-400/15 text-blue-300 border-blue-500/40",
  completed: "bg-emerald-400/15 text-emerald-300 border-emerald-500/40",
  cancelled: "bg-red-400/15 text-red-300 border-red-500/40",
};

export default function Appointments() {
  const { role, appointments, changeAppointmentStatus, fetchDashboardData } = useApp();

  // Refresh appointments when page loads
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // For astrologer: API already returns only their appointments (filtered by astrologerId server-side)
  // For superadmin: API returns all appointments
  const rows = appointments;

  return (
    <div className="p-4 md:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">
            {role === "astrologer" ? "My Appointments" : "All Appointments"}
          </h2>

        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 font-mono">
            {rows.length} appointment{rows.length !== 1 ? "s" : ""}
          </span>
          <button
            onClick={fetchDashboardData}
            className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition-colors text-xs font-medium"
          >
            ↺ Refresh
          </button>
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState text="No appointments found yet. Bookings from the website will appear here." />
      ) : (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-x-auto">
          <table className="w-full text-sm min-w-[820px]">
            <thead>
              <tr className="text-left text-xs text-slate-500 border-b border-slate-800 bg-slate-900/80">
                <th className="px-5 py-3.5 font-medium">Client</th>
                {role !== "astrologer" && (
                  <th className="px-5 py-3.5 font-medium">Astrologer</th>
                )}
                <th className="px-5 py-3.5 font-medium">Contact</th>
                <th className="px-5 py-3.5 font-medium">Date & Time</th>
                <th className="px-5 py-3.5 font-medium">Service</th>
                <th className="px-5 py-3.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {rows.map((a) => (
                <tr key={a.id} className="hover:bg-slate-800/30 transition-colors">
                  {/* Client Name */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={a.user} size="h-8 w-8" />
                      <div>
                        <p className="text-slate-200 font-medium text-sm leading-tight">
                          {a.user}
                        </p>
                        {a.message && (
                          <p className="text-slate-500 text-xs mt-0.5 max-w-[180px] truncate" title={a.message}>
                            💬 {a.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Astrologer Column (only for admin) */}
                  {role !== "astrologer" && (
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                        <span className="text-slate-300 text-sm font-medium">{a.astrologer}</span>
                      </div>
                    </td>
                  )}

                  {/* Contact */}
                  <td className="px-5 py-4">
                    <div className="space-y-0.5">
                      {a.email && (
                        <p className="text-slate-400 text-xs">{a.email}</p>
                      )}
                      {a.phone && (
                        <p className="text-slate-500 text-xs">📞 {a.phone}</p>
                      )}
                      {!a.email && !a.phone && (
                        <span className="text-slate-600 text-xs italic">—</span>
                      )}
                    </div>
                  </td>

                  {/* Date & Time */}
                  <td className="px-5 py-4">
                    <div>
                      <p className="text-slate-300 text-sm font-medium">{a.date}</p>
                      <p className="text-slate-500 text-xs mt-0.5">🕒 {a.time}</p>
                    </div>
                  </td>

                  {/* Service / Mode */}
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800/60 border border-slate-700/60 px-2.5 py-1 rounded-lg max-w-[160px] truncate">
                      ✦ {a.mode}
                    </span>
                  </td>

                  {/* Status Dropdown */}
                  <td className="px-5 py-4">
                    <select
                      value={a.status}
                      onChange={(e) => changeAppointmentStatus(a.id, e.target.value)}
                      className={`text-xs rounded-lg border px-2.5 py-1.5 bg-transparent capitalize focus:outline-none cursor-pointer ${
                        statusColor[a.status] || TONE_STYLES[statusTone(a.status)]
                      }`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s} className="bg-slate-900 text-slate-200">
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

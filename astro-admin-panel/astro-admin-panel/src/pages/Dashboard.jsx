import React from "react";
import { Users, CalendarDays, Package, UserCheck, Clock, Star, Loader2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Avatar, Badge, StatCard, statusTone } from "../components/ui";

export default function Dashboard() {
  const { user, role, astrologers, appointments, products, pending, loading } = useApp();
  const isAdmin = role === "superadmin";

  const currentUserName = user?.fullName || (isAdmin ? "Admin" : "Astrologer");
  const myAppointments = appointments.filter(
    (a) => a.astrologer === currentUserName || a.astrologerId === user?.id
  );
  const myProducts = products.filter(
    (p) => p.astrologer === currentUserName || p.createdBy === user?.id
  );

  if (loading && !appointments.length && !astrologers.length) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-slate-400 gap-3">
        <Loader2 size={32} className="animate-spin text-amber-400" />
        <p className="text-sm">Fetching live dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h2 className="text-xl text-slate-50 font-display">
          Namaste, {currentUserName.split(" ")[0]}
        </h2>
        <p className="text-sm text-slate-500 mt-1">Here's what's happening on your platform today.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isAdmin ? (
          <>
            <StatCard label="Active astrologers" value={astrologers.filter((a) => a.status === "active").length} icon={Users} sub={`${pending.length} awaiting approval`} />
            <StatCard label="Appointments today" value={appointments.length} icon={CalendarDays} sub="Across all astrologers" />
            <StatCard label="Products listed" value={products.length} icon={Package} sub={`${products.filter((p) => p.status === "active").length} live`} />
            <StatCard label="Pending approvals" value={pending.length} icon={UserCheck} sub="Needs your review" />
          </>
        ) : (
          <>
            <StatCard label="Upcoming sessions" value={myAppointments.filter((a) => a.status === "confirmed").length} icon={CalendarDays} sub="Confirmed bookings" />
            <StatCard label="Pending requests" value={myAppointments.filter((a) => a.status === "pending").length} icon={Clock} sub="Awaiting your response" />
            <StatCard label="My products" value={myProducts.length} icon={Package} sub={`${myProducts.filter((p) => p.status === "active").length} live`} />
            <StatCard label="Rating" value="4.8" icon={Star} sub="1,240 sessions completed" />
          </>
        )}
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60">
        <div className="px-5 py-4 border-b border-slate-800">
          <h3 className="text-sm font-medium text-slate-200">{isAdmin ? "Recent appointments" : "Your recent appointments"}</h3>
        </div>
        <div className="divide-y divide-slate-800/80">
          {(isAdmin ? appointments : myAppointments).length === 0 ? (
            <div className="px-5 py-8 text-center text-xs text-slate-500">
              No appointments found.
            </div>
          ) : (
            (isAdmin ? appointments : myAppointments).slice(0, 5).map((a) => (
              <div key={a.id} className="flex items-center gap-3 px-5 py-3.5">
                <Avatar name={a.user} size="h-8 w-8" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-slate-200 truncate">{a.user}</p>
                  <p className="text-xs text-slate-500">
                    {isAdmin ? `with ${a.astrologer} · ` : ""}
                    {a.date}, {a.time}
                  </p>
                </div>
                <Badge tone={statusTone(a.status)}>{a.status}</Badge>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

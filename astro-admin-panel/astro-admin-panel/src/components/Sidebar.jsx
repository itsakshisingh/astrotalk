import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, UserCheck, CalendarDays, Package, LogOut, X, Sparkles, User, ShoppingBag } from "lucide-react";
import { useApp } from "../context/AppContext";

const NAV = {
  superadmin: [
    { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
    // { to: "/astrologers/pending", label: "Pending Astrologers", icon: UserCheck },
    { to: "/astrologers", label: "All Astrologers", icon: Users },
    { to: "/appointments", label: "Appointments", icon: CalendarDays },
    { to: "/products", label: "Products", icon: Package },
    { to: "/orders", label: "All Orders", icon: ShoppingBag },
    { to: "/profile", label: "My Profile", icon: User },
  ],
  astrologer: [
    { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/appointments", label: "My Appointments", icon: CalendarDays },
    { to: "/products", label: "My Products", icon: Package },
    { to: "/orders", label: "My Orders", icon: ShoppingBag },
    { to: "/profile", label: "My Profile", icon: User },
  ],
};

export default function Sidebar({ open, setOpen }) {
  const { role, logout } = useApp();
  const items = NAV[role] || NAV.astrologer;

  return (
    <>
      {open && <div className="fixed inset-0 bg-slate-950/70 z-30 md:hidden" onClick={() => setOpen(false)} />}
      <aside
        className={`fixed z-40 md:z-0 md:static top-0 left-0 h-full w-64 shrink-0 border-r border-slate-800 bg-slate-900/70 backdrop-blur-sm flex flex-col transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="h-16 flex items-center gap-2.5 px-5 border-b border-slate-800">
          <div className="h-8 w-8 rounded-full border border-amber-400/40 flex items-center justify-center">
            <Sparkles size={14} className="text-amber-300" />
          </div>
          <span className="text-slate-100 text-[15px] font-display">Jyotish Console</span>
          <button className="ml-auto md:hidden text-slate-400" onClick={() => setOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <NavLink
                key={it.to}
                to={it.to}
                end={it.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    isActive ? "bg-amber-400/10 text-amber-300 border border-amber-400/25" : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                  }`
                }
              >
                <Icon size={17} />
                {it.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-800">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 hover:text-rose-300 hover:bg-rose-400/5 transition-colors"
          >
            <LogOut size={17} />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}

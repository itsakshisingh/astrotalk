import React from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Search, Bell, ChevronDown } from "lucide-react";
import { Avatar } from "./ui";
import { useApp } from "../context/AppContext";

export default function Topbar({ title, endpoint, onMenu }) {
  const { user, role } = useApp();
  const navigate = useNavigate();
  const displayName = user?.fullName || (role === "superadmin" ? "Super Admin" : "Astrologer");

  return (
    <header className="h-16 shrink-0 border-b border-slate-800 flex items-center gap-3 px-4 md:px-6 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-20">
      <button className="md:hidden text-slate-400" onClick={onMenu}>
        <Menu size={20} />
      </button>
      <div className="min-w-0">
        <h1 className="text-[15px] font-medium text-slate-100 truncate">{title}</h1>
        {endpoint && <p className="font-mono text-[11px] text-slate-600 truncate">{endpoint}</p>}
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5 w-56">
          <Search size={14} className="text-slate-500" />
          <input placeholder="Search…" className="bg-transparent text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none w-full" />
        </div>
        <button className="h-9 w-9 rounded-lg border border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-200">
          <Bell size={16} />
        </button>
        
        {/* Clickable Header Profile Button */}
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2 pl-1 p-1 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all text-left"
          title="View & Edit Profile"
        >
          <Avatar name={displayName} size="h-8 w-8" />
          <span className="text-xs text-slate-200 font-medium hidden md:inline-block truncate max-w-[120px]">
            {displayName}
          </span>
          <ChevronDown size={14} className="text-slate-500 hidden sm:block" />
        </button>
      </div>
    </header>
  );
}

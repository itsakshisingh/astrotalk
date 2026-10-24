import React, { useState } from "react";
import { Star, RefreshCw, CheckCheck } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Avatar, Badge, EndpointNote, statusTone } from "../components/ui";
import api from "../api/axios";

const ALLOWED_STATUSES = ["active", "inactive", "rejected", "blocked", "pending"];

// Inline status changer dropdown for each astrologer row
function AstrologerStatusChanger({ astrologer, onStatusChanged }) {
  const [selectedStatus, setSelectedStatus] = useState(astrologer.status);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const hasChanged = selectedStatus !== astrologer.status;

  const handleUpdate = async () => {
    setSaving(true);
    setErrorMsg("");
    try {
      const res = await api.patch(`/admin/astrologers/${astrologer.id}/status`, {
        status: selectedStatus,
      });
      if (res.data?.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        onStatusChanged(astrologer.id, selectedStatus);
      } else {
        setErrorMsg(res.data?.message || "Update failed");
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Server error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <select
        value={selectedStatus}
        onChange={(e) => {
          setSelectedStatus(e.target.value);
          setSaved(false);
          setErrorMsg("");
        }}
        className="bg-slate-800 border border-slate-700 text-slate-200 text-[11px] font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-400 cursor-pointer capitalize"
      >
        {ALLOWED_STATUSES.map((s) => (
          <option key={s} value={s} className="capitalize">{s}</option>
        ))}
      </select>

      <button
        onClick={handleUpdate}
        disabled={!hasChanged || saving}
        className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
          saved
            ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
            : hasChanged
            ? "bg-amber-400/15 border-amber-400/40 text-amber-300 hover:bg-amber-400/25"
            : "bg-slate-800 border-slate-700 text-slate-500"
        }`}
      >
        {saving ? (
          <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
        ) : saved ? (
          <CheckCheck size={11} />
        ) : (
          <CheckCheck size={11} />
        )}
        {saving ? "Saving..." : saved ? "Saved!" : "Update"}
      </button>

      {errorMsg && (
        <span className="text-[10px] text-rose-400 font-medium">{errorMsg}</span>
      )}
    </div>
  );
}

export default function AllAstrologers() {
  const { astrologers, setAstrologers, fetchDashboardData } = useApp();
  const [filter, setFilter] = useState("all");

  const filtered =
    filter === "all"
      ? astrologers
      : astrologers.filter((a) => a.status === filter);

  // Optimistic local status update
  const handleStatusChanged = (id, newStatus) => {
    // Update the context astrologers array locally for instant UI feedback
    if (typeof setAstrologers === "function") {
      setAstrologers((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
      );
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-medium text-slate-100">All Astrologers</h2>
          <EndpointNote>GET /api/admin/astrologers</EndpointNote>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Filter Pills */}
          <div className="flex gap-1 rounded-lg border border-slate-800 bg-slate-900/60 p-1">
            {["all", "active", "inactive", "rejected", "blocked"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs rounded-md capitalize cursor-pointer transition-colors ${
                  filter === f
                    ? "bg-amber-400/15 text-amber-300"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <button
            onClick={fetchDashboardData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 text-xs font-medium transition-colors cursor-pointer"
          >
            <RefreshCw size={13} />
            Refresh
          </button>
        </div>
      </div>

      {/* Astrologers Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead>
            <tr className="text-left text-xs text-slate-500 border-b border-slate-800">
              <th className="px-5 py-3 font-medium">Astrologer</th>
              <th className="px-5 py-3 font-medium">Specialization</th>
              <th className="px-5 py-3 font-medium">Experience</th>
              <th className="px-5 py-3 font-medium">Rating</th>
              <th className="px-5 py-3 font-medium">Sessions</th>
              <th className="px-5 py-3 font-medium">Current Status</th>
              <th className="px-5 py-3 font-medium">Change Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-xs text-slate-500">
                  No astrologers found for filter: <strong className="text-slate-400 capitalize">{filter}</strong>
                </td>
              </tr>
            ) : (
              filtered.map((a) => (
                <tr key={a.id} className="hover:bg-slate-800/30 transition-colors">
                  {/* Astrologer Info */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={a.name} size="h-8 w-8" />
                      <div className="min-w-0">
                        <p className="text-slate-200 truncate font-medium">{a.name}</p>
                        <p className="text-xs text-slate-500 truncate">{a.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-3.5 text-slate-400 text-xs">{a.specialization}</td>
                  <td className="px-5 py-3.5 text-slate-400 text-xs">{a.experience} yrs</td>

                  {/* Rating */}
                  <td className="px-5 py-3.5 text-slate-400">
                    <span className="inline-flex items-center gap-1 text-xs">
                      <Star size={12} className="text-amber-400 fill-amber-400" />
                      {a.rating}
                    </span>
                  </td>

                  <td className="px-5 py-3.5 text-slate-400 text-xs">
                    {a.sessions?.toLocaleString("en-IN")}
                  </td>

                  {/* Current Status Badge */}
                  <td className="px-5 py-3.5">
                    <Badge tone={statusTone(a.status)}>{a.status}</Badge>
                  </td>

                  {/* Status Change Dropdown */}
                  <td className="px-5 py-3.5">
                    <AstrologerStatusChanger
                      astrologer={a}
                      onStatusChanged={handleStatusChanged}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

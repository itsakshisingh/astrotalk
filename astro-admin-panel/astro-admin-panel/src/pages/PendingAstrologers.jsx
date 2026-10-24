import React from "react";
import { Check, X } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Avatar, Badge, EmptyState, EndpointNote } from "../components/ui";

export default function PendingAstrologers() {
  const { pending, decideAstrologer } = useApp();

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div>
        <h2 className="text-lg font-medium text-slate-100">Pending Astrologers</h2>
        <EndpointNote>GET /api/admin/astrologers/pending · PATCH /api/admin/astrologers/:id/status</EndpointNote>
      </div>

      {pending.length === 0 ? (
        <EmptyState text="No astrologers waiting for review right now." />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {pending.map((a) => (
            <div key={a.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="flex items-start gap-3">
                <Avatar name={a.name} size="h-10 w-10" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-100 truncate">{a.name}</p>
                  <p className="text-xs text-slate-500 truncate">{a.email}</p>
                </div>
                <span className="ml-auto text-xs text-slate-600">{a.submitted}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge tone="violet">{a.specialization}</Badge>
                <Badge tone="slate">{a.experience} yrs experience</Badge>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => decideAstrologer(a.id, "active")}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-400/10 border border-emerald-400/30 text-emerald-300 text-sm py-2 hover:bg-emerald-400/15"
                >
                  <Check size={15} /> Approve
                </button>
                <button
                  onClick={() => decideAstrologer(a.id, "rejected")}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-rose-400/10 border border-rose-400/30 text-rose-300 text-sm py-2 hover:bg-rose-400/15"
                >
                  <X size={15} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

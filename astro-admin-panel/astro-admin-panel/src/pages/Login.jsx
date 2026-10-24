import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";
import { useApp } from "../context/AppContext";
import { EndpointNote } from "../components/ui";

function ConstellationBackdrop() {
  const pts = [
    [60, 90], [160, 40], [260, 110], [340, 60], [420, 140],
    [120, 220], [300, 260], [80, 340], [380, 320], [220, 180],
  ];
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.18]" preserveAspectRatio="xMidYMid slice" viewBox="0 0 480 400">
      {pts.map((p, i) =>
        i < pts.length - 1 ? (
          <line key={i} x1={p[0]} y1={p[1]} x2={pts[i + 1][0]} y2={pts[i + 1][1]} stroke="#fbbf24" strokeWidth="0.5" />
        ) : null
      )}
      {pts.map((p, i) => (
        <circle key={"c" + i} cx={p[0]} cy={p[1]} r={i % 3 === 0 ? 2.5 : 1.4} fill="#fbbf24" />
      ))}
    </svg>
  );
}

export default function Login() {
  const { role, login, loading } = useApp();
  const [selectedRole, setSelectedRole] = useState("superadmin");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  if (role) return <Navigate to="/" replace />;

  async function submit(e) {
    e.preventDefault();
    setLoginError("");

    if (!identifier || !password) {
      setLoginError("Please enter email/mobile and password.");
      return;
    }

    const res = await login(identifier, password);
    if (!res.success) {
      setLoginError(res.message || "Login failed. Please check your credentials.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
      <ConstellationBackdrop />
      <div className="w-full max-w-sm relative">
        <div className="flex flex-col items-center mb-8">
          <div className="h-11 w-11 rounded-full border border-amber-400/40 flex items-center justify-center mb-4">
            <Sparkles size={18} className="text-amber-300" />
          </div>
          <h1 className="text-2xl text-slate-50 font-display">Jyotish Console</h1>
          <p className="text-sm text-slate-500 mt-1">Sign in to manage your platform</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6">
          <div className="grid grid-cols-2 gap-1 rounded-lg bg-slate-950 border border-slate-800 p-1 mb-6">
            {[
              { key: "superadmin", label: "Super Admin" },
              { key: "astrologer", label: "Astrologer" },
            ].map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => {
                  setSelectedRole(r.key);
                  setLoginError("");
                }}
                className={`text-sm py-2 rounded-md transition-colors ${
                  selectedRole === r.key ? "bg-amber-400/15 text-amber-300 border border-amber-400/30" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/15 border border-red-500/30 flex items-center gap-2 text-xs text-red-300">
              <AlertCircle size={16} className="shrink-0 text-red-400" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Email or Mobile</label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={selectedRole === "superadmin" ? "admin@jyotish.app" : "9876543210"}
                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/40"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/40"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-amber-400 hover:bg-amber-300 transition-colors text-slate-950 text-sm font-semibold py-2.5 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
          <EndpointNote>POST /api/auth/login</EndpointNote>
        </div>
        <p className="text-center text-xs text-slate-600 mt-6">Powered by Express & Axios live API</p>
      </div>
    </div>
  );
}

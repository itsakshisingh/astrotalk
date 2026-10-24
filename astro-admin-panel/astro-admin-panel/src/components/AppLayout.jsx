import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const TITLES = {
  "/": "Dashboard",
  "/astrologers/pending": "Pending Astrologers",
  "/astrologers": "All Astrologers",
  "/appointments": "Appointments",
  "/products": "Products",
  "/profile": "My Profile",
};

const ENDPOINTS = {
  "/astrologers/pending": "GET /api/admin/astrologers/pending · PATCH /api/admin/astrologers/:id/status",
  "/astrologers": "GET /api/admin/astrologers",
  "/appointments": "GET /api/appointments · PATCH /api/appointments/:id/status",
  "/products": "GET /api/products · POST /api/products · DELETE /api/products/:id",
};

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname: path } = useLocation();

  return (
    <div className="h-screen bg-slate-950 flex font-sans overflow-hidden">
      {/* Sidebar — fixed height, stays in place while main content scrolls */}
      <div className="hidden md:flex h-full shrink-0">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      </div>

      {/* Mobile sidebar (uses its own fixed positioning inside Sidebar.jsx) */}
      <div className="md:hidden">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      </div>

      {/* Main content area: sticky topbar + scrollable page content */}
      <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden">
        <Topbar title={TITLES[path] || "Dashboard"} endpoint={ENDPOINTS[path]} onMenu={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

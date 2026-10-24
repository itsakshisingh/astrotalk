import React, { useState, useEffect } from "react";
import { ShoppingBag, RefreshCw, ChevronDown, ChevronUp, Package, MapPin, CreditCard, CheckCheck } from "lucide-react";
import { useApp } from "../context/AppContext";
import { EmptyState } from "../components/ui";

const ORDER_STATUSES = ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
const PAYMENT_STATUSES = ["PENDING", "COMPLETED", "FAILED"];

function statusTone(status) {
  switch ((status || "").toLowerCase()) {
    case "placed": return "amber";
    case "processing": return "blue";
    case "shipped": return "indigo";
    case "delivered": return "green";
    case "completed": return "green";
    case "pending": return "amber";
    case "cancelled": return "red";
    case "failed": return "red";
    default: return "slate";
  }
}

function StatusBadge({ status }) {
  const tones = {
    amber: "bg-amber-400/10 text-amber-300 border-amber-400/25",
    blue: "bg-blue-400/10 text-blue-300 border-blue-400/25",
    indigo: "bg-indigo-400/10 text-indigo-300 border-indigo-400/25",
    green: "bg-emerald-400/10 text-emerald-300 border-emerald-400/25",
    red: "bg-rose-400/10 text-rose-300 border-rose-400/25",
    slate: "bg-slate-400/10 text-slate-300 border-slate-400/25",
  };
  const tone = statusTone(status);
  const dotColor = {
    amber: "bg-amber-400 animate-pulse",
    blue: "bg-blue-400",
    indigo: "bg-indigo-400",
    green: "bg-emerald-400",
    red: "bg-rose-400",
    slate: "bg-slate-400",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${tones[tone] || tones.slate}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor[tone] || dotColor.slate}`} />
      {status}
    </span>
  );
}

// Inline Status Change Selector for a single order
function StatusChanger({ order, onUpdate }) {
  const [orderStatus, setOrderStatus] = useState(order.orderStatus);
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const hasChanged =
    orderStatus !== order.orderStatus || paymentStatus !== order.paymentStatus;

  const handleSave = async () => {
    setSaving(true);
    const changedOrderStatus = orderStatus !== order.orderStatus ? orderStatus : null;
    const changedPaymentStatus = paymentStatus !== order.paymentStatus ? paymentStatus : null;
    const res = await onUpdate(order._id, changedOrderStatus, changedPaymentStatus);
    setSaving(false);
    if (res?.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="border-t border-slate-800 bg-slate-900/80 px-4 py-3">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Update Status:
        </span>

        {/* Order Status Select */}
        <div className="flex items-center gap-1.5">
          <label className="text-[11px] text-slate-500">Order:</label>
          <select
            value={orderStatus}
            onChange={(e) => setOrderStatus(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-[11px] font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Payment Status Select */}
        <div className="flex items-center gap-1.5">
          <label className="text-[11px] text-slate-500">Payment:</label>
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-[11px] font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            {PAYMENT_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={!hasChanged || saving}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
            saved
              ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
              : hasChanged
              ? "bg-amber-400/15 border-amber-400/40 text-amber-300 hover:bg-amber-400/25"
              : "bg-slate-800 border-slate-700 text-slate-500"
          }`}
        >
          {saving ? (
            <>
              <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : saved ? (
            <>
              <CheckCheck size={12} />
              Saved!
            </>
          ) : (
            <>
              <CheckCheck size={12} />
              Update Status
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function Orders() {
  const { role, orders, fetchOrders, loadingOrders, updateOrderStatus } = useApp();
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("ALL");

  useEffect(() => {
    fetchOrders();
  }, []);

  const statusFilters = ["ALL", ...ORDER_STATUSES];

  const filteredOrders =
    filterStatus === "ALL"
      ? orders || []
      : (orders || []).filter((o) => o.orderStatus === filterStatus);

  const toggleExpand = (id) =>
    setExpandedOrder(expandedOrder === id ? null : id);

  return (
    <div className="p-4 md:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            <ShoppingBag size={18} className="text-amber-400" />
            {role === "astrologer" ? "My Product Orders" : "All Customer Orders"}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {role === "astrologer"
              ? "Orders received for your consecrated spiritual products."
              : "Complete overview of all customer orders placed on the platform."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">
            {filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""}
          </span>
          <button
            onClick={fetchOrders}
            disabled={loadingOrders}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={13} className={loadingOrders ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              filterStatus === s
                ? "bg-amber-400/15 text-amber-300 border-amber-400/40"
                : "bg-slate-900/50 text-slate-400 border-slate-700/50 hover:text-slate-200 hover:border-slate-600"
            }`}
          >
            {s}
            {s !== "ALL" && (
              <span className="ml-1 text-[10px] opacity-70">
                ({(orders || []).filter((o) => o.orderStatus === s).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loadingOrders ? (
        <div className="py-16 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-amber-400/50 border-t-amber-400 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs">Loading orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          text={`No ${filterStatus === "ALL" ? "" : filterStatus.toLowerCase() + " "}orders found.`}
        />
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const isExpanded = expandedOrder === order._id;
            return (
              <div
                key={order._id}
                className="rounded-xl border border-slate-800 bg-slate-900/70 overflow-hidden hover:border-slate-700 transition-all"
              >
                {/* ── Order Row Header (clickable to expand) ── */}
                <div
                  className="flex flex-wrap items-center justify-between gap-3 p-4 cursor-pointer select-none"
                  onClick={() => toggleExpand(order._id)}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="shrink-0 w-9 h-9 bg-amber-400/10 rounded-lg flex items-center justify-center border border-amber-400/20">
                      <ShoppingBag size={15} className="text-amber-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-100 font-mono truncate">
                        {order.orderId}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {order.customerInfo?.fullName} •{" "}
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <p className="text-sm font-bold text-amber-400">
                        ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {order.items?.length} item{order.items?.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={order.orderStatus} />
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400 font-medium">
                        {order.paymentMethod}
                      </span>
                    </div>
                    <span className="text-slate-500">
                      {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </span>
                  </div>
                </div>

                {/* ── Expanded Order Detail Panel ── */}
                {isExpanded && (
                  <>
                    <div className="border-t border-slate-800 bg-slate-950/60 px-4 py-4 space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">

                        {/* Delivery Address */}
                        <div className="space-y-2">
                          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <MapPin size={12} className="text-amber-400" /> Delivery Address
                          </h4>
                          <div className="bg-slate-900 rounded-lg p-3 border border-slate-800 text-xs space-y-1 text-slate-300">
                            <p className="font-semibold text-slate-100">{order.customerInfo?.fullName}</p>
                            <p>
                              📞 {order.customerInfo?.phone}
                              {order.customerInfo?.alternatePhone
                                ? ` / ${order.customerInfo.alternatePhone}`
                                : ""}
                            </p>
                            {order.customerInfo?.email && (
                              <p>✉️ {order.customerInfo.email}</p>
                            )}
                            <p className="text-slate-400">
                              {order.customerInfo?.address}
                              {order.customerInfo?.landmark
                                ? `, ${order.customerInfo.landmark}`
                                : ""}
                            </p>
                            <p className="text-slate-400">
                              {order.customerInfo?.city}, {order.customerInfo?.state} -{" "}
                              {order.customerInfo?.pincode}
                            </p>
                            <span className="inline-block mt-1 px-2 py-0.5 rounded bg-slate-800 text-amber-300 text-[10px] border border-amber-500/20 font-semibold">
                              {order.customerInfo?.addressType || "HOME"}
                            </span>
                          </div>
                        </div>

                        {/* Payment Details */}
                        <div className="space-y-2">
                          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <CreditCard size={12} className="text-amber-400" /> Payment Details
                          </h4>
                          <div className="bg-slate-900 rounded-lg p-3 border border-slate-800 text-xs space-y-2 text-slate-300">
                            <div className="flex items-center justify-between">
                              <span>Payment Method</span>
                              <span className="font-semibold text-slate-100">{order.paymentMethod}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Payment Status</span>
                              <StatusBadge status={order.paymentStatus} />
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Order Status</span>
                              <StatusBadge status={order.orderStatus} />
                            </div>
                            <div className="flex items-center justify-between border-t border-slate-800 pt-2 mt-2">
                              <span className="font-semibold text-slate-200">Total Amount</span>
                              <span className="text-base font-bold text-amber-400">
                                ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Ordered Items */}
                      <div className="space-y-2">
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Package size={12} className="text-amber-400" /> Ordered Items ({order.items?.length})
                        </h4>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {order.items?.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-3 bg-slate-900 rounded-lg p-3 border border-slate-800"
                            >
                              {item.image ? (
                                <img
                                  src={
                                    item.image.startsWith("http")
                                      ? item.image
                                      : `http://localhost:5000${item.image.startsWith("/") ? "" : "/"}${item.image}`
                                  }
                                  alt={item.name}
                                  className="w-11 h-11 rounded-lg object-cover border border-amber-500/20 bg-slate-800 shrink-0"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              ) : (
                                <div className="w-11 h-11 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                                  <Package size={16} className="text-amber-400/50" />
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold text-slate-100 truncate">{item.name}</p>
                                <p className="text-[11px] text-slate-400 mt-0.5">
                                  ₹{Number(item.price).toLocaleString("en-IN")} × {item.quantity}
                                </p>
                              </div>
                              <span className="text-xs font-bold text-amber-400 shrink-0">
                                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* ── Status Changer Bar (below details) ── */}
                    <StatusChanger order={order} onUpdate={updateOrderStatus} />
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

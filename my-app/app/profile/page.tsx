'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface AppointmentItem {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  appointmentDate: string;
  appointmentTime: string;
  service: string;
  astrologerName?: string;
  astrologerId?: any;
  message?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

interface OrderItem {
  _id: string;
  orderId: string;
  customerInfo: {
    fullName: string;
    email: string;
    phone: string;
    alternatePhone?: string;
    address: string;
    landmark?: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    addressType: string;
  };
  items: Array<{
    _id?: string;
    product?: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  totalAmount: number;
  paymentMethod: 'COD' | 'ONLINE';
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED';
  orderStatus: 'PLACED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  
  // Tab Navigation State
  const [activeTab, setActiveTab] = useState<'appointments' | 'orders'>('appointments');

  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  
  const [loadingAppts, setLoadingAppts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  
  const [apptError, setApptError] = useState('');
  const [orderError, setOrderError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const parsedUser = JSON.parse(userStr);
          setUser(parsedUser);
          fetchUserAppointments(parsedUser);
          fetchUserOrders(parsedUser);
        } catch (e) {
          setUser(null);
          setLoadingAppts(false);
          setLoadingOrders(false);
        }
      } else {
        setLoadingAppts(false);
        setLoadingOrders(false);
      }
    }
  }, []);

  const fetchUserAppointments = async (userData: any) => {
    setLoadingAppts(true);
    setApptError('');
    try {
      const userId = userData.id || userData._id || 'guest';
      const email = userData.email || '';

      const res = await fetch(
        `http://localhost:5000/api/appointments/user/${userId}?email=${encodeURIComponent(email)}`
      );
      const json = await res.json();

      if (json.success && Array.isArray(json.data)) {
        setAppointments(json.data);
      } else {
        setAppointments([]);
      }
    } catch (err: any) {
      console.warn('Failed to fetch user appointments:', err);
      setApptError('Failed to load appointments.');
    } finally {
      setLoadingAppts(false);
    }
  };

  const fetchUserOrders = async (userData: any) => {
    setLoadingOrders(true);
    setOrderError('');
    try {
      const userId = userData.id || userData._id || 'guest';
      const email = userData.email || '';
      const phone = userData.mobile || userData.phone || '';

      const res = await fetch(
        `http://localhost:5000/api/orders/user/${userId}?email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`
      );
      const json = await res.json();

      if (json.success && Array.isArray(json.data)) {
        setOrders(json.data);
      } else {
        setOrders([]);
      }
    } catch (err: any) {
      console.warn('Failed to fetch user orders:', err);
      setOrderError('Failed to load your orders.');
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('storage'));
    }
    router.push('/login');
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
      case 'completed':
      case 'delivered':
        return (
          <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-semibold capitalize flex items-center gap-1.5 w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            {status}
          </span>
        );
      case 'shipped':
      case 'processing':
        return (
          <span className="px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/40 text-blue-300 text-xs font-semibold capitalize flex items-center gap-1.5 w-fit">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            {status}
          </span>
        );
      case 'cancelled':
      case 'failed':
        return (
          <span className="px-3 py-1 rounded-full bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-semibold capitalize flex items-center gap-1.5 w-fit">
            <span className="w-2 h-2 rounded-full bg-red-400"></span>
            {status}
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-semibold capitalize flex items-center gap-1.5 w-fit">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080914] text-slate-100 font-sans">
      <Header />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>

        {!user ? (
          <div className="rounded-3xl p-8 sm:p-12 bg-[#0e1026]/90 backdrop-blur-xl border border-amber-500/30 text-center max-w-md mx-auto space-y-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center text-3xl mx-auto text-amber-400">
              👤
            </div>
            <h2 className="font-serif text-2xl font-bold text-white">Not Logged In</h2>
            <p className="text-sm text-slate-300">
              Please log in to your account to view your profile details, appointments, and orders.
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-black font-bold text-sm shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-105 transition-all"
              >
                Go to Login Page
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* User Details Banner Card */}
            <div className="rounded-3xl p-6 sm:p-8 bg-[#0e1026]/90 backdrop-blur-xl border border-amber-500/35 shadow-[0_12px_40px_rgba(0,0,0,0.8)] relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600" />

              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5 text-center sm:text-left">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-yellow-500/10 border-2 border-amber-500/40 text-amber-300 flex items-center justify-center text-3xl font-serif font-bold shadow-lg shrink-0">
                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : '👤'}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold uppercase tracking-wider">
                        Active Account
                      </span>
                    </div>
                    <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight">
                      {user.fullName || 'Valued User'}
                    </h1>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-300">
                      <span>✉️ {user.email || 'N/A'}</span>
                      {user.mobile && <span>📞 {user.mobile}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleLogout}
                    className="px-5 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 hover:text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                  >
                    <span>Logout Account</span>
                    <span>➔</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ── Profile Filter Buttons (Tabs: Appointments & Orders) ── */}
            <div className="flex items-center gap-4 border-b border-amber-500/20 pb-4">
              <button
                onClick={() => setActiveTab('appointments')}
                className={`py-3 px-6 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2.5 cursor-pointer ${
                  activeTab === 'appointments'
                    ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-black shadow-[0_0_20px_rgba(212,175,55,0.4)] scale-102'
                    : 'bg-[#0e1026] text-slate-300 border border-amber-500/20 hover:border-amber-400/50 hover:text-white'
                }`}
              >
                <span>📅</span>
                <span>My Appointments ({appointments.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`py-3 px-6 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2.5 cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-black shadow-[0_0_20px_rgba(212,175,55,0.4)] scale-102'
                    : 'bg-[#0e1026] text-slate-300 border border-amber-500/20 hover:border-amber-400/50 hover:text-white'
                }`}
              >
                <span>🛒</span>
                <span>My Spiritual Orders ({orders.length})</span>
              </button>
            </div>

            {/* ── TAB 1: Appointments View ── */}
            {activeTab === 'appointments' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-amber-300 flex items-center gap-2">
                      <span>✦</span> Booked Consultation Appointments
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      View all your astrology consultation bookings and their real-time statuses.
                    </p>
                  </div>

                  <button
                    onClick={() => fetchUserAppointments(user)}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-semibold transition-all self-start sm:self-auto cursor-pointer"
                  >
                    ↺ Refresh
                  </button>
                </div>

                {apptError && (
                  <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs text-center font-medium">
                    ⚠️ {apptError}
                  </div>
                )}

                {loadingAppts ? (
                  <div className="py-16 text-center text-slate-400 bg-[#0e1026]/40 rounded-3xl border border-slate-800">
                    <div className="w-9 h-9 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-xs">Fetching your appointments...</p>
                  </div>
                ) : appointments.length === 0 ? (
                  <div className="py-16 px-4 text-center bg-[#0e1026]/60 rounded-3xl border border-amber-500/20 space-y-3">
                    <span className="text-4xl block">🔮</span>
                    <h3 className="font-serif text-lg font-bold text-white">No Appointments Found</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      You haven&apos;t booked any astrology consultations yet. Select an expert astrologer and schedule your session now!
                    </p>
                    <div className="pt-2">
                      <Link
                        href="/astrologers"
                        className="inline-block px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-bold text-xs shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:scale-105 transition-all"
                      >
                        Book Consultation Now
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
                    {appointments.map((appt) => (
                      <div
                        key={appt._id}
                        className="p-5 rounded-2xl bg-[#0e1026]/90 backdrop-blur-xl border border-amber-500/25 hover:border-amber-500/50 shadow-lg space-y-3 relative overflow-hidden group transition-all"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-0.5">
                            <span className="text-[11px] text-amber-400 font-semibold uppercase tracking-wider block">
                              ✦ {appt.service || 'Astrology Consultation'}
                            </span>
                            <h3 className="font-serif text-lg font-bold text-white">
                              With: {appt.astrologerName || (appt.astrologerId?.fullName) || 'Certified Astrologer'}
                            </h3>
                          </div>
                          <div>{getStatusBadge(appt.status)}</div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2 text-xs bg-[#080918] p-3 rounded-xl border border-amber-500/10">
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Appointment Date</span>
                            <span className="text-slate-100 font-medium font-mono">📅 {appt.appointmentDate}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Time Slot</span>
                            <span className="text-slate-100 font-medium font-mono">🕒 {appt.appointmentTime}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Client Name</span>
                            <span className="text-slate-200 font-medium">👤 {appt.fullName}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Contact Phone</span>
                            <span className="text-slate-200 font-medium">📞 {appt.phone}</span>
                          </div>
                        </div>

                        {appt.message && (
                          <div className="text-xs text-slate-300 bg-[#060714] p-2.5 rounded-lg border border-slate-800/80">
                            <span className="text-amber-400 font-semibold">Message:</span> &ldquo;{appt.message}&rdquo;
                          </div>
                        )}

                        <div className="text-[10px] text-slate-500 text-right pt-1">
                          Booked on: {new Date(appt.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── TAB 2: Orders View ── */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-amber-300 flex items-center gap-2">
                      <span>✦</span> My Spiritual Product Orders
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Track all your consecrated Yantras, Gemstones and Rudraksha purchases.
                    </p>
                  </div>

                  <button
                    onClick={() => fetchUserOrders(user)}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-semibold transition-all self-start sm:self-auto cursor-pointer"
                  >
                    ↺ Refresh Orders
                  </button>
                </div>

                {orderError && (
                  <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs text-center font-medium">
                    ⚠️ {orderError}
                  </div>
                )}

                {loadingOrders ? (
                  <div className="py-16 text-center text-slate-400 bg-[#0e1026]/40 rounded-3xl border border-slate-800">
                    <div className="w-9 h-9 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-xs">Fetching your spiritual orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="py-16 px-4 text-center bg-[#0e1026]/60 rounded-3xl border border-amber-500/20 space-y-3">
                    <span className="text-4xl block">🛍️</span>
                    <h3 className="font-serif text-lg font-bold text-white">No Orders Placed Yet</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Explore our consecrated copper yantras, lab-certified gemstones, and energized Vedic items.
                    </p>
                    <div className="pt-2">
                      <Link
                        href="/shop"
                        className="inline-block px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-bold text-xs shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:scale-105 transition-all"
                      >
                        Explore Spiritual Store →
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((ord) => (
                      <div
                        key={ord._id}
                        className="p-6 rounded-3xl bg-[#0e1026]/90 backdrop-blur-xl border border-amber-500/30 shadow-lg space-y-4"
                      >
                        {/* Order Top Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-4">
                          <div>
                            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest block">
                              ORDER ID: {ord.orderId}
                            </span>
                            <span className="text-xs text-slate-400">
                              Placed on: {new Date(ord.createdAt).toLocaleDateString()} at {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            {getStatusBadge(ord.orderStatus)}
                            <span className="text-xs font-bold text-slate-300 bg-[#080918] px-3 py-1 rounded-full border border-amber-500/20">
                              Payment: {ord.paymentMethod} ({ord.paymentStatus})
                            </span>
                          </div>
                        </div>

                        {/* Order Items List */}
                        <div className="divide-y divide-amber-500/15 space-y-3">
                          {ord.items.map((item, idx) => (
                            <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3">
                                {item.image && (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-12 h-12 rounded-xl object-cover border border-amber-500/20 bg-black"
                                  />
                                )}
                                <div>
                                  <h4 className="font-serif text-sm font-bold text-white">{item.name}</h4>
                                  <span className="text-xs text-slate-400">
                                    ₹{item.price.toLocaleString('en-IN')} × {item.quantity}
                                  </span>
                                </div>
                              </div>

                              <span className="font-serif text-sm font-bold text-amber-300">
                                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Shipping Address & Total Footer */}
                        <div className="pt-4 border-t border-amber-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#080918] p-4 rounded-2xl border border-amber-500/10 text-xs">
                          <div>
                            <span className="text-slate-400 font-semibold block text-[10px] uppercase">Shipping Destination ({ord.customerInfo.addressType}):</span>
                            <span className="text-white font-medium">
                              {ord.customerInfo.fullName} • {ord.customerInfo.phone}
                            </span>
                            <p className="text-slate-300 mt-0.5">
                              {ord.customerInfo.address}, {ord.customerInfo.landmark ? ord.customerInfo.landmark + ', ' : ''}{ord.customerInfo.city}, {ord.customerInfo.state} - {ord.customerInfo.pincode}
                            </p>
                          </div>

                          <div className="shrink-0 text-right">
                            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Total Amount</span>
                            <span className="font-serif text-xl font-bold text-amber-300">
                              ₹{ord.totalAmount.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

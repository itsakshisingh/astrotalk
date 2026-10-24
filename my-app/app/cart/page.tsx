'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AppointmentModal from '../components/AppointmentModal';
import { getCart, updateCartQuantity, removeFromCart, saveCart, CartItem } from '../utils/cart';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<any | null>(null);

  // E-commerce Shipping Form State with Complete Location Details
  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    alternatePhone: '',
    address: '',
    landmark: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
    addressType: 'HOME',
  });

  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'ONLINE'>('COD');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setCartItems(getCart());
  }, []);

  const handleUpdateQuantity = (id: string, delta: number) => {
    const updated = updateCartQuantity(id, delta);
    setCartItems(updated);
  };

  const handleRemoveItem = (id: string) => {
    const updated = removeFromCart(id);
    setCartItems(updated);
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (
      !customerInfo.fullName ||
      !customerInfo.phone ||
      !customerInfo.address ||
      !customerInfo.city ||
      !customerInfo.state ||
      !customerInfo.pincode
    ) {
      setErrorMessage('Please fill in Name, Phone, Address, City, State, and Pincode.');
      return;
    }

    if (cartItems.length === 0) {
      setErrorMessage('Your cart is empty.');
      return;
    }

    setSubmitting(true);
    try {
      const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      let userData = null;
      if (userStr) {
        try { userData = JSON.parse(userStr); } catch (e) {}
      }

      const res = await fetch('http://localhost:5000/api/orders/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerInfo,
          items: cartItems,
          totalAmount: subtotal,
          paymentMethod,
          userId: userData?.id || userData?._id || null,
        }),
      });

      const json = await res.json();

      if (json.success) {
        setPlacedOrder(json.data);
        saveCart([]); // Clear cart in localStorage
        setCartItems([]);
        setCheckoutModalOpen(false);
      } else {
        setErrorMessage(json.message || 'Checkout failed. Please try again.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setErrorMessage('Failed to connect to server. Please check your internet connection.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080914] text-slate-100 font-sans">
      <Header onOpenBooking={() => setModalOpen(true)} />

      <main className="flex-1">
        {/* Banner Section */}
        <section className="py-14 px-4 bg-gradient-to-b from-[#0d0f26] via-[#0b0c1e] to-[#080914] border-b border-amber-500/20 text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto">
            <span className="text-amber-400 font-semibold text-xs uppercase tracking-widest block mb-2">
              ✦ SPIRITUAL STORE CART ✦
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-3">
              YOUR <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">SHOPPING CART</span>
            </h1>
            <p className="text-xs text-slate-300 font-medium">
              Home <span className="text-amber-400 mx-1.5">//</span> Cart
            </p>
          </div>
        </section>

        {/* Cart Main Content */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {placedOrder ? (
            <div className="max-w-xl mx-auto p-8 sm:p-10 rounded-3xl bg-[#0d0f26]/95 border border-amber-500/35 text-center space-y-5 shadow-[0_0_50px_rgba(212,175,55,0.25)]">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-3xl mx-auto border border-emerald-500/40">
                ✓
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">Order Placed Successfully!</h2>
              
              <div className="bg-amber-500/10 p-4 rounded-2xl border border-amber-500/20 text-xs text-amber-300 font-medium space-y-1.5 text-left">
                <div className="flex justify-between border-b border-amber-500/20 pb-1.5 mb-1.5">
                  <span>Order ID: <strong className="text-white">{placedOrder.orderId}</strong></span>
                  <span>Method: <strong className="text-white">{placedOrder.paymentMethod}</strong></span>
                </div>
                <p>Deliver To: <strong className="text-white">{placedOrder.customerInfo.fullName}</strong> ({placedOrder.customerInfo.phone})</p>
                <p>Address: <strong className="text-white">{placedOrder.customerInfo.address}, {placedOrder.customerInfo.landmark ? placedOrder.customerInfo.landmark + ', ' : ''}{placedOrder.customerInfo.city}, {placedOrder.customerInfo.state} - {placedOrder.customerInfo.pincode}</strong></p>
                <p>Address Type: <strong className="text-amber-200">{placedOrder.customerInfo.addressType}</strong></p>
                <p className="pt-1 font-bold text-sm text-amber-400">Total Amount: ₹{placedOrder.totalAmount.toLocaleString('en-IN')}</p>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                Our Vedic dispatch team will contact you shortly with shipment tracking details.
              </p>
              <div className="pt-2">
                <Link
                  href="/shop"
                  className="px-7 py-3 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-black font-bold text-xs shadow-md hover:scale-105 transition-all inline-block"
                >
                  Continue Shopping →
                </Link>
              </div>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="max-w-xl mx-auto text-center py-16 p-8 rounded-3xl bg-[#0d0f26]/95 border border-amber-500/25 space-y-4">
              <div className="text-5xl">🛒</div>
              <h2 className="font-serif text-2xl font-bold text-white">Your Cart is Currently Empty</h2>
              <p className="text-xs text-slate-300 max-w-sm mx-auto font-medium">
                Explore our lab-certified gemstones, consecrated copper yantras, and energized Rudraksha beads.
              </p>
              <div className="pt-2">
                <Link
                  href="/shop"
                  className="px-7 py-3 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-black font-bold text-xs shadow-md hover:scale-105 transition-all inline-block"
                >
                  Explore Spiritual Shop →
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Cart Items List */}
              <div className="lg:col-span-2 space-y-6">
                <div className="rounded-3xl p-6 sm:p-8 bg-[#0e1026]/90 border border-amber-500/30 shadow-md">
                  <div className="flex items-center justify-between border-b border-amber-500/20 pb-4 mb-6">
                    <h2 className="font-serif text-xl font-bold text-white">
                      Cart Items ({cartItems.length})
                    </h2>
                    <Link
                      href="/shop"
                      className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                    >
                      + Add More Products
                    </Link>
                  </div>

                  {/* Items List */}
                  <div className="divide-y divide-amber-500/15 space-y-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="pt-6 first:pt-0 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                          <Link href={`/shop/${item.id}`} className="w-20 h-20 rounded-2xl overflow-hidden border border-amber-500/30 shrink-0 bg-black hover:border-amber-400 transition-colors">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                          </Link>
                          <div>
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">
                              {item.category}
                            </span>
                            <h3 className="font-serif text-base font-bold text-white leading-snug">
                              <Link href={`/shop/${item.id}`} className="hover:text-amber-300 transition-colors">
                                {item.name}
                              </Link>
                            </h3>
                            <p className="text-xs text-slate-300 font-medium">₹{item.price.toLocaleString('en-IN')} each</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                          <div className="flex items-center border border-amber-500/30 rounded-xl bg-[#080918] overflow-hidden">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, -1)}
                              className="px-3 py-1.5 text-slate-300 hover:text-amber-400 transition-colors text-sm font-bold"
                            >
                              -
                            </button>
                            <span className="px-3 text-xs font-bold text-white">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, 1)}
                              className="px-3 py-1.5 text-slate-300 hover:text-amber-400 transition-colors text-sm font-bold"
                            >
                              +
                            </button>
                          </div>

                          <span className="font-serif text-base font-bold text-amber-300 min-w-[80px] text-right">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>

                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-2 text-slate-400 hover:text-red-400 transition-colors text-base"
                            title="Remove Item"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              </div>

              {/* Right Column: Order Summary */}
              <div className="space-y-6">
                <div className="rounded-3xl p-6 sm:p-8 bg-[#0e1026]/90 border border-amber-500/35 shadow-[0_0_30px_rgba(212,175,55,0.15)] space-y-6">
                  <h2 className="font-serif text-xl font-bold text-white border-b border-amber-500/20 pb-4">
                    Order Summary
                  </h2>

                  <div className="space-y-3 text-xs font-medium">
                    <div className="flex justify-between text-slate-300">
                      <span>Subtotal</span>
                      <span className="text-white font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-between text-slate-300">
                      <span>Prana Pratishtha &amp; Puja</span>
                      <span className="text-emerald-400 font-bold">FREE</span>
                    </div>

                    <div className="flex justify-between text-slate-300">
                      <span>Express Courier Delivery</span>
                      <span className="text-emerald-400 font-bold">FREE</span>
                    </div>

                    <div className="pt-3 border-t border-amber-500/20 flex justify-between items-center text-sm">
                      <span className="font-bold text-white">Total Amount</span>
                      <span className="font-serif text-2xl font-bold text-amber-300">
                        ₹{subtotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setCheckoutModalOpen(true)}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-black font-bold text-sm shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:brightness-110 hover:scale-[1.02] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Checkout</span>
                    <span className="text-base">→</span>
                  </button>

                  <div className="pt-2 text-center text-[11px] text-slate-400 flex items-center justify-center gap-2 font-medium">
                    <span>🔒 Safe &amp; Encrypted Payment</span>
                    <span>•</span>
                    <span>100% Authentic Vedic Guarantee</span>
                  </div>
                </div>
              </div>

            </div>
          )}
        </section>
      </main>

      {/* ── Enhanced E-commerce Shipping Details Modal ── */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-[#0e1026] border border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-xl w-full relative shadow-[0_0_50px_rgba(212,175,55,0.3)] my-8">
            
            {/* Close Button */}
            <button
              onClick={() => setCheckoutModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white text-xl font-bold"
            >
              ✕
            </button>

            <div className="mb-6">
              <span className="text-amber-400 font-semibold text-[10px] uppercase tracking-widest block mb-1">
                ✦ DELIVERY ADDRESS &amp; LOCATION ✦
              </span>
              <h2 className="font-serif text-2xl font-bold text-white">Complete Shipping Details</h2>
              <p className="text-xs text-slate-300 mt-1">
                Provide your accurate address for courier dispatch &amp; tracking.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 bg-red-500/10 border border-red-500/30 p-3 rounded-xl text-red-400 text-xs font-semibold">
                ⚠️ {errorMessage}
              </div>
            )}

            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              
              {/* Full Name & Primary Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={customerInfo.fullName}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, fullName: e.target.value })}
                    className="w-full bg-[#080918] border border-amber-500/30 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 9876543210"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    className="w-full bg-[#080918] border border-amber-500/30 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Email & Alternate Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    className="w-full bg-[#080918] border border-amber-500/30 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Alternate Phone (Optional)</label>
                  <input
                    type="tel"
                    placeholder="Secondary contact no."
                    value={customerInfo.alternatePhone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, alternatePhone: e.target.value })}
                    className="w-full bg-[#080918] border border-amber-500/30 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Full Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Street Address / House No. *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Flat / House No., Floor, Building Name, Street"
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                  className="w-full bg-[#080918] border border-amber-500/30 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              {/* Landmark */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nearby Landmark (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Near Shiv Temple / Behind City Mall"
                  value={customerInfo.landmark}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, landmark: e.target.value })}
                  className="w-full bg-[#080918] border border-amber-500/30 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* City, State & Pincode */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">City / District *</label>
                  <input
                    type="text"
                    required
                    placeholder="New Delhi"
                    value={customerInfo.city}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })}
                    className="w-full bg-[#080918] border border-amber-500/30 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">State *</label>
                  <input
                    type="text"
                    required
                    placeholder="Delhi / UP / MH"
                    value={customerInfo.state}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, state: e.target.value })}
                    className="w-full bg-[#080918] border border-amber-500/30 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    placeholder="110001"
                    value={customerInfo.pincode}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, pincode: e.target.value })}
                    className="w-full bg-[#080918] border border-amber-500/30 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Address Type Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Save Address As</label>
                <div className="flex items-center gap-3">
                  {['HOME', 'WORK', 'OTHER'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setCustomerInfo({ ...customerInfo, addressType: type })}
                      className={`px-4 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                        customerInfo.addressType === type
                          ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                          : 'border-amber-500/20 bg-[#080918] text-slate-400 hover:text-white'
                      }`}
                    >
                      {type === 'HOME' ? '🏠 Home' : type === 'WORK' ? '💼 Office' : '📍 Other'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Method Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('COD')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      paymentMethod === 'COD'
                        ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                        : 'border-amber-500/20 bg-[#080918] text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>💵</span> Cash On Delivery
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('ONLINE')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      paymentMethod === 'ONLINE'
                        ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                        : 'border-amber-500/20 bg-[#080918] text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>💳</span> Online Payment
                  </button>
                </div>
              </div>

              {/* Price Breakdown Summary */}
              <div className="pt-2 border-t border-amber-500/20 flex justify-between items-center text-xs">
                <span className="text-slate-300">Total Payable Amount:</span>
                <span className="font-serif text-lg font-bold text-amber-300">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-black font-bold text-xs shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm &amp; Place Order</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      <AppointmentModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <Footer />
    </div>
  );
}

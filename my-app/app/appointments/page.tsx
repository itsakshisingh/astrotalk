'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AppointmentModal from '../components/AppointmentModal';

export default function AppointmentsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    appointmentDate: '',
    appointmentTime: '',
    phoneNumber: '',
    service: '',
    astrologer: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080914] text-slate-100 font-sans">
      <Header onOpenBooking={() => setModalOpen(true)} />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        {/* Page Header */}
        <div className="text-center mb-8">
          <span className="text-amber-400 font-semibold text-xs uppercase tracking-widest block mb-2">
            ✦ PERSONAL VEDIC CONSULTATION ✦
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
            Schedule Your <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">Appointment</span>
          </h1>
          <p className="text-slate-200 text-sm max-w-xl mx-auto leading-relaxed font-medium">
            Connect directly with India&apos;s top certified Vedic astrologers for live phone, video, or chat consultations.
          </p>
        </div>

        {/* Embedded Form Card matching the exact screenshot structure (no gift card) */}
        <div className="rounded-3xl p-6 sm:p-10 bg-[#0d0f26]/95 border border-amber-500/35 shadow-[0_0_50px_rgba(212,175,55,0.2)]">
          {submitted ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-3xl mx-auto border border-emerald-500/40">
                ✓
              </div>
              <h3 className="font-serif text-2xl font-bold text-white">
                Appointment <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">Booked Successfully!</span>
              </h3>
              <p className="text-slate-200 text-sm leading-relaxed max-w-md mx-auto">
                Thank you, <span className="text-amber-300 font-semibold">{formData.fullName || 'Valued Client'}</span>! Our Vedic coordinator will contact you shortly regarding your live consultation.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-6 py-2.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-semibold text-xs hover:bg-amber-400 hover:text-black transition-colors"
              >
                Book Another Appointment
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Full Name */}
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Full Name *"
                    className="w-full px-4 py-3 rounded-xl bg-[#080918] border border-amber-500/25 text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 pr-10 text-xs font-medium"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">👤</span>
                </div>

                {/* Email Address */}
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Email Address *"
                    className="w-full px-4 py-3 rounded-xl bg-[#080918] border border-amber-500/25 text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 pr-10 text-xs font-medium"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">✉️</span>
                </div>

                {/* Appointment Date */}
                <div className="relative">
                  <input
                    type="text"
                    required
                    onFocus={(e) => (e.target.type = 'date')}
                    onBlur={(e) => {
                      if (!e.target.value) e.target.type = 'text';
                    }}
                    value={formData.appointmentDate}
                    onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                    placeholder="Appointment Date (DD/MM/YYYY) *"
                    className="w-full px-4 py-3 rounded-xl bg-[#080918] border border-amber-500/25 text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 pr-10 text-xs font-medium"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">📅</span>
                </div>

                {/* Select Appointment Time */}
                <div className="relative">
                  <select
                    value={formData.appointmentTime}
                    onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#080918] border border-amber-500/25 text-white focus:outline-none focus:border-amber-400 pr-10 text-xs font-medium appearance-none"
                  >
                    <option value="" className="text-slate-400">-- Select Appointment Time --</option>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="02:30 PM">02:30 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                    <option value="06:00 PM">06:00 PM</option>
                    <option value="08:00 PM">08:00 PM</option>
                  </select>
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">🕒</span>
                </div>

                {/* Phone Number */}
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder="Phone Number *"
                    className="w-full px-4 py-3 rounded-xl bg-[#080918] border border-amber-500/25 text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 pr-10 text-xs font-medium"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">📞</span>
                </div>

                {/* Select Service */}
                <div className="relative">
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#080918] border border-amber-500/25 text-white focus:outline-none focus:border-amber-400 pr-10 text-xs font-medium appearance-none"
                  >
                    <option value="">Select Service</option>
                    <option value="Kundli Analysis">Kundli Analysis & Chart</option>
                    <option value="Horoscope Forecast">Horoscope & Planetary Transit</option>
                    <option value="Vastu Shastra">Vastu Shastra Consultation</option>
                    <option value="Love & Marriage">Love & Relationship Guidance</option>
                    <option value="Career & Business">Career & Business Growth</option>
                    <option value="Numerology">Numerology & Name Correction</option>
                  </select>
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none">▼</span>
                </div>

                {/* Choose Astrologer */}
                <div className="relative sm:col-span-2">
                  <select
                    value={formData.astrologer}
                    onChange={(e) => setFormData({ ...formData, astrologer: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#080918] border border-amber-500/25 text-white focus:outline-none focus:border-amber-400 pr-10 text-xs font-medium appearance-none"
                  >
                    <option value="">Choose Astrologer</option>
                    <option value="Any Expert Astrologer">Any Available Expert Astrologer</option>
                    <option value="Pandit Rajesh Sharma">Pandit Rajesh Sharma (Vedic Specialist)</option>
                    <option value="Dr. Priya Verma">Dr. Priya Verma (Tarot & Numerology)</option>
                    <option value="Acharya Suresh Kumar">Acharya Suresh Kumar (Vastu Expert)</option>
                    <option value="Ms. Anita Joshi">Ms. Anita Joshi (Love & Marriage)</option>
                  </select>
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none">▼</span>
                </div>
              </div>

              {/* Message / Questions Textarea */}
              <div className="pt-1">
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Your message or specific questions (optional)"
                  className="w-full px-4 py-3 rounded-xl bg-[#080918] border border-amber-500/25 text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 text-xs font-medium resize-none"
                />
              </div>

              {/* Book Now Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-black font-bold text-sm shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:brightness-110 hover:scale-[1.01] transition-all cursor-pointer"
                >
                  Book Now
                </button>
              </div>

              {/* Login Link Footer */}
              <div className="pt-2 text-left">
                <Link href="/auth/login" className="text-xs text-amber-400 hover:text-amber-300 underline font-medium">
                  Login to manage your appointments easily.
                </Link>
              </div>
            </form>
          )}
        </div>

        <AppointmentModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </main>

      <Footer />
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ServicesSection from '../components/ServicesSection';
import AppointmentModal from '../components/AppointmentModal';

export default function ServicesPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#080914] text-slate-100 font-sans">
      <Header onOpenBooking={() => setModalOpen(true)} />

      <main className="flex-1">
        <section className="py-16 px-4 bg-gradient-to-b from-[#0d0f26] to-[#080914] border-b border-amber-500/20 text-center">
          <div className="max-w-4xl mx-auto">
            <span className="text-amber-400 font-semibold text-xs uppercase tracking-widest block mb-2">
              ✦ CERTIFIED VEDIC OFFERINGS ✦
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">
              All <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">Astrology Services</span>
            </h1>
            <p className="text-slate-200 text-sm max-w-2xl mx-auto leading-relaxed font-medium">
              Explore our complete range of birth chart analysis, horoscope transit predictions, Vastu remedies, and numerology corrections.
            </p>
          </div>
        </section>

        <ServicesSection onOpenBooking={() => setModalOpen(true)} />
        <AppointmentModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </main>

      <Footer />
    </div>
  );
}

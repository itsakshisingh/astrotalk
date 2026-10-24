'use client';

import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AstrologersSection from '../components/AstrologersSection';
import AppointmentModal from '../components/AppointmentModal';

export default function AstrologersPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAstro, setSelectedAstro] = useState<{ id?: string; name?: string }>({});

  const handleOpenBooking = (id?: string, name?: string) => {
    setSelectedAstro({ id, name });
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080914] text-slate-100 font-sans">
      <Header onOpenBooking={() => handleOpenBooking()} />

      <main className="flex-1">
        <section className="py-16 px-4 bg-gradient-to-b from-[#0d0f26] to-[#080914] border-b border-amber-500/20 text-center">
          <div className="max-w-4xl mx-auto">
            <span className="text-amber-400 font-semibold text-xs uppercase tracking-widest block mb-2">
              ✦ VERIFIED ASTROLOGERS DIRECTORY ✦
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">
              Our Certified <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">Astrologers</span>
            </h1>
            <p className="text-slate-200 text-sm max-w-2xl mx-auto leading-relaxed font-medium">
              Choose from top verified astrologers with proven track records in Vedic Janam Kundli analysis, Tarot reading, and Vastu.
            </p>
          </div>
        </section>

        <AstrologersSection onOpenBooking={handleOpenBooking} />
        <AppointmentModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          selectedAstrologerId={selectedAstro.id}
          selectedAstrologerName={selectedAstro.name}
        />
      </main>

      <Footer />
    </div>
  );
}

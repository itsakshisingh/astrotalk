'use client';

import React, { useState } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import HoroscopeGrid from './components/HoroscopeGrid';
import ServicesSection from './components/ServicesSection';
import AstrologersSection from './components/AstrologersSection';
import ShopSection from './components/ShopSection';
import TestimonialsSection from './components/TestimonialsSection';
import AppointmentModal from './components/AppointmentModal';
import Footer from './components/Footer';

export default function Home() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedAstro, setSelectedAstro] = useState<{ id?: string; name?: string }>({});

  const handleOpenBooking = (id?: string, name?: string) => {
    setSelectedAstro({ id, name });
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col text-gray-100 selection:bg-amber-500 selection:text-black">
      {/* Navigation Header */}
      <Header onOpenBooking={() => handleOpenBooking()} />

      {/* Main Content Sections */}
      <main className="flex-1">
        <HeroSection onOpenBooking={() => handleOpenBooking()} />
        <HoroscopeGrid onOpenBooking={() => handleOpenBooking()} />
        <ServicesSection onOpenBooking={() => handleOpenBooking()} />
        <AstrologersSection onOpenBooking={handleOpenBooking} />
        <ShopSection />
        <TestimonialsSection />
      </main>

      {/* Consultation Booking Modal */}
      <AppointmentModal
        isOpen={isBookingOpen}
        onClose={handleCloseBooking}
        selectedAstrologerId={selectedAstro.id}
        selectedAstrologerName={selectedAstro.name}
      />

      {/* Page Footer */}
      <Footer />
    </div>
  );
}

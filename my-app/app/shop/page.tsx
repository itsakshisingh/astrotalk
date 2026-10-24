import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ShopSection from '../components/ShopSection';

export default function ShopPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#080914] text-gray-200">
      <Header />

      <main className="flex-1">
        <section className="py-16 px-4 bg-gradient-to-b from-[#0d0f26] to-[#080914] border-b border-amber-500/20 text-center">
          <div className="max-w-4xl mx-auto">
            <span className="text-amber-400 font-medium text-xs uppercase tracking-widest block mb-2">
              ✦ Energized Products Store ✦
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">
              Spiritual <span className="gold-gradient-text">Gemstones & Yantras</span>
            </h1>
            <p className="text-gray-300 text-sm max-w-2xl mx-auto leading-relaxed font-light">
              Explore 100% lab-certified gemstones and consecrated copper & gold-plated yantras energized for wealth and health.
            </p>
          </div>
        </section>

        <ShopSection />
      </main>

      <Footer />
    </div>
  );
}

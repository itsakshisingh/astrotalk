'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ZODIAC_SIGNS, ZodiacSign } from '../data/astrologyData';

// High-quality Zodiac Artwork Images for each sign
const ZODIAC_IMAGES: Record<string, string> = {
  aries: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80',
  taurus: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80',
  gemini: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=400&q=80',
  cancer: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
  leo: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=400&q=80',
  virgo: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&w=400&q=80',
  libra: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80',
  scorpio: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&w=400&q=80',
  sagittarius: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=400&q=80',
  capricorn: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?auto=format&fit=crop&w=400&q=80',
  aquarius: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=400&q=80',
  pisces: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=400&q=80',
};

interface HoroscopeGridProps {
  onOpenBooking?: () => void;
}

export default function HoroscopeGrid({ onOpenBooking }: HoroscopeGridProps) {
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(null);

  const handleCardClick = (sign: ZodiacSign) => {
    if (onOpenBooking) {
      onOpenBooking();
    } else {
      setSelectedSign(sign);
    }
  };

  return (
    <section className="pt-2 pb-16 px-4 sm:px-6 lg:px-8 bg-transparent relative z-10">
      <div className="max-w-7xl mx-auto">

        {/* ── Section Header ── */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-semibold tracking-widest uppercase mb-3 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            ✦ WHAT'S YOUR SIGN? ✦
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
            Daily <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">Horoscope Forecasts</span>
          </h2>
          <p className="text-slate-100 text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-medium">
            Select your zodiac sign below to unlock daily predictions and book a live personal consultation with expert Vedic astrologers.
          </p>
        </div>

        {/* ── 12 Zodiac Cards Grid (Using High-Quality Zodiac Artwork Images) ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {ZODIAC_SIGNS.map((sign) => (
            <div
              key={sign.id}
              onClick={() => handleCardClick(sign)}
              className="relative overflow-hidden rounded-2xl p-5 bg-[#12142e] border border-amber-500/40 hover:border-amber-400 hover:shadow-[0_8px_30px_rgba(212,175,55,0.35)] cursor-pointer group hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center text-center shadow-[0_6px_24px_rgba(0,0,0,0.8)] opacity-100"
            >
              {/* Top ambient gold highlight line */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-amber-400/80 to-transparent group-hover:w-full transition-all duration-500" />

              {/* Circular Zodiac Artwork Image Container */}
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-amber-400/80 p-0.5 mb-3 shadow-[0_0_20px_rgba(255,215,0,0.4)] group-hover:scale-110 group-hover:border-amber-300 group-hover:shadow-[0_0_30px_rgba(255,215,0,0.7)] transition-all duration-300">
                <img
                  src={ZODIAC_IMAGES[sign.id] || '/websiteImage/image1.jpg'}
                  alt={sign.name}
                  className="w-full h-full object-cover rounded-full group-hover:rotate-6 transition-transform duration-500"
                />
                <div className="absolute inset-0 rounded-full shadow-[inset_0_0_15px_rgba(0,0,0,0.5)] pointer-events-none" />
              </div>

              {/* Sign Name */}
              <h3 className="font-serif text-lg font-bold text-white mb-1 group-hover:text-amber-300 transition-colors">
                {sign.name}
              </h3>

              {/* Date Range */}
              <p className="text-xs text-amber-300 font-semibold">
                {sign.dates}
              </p>

              {/* Bottom action bar */}
              <div className="mt-3 pt-2 w-full border-t border-amber-500/20 flex items-center justify-center gap-1 text-[11px] text-amber-400 font-semibold opacity-90 group-hover:opacity-100 transition-opacity">
                <span>Book Consultation</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ── Selected Zodiac Detailed Modal ── */}
      {selectedSign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative rounded-3xl p-6 sm:p-8 max-w-lg w-full bg-[#0d0f28] border-2 border-amber-400/60 shadow-[0_0_60px_rgba(212,175,55,0.4)] animate-in fade-in zoom-in duration-200">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedSign(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center hover:bg-amber-400 hover:text-black transition-colors"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-amber-400/80 p-0.5 shadow-[0_0_30px_rgba(255,215,0,0.5)]">
                <img
                  src={ZODIAC_IMAGES[selectedSign.id] || '/websiteImage/image1.jpg'}
                  alt={selectedSign.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <h3 className="font-serif text-3xl font-bold bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">
                  {selectedSign.name}
                </h3>
                <p className="text-xs text-amber-400 font-medium">📅 {selectedSign.dates}</p>
                <p className="text-xs text-slate-300 mt-0.5 font-medium">Element: <span className="text-amber-200 font-semibold">{selectedSign.element}</span> | Ruling Planet: <span className="text-amber-200 font-semibold">{selectedSign.rulingPlanet}</span></p>
              </div>
            </div>

            {/* Summary & Prediction Box */}
            <div className="bg-[#080918] p-5 rounded-2xl border border-amber-500/30 mb-6 shadow-inner">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🔮</span> Today's Planetary Prediction
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">Live Vedic Reading</span>
              </div>
              <p className="text-slate-100 text-sm leading-relaxed italic mb-3 font-normal">
                "{selectedSign.todayPrediction}"
              </p>
              <p className="text-xs text-slate-300 font-medium border-t border-amber-500/15 pt-2">
                <span className="text-amber-300 font-medium">Trait:</span> {selectedSign.summary}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setSelectedSign(null);
                  if (onOpenBooking) onOpenBooking();
                }}
                className="flex-1 py-3 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-black font-bold text-xs text-center shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-105 transition-all"
              >
                Book Astrologer Consultation ✦
              </button>
              <button
                onClick={() => setSelectedSign(null)}
                className="px-6 py-3 rounded-full border border-gray-700 text-slate-200 font-medium text-xs hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ASTROLOGY_SERVICES } from '../data/astrologyData';

interface ServicesSectionProps {
  onOpenBooking?: () => void;
}

const serviceImages: Record<number, string> = {
  0: '/websiteImage/Birth Chart.jpg',
  1: '/websiteImage/Horoscope.jpg',
  2: '/websiteImage/VastuShastra.png',
  3: '/websiteImage/Numerology.jpg',
  4: '/websiteImage/PalmistryHand.jpg',
  5: '/websiteImage/TarotCard.jpg',
};

const serviceBadges: Record<number, string[]> = {
  0: ['Kundli Chart', 'Planetary Dasha', 'Full Remedies'],
  1: ['Daily Horoscope', 'Moon Sign', 'Transit Map'],
  2: ['Home & Office', 'Energy Balance', 'No Demolition'],
  3: ['Life Path No.', 'Name Correction', 'Lucky Grid'],
  4: ['Hand Lines', 'Life Timing', 'Fate Line'],
  5: ['Card Spreads', 'Love & Career', 'Instant Clarity'],
};

export default function ServicesSection({ onOpenBooking }: ServicesSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={containerRef} className="py-16 px-4 sm:px-6 lg:px-8 bg-transparent relative z-10 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* ── Section Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 pb-6 border-b border-amber-500/15">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-semibold tracking-widest uppercase mb-3 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              ✦ HOLISTIC GUIDANCE ✦
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Our Premium <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">Astrology Services</span>
            </h2>
          </div>
          <p className="text-slate-100 text-sm sm:text-base leading-relaxed max-w-md font-medium">
            Empower your decisions across relationships, career, financial growth, and home harmony with authentic Vedic services curated by world-renowned experts.
          </p>
        </div>

        {/* ── Services Cards Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ASTROLOGY_SERVICES.map((service, index) => (
            <div
              key={service.id}
              className="relative overflow-hidden rounded-3xl p-6 bg-[#0e1026]/90 backdrop-blur-xl border border-amber-500/35 hover:border-amber-400 hover:shadow-[0_12px_40px_rgba(212,175,55,0.3)] group hover:-translate-y-2 transition-all duration-400 flex flex-col justify-between shadow-[0_8px_30px_rgba(0,0,0,0.7)]"
            >
              {/* Top ambient highlight line */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-amber-400/80 to-transparent group-hover:w-full transition-all duration-500" />

              <div>
                {/* Service Image Banner with Overlay Badge & Icon */}
                <div className="relative mb-6 h-52 rounded-2xl overflow-hidden border border-amber-500/30 group-hover:border-amber-400/70 transition-colors shadow-inner">
                  <img
                    src={serviceImages[index] || '/websiteImage/image1.jpg'}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e1026] via-transparent to-black/40" />

                  {/* Floating Icon Box */}
                  <div className="absolute top-3 right-3 w-11 h-11 rounded-xl bg-black/80 backdrop-blur-md border border-amber-400/50 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                    {service.icon}
                  </div>

                  {/* Category Tag */}
                  <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-400/40 text-amber-100 text-[11px] font-semibold tracking-wide">
                    Authentic Vedic Guidance
                  </div>
                </div>

                {/* Service Title */}
                <h3 className="font-serif text-2xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors leading-snug">
                  {service.title}
                </h3>

                {/* Service Description */}
                <p className="text-slate-200 text-xs sm:text-sm leading-relaxed mb-5 font-normal">
                  {service.description}
                </p>

                {/* Feature Pills */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {(serviceBadges[index] || ['Vedic Remedy', 'Expert Guidance']).map((badge, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-[#16183a] border border-amber-500/20 text-amber-200 text-[11px] font-semibold"
                    >
                      ✦ {badge}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons Strip */}
              <div className="pt-4 border-t border-amber-500/20 flex items-center justify-between gap-3">
                <button
                  onClick={onOpenBooking}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-black font-bold text-xs shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:scale-102 hover:shadow-[0_0_25px_rgba(255,215,0,0.5)] transition-all text-center"
                >
                  Book Consultation
                </button>
                <Link
                  href={`/services/${service.slug}`}
                  className="px-3 py-2.5 rounded-xl border border-amber-500/30 text-amber-300 hover:text-white hover:border-amber-400 text-xs font-semibold transition-colors"
                >
                  Details →
                </Link>
              </div>

            </div>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-14 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#121430] to-[#1a1d45] border-2 border-amber-400/50 text-amber-300 font-bold text-sm hover:border-amber-300 hover:text-white hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] backdrop-blur-md transition-all duration-300"
          >
            <span>Explore All 15+ Specialized Astrology Services</span>
            <span className="text-amber-400 font-bold text-base">→</span>
          </Link>
        </div>

      </div>
    </section>
  );
}

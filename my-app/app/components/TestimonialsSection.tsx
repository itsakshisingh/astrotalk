'use client';

import React, { useState, useEffect, useRef } from 'react';
import { TESTIMONIALS } from '../data/astrologyData';

export default function TestimonialsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-slide feature for mobile carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <section ref={containerRef} className="py-16 px-4 sm:px-6 lg:px-8 bg-transparent relative z-10 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* ── Section Header ── */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-semibold tracking-widest uppercase mb-3 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            ✦ CLIENT TRANSFORMATIONS ✦
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
            What Our <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">Clients Say</span>
          </h2>
          <p className="text-slate-100 text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-medium">
            Real stories from thousands of individuals whose personal, financial, and family lives were transformed through cosmic wisdom and Vedic guidance.
          </p>
        </div>

        {/* ── Trust Stats Counter Bar ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10 max-w-4xl mx-auto">
          <div className="p-3 rounded-2xl bg-[#0e1026]/80 border border-amber-500/25 flex items-center justify-center gap-3 text-center shadow-md">
            <span className="text-xl">⭐</span>
            <div className="text-left">
              <p className="text-amber-300 font-bold text-xs">4.9 / 5.0 Rating</p>
              <p className="text-[10px] text-slate-200 font-medium">Over 25,000+ Reviews</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#0e1026]/80 border border-amber-500/25 flex items-center justify-center gap-3 text-center shadow-md">
            <span className="text-xl">🕉️</span>
            <div className="text-left">
              <p className="text-amber-300 font-bold text-xs">99.4% Satisfaction</p>
              <p className="text-[10px] text-slate-200 font-medium">Verified Client Ratings</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#0e1026]/80 border border-amber-500/25 flex items-center justify-center gap-3 text-center shadow-md">
            <span className="text-xl">🔒</span>
            <div className="text-left">
              <p className="text-amber-300 font-bold text-xs">100% Private</p>
              <p className="text-[10px] text-slate-200 font-medium">Encrypted Consultation</p>
            </div>
          </div>
        </div>

        {/* ── Desktop View: 3-Column Grid ── */}
        <div className="hidden md:grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((review) => (
            <div
              key={review.id}
              className="relative overflow-hidden rounded-3xl p-6 bg-[#0e1026]/90 backdrop-blur-xl border border-amber-500/35 hover:border-amber-400 hover:shadow-[0_12px_40px_rgba(212,175,55,0.3)] group hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between shadow-[0_8px_30px_rgba(0,0,0,0.7)]"
            >
              {/* Top ambient gold highlight line */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-transparent via-amber-400/80 to-transparent group-hover:w-full transition-all duration-500" />

              {/* Decorative Quote Mark */}
              <div className="absolute top-4 right-6 text-6xl font-serif text-amber-500/10 group-hover:text-amber-500/20 transition-colors pointer-events-none select-none">
                “
              </div>

              <div>
                {/* 5-Star Rating & Verified Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-amber-400 text-sm gap-1 drop-shadow-[0_0_6px_rgba(255,215,0,0.6)]">
                    {'★'.repeat(review.rating)}
                  </div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 font-medium flex items-center gap-1">
                    <span>✓</span> Verified Consultation
                  </span>
                </div>

                {/* Testimonial Text */}
                <p className="text-slate-100 text-xs sm:text-sm italic leading-relaxed mb-6 relative z-10">
                  &quot;{review.comment}&quot;
                </p>
              </div>

              {/* Client Info Footer */}
              <div className="pt-4 border-t border-amber-500/20 flex items-center gap-3.5">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400/60 p-0.5 shadow-[0_0_15px_rgba(212,175,55,0.3)] group-hover:border-amber-300 transition-colors flex-shrink-0">
                  <img
                    src={review.avatar}
                    alt={review.clientName}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-serif text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                    {review.clientName}
                  </h4>
                  <p className="text-xs text-slate-200 font-medium mt-0.5">
                    {review.location} • <span className="text-amber-300 font-medium">{review.serviceUsed}</span>
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* ── Mobile View: Responsive 1-Card Slider ── */}
        <div className="md:hidden">
          {TESTIMONIALS.map((review, idx) => {
            if (idx !== activeIndex) return null;
            return (
              <div
                key={review.id}
                className="relative overflow-hidden rounded-3xl p-6 bg-[#0e1026]/95 backdrop-blur-xl border-2 border-amber-400/60 shadow-[0_8px_30px_rgba(212,175,55,0.25)] flex flex-col justify-between animate-in fade-in zoom-in duration-300"
              >
                {/* Top ambient gold highlight line */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

                {/* Decorative Quote Mark */}
                <div className="absolute top-4 right-6 text-6xl font-serif text-amber-500/15 pointer-events-none select-none">
                  “
                </div>

                <div>
                  {/* 5-Star Rating & Verified Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex text-amber-400 text-base gap-1 drop-shadow-[0_0_6px_rgba(255,215,0,0.6)]">
                      {'★'.repeat(review.rating)}
                    </div>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium flex items-center gap-1">
                      <span>✓</span> Verified
                    </span>
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-gray-100 text-sm italic leading-relaxed mb-6">
                    &quot;{review.comment}&quot;
                  </p>
                </div>

                {/* Client Info Footer */}
                <div className="pt-4 border-t border-amber-500/20 flex items-center gap-3.5">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400 p-0.5 shadow-[0_0_15px_rgba(212,175,55,0.4)] flex-shrink-0">
                    <img
                      src={review.avatar}
                      alt={review.clientName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-bold text-white">
                      {review.clientName}
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {review.location} • <span className="text-amber-300 font-medium">{review.serviceUsed}</span>
                    </p>
                  </div>
                </div>

              </div>
            );
          })}

          {/* Slider Navigation Arrows & Dot Indicators */}
          <div className="flex items-center justify-between mt-6 px-2">
            <button
              onClick={prevSlide}
              className="w-10 h-10 rounded-full bg-[#121430] border border-amber-500/40 text-amber-300 flex items-center justify-center hover:bg-amber-400 hover:text-black transition-all shadow-md"
              aria-label="Previous review"
            >
              ←
            </button>

            {/* Dot Indicators */}
            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === activeIndex ? 'w-8 bg-amber-400 shadow-[0_0_10px_rgba(255,215,0,0.8)]' : 'w-2.5 bg-amber-500/30'
                  }`}
                  aria-label={`Go to review ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="w-10 h-10 rounded-full bg-[#121430] border border-amber-500/40 text-amber-300 flex items-center justify-center hover:bg-amber-400 hover:text-black transition-all shadow-md"
              aria-label="Next review"
            >
              →
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}

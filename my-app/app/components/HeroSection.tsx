'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface HeroSectionProps {
  onOpenBooking?: () => void;
}

const ZODIAC_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

export default function HeroSection({ onOpenBooking }: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgInnerRef  = useRef<HTMLImageElement>(null);
  const ring1Ref     = useRef<HTMLDivElement>(null);
  const ring2Ref     = useRef<HTMLDivElement>(null);
  const glowRef      = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(imgInnerRef.current, { rotation: 360, duration: 14, repeat: -1, ease: 'none', transformOrigin: '50% 50%' });
      gsap.to(ring1Ref.current,    { rotation: 360, duration: 30, repeat: -1, ease: 'none' });
      gsap.to(ring2Ref.current,    { rotation: -360, duration: 20, repeat: -1, ease: 'none' });
      gsap.to(glowRef.current,     { scale: 1.2, opacity: 0.6, duration: 2.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      
      // Entrance animation for main sections
      gsap.from('.hero-fade', { y: 25, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power2.out', delay: 0.1 });
      gsap.from('.zodiac-sym', { opacity: 0, scale: 0, duration: 0.5, stagger: 0.04, ease: 'back.out(2)', delay: 0.5 });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[85vh] flex items-center justify-center overflow-hidden px-4 lg:px-10 py-8 lg:py-12"
    >
      {/* ── Ambient glows ── */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-indigo-700/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-amber-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* ══════════════════════════════
          3-COLUMN LAYOUT
      ══════════════════════════════ */}
      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 lg:gap-12 items-center">

        {/* ── LEFT TEXT COLUMN ── */}
        <div className="flex flex-col gap-5 text-center lg:text-right order-2 lg:order-1">

          {/* Eyebrow */}
          <div className="hero-fade inline-flex items-center justify-center lg:justify-end gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#ffd700]" />
            <span className="text-amber-400 text-xs font-semibold tracking-widest uppercase">Vedic Astrology</span>
          </div>

          {/* Main Heading */}
          <h1 className="hero-fade font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            <span className="bg-gradient-to-br from-amber-100 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              Unlock the
            </span>
            <br />
            <span className="text-white">Secrets of</span>
            <br />
            <span className="bg-gradient-to-br from-amber-100 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              Your Stars
            </span>
          </h1>

          {/* Description */}
          <p className="hero-fade text-slate-100 font-medium text-sm sm:text-base leading-relaxed max-w-md mx-auto lg:ml-auto lg:mr-0 drop-shadow-sm">
            Connect with India&apos;s most trusted Vedic astrologers.
            Get your Kundli decoded, career path revealed, and
            destiny aligned — with clarity you can act on.
          </p>
        </div>

        {/* ── CENTER — Rotating Orb ── */}
        <div className="relative flex-shrink-0 flex items-center justify-center w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] lg:w-[420px] lg:h-[420px] mx-auto order-1 lg:order-2">

          {/* Outer zodiac ring */}
          <div ref={ring1Ref} className="absolute inset-0 rounded-full border border-amber-400/30">
            {ZODIAC_SYMBOLS.map((sym, i) => {
              const angle = (i / 12) * 360;
              const rad   = (angle * Math.PI) / 180;
              const x = 50 + 49 * Math.sin(rad);
              const y = 50 - 49 * Math.cos(rad);
              return (
                <span
                  key={i}
                  className="zodiac-sym absolute text-amber-300 text-xs sm:text-sm font-bold select-none drop-shadow-[0_0_6px_rgba(255,215,0,0.8)]"
                  style={{ left: `${x}%`, top: `${y}%`, transform: `translate(-50%,-50%) rotate(${-angle}deg)` }}
                >
                  {sym}
                </span>
              );
            })}
          </div>

          {/* Inner dashed ring */}
          <div ref={ring2Ref} className="absolute inset-6 rounded-full border border-dashed border-amber-400/25">
            {[0, 60, 120, 180, 240, 300].map((deg, i) => {
              const rad = (deg * Math.PI) / 180;
              return (
                <div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#ffd700]"
                  style={{ left: `${50 + 49 * Math.sin(rad)}%`, top: `${50 - 49 * Math.cos(rad)}%`, transform: 'translate(-50%,-50%)' }} />
              );
            })}
          </div>

          {/* Glow */}
          <div ref={glowRef} className="absolute inset-12 rounded-full bg-amber-400/20 blur-2xl" />

          {/* Rotating image */}
          <div className="absolute inset-12 rounded-full overflow-hidden border-2 border-amber-400/70 shadow-[0_0_50px_rgba(212,175,55,0.5)]">
            <img
              ref={imgInnerRef}
              src="/websiteImage/image1.jpg"
              alt="Cosmic"
              className="w-full h-full object-cover scale-110"
              style={{ willChange: 'transform' }}
            />
            <div className="absolute inset-0 rounded-full shadow-[inset_0_0_40px_rgba(8,9,20,0.4)]" />
          </div>

          {/* Center dot */}
          <div className="absolute w-3.5 h-3.5 rounded-full bg-amber-400 shadow-[0_0_20px_rgba(255,215,0,0.9)] z-20" />
        </div>

        {/* ── RIGHT TEXT COLUMN ── */}
        <div className="flex flex-col gap-5 text-center lg:text-left order-3">

          {/* Eyebrow */}
          <div className="hero-fade inline-flex items-center justify-center lg:justify-start gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#ffd700]" />
            <span className="text-amber-400 text-xs font-semibold tracking-widest uppercase">Cosmic Guidance</span>
          </div>

          {/* Heading */}
          <h2 className="hero-fade font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
            Accurate Predictions &amp; <span className="text-amber-300">Divine Wisdom</span>
          </h2>

          {/* Stats Grid — hero-fade on the container so all cards animate together and never get hidden */}
          <div className="hero-fade grid grid-cols-2 gap-3 max-w-md mx-auto lg:mx-0 w-full">
            {[
              { val: '50K+',  label: 'Happy Clients',       icon: '👥' },
              { val: '25+',   label: 'Years Exp.',          icon: '⭐' },
              { val: '200+',  label: 'Expert Astrologers',  icon: '🔮' },
              { val: '4.9★',  label: 'Rating (10K+)',       icon: '✨' },
            ].map((s, i) => (
              <div
                key={i}
                className="flex flex-col p-3.5 rounded-xl border border-amber-500/40 bg-[#0d0f22]/90 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.6)]"
              >
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                  <span className="text-lg sm:text-xl">{s.icon}</span>
                  <span className="font-serif text-xl sm:text-2xl font-bold text-amber-300 drop-shadow-[0_0_4px_rgba(255,215,0,0.4)]">{s.val}</span>
                </div>
                <p className="text-slate-100 text-xs font-semibold text-center lg:text-left">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Feature Badges */}
          <div className="hero-fade flex flex-wrap justify-center lg:justify-start gap-2 pt-1">
            {['Kundli Reading', 'Vastu Shastra', 'Career Guidance', 'Love & Marriage'].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 rounded-full text-xs font-semibold border border-amber-400/50 text-amber-100 bg-[#0d0f22]/90 backdrop-blur-md shadow-md"
              >
                ✦ {tag}
              </span>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
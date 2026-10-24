'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';



/* ─── Values Data ─── */
const values = [
  {
    icon: '🪐',
    title: 'Authentic Vedic Wisdom',
    desc: 'We follow time-tested Vedic traditions passed down through generations of learned scholars.',
  },
  {
    icon: '🤝',
    title: 'Empathetic Guidance',
    desc: 'Every consultation is delivered with compassion, respect, and zero judgement.',
  },
  {
    icon: '🔬',
    title: 'Scientific Precision',
    desc: 'Our astrologers use accurate birth chart calculations and planetary positions for every reading.',
  },
  {
    icon: '🛡️',
    title: 'Privacy First',
    desc: 'Your personal data and consultations are fully confidential and securely protected.',
  },
  {
    icon: '💛',
    title: 'Affordable Access',
    desc: 'Premium celestial guidance available to everyone — regardless of budget.',
  },
  {
    icon: '✨',
    title: 'Continuous Learning',
    desc: 'Our team undergoes regular training to blend ancient wisdom with modern life challenges.',
  },
];

/* ─── Journey Milestones ─── */
const milestones = [
  { year: '2018', event: 'jyotara founded with 10 expert astrologers and a mission to democratize Vedic wisdom.' },
  { year: '2019', event: 'Launched mobile-first platform with live chat and audio consultation features.' },
  { year: '2020', event: 'Expanded to 50,000+ users. Introduced tarot reading and numerology services.' },
  { year: '2021', event: 'Crossed 1 Lakh consultations. Onboarded 200+ certified astrologers pan India.' },
  { year: '2022', event: 'Launched AstroNora — AI-powered birth chart analysis and daily horoscope system.' },
  { year: '2024', event: 'Serving 1 Million+ consultations. Expanded globally with multilingual support.' },
];

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const statRefs = useRef<(HTMLDivElement | null)[]>([]);
  const milestoneRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    /* Lightweight CSS animation trigger on scroll */
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('anim-visible');
          }
        });
      },
      { threshold: 0.15 }
    );

    const elements = document.querySelectorAll('.anim-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        /* Scroll-reveal animation */
        .anim-on-scroll {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .anim-on-scroll.anim-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .anim-delay-1 { transition-delay: 0.1s; }
        .anim-delay-2 { transition-delay: 0.2s; }
        .anim-delay-3 { transition-delay: 0.3s; }
        .anim-delay-4 { transition-delay: 0.4s; }
        .anim-delay-5 { transition-delay: 0.5s; }
        .anim-delay-6 { transition-delay: 0.6s; }

        /* Glowing gold divider */
        .gold-divider {
          height: 2px;
          background: linear-gradient(90deg, transparent, #d4af37, transparent);
        }

        /* Parallax Hero */
        @keyframes float-up {
          0%   { transform: translateY(0px); }
          50%  { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        .float-anim { animation: float-up 6s ease-in-out infinite; }

        /* Timeline vertical line */
        .timeline-line::before {
          content: '';
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(to bottom, transparent, rgba(212,175,55,0.5), transparent);
          transform: translateX(-50%);
        }

        /* Stat counter card hover */
        .stat-card:hover {
          transform: translateY(-6px) scale(1.03);
          border-color: rgba(255, 215, 0, 0.6);
          box-shadow: 0 0 30px rgba(212, 175, 55, 0.25);
        }

        /* Value card hover */
        .value-card:hover {
          transform: translateY(-4px);
          border-color: rgba(212, 175, 55, 0.5);
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.15);
        }

        /* Parallax slow scroll */
        .parallax-slow {
          will-change: transform;
        }
      `}</style>

      <div className="min-h-screen flex flex-col text-gray-200">
        <Header />

        <main className="flex-1">

          {/* ══════════════════════════════════════════ */}
          {/* HERO SECTION */}
          {/* ══════════════════════════════════════════ */}
          <section
            ref={heroRef}
            className="relative overflow-hidden min-h-screen flex items-center"
          >
            {/* Subtle dark cosmic background */}
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#06070f] via-[#0d0f22] to-[#080914]" />

            {/* Decorative glowing orbs */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-700/8 rounded-full blur-[100px] pointer-events-none" />

            {/* Floating star particles */}
            <div className="absolute top-16 left-12 text-amber-400/25 text-3xl float-anim" style={{ animationDelay: '0s' }}>✦</div>
            <div className="absolute top-32 right-24 text-amber-300/15 text-5xl float-anim" style={{ animationDelay: '1.5s' }}>✧</div>
            <div className="absolute bottom-24 left-16 text-yellow-500/15 text-4xl float-anim" style={{ animationDelay: '0.8s' }}>⭐</div>
            <div className="absolute top-1/2 left-6 text-amber-500/10 text-6xl float-anim" style={{ animationDelay: '2.5s' }}>◈</div>

            {/* ── SPLIT LAYOUT ── */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

              {/* LEFT — Text Content */}
              <div className="space-y-7">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-amber-400 text-xs uppercase tracking-widest font-medium">
                    Ancient Wisdom · Modern Guidance
                  </span>
                </div>

                {/* Heading */}
                <h1 className="font-serif text-5xl sm:text-6xl font-bold text-white leading-[1.1]">
                  About <span className="gold-gradient-text">jyotara</span>
                  <br />
                  <span className="text-slate-200 text-4xl sm:text-5xl font-light">&amp; Our Sacred Mission</span>
                </h1>

                {/* Divider line */}
                <div className="w-20 h-0.5 bg-gradient-to-r from-amber-500 to-transparent rounded-full" />

                {/* Description */}
                <p className="text-slate-100 text-base leading-relaxed max-w-lg font-medium">
                  jyotara was born from a simple belief — that authentic Vedic astrology
                  should be accessible to everyone. We bridge the gap between ancient celestial
                  wisdom and the modern world, connecting millions of seekers with India&apos;s
                  most trusted celestial guides.
                </p>

                {/* Mini Stats Row */}
                <div className="flex flex-wrap gap-6 pt-2">
                  {[
                    { value: '1M+', label: 'Consultations' },
                    { value: '500+', label: 'Astrologers' },
                    { value: '4.9★', label: 'User Rating' },
                  ].map((s) => (
                    <div key={s.label} className="text-center">
                      <div className="font-serif text-2xl font-bold gold-gradient-text">{s.value}</div>
                      <div className="text-slate-300 text-xs mt-0.5 font-medium">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <Link
                    href="/astrologers"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-black font-bold text-sm shadow-[0_0_25px_rgba(212,175,55,0.35)] hover:shadow-[0_0_40px_rgba(255,215,0,0.6)] hover:scale-105 transition-all"
                  >
                    Meet Our Astrologers ✦
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-amber-500/40 text-amber-300 font-medium text-sm hover:bg-amber-500/10 hover:border-amber-400 transition-all"
                  >
                    Contact Us →
                  </Link>
                </div>
              </div>

              {/* RIGHT — Image Card */}
              <div className="relative flex justify-center lg:justify-end">
                {/* Outer glow ring */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-500/20 to-purple-700/10 blur-2xl scale-105" />

                {/* Main image */}
                <div className="relative w-full max-w-sm lg:max-w-md rounded-3xl overflow-hidden gold-border-glow shadow-2xl">
                  <div className="relative h-[520px]">
                    <Image
                      src="/websiteImage/abouteimage1.jpg"
                      alt="About jyotara"
                      fill
                      priority
                      className="object-cover"
                    />
                    {/* Bottom gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080914]/70 via-transparent to-[#080914]/20" />
                  </div>
                </div>

                {/* Floating badge — top left */}
                <div className="absolute -top-4 -left-4 lg:-left-8 glass-card gold-border-glow rounded-2xl px-4 py-3 flex items-center gap-3 backdrop-blur-md shadow-xl">
                  <div className="text-2xl">🏆</div>
                  <div>
                    <div className="text-xs text-amber-300 font-semibold">India&apos;s #1</div>
                    <div className="text-xs text-gray-400">Astrology Platform</div>
                  </div>
                </div>

                {/* Floating badge — bottom right */}
                <div className="absolute -bottom-4 -right-4 lg:-right-6 glass-card gold-border-glow rounded-2xl px-4 py-3 flex items-center gap-3 backdrop-blur-md shadow-xl">
                  <div className="text-2xl">🌟</div>
                  <div>
                    <div className="text-xs text-amber-300 font-semibold">Est. 2018</div>
                    <div className="text-xs text-gray-400">Trusted Globally</div>
                  </div>
                </div>

                {/* Spinning ring decoration */}
                <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full border border-amber-500/30 animate-spin-slow" />
                <div className="absolute -bottom-6 -left-6 w-14 h-14 rounded-full border border-amber-400/20 animate-spin-slow" style={{ animationDirection: 'reverse' }} />
              </div>
            </div>

            {/* Bottom scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
              <span className="text-amber-400 text-xs uppercase tracking-widest">Scroll to Explore</span>
              <div className="w-0.5 h-8 bg-gradient-to-b from-amber-400 to-transparent" />
            </div>
          </section>


          {/* ══════════════════════════════════════════ */}
          {/* OUR STORY — Redesigned Premium Layout   */}
          {/* ══════════════════════════════════════════ */}
          <section className="relative py-28 px-4 overflow-hidden">

            {/* Same dark cosmic background as hero section */}
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#06070f] via-[#0d0f22] to-[#080914]" />

            {/* Decorative glow orbs — same as hero */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none z-0" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-700/8 rounded-full blur-[100px] pointer-events-none z-0" />

            <div className="relative z-10 max-w-6xl mx-auto">

              {/* Section Label */}
              <div className="flex items-center gap-3 mb-14 anim-on-scroll">
                <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-transparent to-amber-500/50" />
                <span className="text-amber-400 text-xs uppercase tracking-[0.2em] font-semibold">Our Origins</span>
                <div className="h-px flex-1 bg-gradient-to-r from-amber-500/50 to-transparent" />
              </div>

              {/* Main Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">

                {/* LEFT — Image Column (3 cols) */}
                <div className="lg:col-span-3 anim-on-scroll">
                  <div className="relative">

                    {/* Primary large image */}
                    <div className="relative h-[480px] rounded-3xl overflow-hidden gold-border-glow shadow-2xl">
                      <Image
                        src="/websiteImage/abouteimage5.jpg"
                        alt="jyotara Origins"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#080914]/80 via-[#080914]/20 to-transparent" />

                      {/* Overlay text on image */}
                      <div className="absolute bottom-6 left-6 right-6">
                        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
                          Guiding Humanity Through{' '}
                          <span className="gold-gradient-text">The Language of Stars</span>
                        </h2>
                      </div>
                    </div>

                    {/* Small floating stat cards */}
                    <div className="absolute -top-5 -right-5 glass-card gold-border-glow rounded-2xl px-4 py-3 backdrop-blur-md flex items-center gap-3 shadow-xl z-10">
                      <span className="text-2xl">🌟</span>
                      <div>
                        <div className="font-serif text-xl font-bold gold-gradient-text">1M+</div>
                        <div className="text-gray-400 text-xs">Happy Seekers</div>
                      </div>
                    </div>

                    <div className="absolute -bottom-5 -left-5 glass-card gold-border-glow rounded-2xl px-4 py-3 backdrop-blur-md flex items-center gap-3 shadow-xl z-10">
                      <span className="text-2xl">🔮</span>
                      <div>
                        <div className="font-serif text-xl font-bold gold-gradient-text">500+</div>
                        <div className="text-gray-400 text-xs">Certified Astrologers</div>
                      </div>
                    </div>

                    {/* Spinning orbit ring */}
                    <div className="absolute -top-8 -left-8 w-24 h-24 rounded-full border border-amber-500/20 animate-spin-slow pointer-events-none" />
                  </div>
                </div>

                {/* RIGHT — Content Column (2 cols) */}
                <div className="lg:col-span-2 space-y-7 anim-on-scroll anim-delay-2 lg:pt-6">

                  {/* Story text */}
                  <p className="text-gray-300 text-sm leading-[1.9] border-l-2 border-amber-500/40 pl-4">
                    Founded in 2018, jyotara emerged from the vision of making authentic
                    Vedic astrology accessible to everyone — from the curious seeker to the
                    life-decision maker.
                  </p>

                  <p className="text-gray-400 text-sm leading-[1.9]">
                    We bridge the gap between ancient celestial wisdom and the modern world.
                    Our 500+ certified astrologers offer precise, empathetic, and deeply
                    personalised readings across all life domains.
                  </p>

                  {/* Feature highlights */}
                  <div className="space-y-4 pt-2">
                    {[
                      { icon: '📜', title: 'Vedic Certified', desc: 'All astrologers vetted & certified' },
                      { icon: '💬', title: 'Live Consultations', desc: 'Chat, call & video sessions' },
                      { icon: '🌐', title: 'Global Reach', desc: 'Serving 50+ cities worldwide' },
                    ].map((f) => (
                      <div key={f.title} className="flex items-center gap-4 glass-card rounded-xl px-4 py-3 gold-border-glow hover:border-amber-400/60 transition-all group cursor-default">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-xl flex-shrink-0 group-hover:bg-amber-500/20 transition-colors">
                          {f.icon}
                        </div>
                        <div>
                          <div className="text-white text-sm font-semibold">{f.title}</div>
                          <div className="text-gray-500 text-xs">{f.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CTA buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-3">
                    <Link
                      href="/services"
                      className="flex-1 text-center px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold text-xs shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] hover:scale-105 transition-all"
                    >
                      Explore Services ✦
                    </Link>
                    <Link
                      href="/astrologers"
                      className="flex-1 text-center px-6 py-3 rounded-full border border-amber-500/40 text-amber-300 text-xs font-medium hover:bg-amber-500/10 transition-all"
                    >
                      Meet Astrologers →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════ */}
          {/* MISSION & VISION — Premium Redesign      */}
          {/* ══════════════════════════════════════════ */}
          <section className="relative py-28 px-4 overflow-hidden">

            {/* Same hero-style background */}
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#06070f] via-[#0d0f22] to-[#080914]" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none z-0" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-700/8 rounded-full blur-[100px] pointer-events-none z-0" />

            {/* Floating star accents */}
            <div className="absolute top-12 left-20 text-amber-400/15 text-5xl float-anim" style={{ animationDelay: '0.5s' }}>✦</div>
            <div className="absolute bottom-16 right-24 text-purple-400/10 text-6xl float-anim" style={{ animationDelay: '2s' }}>✧</div>

            <div className="relative z-10 max-w-6xl mx-auto">

              {/* Section heading */}
              <div className="text-center mb-16 anim-on-scroll">
                <div className="inline-flex items-center gap-3 mb-5">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-500/60" />
                  <span className="text-amber-400 text-xs uppercase tracking-[0.25em] font-semibold">Purpose & Direction</span>
                  <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-500/60" />
                </div>
                <h2 className="font-serif text-5xl font-bold text-white">
                  Mission &amp; <span className="gold-gradient-text">Vision</span>
                </h2>
                <p className="text-gray-500 text-sm mt-4 max-w-lg mx-auto">
                  The twin pillars that guide every decision, every consultation, and every feature we build.
                </p>
              </div>

              {/* Full-width two-panel layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-amber-500/20 shadow-[0_0_60px_rgba(0,0,0,0.5)]">

                {/* ── MISSION PANEL ── */}
                <div className="relative p-10 lg:p-14 anim-on-scroll overflow-hidden">
                  {/* Panel background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0d0f1e] to-[#0a0c18]" />
                  <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500/6 rounded-full blur-3xl" />

                  {/* Right border divider */}
                  <div className="hidden lg:block absolute right-0 top-8 bottom-8 w-px bg-gradient-to-b from-transparent via-amber-500/30 to-transparent" />

                  <div className="relative z-10 space-y-6">
                    {/* Big number accent */}
                    <div className="font-serif text-8xl font-black text-amber-500/8 leading-none select-none absolute -top-2 -right-2">01</div>

                    {/* Icon */}
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(212,175,55,0.4)]">
                      🎯
                    </div>

                    {/* Label */}
                    <div className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                      <span className="text-amber-400 text-xs uppercase tracking-widest font-semibold">Our Mission</span>
                    </div>

                    <h3 className="font-serif text-3xl font-bold text-white leading-tight">
                      Authentic Guidance,<br />
                      <span className="gold-gradient-text">Accessible to All</span>
                    </h3>

                    <p className="text-gray-400 text-sm leading-[1.9]">
                      To deliver authentic, affordable, and actionable astrological guidance
                      without superstition — empowering individuals to make informed life
                      decisions backed by centuries-old planetary science.
                    </p>

                    {/* Checklist */}
                    <div className="space-y-3 pt-2">
                      {[
                        'Certified & vetted astrologers only',
                        'No fear-mongering or dark predictions',
                        'Evidence-based Vedic methodology',
                      ].map((item) => (
                        <div key={item} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-amber-400 text-xs">✓</span>
                          </div>
                          <span className="text-gray-300 text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── VISION PANEL ── */}
                <div className="relative p-10 lg:p-14 anim-on-scroll anim-delay-2 overflow-hidden">
                  {/* Panel background */}
                  <div className="absolute inset-0 bg-gradient-to-bl from-[#100d1e] to-[#0a0c18]" />
                  <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-700/8 rounded-full blur-3xl" />

                  <div className="relative z-10 space-y-6">
                    {/* Big number accent */}
                    <div className="font-serif text-8xl font-black text-purple-500/8 leading-none select-none absolute -top-2 -right-2">02</div>

                    {/* Icon */}
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-700 flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(139,92,246,0.4)]">
                      🌌
                    </div>

                    {/* Label */}
                    <div className="inline-block px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
                      <span className="text-purple-400 text-xs uppercase tracking-widest font-semibold">Our Vision</span>
                    </div>

                    <h3 className="font-serif text-3xl font-bold text-white leading-tight">
                      World&apos;s Most Trusted<br />
                      <span className="bg-gradient-to-r from-purple-300 via-violet-300 to-indigo-400 bg-clip-text text-transparent">Celestial Platform</span>
                    </h3>

                    <p className="text-gray-400 text-sm leading-[1.9]">
                      To become the world&apos;s most trusted celestial guidance platform —
                      merging ancient Vedic astrology with modern AI to create deeply
                      personalised, meaningful life experiences for every user.
                    </p>

                    {/* Checklist */}
                    <div className="space-y-3 pt-2">
                      {[
                        'AI-enhanced birth chart analysis',
                        'Global multilingual reach',
                        '10 Million consultations by 2026',
                      ].map((item) => (
                        <div key={item} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-purple-500/15 border border-purple-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-purple-400 text-xs">✓</span>
                          </div>
                          <span className="text-gray-300 text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom gold strip */}
              <div className="h-1 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-purple-500 mt-0 shadow-[0_0_20px_rgba(212,175,55,0.4)]" />
            </div>
          </section>

          <div className="gold-divider max-w-4xl mx-auto opacity-40" />

          {/* ══════════════════════════════════════════ */}
          {/* CORE VALUES — Premium Redesign            */}
          {/* ══════════════════════════════════════════ */}
          <section className="relative py-28 px-4 overflow-hidden">

            {/* Hero-style background */}
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#06070f] via-[#0d0f22] to-[#080914]" />
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none z-0" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-700/6 rounded-full blur-[100px] pointer-events-none z-0" />

            {/* Decorative floating symbols */}
            <div className="absolute top-10 right-16 text-amber-400/10 text-7xl float-anim select-none" style={{ animationDelay: '1s' }}>✦</div>
            <div className="absolute bottom-10 left-20 text-amber-300/8 text-8xl float-anim select-none" style={{ animationDelay: '3s' }}>◈</div>

            <div className="relative z-10 max-w-6xl mx-auto">

              {/* Heading */}
              <div className="text-center mb-16 anim-on-scroll">
                <div className="inline-flex items-center gap-3 mb-5">
                  <div className="h-px w-10 bg-gradient-to-r from-transparent to-amber-500/60" />
                  <span className="text-amber-400 text-xs uppercase tracking-[0.25em] font-semibold">What We Stand For</span>
                  <div className="h-px w-10 bg-gradient-to-l from-transparent to-amber-500/60" />
                </div>
                <h2 className="font-serif text-5xl font-bold text-white">
                  Our Core <span className="gold-gradient-text">Values</span>
                </h2>
                <p className="text-gray-500 text-sm mt-4 max-w-lg mx-auto leading-relaxed">
                  Every decision at jyotara is guided by principles that honour both our ancient heritage and modern responsibilities.
                </p>
              </div>

              {/* Values Grid — 3 cols top + 3 cols bottom */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {values.map((v, i) => (
                  <div
                    key={v.title}
                    className={`anim-on-scroll anim-delay-${(i % 3) + 1} group relative rounded-2xl overflow-hidden cursor-default transition-all duration-400 hover:-translate-y-2`}
                  >
                    {/* Card background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0d0f1e] to-[#0a0c18] rounded-2xl" />
                    <div className="absolute inset-0 rounded-2xl border border-amber-500/15 group-hover:border-amber-500/50 transition-colors duration-300" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.12)_inset]" />

                    {/* Large background number */}
                    <div className="absolute top-2 right-4 font-serif text-7xl font-black text-amber-500/6 select-none leading-none">
                      {String(i + 1).padStart(2, '0')}
                    </div>

                    <div className="relative z-10 p-7 space-y-4">
                      {/* Icon badge */}
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/15 to-amber-600/5 border border-amber-500/20 flex items-center justify-center text-3xl group-hover:from-amber-500/25 group-hover:border-amber-500/40 transition-all duration-300">
                        {v.icon}
                      </div>

                      {/* Title */}
                      <h4 className="font-serif text-xl font-bold text-white group-hover:text-amber-100 transition-colors">
                        {v.title}
                      </h4>

                      {/* Animated gold underline */}
                      <div className="w-0 h-0.5 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full group-hover:w-12 transition-all duration-500" />

                      {/* Description */}
                      <p className="text-gray-400 text-sm leading-[1.8] group-hover:text-gray-300 transition-colors">
                        {v.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════ */}
          {/* IMAGE GALLERY — abouteimage4 & abouteimage5 */}
          {/* ══════════════════════════════════════════ */}
          <section className="relative py-20 px-4 overflow-hidden">

            {/* Hero-style dark cosmic background */}
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#06070f] via-[#0d0f22] to-[#080914]" />
            <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none z-0" />
            <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-purple-700/6 rounded-full blur-[100px] pointer-events-none z-0" />


            <div className="relative z-10 max-w-6xl mx-auto">
              <div className="text-center mb-12 anim-on-scroll">
                <span className="text-amber-400 text-xs uppercase tracking-widest font-medium block mb-3">✦ Inside jyotara ✦</span>
                <h2 className="font-serif text-4xl font-bold text-white">
                  Where Cosmic <span className="gold-gradient-text">Magic Happens</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Large left */}
                <div className="md:col-span-2 anim-on-scroll anim-delay-1">
                  <div className="relative h-80 rounded-3xl overflow-hidden glass-card gold-border-glow group">
                    <Image
                      src="/websiteImage/abouteimage4.jpg"
                      alt="Astrology Consultation Space"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080914]/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <span className="text-xs text-amber-400 uppercase tracking-widest">Expert Consultations</span>
                      <p className="text-white font-serif text-lg font-bold mt-0.5">One-on-one Cosmic Sessions</p>
                    </div>
                  </div>
                </div>

                {/* Right */}
                <div className="anim-on-scroll anim-delay-2">
                  <div className="relative h-80 rounded-3xl overflow-hidden glass-card gold-border-glow group">
                    <Image
                      src="/websiteImage/abouteimage5.jpg"
                      alt="Vedic Astrology Traditions"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080914]/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <span className="text-xs text-amber-400 uppercase tracking-widest">Vedic Traditions</span>
                      <p className="text-white font-serif text-base font-bold mt-0.5">Ancient Wisdom Preserved</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════ */}
          {/* JOURNEY TIMELINE */}
          {/* ══════════════════════════════════════════ */}
          <section className="relative py-24 px-4 overflow-hidden">

            {/* Hero-style dark cosmic background */}
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#06070f] via-[#0d0f22] to-[#080914]" />
            <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none z-0" />
            <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-purple-700/6 rounded-full blur-[100px] pointer-events-none z-0" />

            <div className="relative z-10 max-w-4xl mx-auto">
              <div className="text-center mb-16 anim-on-scroll">
                <span className="text-amber-400 text-xs uppercase tracking-widest font-medium block mb-3">✦ Our Journey ✦</span>
                <h2 className="font-serif text-4xl font-bold text-white">
                  Milestones That <span className="gold-gradient-text">Define Us</span>
                </h2>
              </div>

              <div className="relative timeline-line space-y-0">
                {milestones.map((m, i) => (
                  <div
                    key={m.year}
                    className={`anim-on-scroll anim-delay-${(i % 3) + 1} relative flex items-start gap-8 pb-12 ${
                      i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    {/* Year badge */}
                    <div className="flex-shrink-0 w-24 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 text-black font-bold text-sm shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                        {m.year}
                      </div>
                    </div>
                    {/* Event */}
                    <div className={`flex-1 glass-card gold-border-glow rounded-2xl p-5 ${i % 2 !== 0 ? 'md:text-right' : ''}`}>
                      <p className="text-gray-300 text-sm leading-relaxed">{m.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════ */}
          {/* CTA SECTION */}
          {/* ══════════════════════════════════════════ */}
          <section className="relative py-24 px-4 overflow-hidden">

            {/* Hero-style dark cosmic background */}
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#06070f] via-[#0d0f22] to-[#080914]" />
            <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none z-0" />
            <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-purple-700/5 rounded-full blur-[100px] pointer-events-none z-0" />

            <div className="relative z-10 max-w-4xl mx-auto anim-on-scroll">
              <div className="glass-card gold-border-glow rounded-3xl p-12 text-center relative overflow-hidden">
                {/* Decorative glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-500/10 rounded-full blur-3xl" />

                <div className="relative z-10 space-y-6">
                  <div className="text-5xl">🌠</div>
                  <h2 className="font-serif text-4xl font-bold text-white">
                    Begin Your <span className="gold-gradient-text">Cosmic Journey</span>
                  </h2>
                  <p className="text-gray-300 text-sm max-w-lg mx-auto leading-relaxed">
                    Connect with a certified astrologer today. Get your personalised Kundli, career forecast,
                    love compatibility, or Vastu consultation — all in one place.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Link
                      href="/astrologers"
                      className="px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-black font-bold text-sm shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:shadow-[0_0_40px_rgba(255,215,0,0.6)] hover:scale-105 transition-all"
                    >
                      Talk to an Astrologer ✦
                    </Link>
                    <Link
                      href="/horoscope"
                      className="px-8 py-4 rounded-full border border-amber-500/40 text-amber-300 font-medium text-sm hover:bg-amber-500/10 transition-all"
                    >
                      Free Horoscope →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </main>

        <Footer />
      </div>
    </>
  );
}

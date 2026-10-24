'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import AppointmentModal from '../../components/AppointmentModal';
import { ASTROLOGY_SERVICES, ASTROLOGERS } from '../../data/astrologyData';

const serviceImagesMap: Record<string, string> = {
  'kundli-analysis': '/websiteImage/Birth Chart.jpg',
  'horoscope-reading': '/websiteImage/Horoscope.jpg',
  'vastu-shastra': '/websiteImage/VastuShastra.png',
  'numerology': '/websiteImage/Numerology.jpg',
  'palmistry': '/websiteImage/PalmistryHand.jpg',
  'tarot-reading': '/websiteImage/TarotCard.jpg',
};

const serviceHighlightsMap: Record<string, { title: string; desc: string; icon: string }[]> = {
  'kundli-analysis': [
    { title: 'Complete Janam Kundli', desc: '30+ page detailed birth chart mapping planetary positions at your exact birth time.', icon: '📜' },
    { title: 'Vimshottari Dasha Analysis', desc: 'Detailed phase timelines predicting major life turns in career, health, and marriage.', icon: '⏳' },
    { title: 'Dosha & Remedies', desc: 'Identify Manglik, Kalsarp, or Pitra doshas with authentic Vedic remedies & pujas.', icon: '🕉️' },
    { title: 'Gemstone & Rudraksha Advice', desc: 'Personalized gemstone recommendations to enhance positive planetary energies.', icon: '💎' },
  ],
  'horoscope-reading': [
    { title: 'Daily & Monthly Transits', desc: 'Track key planetary movements (Jupiter, Saturn, Rahu-Ketu) and their direct impact.', icon: '🪐' },
    { title: 'Lagna & Moon Sign Reading', desc: 'In-depth breakdown based on your Moon sign and Rising ascendant.', icon: '🌙' },
    { title: 'Career & Relationship Map', desc: 'Favorable timings for job changes, business deals, and marriage proposals.', icon: '💼' },
    { title: 'Personalized Solutions', desc: 'Simple daily mantras and astrological practices for planetary alignment.', icon: '✨' },
  ],
  'vastu-shastra': [
    { title: 'Home & Office Alignment', desc: 'Optimize space orientation for peace, financial growth, and family health.', icon: '🏛️' },
    { title: 'Remedies Without Demolition', desc: 'Practical Vastu energy balancing using Yantras, colors, and directional fixes.', icon: '☯️' },
    { title: 'Commercial Vastu Map', desc: 'Enhance cash flow, employee productivity, and business expansion.', icon: '💰' },
    { title: 'Directional Energy Audit', desc: 'Detailed audit of 16 Vastu zones and 32 entrance points.', icon: '🧭' },
  ],
  'numerology': [
    { title: 'Life Path & Destiny Number', desc: 'Decode your core birth numbers and hidden life purpose.', icon: '🔢' },
    { title: 'Name Correction & Tuning', desc: 'Optimize your name spelling for lucky vibrations and corporate success.', icon: '✍️' },
    { title: 'Business Name Numerology', desc: 'Choose high-frequency names for companies, products, and brand logos.', icon: '🏷️' },
    { title: 'Personal Year Forecast', desc: 'Know which years favor investments, travel, or relationship milestones.', icon: '📅' },
  ],
  'palmistry': [
    { title: 'Major Line Analysis', desc: 'Detailed interpretation of Life Line, Heart Line, Head Line, and Fate Line.', icon: '✋' },
    { title: 'Mounts & Markings', desc: 'Evaluate Jupiter, Venus, Sun, and Saturn mounts for wealth and intuition.', icon: '🔮' },
    { title: 'Timing of Major Events', desc: 'Pinpoint ages for career breakthroughs, marriage, and foreign travel.', icon: '⌛' },
    { title: 'Hand Shape & Element', desc: 'Discover your fundamental personality archetype (Fire, Earth, Air, Water hand).', icon: '🌿' },
  ],
  'tarot-reading': [
    { title: 'Love & Relationship Spread', desc: 'Gain immediate clarity on partner intentions, compatibility, and future.', icon: '❤️' },
    { title: 'Career & Financial Spread', desc: 'Uncover hidden opportunities, job offers, and financial hurdles.', icon: '💼' },
    { title: '78-Card Intuitive Guidance', desc: 'Deep Major and Minor Arcana readings for immediate decision making.', icon: '🃏' },
    { title: 'Actionable Energy Remedies', desc: 'Crystal and chakra balancing advice based on card guidance.', icon: '🕯️' },
  ],
};

interface ServiceDetailsProps {
  params: Promise<{ slug: string }>;
}

export default function ServiceDetailPage({ params }: ServiceDetailsProps) {
  const { slug } = use(params);
  const [modalOpen, setModalOpen] = useState(false);

  const service = ASTROLOGY_SERVICES.find((s) => s.slug === slug) || ASTROLOGY_SERVICES[0];
  const serviceImage = serviceImagesMap[service.slug] || '/websiteImage/image1.jpg';
  const highlights = serviceHighlightsMap[service.slug] || serviceHighlightsMap['kundli-analysis'];

  return (
    <div className="min-h-screen flex flex-col bg-[#080914] text-slate-100 font-sans">
      <Header onOpenBooking={() => setModalOpen(true)} />

      <main className="flex-1">
        {/* Service Hero Section */}
        <section className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0d0f26] via-[#0b0c1e] to-[#080914] border-b border-amber-500/20 overflow-hidden">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-semibold uppercase tracking-wider">
                <span>{service.icon}</span>
                <span>VERIFIED VEDIC SERVICE</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                {service.title}
              </h1>

              <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-medium">
                {service.longDescription || service.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setModalOpen(true)}
                  className="px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-black font-bold text-sm shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:brightness-110 hover:scale-105 transition-all cursor-pointer"
                >
                  Book Consultation Now ✦
                </button>
                <Link
                  href="/services"
                  className="px-6 py-3.5 rounded-full border border-amber-500/30 text-amber-300 text-xs font-semibold hover:border-amber-400 hover:text-white transition-colors"
                >
                  ← All Services
                </Link>
              </div>

              <div className="pt-4 flex items-center gap-6 text-xs text-slate-300 font-medium">
                <span className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> 100% Confidential</span>
                <span className="flex items-center gap-1.5"><span className="text-amber-400">★</span> 4.9/5 User Rating</span>
                <span className="flex items-center gap-1.5"><span className="text-amber-400">⚡</span> Live Phone / Chat</span>
              </div>
            </div>

            {/* Right Banner Image */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden border-2 border-amber-500/40 shadow-[0_0_50px_rgba(212,175,55,0.25)] group">
                <img
                  src={serviceImage}
                  alt={service.title}
                  className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080914] via-transparent to-black/30" />
                
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-black/80 backdrop-blur-md border border-amber-500/30 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-amber-300">Live Consultation Available</p>
                    <p className="text-[11px] text-slate-300">Talk to Certified Vedic Experts</p>
                  </div>
                  <button
                    onClick={() => setModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition-colors"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Key Highlights Grid */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-amber-400 font-semibold text-xs uppercase tracking-widest block mb-2">
              ✦ WHAT YOU GET ✦
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-3">
              Key <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">Highlights &amp; Benefits</span>
            </h2>
            <p className="text-slate-200 text-sm font-medium">
              Comprehensive guidance customized to your unique birth chart details.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((item, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-[#0e1026]/90 border border-amber-500/30 shadow-md hover:border-amber-400 transition-all space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl">
                  {item.icon}
                </div>
                <h3 className="font-serif text-lg font-bold text-white">{item.title}</h3>
                <p className="text-slate-200 text-xs leading-relaxed font-normal">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0b0c1e] border-y border-amber-500/20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-amber-400 font-semibold text-xs uppercase tracking-widest block mb-2">
                ✦ SIMPLE PROCESS ✦
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                How It <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">Works</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-[#080918] border border-amber-500/25 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-amber-500 text-black font-bold text-sm flex items-center justify-center mx-auto">1</div>
                <h3 className="font-serif text-lg font-bold text-white">Fill Booking Details</h3>
                <p className="text-slate-200 text-xs leading-relaxed font-normal">Provide your birth date, time, and questions in our simple appointment form.</p>
              </div>

              <div className="p-6 rounded-2xl bg-[#080918] border border-amber-500/25 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-amber-500 text-black font-bold text-sm flex items-center justify-center mx-auto">2</div>
                <h3 className="font-serif text-lg font-bold text-white">Chart &amp; Transit Analysis</h3>
                <p className="text-slate-200 text-xs leading-relaxed font-normal">Certified Vedic astrologer deeply analyzes planetary alignments and dashas.</p>
              </div>

              <div className="p-6 rounded-2xl bg-[#080918] border border-amber-500/25 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-amber-500 text-black font-bold text-sm flex items-center justify-center mx-auto">3</div>
                <h3 className="font-serif text-lg font-bold text-white">Live Consultation &amp; Remedies</h3>
                <p className="text-slate-200 text-xs leading-relaxed font-normal">Receive clear answers, practical remedies, and lifetime cosmic guidance.</p>
              </div>
            </div>

            <div className="mt-10 text-center">
              <button
                onClick={() => setModalOpen(true)}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-black font-bold text-sm shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:scale-105 transition-all cursor-pointer"
              >
                Schedule {service.title} Now ✦
              </button>
            </div>
          </div>
        </section>

        {/* Recommended Astrologers Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-amber-400 font-semibold text-xs uppercase tracking-widest block mb-2">
              ✦ EXPERT ADVISORS ✦
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Recommended <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">Astrologers</span>
            </h2>
            <p className="text-slate-200 text-sm mt-2 font-medium">
              Connect instantly with India&apos;s renowned Vedic astrologers for personalized live chat, phone call, or Kundli reports.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ASTROLOGERS.map((astro) => (
              <div
                key={astro.id}
                className="relative overflow-hidden rounded-3xl p-5 bg-[#0e1026]/90 border border-amber-500/35 hover:border-amber-400 shadow-[0_8px_30px_rgba(0,0,0,0.7)] hover:shadow-[0_12px_40px_rgba(212,175,55,0.3)] transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Astrologer Image Banner */}
                  <div className="relative h-48 rounded-2xl overflow-hidden mb-4 border border-amber-500/30">
                    <img src={astro.image} alt={astro.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-[10px] font-bold tracking-wide flex items-center gap-1 shadow-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                      ONLINE NOW
                    </div>

                    {/* Rating Tag */}
                    <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-amber-400/50 text-amber-300 text-xs font-bold flex items-center gap-1">
                      ★ {astro.rating} <span className="text-[10px] text-slate-300 font-normal">({astro.reviewsCount})</span>
                    </div>
                  </div>

                  {/* Name & Title */}
                  <h3 className="font-serif text-xl font-bold text-white mb-0.5 group-hover:text-amber-300 transition-colors">
                    {astro.name}
                  </h3>
                  <p className="text-xs text-amber-400 font-medium mb-3">{astro.title}</p>

                  {/* Specialties Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {astro.specialties.slice(0, 3).map((spec, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-[#16183a] border border-amber-500/20 text-slate-200 text-[10px] font-medium">
                        ✦ {spec}
                      </span>
                    ))}
                  </div>

                  {/* Exp & Lang */}
                  <div className="space-y-1 text-xs text-slate-300 border-t border-amber-500/15 pt-3 mb-4 font-medium">
                    <div className="flex justify-between">
                      <span>Experience:</span>
                      <span className="text-amber-300 font-semibold">{astro.experienceYears}+ Years</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Languages:</span>
                      <span className="text-slate-100">{astro.languages.join(', ')}</span>
                    </div>
                  </div>
                </div>

                {/* Pricing & Booking CTA */}
                <div className="pt-3 border-t border-amber-500/20 flex items-center justify-between gap-2">
                  <div>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-amber-300 font-serif font-bold text-lg">₹{astro.pricePerMin}</span>
                      <span className="text-[11px] text-slate-300 font-medium">/min</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-medium">Free First 5 Mins</span>
                  </div>

                  <button
                    onClick={() => setModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-black font-bold text-xs shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:scale-105 transition-all cursor-pointer"
                  >
                    Consult Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Explore All Astrologers Button */}
          <div className="mt-12 text-center">
            <Link
              href="/astrologers"
              className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#121430] to-[#1a1d45] border-2 border-amber-400/50 text-amber-300 font-bold text-sm hover:border-amber-300 hover:text-white hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] backdrop-blur-md transition-all duration-300"
            >
              <span>Explore All 50+ Certified Astrologers</span>
              <span className="text-amber-400 font-bold text-base">→</span>
            </Link>
          </div>
        </section>
      </main>

      <AppointmentModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <Footer />
    </div>
  );
}

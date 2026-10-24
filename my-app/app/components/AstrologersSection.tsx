'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface AstrologersSectionProps {
  onOpenBooking?: (astrologerId?: string, astrologerName?: string) => void;
}

const astrologerImages: Record<number, string> = {
  0: '/websiteImage/Astrology1.jpg',
  1: '/websiteImage/Astrology2.jpg',
  2: '/websiteImage/Astrology3.jpg',
  3: '/websiteImage/Astrology4.jpg',
};

interface AstrologerDisplay {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  experienceYears: number;
  languages: string[];
  pricePerMin: number;
  rating: number;
  reviewsCount: number;
  isOnline: boolean;
  image: string;
}

export default function AstrologersSection({ onOpenBooking }: AstrologersSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [astrologers, setAstrologers] = useState<AstrologerDisplay[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchAstrologers() {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/astrologer/public");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const mapped: AstrologerDisplay[] = json.data.map((item: any, idx: number) => {
            const userObj = item.userId || {};
            const imgPath = userObj.profileImage || item.profileImage;
            const fullImg = imgPath
              ? (imgPath.startsWith("http") ? imgPath : `http://localhost:5000${imgPath}`)
              : (astrologerImages[idx % 4] || "/websiteImage/Astrology1.jpg");

            return {
              id: item._id || userObj._id || String(idx),
              name: item.displayName || userObj.fullName || "Certified Astrologer",
              title: item.professionalTitle || "Senior Vedic Astrologer & Kundli Expert",
              specialties: Array.isArray(item.specialization) && item.specialization.length > 0
                ? item.specialization
                : ["Vedic Astrology", "Kundli Analysis"],
              experienceYears: item.experience || 0,
              languages: Array.isArray(item.languages) && item.languages.length > 0
                ? item.languages
                : ["Hindi", "English"],
              pricePerMin: item.consultationFee || 0,
              rating: item.rating || 4.9,
              reviewsCount: item.totalConsultations || 100 + idx * 10,
              isOnline: item.isAcceptingAppointments !== false,
              image: fullImg,
            };
          });
          setAstrologers(mapped);
        } else {
          setAstrologers([]);
        }
      } catch (err) {
        console.warn("Failed to fetch public astrologers API:", err);
        setAstrologers([]);
      } finally {
        setLoading(false);
      }
    }

    fetchAstrologers();
  }, []);

  return (
    <section ref={containerRef} className="py-16 px-4 sm:px-6 lg:px-8 bg-transparent relative z-10 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* ── Section Header ── */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-semibold tracking-widest uppercase mb-3 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            ✦ CERTIFIED VEDIC EXPERTS ✦
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
            Consult Our Top <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">Astrologers</span>
          </h2>
          <p className="text-slate-100 text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-medium">
            Connect instantly with India&apos;s renowned Vedic astrologers for personalized live chat, phone call, or Kundli reports.
          </p>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400">
            <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm">Loading verified astrologers...</p>
          </div>
        ) : astrologers.length === 0 ? (
          <div className="py-16 text-center text-slate-400 bg-[#0e1026]/60 rounded-3xl border border-amber-500/20 max-w-md mx-auto">
            <span className="text-3xl block mb-2">🔮</span>
            <h3 className="text-white font-serif text-lg font-bold">No Astrologers Available</h3>
            <p className="text-xs text-slate-300 mt-1">Currently no online astrologers found.</p>
          </div>
        ) : (
          /* ── 4-Column Astrologers Grid (Click Card to Open Details Page by ID) ── */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {astrologers.map((astro, index) => (
            <div
              key={astro.id || index}
              onClick={() => router.push(`/astrologers/${astro.id}`)}
              className="relative overflow-hidden rounded-3xl p-5 bg-[#0e1026]/90 backdrop-blur-xl border border-amber-500/35 hover:border-amber-400 hover:shadow-[0_12px_40px_rgba(212,175,55,0.3)] group hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between shadow-[0_8px_30px_rgba(0,0,0,0.7)] cursor-pointer"
            >
              {/* Top ambient highlight bar */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-transparent via-amber-400/80 to-transparent group-hover:w-full transition-all duration-500" />

              <div>
                {/* Image Banner Header with Badges */}
                <div className="relative mb-5 overflow-hidden rounded-2xl h-52 border border-amber-500/30 group-hover:border-amber-400/60 transition-colors shadow-inner">
                  <img
                    src={astro.image}
                    alt={astro.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = astrologerImages[index % 4] || "/websiteImage/Astrology1.jpg";
                    }}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e1026] via-transparent to-black/30" />

                  {/* Online / Busy Badge */}
                  {astro.isOnline ? (
                    <span className="absolute top-3 right-3 bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.5)] border border-emerald-400/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      ONLINE NOW
                    </span>
                  ) : (
                    <span className="absolute top-3 right-3 bg-gray-800/90 backdrop-blur-md text-slate-100 text-[10px] font-bold px-2.5 py-1 rounded-full border border-gray-600/40">
                      IN CONSULTATION
                    </span>
                  )}

                  {/* Rating Tag */}
                  <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-semibold text-amber-300 flex items-center gap-1 border border-amber-500/40 shadow-md">
                    <span className="text-yellow-400">★</span> {astro.rating}
                    <span className="text-[10px] text-slate-200 font-medium">({astro.reviewsCount})</span>
                  </div>
                </div>

                {/* Name & Title */}
                <h3 className="font-serif text-xl font-bold text-white mb-1 group-hover:text-amber-300 transition-colors leading-snug">
                  {astro.name}
                </h3>
                <p className="text-xs text-amber-400 font-medium mb-3">
                  {astro.title}
                </p>

                {/* Specialty Badges */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {astro.specialties.map((spec, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-[#16183a] text-amber-100 border border-amber-500/20 font-semibold"
                    >
                      ✦ {spec}
                    </span>
                  ))}
                </div>

                {/* Exp & Languages Info */}
                <div className="text-xs text-slate-200 space-y-1 mb-5 bg-[#080918] p-2.5 rounded-xl border border-amber-500/15">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 font-medium">Experience:</span>
                    <span className="text-amber-300 font-semibold">{astro.experienceYears}+ Years</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 font-medium">Languages:</span>
                    <span className="text-slate-100 font-semibold">{astro.languages.join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* Pricing & Consultation Button */}
              <div className="pt-4 border-t border-amber-500/20 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-amber-300 font-serif font-bold text-lg">₹{astro.pricePerMin}</span>
                    <span className="text-[11px] text-slate-300 font-medium">/min</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-medium">Free First 5 Mins</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent duplicate card click event
                    if (onOpenBooking) {
                      onOpenBooking(String(astro.id), astro.name);
                    } else {
                      router.push(`/astrologers/${astro.id}`);
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-black font-bold text-xs shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:scale-105 hover:shadow-[0_0_25px_rgba(255,215,0,0.5)] transition-all cursor-pointer"
                >
                  Consult Now
                </button>
              </div>

            </div>
          ))}
        </div>
        )}

        {/* ── Bottom Call To Action Banner ── */}
        <div className="mt-14 text-center">
          <Link
            href="/astrologers"
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#121430] to-[#1a1d45] border-2 border-amber-400/50 text-amber-300 font-bold text-sm hover:border-amber-300 hover:text-white hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] backdrop-blur-md transition-all duration-300"
          >
            <span>Meet All Certified Astrologers &amp; Gurus</span>
            <span className="text-amber-400 font-bold text-base">→</span>
          </Link>
        </div>

      </div>
    </section>
  );
}

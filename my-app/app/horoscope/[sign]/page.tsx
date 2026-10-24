import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { ZODIAC_SIGNS } from '../../data/astrologyData';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function HoroscopeDetailPage({
  params,
}: {
  params: Promise<{ sign: string }>;
}) {
  const { sign: signId } = await params;
  const sign = ZODIAC_SIGNS.find((s) => s.id.toLowerCase() === signId.toLowerCase());

  if (!sign) {
    return notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#080914] text-gray-200">
      <Header />

      <main className="flex-1 py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header Card */}
          <div className="glass-card rounded-3xl p-8 gold-border-glow border-amber-400/40 text-center relative overflow-hidden">
            <div className="text-7xl text-amber-300 mb-3">{sign.icon}</div>
            <h1 className="font-serif text-4xl font-bold text-white mb-2">
              {sign.name} <span className="gold-gradient-text">Horoscope Today</span>
            </h1>
            <p className="text-amber-400 text-sm font-medium">{sign.dates}</p>
            <div className="flex justify-center gap-4 text-xs text-gray-400 mt-3">
              <span>Element: <strong className="text-amber-300">{sign.element}</strong></span>
              <span>•</span>
              <span>Ruling Planet: <strong className="text-amber-300">{sign.rulingPlanet}</strong></span>
            </div>
          </div>

          {/* Today Prediction Card */}
          <div className="glass-card rounded-2xl p-6 border border-amber-500/20 space-y-4">
            <h2 className="font-serif text-xl font-bold text-white gold-gradient-text border-b border-amber-500/20 pb-2">
              ✦ Today's Cosmic Overview
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              {sign.todayPrediction}
            </p>
            <p className="text-gray-400 text-xs leading-relaxed">
              Planetary transits align favorably for personal development. Maintain balance between analytical thinking and intuitive feeling to navigate decisions effortlessly.
            </p>
          </div>

          {/* Life Dimensions Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-[#0c0e22] p-5 rounded-2xl border border-amber-500/20">
              <h3 className="font-serif text-sm font-bold text-amber-300 mb-2">💼 Career & Money</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Strong focus on professional goals. Strategic moves made today bring fruitful rewards in upcoming months.
              </p>
            </div>
            <div className="bg-[#0c0e22] p-5 rounded-2xl border border-amber-500/20">
              <h3 className="font-serif text-sm font-bold text-pink-400 mb-2">❤️ Love & Relationships</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Openhearted communication resolves past misunderstandings. Express your appreciation to your partner.
              </p>
            </div>
            <div className="bg-[#0c0e22] p-5 rounded-2xl border border-amber-500/20">
              <h3 className="font-serif text-sm font-bold text-emerald-400 mb-2">🌿 Health & Wellness</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                High vitality. Incorporate light yoga or evening walks to maintain optimal energetic flow.
              </p>
            </div>
          </div>

          <div className="text-center pt-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-amber-500/30 text-amber-400 text-xs font-semibold hover:bg-amber-500/10"
            >
              ← Back to All Zodiac Signs
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

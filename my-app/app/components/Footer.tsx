'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#05060d]/80 backdrop-blur-md border-t border-amber-500/30 pt-16 pb-8 text-slate-100 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="jyotara Logo"
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-xs leading-relaxed text-slate-200 font-medium">
              Guiding your life journey with authentic Vedic astrology, Kundli analysis, Vastu Shastra, and celestial horoscope predictions.
            </p>
            <div className="space-y-2 text-xs text-slate-200 font-medium">
              <p className="flex items-start gap-2">
                <span>📍</span>
                <span>First Floor, Office No. 102, Shakarpur, New Delhi - 110092</span>
              </p>
              <p className="flex items-center gap-2">
                <span>📞</span>
                <a href="tel:+919310238608" className="hover:text-amber-400 transition-colors">+91 9310238608</a>
              </p>
              <p className="flex items-center gap-2">
                <span>✉️</span>
                <a href="mailto:support@astronora.com" className="hover:text-amber-400 transition-colors">support@astronora.com</a>
              </p>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-serif font-semibold text-base mb-4 border-b border-amber-500/30 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-200 font-medium">
              <li><Link href="/about" className="hover:text-amber-400 transition-colors">About Us</Link></li>
              <li><Link href="/services" className="hover:text-amber-400 transition-colors">Our Services</Link></li>
              <li><Link href="/astrologers" className="hover:text-amber-400 transition-colors">Meet Astrologers</Link></li>
              <li><Link href="/appointments" className="hover:text-amber-400 transition-colors">Book Appointment</Link></li>
              <li><Link href="/shop" className="hover:text-amber-400 transition-colors">Spiritual Gemstones &amp; Yantras</Link></li>
              <li><Link href="/contact" className="hover:text-amber-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 3: Daily Horoscopes */}
          <div>
            <h4 className="text-white font-serif font-semibold text-base mb-4 border-b border-amber-500/30 pb-2">
              Horoscope Forecasts
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-200 font-medium">
              <li><Link href="/horoscope/aries" className="hover:text-amber-400 transition-colors">Aries Daily Horoscope</Link></li>
              <li><Link href="/horoscope/taurus" className="hover:text-amber-400 transition-colors">Taurus Daily Horoscope</Link></li>
              <li><Link href="/horoscope/gemini" className="hover:text-amber-400 transition-colors">Gemini Daily Horoscope</Link></li>
              <li><Link href="/horoscope/cancer" className="hover:text-amber-400 transition-colors">Cancer Daily Horoscope</Link></li>
              <li><Link href="/horoscope/leo" className="hover:text-amber-400 transition-colors">Leo Daily Horoscope</Link></li>
              <li><Link href="/services" className="hover:text-amber-400 transition-colors text-amber-300 font-semibold">View All 12 Signs →</Link></li>
            </ul>
          </div>

          {/* Column 4: 24/7 Vedic Support & Trust */}
          <div>
            <h4 className="text-white font-serif font-semibold text-base mb-4 border-b border-amber-500/30 pb-2">
              24/7 Celestial Support
            </h4>
            <p className="text-xs text-slate-200 font-medium mb-4 leading-relaxed">
              Connect with expert Vedic astrologers anytime. Live consultation available 24/7 with 100% privacy guarantee.
            </p>
            <div className="space-y-2 text-xs text-slate-200 font-medium">
              <div className="p-3 rounded-xl bg-[#0d0f21] border border-amber-500/20 flex items-center gap-3">
                <span className="text-xl">⚡</span>
                <div>
                  <p className="text-amber-300 font-semibold">24x7 Live Consultation</p>
                  <p className="text-[11px] text-slate-400">Audio, Video &amp; Chat</p>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#0d0f21] border border-amber-500/20 flex items-center gap-3">
                <span className="text-xl">🔒</span>
                <div>
                  <p className="text-amber-300 font-semibold">100% Privacy Assured</p>
                  <p className="text-[11px] text-slate-400">Confidential &amp; Secure</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-amber-500/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300 font-medium">
          <p>© {new Date().getFullYear()} jyotara / AstroNora. All Rights Reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-amber-400">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-amber-400">Terms of Service</Link>
            <span>•</span>
            <Link href="/refund" className="hover:text-amber-400">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

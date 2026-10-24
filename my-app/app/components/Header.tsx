'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import AppointmentModal from './AppointmentModal';

import { getCartCount } from '../utils/cart';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface HeaderProps {
  onOpenBooking?: () => void;
}

export default function Header({ onOpenBooking }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [internalModalOpen, setInternalModalOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setCartCount(getCartCount());
    const handleCartUpdate = () => {
      setCartCount(getCartCount());
    };

    window.addEventListener('cart_updated', handleCartUpdate);
    return () => {
      window.removeEventListener('cart_updated', handleCartUpdate);
    };
  }, []);

  const handleBookingClick = () => {
    if (onOpenBooking) {
      onOpenBooking();
    } else {
      setInternalModalOpen(true);
    }
  };
  const headerRef = useRef<HTMLElement>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const hoverPillRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const cursorOrbRef = useRef<HTMLDivElement>(null);

  // QuickTo functions for smooth mouse tracking
  const xTo = useRef<((val: number) => void) | null>(null);
  const yTo = useRef<((val: number) => void) | null>(null);

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = () => {
      if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          try {
            setUser(JSON.parse(userStr));
          } catch (e) {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    };
    checkUser();
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.dispatchEvent(new Event('storage'));
  };

  useEffect(() => {
    // Initialize quickTo for mouse interaction orb
    if (cursorOrbRef.current) {
      xTo.current = gsap.quickTo(cursorOrbRef.current, 'x', { duration: 0.4, ease: 'power3.out' });
      yTo.current = gsap.quickTo(cursorOrbRef.current, 'y', { duration: 0.4, ease: 'power3.out' });
    }

    const ctx = gsap.context(() => {
      // 1. GSAP Timeline - Initial Reveal & Nav Stagger
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        headerRef.current,
        { y: -60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 }
      )
        .fromTo(
          logoRef.current,
          { scale: 0.8, opacity: 0, rotation: -5 },
          { scale: 1, opacity: 1, rotation: 0, duration: 0.5 },
          '-=0.4'
        )
        .fromTo(
          '.nav-item-anim',
          { y: -20, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.08, duration: 0.5 },
          '-=0.3'
        )
        .fromTo(
          actionsRef.current,
          { scale: 0.85, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4 },
          '-=0.2'
        );

      // 2. Scroll Trigger - Scroll Shrink & Glassmorphic Elevation
      ScrollTrigger.create({
        start: 'top -20',
        end: 99999,
        onUpdate: (self) => {
          if (!navContainerRef.current || !headerRef.current) return;

          if (self.scroll() > 40) {
            // Shrink navbar height & enhance border glow
            gsap.to(navContainerRef.current, {
              height: '60px',
              duration: 0.4,
              ease: 'power2.out',
              overwrite: 'auto'
            });
            gsap.to(headerRef.current, {
              backgroundColor: 'rgba(5, 6, 15, 0.65)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
              borderColor: 'rgba(212, 175, 55, 0.4)',
              duration: 0.4,
              overwrite: 'auto'
            });
          } else {
            // Reset to default navbar size
            gsap.to(navContainerRef.current, {
              height: '80px',
              duration: 0.4,
              ease: 'power2.out',
              overwrite: 'auto'
            });
            gsap.to(headerRef.current, {
              backgroundColor: 'rgba(8, 9, 20, 0.5)',
              boxShadow: '0 0 0px rgba(0,0,0,0)',
              borderColor: 'rgba(212, 175, 55, 0.2)',
              duration: 0.4,
              overwrite: 'auto'
            });
          }
        }
      });
    }, headerRef);

    return () => ctx.revert();
  }, []);

  // 3. Mouse Interaction (gsap.quickTo tracking mouse glow)
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!headerRef.current || !xTo.current || !yTo.current) return;
    const rect = headerRef.current.getBoundingClientRect();
    xTo.current(e.clientX - rect.left - 60);
    yTo.current(e.clientY - rect.top - 60);
  };

  // 4. GSAP Hover Underline Pill Handler
  const handleMouseEnterLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!hoverPillRef.current || !navRef.current) return;
    const linkRect = e.currentTarget.getBoundingClientRect();
    const navRect = navRef.current.getBoundingClientRect();

    gsap.to(hoverPillRef.current, {
      x: linkRect.left - navRect.left,
      width: linkRect.width,
      opacity: 1,
      scaleX: 1,
      duration: 0.35,
      ease: 'back.out(1.7)',
      overwrite: 'auto'
    });
  };

  const handleMouseLeaveNav = () => {
    if (!hoverPillRef.current) return;
    gsap.to(hoverPillRef.current, {
      opacity: 0,
      scaleX: 0.5,
      duration: 0.25,
      ease: 'power2.in',
      overwrite: 'auto'
    });
  };

  return (
    <>
      <header
        ref={headerRef}
        onMouseMove={handleMouseMove}
        className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#080914]/50 border-b border-amber-500/20 relative overflow-hidden transition-all"
      >
      {/* Interactive Mouse Glow Orb (gsap.quickTo) */}
      <div
        ref={cursorOrbRef}
        className="absolute w-32 h-32 bg-amber-500/15 rounded-full blur-2xl pointer-events-none -top-10 -left-10 z-0"
      />

      {/* Top Notification / Contact Bar */}
      <div className="hidden md:block bg-[#0f1226]/60 border-b border-amber-500/10 text-xs py-2 px-4 text-slate-100 font-medium relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <a href="tel:+919310238608" className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
              <span>📞</span> +91 9310238608
            </a>
            <span className="hidden sm:inline text-amber-500/40">|</span>
            <a href="mailto:support@astronora.com" className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
              <span>✉️</span> support@astronora.com
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-amber-400 font-medium hidden md:inline">⚡ First Consultation 50% OFF</span>
            {user ? (
              <div className="flex items-center gap-2.5">
                <Link
                  href="/profile"
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-amber-600/20 border border-amber-500/40 text-amber-300 hover:text-white hover:border-amber-400 text-xs font-semibold shadow-[0_0_12px_rgba(212,175,55,0.25)] transition-all cursor-pointer hover:scale-105"
                  title="View My Profile & Appointments"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>👤 {user.fullName}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 rounded-full bg-red-500/10 hover:bg-red-500/25 border border-red-500/30 hover:border-red-500/60 text-red-300 hover:text-white text-xs font-bold transition-all duration-300 flex items-center gap-1 cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] hover:scale-105 active:scale-95"
                  title="Logout Account"
                >
                  <span>Logout</span>
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M16 17v-3H9v-4h7V7l5 5-5 5M14 2a2 2 0 012 2v2h-2V4H4v16h10v-2h2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2h10z"/>
                  </svg>
                </button>
              </div>
            ) : (
              <Link href="/login" className="hover:text-amber-400 transition-colors font-semibold">
                Login / Register
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div ref={navContainerRef} className="flex items-center justify-between h-20 transition-all">
          {/* Brand Logo */}
          <Link ref={logoRef} href="/" className="flex items-center gap-3 group">
            <img
              src="/logo.png"
              alt="jyotara Logo"
              className="h-12 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation Links with GSAP Hover Underline Indicator */}
          <div className="hidden md:flex items-center relative">
            <nav
              ref={navRef}
              onMouseLeave={handleMouseLeaveNav}
              className="flex items-center gap-7 text-sm font-semibold text-slate-100 relative py-2"
            >
              {/* Sliding Underline Indicator Pill */}
              <div
                ref={hoverPillRef}
                className="absolute bottom-0 h-0.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 rounded-full opacity-0 pointer-events-none shadow-[0_0_10px_rgba(255,215,0,0.8)]"
              />

              <Link
                href="/"
                onMouseEnter={handleMouseEnterLink}
                className="nav-item-anim hover:text-amber-300 transition-colors py-1 px-1"
              >
                Home
              </Link>
              <Link
                href="/about"
                onMouseEnter={handleMouseEnterLink}
                className="nav-item-anim hover:text-amber-300 transition-colors py-1 px-1"
              >
                About Us
              </Link>
              <Link
                href="/services"
                onMouseEnter={handleMouseEnterLink}
                className="nav-item-anim hover:text-amber-300 transition-colors py-1 px-1"
              >
                Services
              </Link>
              <Link
                href="/astrologers"
                onMouseEnter={handleMouseEnterLink}
                className="nav-item-anim hover:text-amber-300 transition-colors py-1 px-1 flex items-center gap-1.5"
              >
                Astrologers
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </Link>
              <Link
                href="/shop"
                onMouseEnter={handleMouseEnterLink}
                className="nav-item-anim hover:text-amber-300 transition-colors py-1 px-1"
              >
                Shop
              </Link>
              <Link
                href="/contact"
                onMouseEnter={handleMouseEnterLink}
                className="nav-item-anim hover:text-amber-300 transition-colors py-1 px-1"
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Action CTAs */}
          <div ref={actionsRef} className="hidden lg:flex items-center gap-4">
            <Link href="/cart" className="relative p-2 text-gray-300 hover:text-amber-400 transition-colors">
              <span className="text-xl">🛒</span>
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-black text-xs font-bold flex items-center justify-center">
                {cartCount}
              </span>
            </Link>

            <button
              onClick={handleBookingClick}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-black font-semibold text-sm shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_25px_rgba(255,215,0,0.6)] hover:scale-105 transition-all cursor-pointer"
            >
              Book Appointment ✦
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xl"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0d0f21]/70 backdrop-blur-md border-b border-amber-500/20 px-6 py-6 space-y-4">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block text-gray-200 hover:text-amber-400 py-1">
            Home
          </Link>
          <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block text-gray-200 hover:text-amber-400 py-1">
            About Us
          </Link>
          <Link href="/services" onClick={() => setMobileMenuOpen(false)} className="block text-gray-200 hover:text-amber-400 py-1">
            Services
          </Link>
          <Link href="/astrologers" onClick={() => setMobileMenuOpen(false)} className="block text-gray-200 hover:text-amber-400 py-1">
            Astrologers
          </Link>
          <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="block text-gray-200 hover:text-amber-400 py-1">
            Shop
          </Link>
          <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block text-gray-200 hover:text-amber-400 py-1">
            Contact
          </Link>
          <div className="pt-4 border-t border-amber-500/20 flex flex-col gap-3">
            {user ? (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#080918] border border-amber-500/20">
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-amber-300 hover:text-amber-200 text-xs font-semibold"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>👤 {user.fullName}</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-full bg-red-500/15 hover:bg-red-500/30 border border-red-500/40 text-red-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <span>Logout</span>
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M16 17v-3H9v-4h7V7l5 5-5 5M14 2a2 2 0 012 2v2h-2V4H4v16h10v-2h2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2h10z"/>
                  </svg>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center text-xs text-amber-400 font-bold hover:underline py-1"
              >
                Login / Register Account
              </Link>
            )}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleBookingClick();
              }}
              className="w-full py-3 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-semibold text-center cursor-pointer"
            >
              Book Appointment
            </button>
          </div>
        </div>
      )}
    </header>

    {/* Fallback modal if onOpenBooking is not passed from parent page */}
    <AppointmentModal
      isOpen={internalModalOpen}
      onClose={() => setInternalModalOpen(false)}
    />
  </>
);
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface ServiceItem {
  name: string;
  description?: string;
  price?: number;
}

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAstrologerId?: string;
  selectedAstrologerName?: string;
  servicesList?: ServiceItem[];
}

export default function AppointmentModal({
  isOpen,
  onClose,
  selectedAstrologerId,
  selectedAstrologerName,
  servicesList = [],
}: AppointmentModalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    appointmentDate: '',
    appointmentTime: '',
    phoneNumber: '',
    service: '',
    astrologer: selectedAstrologerId || '',
    astrologerName: selectedAstrologerName || '',
    message: '',
  });

  const [astrologersList, setAstrologersList] = useState<any[]>([]);
  const [fetchedServices, setFetchedServices] = useState<string[]>([]);
  const [astroDisplayName, setAstroDisplayName] = useState<string>(selectedAstrologerName || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Compute active services list with strict priority:
  // 1. servicesList passed as prop
  // 2. fetchedServices from backend API for this astrologer
  // 3. Default fallback list (only if no astrologer selected)
  const defaultServices = [
    'Detailed Kundli Reading',
    'Kundli Analysis & Chart',
    'Horoscope & Planetary Transit',
    'Vastu Shastra Consultation',
    'Love & Relationship Guidance',
    'Career & Business Growth',
    'Numerology & Name Correction',
  ];

  let activeServicesList: string[] = [];
  if (Array.isArray(servicesList) && servicesList.length > 0) {
    activeServicesList = servicesList.map((s: any) => (typeof s === 'string' ? s : s.name)).filter(Boolean);
  } else if (fetchedServices.length > 0) {
    activeServicesList = fetchedServices;
  } else if (!selectedAstrologerId) {
    activeServicesList = defaultServices;
  }

  // Sync pre-selected astrologer & fetch their specific profile/services when modal opens
  useEffect(() => {
    if (!isOpen) return;

    if (selectedAstrologerId) {
      setFormData((prev) => ({
        ...prev,
        astrologer: selectedAstrologerId,
        astrologerName: selectedAstrologerName || '',
      }));
      setAstroDisplayName(selectedAstrologerName || '');

      // Fetch specific profile from backend if servicesList wasn't passed directly
      if (!servicesList || servicesList.length === 0) {
        fetch(`http://localhost:5000/api/astrologer/profile/${selectedAstrologerId}`)
          .then((res) => res.json())
          .then((json) => {
            if (json.success && json.data) {
              const data = json.data;
              setAstroDisplayName(data.displayName || data.userId?.fullName || selectedAstrologerName || '');
              
              let svcs: string[] = [];
              if (Array.isArray(data.services) && data.services.length > 0) {
                svcs = data.services.map((s: any) => s.name).filter(Boolean);
              }
              if (svcs.length === 0 && Array.isArray(data.specialization) && data.specialization.length > 0) {
                svcs = data.specialization;
              }

              if (svcs.length > 0) {
                setFetchedServices(svcs);
              }
            }
          })
          .catch((err) => console.warn('Could not fetch astrologer specific profile:', err));
      }
    } else {
      // General list for fallback dropdown
      fetch('http://localhost:5000/api/astrologer/public')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) {
            setAstrologersList(data.data);
          }
        })
        .catch((err) => console.error('Error fetching astrologers:', err));
    }
  }, [isOpen, selectedAstrologerId, selectedAstrologerName]);

  // Set default selected service whenever activeServicesList updates
  useEffect(() => {
    if (activeServicesList.length > 0 && !formData.service) {
      setFormData((prev) => ({ ...prev, service: activeServicesList[0] }));
    }
  }, [activeServicesList]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let loggedInUserId = null;
      if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          try {
            const userObj = JSON.parse(userStr);
            loggedInUserId = userObj.id || userObj._id;
          } catch (e) {}
        }
      }

      const res = await fetch('http://localhost:5000/api/appointments/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phoneNumber,
          appointmentDate: formData.appointmentDate,
          appointmentTime: formData.appointmentTime,
          service: formData.service || activeServicesList[0] || 'Astrology Consultation',
          astrologer: astroDisplayName || formData.astrologer || 'Selected Astrologer',
          astrologerId: selectedAstrologerId || (formData.astrologer.match(/^[0-9a-fA-F]{24}$/) ? formData.astrologer : null),
          userId: loggedInUserId,
          message: formData.message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to book appointment');
      }

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative rounded-3xl p-5 sm:p-7 max-w-2xl w-full bg-[#0d0f26] border border-amber-500/35 shadow-[0_0_50px_rgba(212,175,55,0.3)] my-auto max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center hover:bg-amber-400 hover:text-black transition-colors z-10"
        >
          ✕
        </button>

        {submitted ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-3xl mx-auto border border-emerald-500/40">
              ✓
            </div>
            <h3 className="font-serif text-2xl font-bold text-white">
              Appointment <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">Booked Successfully!</span>
            </h3>
            <p className="text-slate-200 text-sm leading-relaxed max-w-md mx-auto">
              Thank you, <span className="text-amber-300 font-semibold">{formData.fullName || 'Valued Client'}</span>! Your appointment request has been submitted to <span className="text-amber-300 font-semibold">{astroDisplayName || 'the Astrologer'}</span>.
            </p>
          </div>
        ) : (
          <div>
            {/* Form Header */}
            <div className="text-center mb-6">
              <span className="text-amber-400 text-xs font-semibold uppercase tracking-widest block mb-1">
                ✦ LIVE VEDIC CONSULTATION ✦
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Book Your <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">Astrologer Appointment</span>
              </h3>
              
              {/* Display locked pre-selected astrologer banner if opened from profile */}
              {selectedAstrologerId && (
                <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Booking Consultation with: <strong className="text-white font-serif">{astroDisplayName || 'Astrologer'}</strong>
                </div>
              )}
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-medium text-center">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Full Name */}
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Full Name *"
                    className="w-full px-4 py-3 rounded-xl bg-[#080918] border border-amber-500/25 text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 pr-10 text-xs font-medium"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">👤</span>
                </div>

                {/* Email Address */}
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Email Address *"
                    className="w-full px-4 py-3 rounded-xl bg-[#080918] border border-amber-500/25 text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 pr-10 text-xs font-medium"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">✉️</span>
                </div>

                {/* Appointment Date */}
                <div className="relative">
                  <input
                    type="text"
                    required
                    onFocus={(e) => (e.target.type = 'date')}
                    onBlur={(e) => {
                      if (!e.target.value) e.target.type = 'text';
                    }}
                    value={formData.appointmentDate}
                    onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                    placeholder="Appointment Date (DD/MM/YYYY) *"
                    className="w-full px-4 py-3 rounded-xl bg-[#080918] border border-amber-500/25 text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 pr-10 text-xs font-medium"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">📅</span>
                </div>

                {/* Select Appointment Time Slot */}
                <div className="relative">
                  <select
                    required
                    value={formData.appointmentTime}
                    onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#080918] border border-amber-500/25 text-white focus:outline-none focus:border-amber-400 pr-10 text-xs font-medium appearance-none"
                  >
                    <option value="" className="text-slate-400">-- Select Appointment Time --</option>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="02:30 PM">02:30 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                    <option value="06:00 PM">06:00 PM</option>
                    <option value="08:00 PM">08:00 PM</option>
                  </select>
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">🕒</span>
                </div>

                {/* Phone Number */}
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder="Phone Number *"
                    className="w-full px-4 py-3 rounded-xl bg-[#080918] border border-amber-500/25 text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 pr-10 text-xs font-medium"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">📞</span>
                </div>

                {/* Select Service (Strictly filtered to ONLY this astrologer's services) */}
                <div className="relative">
                  <select
                    required
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#080918] border border-amber-500/25 text-white focus:outline-none focus:border-amber-400 pr-10 text-xs font-medium appearance-none"
                  >
                    {activeServicesList.length === 0 && <option value="">No services available</option>}
                    {activeServicesList.map((svcName, idx) => (
                      <option key={idx} value={svcName}>
                        {svcName}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none">▼</span>
                </div>

                {/* Choose Astrologer Dropdown (HIDDEN IF PRE-SELECTED FROM PROFILE) */}
                {!selectedAstrologerId && (
                  <div className="relative sm:col-span-2">
                    <select
                      value={formData.astrologer}
                      onChange={(e) => setFormData({ ...formData, astrologer: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#080918] border border-amber-500/25 text-white focus:outline-none focus:border-amber-400 pr-10 text-xs font-medium appearance-none"
                    >
                      <option value="">Choose Astrologer</option>
                      <option value="Any Available Expert Astrologer">Any Available Expert Astrologer</option>
                      {astrologersList.map((astro) => (
                        <option key={astro._id} value={astro.userId?._id || astro.userId}>
                          {astro.displayName || astro.userId?.fullName} ({astro.professionalTitle || 'Astrologer'})
                        </option>
                      ))}
                    </select>
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none">▼</span>
                  </div>
                )}
              </div>

              {/* Message / Questions Textarea */}
              <div className="pt-1">
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Your message or specific questions (optional)"
                  className="w-full px-4 py-3 rounded-xl bg-[#080918] border border-amber-500/25 text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 text-xs font-medium resize-none"
                />
              </div>

              {/* Book Now Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-black font-bold text-sm shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:brightness-110 hover:scale-[1.01] transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Booking Appointment...' : 'Book Now'}
                </button>
              </div>

              {/* Login Link Footer */}
              <div className="pt-2 text-left">
                <Link href="/login" className="text-xs text-amber-400 hover:text-amber-300 underline font-medium">
                  Login to manage your appointments easily.
                </Link>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

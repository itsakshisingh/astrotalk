'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AppointmentModal from '../components/AppointmentModal';

export default function RegisterPage() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    gender: 'Male',
    role: 'user', // Allowed on website register: 'user', 'astrologer'
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData({ ...formData, mobileNumber: cleaned });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.mobileNumber.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please re-check.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          mobile: formData.mobileNumber,
          gender: formData.gender.toLowerCase(),
          role: formData.role,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setSuccessMsg(data.message || 'Account Created Successfully!');
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2500);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080914] text-slate-100 font-sans">
      <Header onOpenBooking={() => setModalOpen(true)} />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background glow orbs */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative w-full max-w-lg rounded-3xl p-6 sm:p-8 bg-[#0d0f26]/95 border border-amber-500/35 shadow-[0_0_50px_rgba(212,175,55,0.2)] backdrop-blur-xl">
          
          {/* Top Auth Tab Selector */}
          <div className="flex rounded-2xl bg-[#060712] p-1.5 border border-amber-500/20 mb-8">
            <Link
              href="/login"
              className="flex-1 py-2.5 text-center text-xs font-semibold rounded-xl text-slate-300 hover:text-white transition-colors"
            >
              Login
            </Link>
            <button
              className="flex-1 py-2.5 text-center text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-md"
            >
              Register
            </button>
          </div>

          {/* Form Header */}
          <div className="text-center mb-6">
            <span className="text-amber-400 text-xs font-semibold uppercase tracking-widest block mb-1">
              ✦ CREATE YOUR ACCOUNT ✦
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Join <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">jyotara</span>
            </h1>
            <p className="text-xs text-slate-200 mt-1 font-medium">
              Select your role and create an account.
            </p>
          </div>

          {success ? (
            <div className="py-10 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-3xl mx-auto border border-emerald-500/40">
                ✓
              </div>
              <h3 className="font-serif text-2xl font-bold text-white">
                Account <span className="text-amber-400">Created Successfully!</span>
              </h3>
              <p className="text-slate-200 text-xs leading-relaxed max-w-xs mx-auto">
                {successMsg} Redirecting you to the login page...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {error && (
                <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-medium text-center">
                  ⚠️ {error}
                </div>
              )}

              {/* Role Selection (Only User and Astrologer) */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Select Role <span className="text-amber-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'user', label: '👤 User' },
                    { id: 'astrologer', label: '🔮 Astrologer' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: r.id })}
                      className={`py-3 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        formData.role === r.id
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                          : 'bg-[#080918] border-amber-500/20 text-slate-300 hover:border-amber-500/40'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Full Name <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-xl bg-[#080918] border border-amber-500/25 text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 text-xs font-medium pr-10"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">👤</span>
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Email Address <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-[#080918] border border-amber-500/25 text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 text-xs font-medium pr-10"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">✉️</span>
                </div>
              </div>

              {/* Mobile Number with Country Code */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Mobile Number <span className="text-amber-400">*</span>
                </label>
                <div className="flex gap-2">
                  <div className="px-3.5 py-3 rounded-xl bg-[#080918] border border-amber-500/25 text-amber-300 font-bold text-xs flex items-center gap-1 shrink-0">
                    <span>🇮🇳</span>
                    <span>IN +91</span>
                  </div>
                  <input
                    type="tel"
                    required
                    value={formData.mobileNumber}
                    onChange={handleMobileChange}
                    placeholder="Enter 10 digit mobile number"
                    className="flex-1 px-4 py-3 rounded-xl bg-[#080918] border border-amber-500/25 text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 text-xs font-medium"
                  />
                </div>
              </div>

              {/* Gender Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Gender <span className="text-amber-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['Male', 'Female', 'Other'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: g })}
                      className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                        formData.gender === g
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                          : 'bg-[#080918] border-amber-500/20 text-slate-300 hover:border-amber-500/40'
                      }`}
                    >
                      {g === 'Male' ? '👨 Male' : g === 'Female' ? '👩 Female' : '🧑 Other'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Password <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Create strong password"
                    className="w-full px-4 py-3 rounded-xl bg-[#080918] border border-amber-500/25 text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 text-xs font-medium pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"
                  >
                    {showPassword ? '👁️' : '🔒'}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Confirm Password <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Re-enter password"
                    className="w-full px-4 py-3 rounded-xl bg-[#080918] border border-amber-500/25 text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 text-xs font-medium pr-10"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">🔒</span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-black font-bold text-sm shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:brightness-110 hover:scale-[1.01] transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Registering Account...' : 'Create Account ✦'}
                </button>
              </div>

              {/* Already have account */}
              <div className="pt-3 text-center text-xs text-slate-300">
                Already have an account?{' '}
                <Link href="/login" className="text-amber-400 font-bold hover:underline">
                  Login here
                </Link>
              </div>

            </form>
          )}

        </div>
      </main>

      <AppointmentModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <Footer />
    </div>
  );
}

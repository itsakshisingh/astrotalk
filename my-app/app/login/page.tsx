'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AppointmentModal from '../components/AppointmentModal';

export default function LoginPage() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    rememberMe: true,
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.identifier.trim()) {
      setError('Please enter your Email or Mobile Number.');
      return;
    }

    if (!formData.password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: formData.identifier.trim(),
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save token and user details to localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.data));
        window.dispatchEvent(new Event('storage'));
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Something went wrong during login.');
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

        <div className="relative w-full max-w-md rounded-3xl p-6 sm:p-8 bg-[#0d0f26]/95 border border-amber-500/35 shadow-[0_0_50px_rgba(212,175,55,0.2)] backdrop-blur-xl">
          
          {/* Top Auth Tab Selector */}
          <div className="flex rounded-2xl bg-[#060712] p-1.5 border border-amber-500/20 mb-8">
            <button
              className="flex-1 py-2.5 text-center text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-md"
            >
              Login
            </button>
            <Link
              href="/register"
              className="flex-1 py-2.5 text-center text-xs font-semibold rounded-xl text-slate-300 hover:text-white transition-colors"
            >
              Register
            </Link>
          </div>

          {/* Form Header */}
          <div className="text-center mb-6">
            <span className="text-amber-400 text-xs font-semibold uppercase tracking-widest block mb-1">
              ✦ WELCOME BACK ✦
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Login to <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">jyotara</span>
            </h1>
            <p className="text-xs text-slate-200 mt-1 font-medium">
              Access your consultations, birth charts, and appointments.
            </p>
          </div>

          {success ? (
            <div className="py-10 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-3xl mx-auto border border-emerald-500/40">
                ✓
              </div>
              <h3 className="font-serif text-2xl font-bold text-white">
                Logged In <span className="text-amber-400">Successfully!</span>
              </h3>
              <p className="text-slate-200 text-xs leading-relaxed max-w-xs mx-auto">
                Welcome back. Redirecting to Homepage...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {error && (
                <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-medium text-center">
                  ⚠️ {error}
                </div>
              )}

              {/* Email or Mobile */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Email / Mobile Number <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.identifier}
                    onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                    placeholder="Enter email or 10-digit mobile number"
                    className="w-full px-4 py-3 rounded-xl bg-[#080918] border border-amber-500/25 text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 text-xs font-medium pr-10"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">✉️</span>
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-200">
                    Password <span className="text-amber-400">*</span>
                  </label>
                  <a href="#" className="text-[11px] text-amber-400 hover:underline">
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter your password"
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

              {/* Remember Me */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                  className="rounded border-amber-500/30 text-amber-500 focus:ring-amber-500 bg-[#080918]"
                />
                <label htmlFor="rememberMe" className="text-xs text-slate-300 font-medium">
                  Remember me on this device
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-black font-bold text-sm shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:brightness-110 hover:scale-[1.01] transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Logging in...' : 'Login to Account ✦'}
                </button>
              </div>

              {/* Register Redirect */}
              <div className="pt-3 text-center text-xs text-slate-300">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-amber-400 font-bold hover:underline">
                  Register Now
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

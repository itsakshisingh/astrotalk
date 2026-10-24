import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#080914] text-gray-200">
      <Header />

      <main className="flex-1">
        <section className="py-16 px-4 bg-gradient-to-b from-[#0d0f26] to-[#080914] border-b border-amber-500/20 text-center">
          <div className="max-w-4xl mx-auto">
            <span className="text-amber-400 font-medium text-xs uppercase tracking-widest block mb-2">
              ✦ Get In Touch ✦
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">
              Contact <span className="gold-gradient-text">jyotara</span>
            </h1>
            <p className="text-gray-300 text-sm max-w-2xl mx-auto leading-relaxed font-light">
              Have questions regarding your appointment, Kundli reports, or spiritual order? We are available 24/7.
            </p>
          </div>
        </section>

        <section className="py-20 px-4 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Details */}
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-bold text-white">
              We'd Love To <span className="gold-gradient-text">Hear From You</span>
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              Reach out to our customer support team or visit our head office in Delhi.
            </p>

            <div className="space-y-4 text-xs">
              <div className="glass-card p-4 rounded-xl border border-amber-500/20 flex items-start gap-4">
                <span className="text-2xl">📍</span>
                <div>
                  <h4 className="font-semibold text-white">Office Address</h4>
                  <p className="text-gray-400 mt-0.5">First Floor, Office No. 102, 13A, Veer Savarkar Block, Shakarpur, New Delhi - 110092</p>
                </div>
              </div>

              <div className="glass-card p-4 rounded-xl border border-amber-500/20 flex items-center gap-4">
                <span className="text-2xl">📞</span>
                <div>
                  <h4 className="font-semibold text-white">Phone Support</h4>
                  <p className="text-gray-400 mt-0.5">+91 9310238608 (24/7 Helpline)</p>
                </div>
              </div>

              <div className="glass-card p-4 rounded-xl border border-amber-500/20 flex items-center gap-4">
                <span className="text-2xl">✉️</span>
                <div>
                  <h4 className="font-semibold text-white">Email Address</h4>
                  <p className="text-gray-400 mt-0.5">support@astronora.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass-card p-8 rounded-3xl gold-border-glow border-amber-400/30">
            <h3 className="font-serif text-xl font-bold text-white mb-6">
              Send Us A <span className="gold-gradient-text">Message</span>
            </h3>

            <form className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-medium mb-1">Your Name</label>
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0b0d1e] border border-amber-500/30 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-medium mb-1">Email / Phone</label>
                <input
                  type="text"
                  placeholder="Email or Mobile Number"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0b0d1e] border border-amber-500/30 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-medium mb-1">Message</label>
                <textarea
                  rows={4}
                  placeholder="How can we assist you?"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0b0d1e] border border-amber-500/30 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="button"
                className="w-full py-3 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold text-xs shadow-md hover:scale-[1.01] transition-all"
              >
                Send Message ✦
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import AppointmentModal from '../../components/AppointmentModal';

interface ServiceItem {
  name: string;
  description?: string;
  price: number;
  duration: number;
  durationUnit?: string;
}

interface EducationItem {
  degree: string;
  institution: string;
  year?: number | string;
}

interface CertItem {
  name: string;
  issuingOrganization: string;
  year?: number | string;
  certificateUrl?: string;
}

export default function AstrologerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [astro, setAstro] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function fetchAstrologerDetails() {
      setLoading(true);
      try {
        // Try fetching specific profile by ID first
        let res = await fetch(`http://localhost:5000/api/astrologer/profile/${id}`);
        let json = await res.json();

        if (json.success && json.data) {
          setAstro(json.data);
        } else {
          // Fallback: search in public list
          res = await fetch("http://localhost:5000/api/astrologer/public");
          json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            const found = json.data.find(
              (item: any) =>
                item._id === id ||
                item.userId?._id === id ||
                item.userId === id
            );
            if (found) setAstro(found);
            else if (json.data.length > 0) setAstro(json.data[0]);
          }
        }
      } catch (err) {
        console.warn("Failed to fetch astrologer profile details:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAstrologerDetails();
  }, [id]);

  const userObj = astro?.userId || {};
  const name = astro?.displayName || userObj.fullName || "Certified Astrologer";
  const title = astro?.professionalTitle || "Senior Vedic & Nadi Astrologer";
  const bio = astro?.bio || "Experienced Vedic astrologer providing accurate Kundli analysis, horoscope readings, matchmaking, and cosmic guidance for life solutions.";
  const experience = astro?.experience || 10;
  const fee = astro?.consultationFee || 45;
  const unit = astro?.consultationUnit || "minute";
  const specializations: string[] = Array.isArray(astro?.specialization) && astro.specialization.length ? astro.specialization : ["Vedic Astrology", "Kundli Analysis", "Tarot Reading", "Numerology"];
  const languages: string[] = Array.isArray(astro?.languages) && astro.languages.length ? astro.languages : ["Hindi", "English"];
  const services: ServiceItem[] = Array.isArray(astro?.services) ? astro.services : [];
  const education: EducationItem[] = Array.isArray(astro?.education) ? astro.education : [];
  const certifications: CertItem[] = Array.isArray(astro?.certifications) ? astro.certifications : [];
  
  const imgPath = userObj.profileImage || astro?.profileImage;
  const profileImg = imgPath
    ? (imgPath.startsWith("http") ? imgPath : `http://localhost:5000${imgPath}`)
    : "/websiteImage/Astrology1.jpg";

  return (
    <div className="min-h-screen flex flex-col bg-[#080914] text-slate-100 font-sans">
      <Header onOpenBooking={() => setModalOpen(true)} />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        {/* Back Link */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
          >
            ← Back to Astrologers
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm">Loading astrologer details...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Top Profile Banner Card */}
            <div className="rounded-3xl p-6 sm:p-8 bg-[#0e1026]/90 backdrop-blur-xl border border-amber-500/35 shadow-[0_12px_40px_rgba(0,0,0,0.8)] relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600" />
              
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start">
                {/* Profile Photo */}
                <div className="relative shrink-0">
                  <div className="h-44 w-44 rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-xl">
                    <img
                      src={profileImg}
                      alt={name}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = "/websiteImage/Astrology1.jpg"; }}
                    />
                  </div>
                  <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full border border-emerald-400/50 shadow-md uppercase tracking-wider">
                    ONLINE NOW
                  </span>
                </div>

                {/* Main Details */}
                <div className="flex-1 text-center md:text-left space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold">
                    ★ 4.9 Rating (1420+ Consultations)
                  </div>
                  
                  <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
                    {name}
                  </h1>
                  
                  <p className="text-sm text-amber-400 font-medium">{title}</p>

                  <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-1">
                    {specializations.map((spec, i) => (
                      <span key={i} className="text-xs bg-[#16183a] text-amber-200 border border-amber-500/20 px-3 py-1 rounded-lg">
                        ✦ {spec}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 flex flex-wrap justify-center md:justify-start gap-6 text-xs text-slate-300 border-t border-amber-500/15">
                    <div><span className="text-slate-400">Experience:</span> <strong className="text-amber-300">{experience}+ Years</strong></div>
                    <div><span className="text-slate-400">Languages:</span> <strong className="text-slate-100">{languages.join(", ")}</strong></div>
                    <div><span className="text-slate-400">Consultation:</span> <strong className="text-amber-300">₹{fee} / {unit}</strong></div>
                  </div>
                </div>

                {/* Consult CTA Button */}
                <div className="shrink-0 flex flex-col items-center justify-center gap-2 pt-4 md:pt-0">
                  <div className="text-center">
                    <span className="text-2xl font-serif font-bold text-amber-300">₹{fee}</span>
                    <span className="text-xs text-slate-400"> / min</span>
                    <p className="text-[10px] text-emerald-400">First 5 Mins Free</p>
                  </div>
                  <button
                    onClick={() => setModalOpen(true)}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-black font-bold text-sm shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-105 transition-all cursor-pointer"
                  >
                    Consult Now
                  </button>
                </div>
              </div>
            </div>

            {/* About / Bio Section */}
            <div className="rounded-3xl p-6 sm:p-8 bg-[#0e1026]/90 backdrop-blur-xl border border-amber-500/20 space-y-3">
              <h2 className="font-serif text-xl font-bold text-amber-300 flex items-center gap-2">
                <span>✦</span> About {name}
              </h2>
              <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-line">
                {bio}
              </p>
            </div>

            {/* Services Offered Section */}
            {services.length > 0 && (
              <div className="rounded-3xl p-6 sm:p-8 bg-[#0e1026]/90 backdrop-blur-xl border border-amber-500/20 space-y-4">
                <h2 className="font-serif text-xl font-bold text-amber-300 flex items-center gap-2">
                  <span>✦</span> Services Offered
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {services.map((svc, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-[#080918] border border-amber-500/20 space-y-1.5">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-slate-100 text-base">{svc.name}</h3>
                        <span className="text-amber-300 font-bold text-sm">₹{svc.price}</span>
                      </div>
                      {svc.description && <p className="text-xs text-slate-300 leading-normal">{svc.description}</p>}
                      <p className="text-[11px] text-slate-400 pt-1">Duration: {svc.duration} {svc.durationUnit || "mins"}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education & Certifications Section */}
            {(education.length > 0 || certifications.length > 0) && (
              <div className="grid md:grid-cols-2 gap-6">
                {education.length > 0 && (
                  <div className="rounded-3xl p-6 bg-[#0e1026]/90 backdrop-blur-xl border border-amber-500/20 space-y-3">
                    <h2 className="font-serif text-lg font-bold text-amber-300">🎓 Education & Degrees</h2>
                    <div className="space-y-2.5">
                      {education.map((edu, i) => (
                        <div key={i} className="p-3 rounded-xl bg-[#080918] border border-slate-800 text-xs">
                          <p className="font-semibold text-slate-100">{edu.degree}</p>
                          <p className="text-slate-400">{edu.institution} {edu.year ? `(${edu.year})` : ""}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {certifications.length > 0 && (
                  <div className="rounded-3xl p-6 bg-[#0e1026]/90 backdrop-blur-xl border border-amber-500/20 space-y-3">
                    <h2 className="font-serif text-lg font-bold text-amber-300">📜 Certifications</h2>
                    <div className="space-y-2.5">
                      {certifications.map((cert, i) => (
                        <div key={i} className="p-3 rounded-xl bg-[#080918] border border-slate-800 text-xs space-y-1">
                          <p className="font-semibold text-slate-100">{cert.name}</p>
                          <p className="text-slate-400">{cert.issuingOrganization} {cert.year ? `(${cert.year})` : ""}</p>
                          {cert.certificateUrl && (
                            <a
                              href={cert.certificateUrl.startsWith("http") ? cert.certificateUrl : `http://localhost:5000${cert.certificateUrl}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-amber-400 underline inline-block mt-1 hover:text-amber-300"
                            >
                              View Certificate Document →
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      <AppointmentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedAstrologerId={id}
        selectedAstrologerName={name}
        servicesList={services}
      />

      <Footer />
    </div>
  );
}

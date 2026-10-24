import React, { useState, useEffect, useRef } from "react";
import {
  Upload, Mail, Globe, ArrowUpRight, Loader2, CheckCircle2,
  AlertCircle, Plus, Trash2, Phone, MapPin, Link2, Briefcase,
  GraduationCap, Star, Layers, X, Camera, Edit3, ArrowLeft,
  User, ShieldCheck, Key
} from "lucide-react";
import { Badge, initials } from "../components/ui";
import { SPECIALIZATIONS } from "../data/mockData";
import { useApp } from "../context/AppContext";
import api from "../api/axios";

// ─── Reusable Field Component ──────────────────────────────────────

function Field({ label, value, onChange, type = "text", placeholder = "", disabled = false }) {
  return (
    <div>
      <label className="text-xs text-slate-400 mb-1.5 block">{label}</label>
      <input
        type={type}
        value={value ?? ""}
        disabled={disabled}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400/40 placeholder:text-slate-600 ${disabled ? "opacity-60 cursor-not-allowed bg-slate-900" : ""}`}
      />
    </div>
  );
}

function SectionHeader({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-2 pt-2 pb-1 border-b border-slate-800 mb-4">
      <Icon size={15} className="text-amber-400 shrink-0" />
      <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">{title}</span>
    </div>
  );
}

function TagInput({ label, tags, onChange }) {
  const [input, setInput] = useState("");
  function add() {
    const val = input.trim();
    if (val && !tags.includes(val)) onChange([...tags, val]);
    setInput("");
  }
  function remove(t) { onChange(tags.filter((x) => x !== t)); }
  return (
    <div>
      <label className="text-xs text-slate-400 mb-1.5 block">{label}</label>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {tags.map((t) => (
          <span key={t} className="flex items-center gap-1 text-xs bg-slate-800 text-slate-200 border border-slate-700 rounded-full px-2.5 py-1">
            {t}
            <button type="button" onClick={() => remove(t)} className="text-slate-500 hover:text-red-400"><X size={11} /></button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder="Type and press Enter…"
          className="flex-1 rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400/40 placeholder:text-slate-600"
        />
        <button type="button" onClick={add} className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700">
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Main Profile Component ──────────────────────────────────────────

export default function Profile() {
  const { user, role } = useApp();
  const userId = user?.id || user?._id;
  const isAdmin = role === "superadmin";

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Admin Form State
  const [adminForm, setAdminForm] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    mobile: user?.mobile || "",
    gender: user?.gender || "male",
    role: user?.role || "super_admin",
  });

  // Astrologer Form State
  const defaultForm = {
    displayName: user?.fullName || "",
    professionalTitle: "Vedic Astrologer",
    bio: "",
    email: user?.email || "",
    phone: user?.mobile || "",
    experience: "5",
    experienceUnit: "years",
    consultationFee: "499",
    consultationUnit: "minute",
    consultationModes: ["chat"],
    specialization: ["Vedic Astrology"],
    skills: [],
    expertise: [],
    languages: ["Hindi", "English"],
    services: [],
    education: [],
    certifications: [],
    location: { country: "India", state: "", city: "", address: "", pincode: "" },
    website: "",
    socialLinks: { instagram: "", facebook: "", youtube: "", linkedin: "" },
    isAcceptingAppointments: true,
  };

  const [form, setForm] = useState(defaultForm);
  const [profileRawData, setProfileRawData] = useState(null);

  // ─── Fetch Profile from Backend ──────────────────────────────────
  async function fetchProfile() {
    if (!userId) return;
    setLoading(true);
    try {
      if (isAdmin) {
        // Fetch Admin Profile
        const res = await api.get(`/admin/profile/${userId}`);
        if (res.data?.success && res.data?.data) {
          const d = res.data.data;
          setAdminForm({
            fullName: d.fullName || user?.fullName || "",
            email: d.email || user?.email || "",
            mobile: d.mobile || user?.mobile || "",
            gender: d.gender || "male",
            role: d.role || "super_admin",
          });
          setProfileRawData(d);
        }
      } else {
        // Fetch Astrologer Profile
        const res = await api.get(`/astrologer/profile/${userId}`);
        if (res.data?.success && res.data?.data) {
          const d = res.data.data;
          setProfileRawData(d);
          setForm({
            displayName: d.displayName || user?.fullName || "",
            professionalTitle: d.professionalTitle || "Vedic Astrologer",
            bio: d.bio || "",
            email: d.userId?.email || user?.email || "",
            phone: d.userId?.mobile || user?.mobile || "",
            experience: String(d.experience ?? 5),
            experienceUnit: d.experienceUnit || "years",
            consultationFee: String(d.consultationFee ?? 499),
            consultationUnit: d.consultationUnit || "minute",
            consultationModes: Array.isArray(d.consultationModes) ? d.consultationModes : ["chat"],
            specialization: Array.isArray(d.specialization) && d.specialization.length ? d.specialization : ["Vedic Astrology"],
            skills: Array.isArray(d.skills) ? d.skills : [],
            expertise: Array.isArray(d.expertise) ? d.expertise : [],
            languages: Array.isArray(d.languages) && d.languages.length ? d.languages : ["Hindi", "English"],
            services: Array.isArray(d.services) ? d.services.map((s) => ({ name: s.name || "", description: s.description || "", price: String(s.price ?? ""), duration: String(s.duration ?? ""), durationUnit: s.durationUnit || "minutes", isActive: s.isActive !== false })) : [],
            education: Array.isArray(d.education) ? d.education.map((e) => ({ degree: e.degree || "", institution: e.institution || "", year: String(e.year ?? "") })) : [],
            certifications: Array.isArray(d.certifications) ? d.certifications.map((c) => ({ name: c.name || "", issuingOrganization: c.issuingOrganization || "", year: String(c.year ?? ""), certificateUrl: c.certificateUrl || "" })) : [],
            location: {
              country: d.location?.country || "India",
              state: d.location?.state || "",
              city: d.location?.city || "",
              address: d.location?.address || "",
              pincode: d.location?.pincode || "",
            },
            website: d.website || "",
            socialLinks: {
              instagram: d.socialLinks?.instagram || "",
              facebook: d.socialLinks?.facebook || "",
              youtube: d.socialLinks?.youtube || "",
              linkedin: d.socialLinks?.linkedin || "",
            },
            isAcceptingAppointments: d.isAcceptingAppointments !== false,
          });
        }
      }
    } catch (err) {
      console.warn("Profile fetch failed, using defaults:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, [userId, role]);

  // ─── Handle Save for Admin ─────────────────────────────────────────
  async function handleAdminSubmit(e) {
    e.preventDefault();
    if (!userId) { setMessage({ type: "error", text: "User ID not found. Please re-login." }); return; }
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await api.put(`/admin/profile/${userId}`, adminForm);
      if (res.data?.success) {
        setMessage({ type: "success", text: "Admin profile updated successfully!" });
        await fetchProfile();
        setIsEditing(false);
      } else {
        setMessage({ type: "error", text: res.data?.message || "Failed to update profile." });
      }
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || err.message || "Failed to update profile." });
    } finally {
      setSaving(false);
    }
  }

  // ─── Handle Save for Astrologer ────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    if (!userId) { setMessage({ type: "error", text: "User ID not found. Please re-login." }); return; }
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const payload = {
        displayName: form.displayName,
        professionalTitle: form.professionalTitle,
        bio: form.bio,
        experience: Number(form.experience) || 0,
        experienceUnit: form.experienceUnit,
        consultationFee: Number(form.consultationFee) || 0,
        consultationUnit: form.consultationUnit,
        consultationModes: form.consultationModes,
        specialization: form.specialization,
        skills: form.skills,
        expertise: form.expertise,
        languages: form.languages,
        services: form.services.map((s) => ({ ...s, price: Number(s.price) || 0, duration: Number(s.duration) || 0 })),
        education: form.education.map((e) => ({ ...e, year: Number(e.year) || undefined })),
        certifications: form.certifications.map((c) => ({ ...c, year: Number(c.year) || undefined })),
        location: form.location,
        website: form.website || null,
        socialLinks: {
          instagram: form.socialLinks.instagram || null,
          facebook: form.socialLinks.facebook || null,
          youtube: form.socialLinks.youtube || null,
          linkedin: form.socialLinks.linkedin || null,
        },
        isAcceptingAppointments: form.isAcceptingAppointments,
      };

      const res = await api.put(`/astrologer/profile/${userId}`, payload);
      if (res.data?.success) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        await fetchProfile();
        setIsEditing(false);
      } else {
        setMessage({ type: "error", text: res.data?.message || "Failed to update profile." });
      }
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || err.message || "Failed to update profile." });
    } finally {
      setSaving(false);
    }
  }

  // ─── Helpers for Astrologer Form ──────────────────────────────────
  function addService() {
    setForm((f) => ({ ...f, services: [...f.services, { name: "", description: "", price: "", duration: "", durationUnit: "minutes", isActive: true }] }));
  }
  function updateService(i, field, val) {
    setForm((f) => { const s = [...f.services]; s[i] = { ...s[i], [field]: val }; return { ...f, services: s }; });
  }
  function removeService(i) {
    setForm((f) => ({ ...f, services: f.services.filter((_, idx) => idx !== i) }));
  }

  function addEducation() {
    setForm((f) => ({ ...f, education: [...f.education, { degree: "", institution: "", year: "" }] }));
  }
  function updateEducation(i, field, val) {
    setForm((f) => { const e = [...f.education]; e[i] = { ...e[i], [field]: val }; return { ...f, education: e }; });
  }
  function removeEducation(i) {
    setForm((f) => ({ ...f, education: f.education.filter((_, idx) => idx !== i) }));
  }

  function addCertification() {
    setForm((f) => ({ ...f, certifications: [...f.certifications, { name: "", issuingOrganization: "", year: "", certificateUrl: "" }] }));
  }
  function updateCertification(i, field, val) {
    setForm((f) => { const c = [...f.certifications]; c[i] = { ...c[i], [field]: val }; return { ...f, certifications: c }; });
  }
  function removeCertification(i) {
    setForm((f) => ({ ...f, certifications: f.certifications.filter((_, idx) => idx !== i) }));
  }

  const MODES = ["chat", "call", "video", "in_person"];
  function toggleMode(m) {
    setForm((f) => ({
      ...f,
      consultationModes: f.consultationModes.includes(m)
        ? f.consultationModes.filter((x) => x !== m)
        : [...f.consultationModes, m],
    }));
  }

  // ─── Photo Upload Handler ─────────────────────────────────────────
  const fileInputRef = useRef(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoUploading, setPhotoUploading] = useState(false);

  async function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);

    setPhotoUploading(true);
    try {
      const formData = new FormData();
      formData.append("profileImage", file);
      if (userId) formData.append("userId", userId);

      const res = await api.post("/upload/profile-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success) {
        setMessage({ type: "success", text: "Profile photo updated successfully!" });
        fetchProfile();
      } else {
        setMessage({ type: "error", text: res.data?.message || "Failed to upload photo." });
      }
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Photo upload failed." });
    } finally {
      setPhotoUploading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-slate-400 gap-3">
        <Loader2 size={32} className="animate-spin text-amber-400" />
        <p className="text-sm">Loading profile details...</p>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════
  // A. SUPER ADMIN PROFILE (VIEW & EDIT)
  // ════════════════════════════════════════════════════════════════════
  if (isAdmin) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-medium text-slate-50 font-display">Super Admin Profile</h2>
            <p className="text-xs text-slate-400 mt-1">
              {isEditing ? "Edit your administrator account details below." : "View & manage your platform admin profile."}
            </p>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-sm font-semibold px-4 py-2.5 transition-colors"
            >
              <Edit3 size={16} /> Edit Admin Profile
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(false)}
              className="rounded-lg border border-slate-700 text-slate-300 text-xs px-3.5 py-2 hover:bg-slate-800"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Message Alert */}
        {message.text && (
          <div className={`p-3.5 rounded-xl border text-sm flex items-center gap-2.5 ${message.type === "success" ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300" : "bg-red-500/15 border-red-500/30 text-red-300"}`}>
            {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{message.text}</span>
          </div>
        )}

        {!isEditing ? (
          // ─── ADMIN VIEW MODE ───────────────────────────────────────
          <div className="grid md:grid-cols-3 gap-6">
            {/* Avatar Card */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col items-center text-center space-y-4">
              <div className="h-24 w-24 rounded-full bg-amber-500/15 border-2 border-amber-400/40 flex items-center justify-center text-amber-200 text-2xl font-bold overflow-hidden">
                {photoPreview || profileRawData?.profileImage ? (
                  <img src={photoPreview || (profileRawData.profileImage.startsWith("http") ? profileRawData.profileImage : `http://localhost:5000${profileRawData.profileImage}`)} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  initials(adminForm.fullName || "Admin")
                )}
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-100">{adminForm.fullName}</h3>
                <p className="text-xs text-amber-400 font-medium uppercase tracking-wider mt-0.5">System Super Admin</p>
              </div>
              <div className="w-full pt-3 border-t border-slate-800">
                <Badge tone="emerald">Active Super Admin</Badge>
              </div>
            </div>

            {/* Account Info Details */}
            <div className="md:col-span-2 rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-5">
              <SectionHeader icon={ShieldCheck} title="Account Credentials & Information" />
              <div className="grid sm:grid-cols-2 gap-5 text-sm">
                <div>
                  <p className="text-xs text-slate-400 mb-1">Full Name</p>
                  <p className="font-medium text-slate-100">{adminForm.fullName}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Email Address</p>
                  <p className="font-medium text-slate-100">{adminForm.email}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Mobile Number</p>
                  <p className="font-medium text-slate-100">{adminForm.mobile}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Gender</p>
                  <p className="font-medium text-slate-100 capitalize">{adminForm.gender}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Account Role</p>
                  <p className="font-medium text-amber-300 capitalize">{adminForm.role.replace("_", " ")}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Permissions</p>
                  <p className="font-medium text-emerald-400">Full System Access</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // ─── ADMIN EDIT MODE ───────────────────────────────────────
          <form onSubmit={handleAdminSubmit} className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
            <SectionHeader icon={User} title="Edit Admin Details" />
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Full Name" value={adminForm.fullName} onChange={(v) => setAdminForm({ ...adminForm, fullName: v })} />
              <Field label="Email Address" value={adminForm.email} onChange={(v) => setAdminForm({ ...adminForm, email: v })} />
              <Field label="Mobile Number" value={adminForm.mobile} onChange={(v) => setAdminForm({ ...adminForm, mobile: v })} />
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">Gender</label>
                <select
                  value={adminForm.gender}
                  onChange={(e) => setAdminForm({ ...adminForm, gender: e.target.value })}
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <Field label="Role" value="super_admin (Super Admin)" disabled />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-lg border border-slate-700 text-slate-300 text-sm px-5 py-2.5 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-sm font-semibold px-6 py-2.5 disabled:opacity-50"
              >
                {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <>Save Admin Profile <ArrowUpRight size={14} /></>}
              </button>
            </div>
          </form>
        )}
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════
  // B. ASTROLOGER PROFILE (VIEW & EDIT)
  // ════════════════════════════════════════════════════════════════════
  if (!isEditing) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-medium text-slate-50 font-display">Astrologer Profile</h2>
            <p className="text-xs text-slate-400 mt-1">Live details from GET /api/astrologer/profile/:userId</p>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-sm font-semibold px-4 py-2.5 transition-colors shadow-lg shadow-amber-400/10"
          >
            <Edit3 size={16} /> Edit Profile
          </button>
        </div>

        {message.text && (
          <div className={`p-3.5 rounded-xl border text-sm flex items-center gap-2.5 ${message.type === "success" ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300" : "bg-red-500/15 border-red-500/30 text-red-300"}`}>
            {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{message.text}</span>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col items-center text-center h-fit space-y-4">
            <div className="h-24 w-24 rounded-full bg-amber-500/15 border-2 border-amber-400/40 flex items-center justify-center text-amber-200 text-2xl font-bold overflow-hidden shadow-inner">
              {photoPreview || profileRawData?.profileImage ? (
                <img src={photoPreview || (profileRawData.profileImage.startsWith("http") ? profileRawData.profileImage : `http://localhost:5000${profileRawData.profileImage}`)} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                initials(form.displayName || "AS")
              )}
            </div>

            <div>
              <h3 className="text-base font-semibold text-slate-100">{form.displayName || "No Name"}</h3>
              <p className="text-xs text-amber-400/90 font-medium mt-0.5">{form.professionalTitle}</p>
            </div>

            <div className="w-full pt-2 border-t border-slate-800 space-y-2.5 text-left text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <Mail size={14} className="text-slate-500 shrink-0" />
                <span className="truncate">{form.email || "No email"}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={14} className="text-slate-500 shrink-0" />
                <span>{form.phone || "No phone"}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin size={14} className="text-slate-500 shrink-0" />
                <span>{[form.location.city, form.location.state, form.location.country].filter(Boolean).join(", ") || "India"}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Globe size={14} className="text-slate-500 shrink-0" />
                <span>{form.languages.join(", ") || "Languages"}</span>
              </div>
            </div>

            <div className="w-full pt-3 border-t border-slate-800">
              <Badge tone={form.isAcceptingAppointments ? "emerald" : "amber"}>
                {form.isAcceptingAppointments ? "Accepting Appointments" : "Not Accepting"}
              </Badge>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
                <p className="text-xs text-slate-400">Experience</p>
                <p className="text-lg font-semibold text-slate-100 mt-1">{form.experience} {form.experienceUnit}</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
                <p className="text-xs text-slate-400">Consultation Fee</p>
                <p className="text-lg font-semibold text-amber-300 mt-1">₹{form.consultationFee} <span className="text-xs font-normal text-slate-400">/ {form.consultationUnit}</span></p>
              </div>
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 col-span-2 sm:col-span-1">
                <p className="text-xs text-slate-400">Consultation Modes</p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {form.consultationModes.map((m) => (
                    <span key={m} className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded capitalize">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
              <SectionHeader icon={Star} title="About / Bio" />
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {form.bio || "No bio added yet."}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
              <SectionHeader icon={Layers} title="Specializations & Skills" />
              <div>
                <p className="text-xs text-slate-400 mb-2">Specializations</p>
                <div className="flex flex-wrap gap-1.5">
                  {form.specialization.map((s) => (
                    <span key={s} className="text-xs bg-amber-400/15 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {form.skills.length > 0 && (
                <div>
                  <p className="text-xs text-slate-400 mb-2">Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {form.skills.map((sk) => (
                      <span key={sk} className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {form.expertise.length > 0 && (
                <div>
                  <p className="text-xs text-slate-400 mb-2">Expertise Areas</p>
                  <div className="flex flex-wrap gap-1.5">
                    {form.expertise.map((ex) => (
                      <span key={ex} className="text-xs bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-full">
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {form.services.length > 0 && (
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
                <SectionHeader icon={Briefcase} title="Services Offered" />
                <div className="grid sm:grid-cols-2 gap-3">
                  {form.services.map((svc, i) => (
                    <div key={i} className="p-3.5 rounded-lg border border-slate-800 bg-slate-950/60 space-y-1">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-medium text-slate-100">{svc.name}</h4>
                        <span className="text-xs font-semibold text-amber-300">₹{svc.price}</span>
                      </div>
                      {svc.description && <p className="text-xs text-slate-400">{svc.description}</p>}
                      <p className="text-[11px] text-slate-500 pt-1">Duration: {svc.duration} {svc.durationUnit}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(form.education.length > 0 || form.certifications.length > 0) && (
              <div className="grid sm:grid-cols-2 gap-4">
                {form.education.length > 0 && (
                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
                    <SectionHeader icon={GraduationCap} title="Education" />
                    <div className="space-y-2">
                      {form.education.map((edu, i) => (
                        <div key={i} className="text-xs text-slate-300 border-b border-slate-800/80 pb-2 last:border-0">
                          <p className="font-medium text-slate-100">{edu.degree}</p>
                          <p className="text-slate-400">{edu.institution} {edu.year ? `(${edu.year})` : ""}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {form.certifications.length > 0 && (
                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
                    <SectionHeader icon={Star} title="Certifications" />
                    <div className="space-y-2">
                      {form.certifications.map((cert, i) => (
                        <div key={i} className="text-xs text-slate-300 border-b border-slate-800/80 pb-2 last:border-0">
                          <p className="font-medium text-slate-100">{cert.name}</p>
                          <p className="text-slate-400">{cert.issuingOrganization} {cert.year ? `(${cert.year})` : ""}</p>
                          {cert.certificateUrl && (
                            <a
                              href={cert.certificateUrl.startsWith("http") ? cert.certificateUrl : `http://localhost:5000${cert.certificateUrl}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-amber-400 underline block mt-0.5"
                            >
                              View Certificate Image
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {(form.website || Object.values(form.socialLinks).some(Boolean)) && (
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
                <SectionHeader icon={Link2} title="Social Links & Website" />
                <div className="flex flex-wrap gap-3 text-xs text-amber-300">
                  {form.website && <a href={form.website} target="_blank" rel="noreferrer" className="hover:underline">Website</a>}
                  {form.socialLinks.instagram && <a href={form.socialLinks.instagram} target="_blank" rel="noreferrer" className="hover:underline">Instagram</a>}
                  {form.socialLinks.youtube && <a href={form.socialLinks.youtube} target="_blank" rel="noreferrer" className="hover:underline">YouTube</a>}
                  {form.socialLinks.facebook && <a href={form.socialLinks.facebook} target="_blank" rel="noreferrer" className="hover:underline">Facebook</a>}
                  {form.socialLinks.linkedin && <a href={form.socialLinks.linkedin} target="_blank" rel="noreferrer" className="hover:underline">LinkedIn</a>}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    );
  }

  // Astrologer Edit Form
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 mb-1 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Profile View
          </button>
          <h2 className="text-xl font-medium text-slate-50 font-display">Edit Astrologer Profile</h2>
        </div>
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="rounded-lg border border-slate-700 text-slate-300 text-xs px-3.5 py-2 hover:bg-slate-800"
        >
          Cancel
        </button>
      </div>

      {message.text && (
        <div className={`p-3.5 rounded-xl border text-sm flex items-center gap-2.5 ${message.type === "success" ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300" : "bg-red-500/15 border-red-500/30 text-red-300"}`}>
          {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col items-center text-center h-fit">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />

            <div
              className="relative mb-4 group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              title="Click to change photo"
            >
              <div className="h-24 w-24 rounded-full bg-amber-500/15 border-2 border-amber-400/30 flex items-center justify-center text-amber-200 text-xl font-bold overflow-hidden">
                {photoPreview || profileRawData?.profileImage ? (
                  <img src={photoPreview || (profileRawData.profileImage.startsWith("http") ? profileRawData.profileImage : `http://localhost:5000${profileRawData.profileImage}`)} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  initials(form.displayName || "AS")
                )}
              </div>
              <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {photoUploading ? <Loader2 size={18} className="animate-spin text-white" /> : <Camera size={18} className="text-white" />}
              </div>
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={photoUploading}
              className="inline-flex items-center gap-1.5 text-xs rounded-lg border border-slate-700 px-3 py-1.5 text-slate-300 hover:bg-slate-800 disabled:opacity-50 transition-colors"
            >
              {photoUploading ? <><Loader2 size={13} className="animate-spin" /> Uploading...</> : <><Upload size={13} /> Change photo</>}
            </button>

            <div className="mt-5 w-full space-y-2.5 text-left">
              <div className="flex items-start gap-2 text-xs text-slate-400"><Mail size={13} className="shrink-0 mt-0.5" /> <span className="break-all">{form.email || "No email"}</span></div>
              <div className="flex items-center gap-2 text-xs text-slate-400"><Phone size={13} className="shrink-0" /> {form.phone || "No phone"}</div>
              <div className="flex items-start gap-2 text-xs text-slate-400"><MapPin size={13} className="shrink-0 mt-0.5" /> {[form.location.city, form.location.state, form.location.country].filter(Boolean).join(", ") || "Location not set"}</div>
              <div className="flex items-center gap-2 text-xs text-slate-400"><Globe size={13} className="shrink-0" /> {form.languages.join(", ") || "—"}</div>
            </div>

            <div className="mt-5 w-full flex flex-col gap-2">
              <Badge tone={form.isAcceptingAppointments ? "emerald" : "amber"}>
                {form.isAcceptingAppointments ? "Accepting Appointments" : "Not Accepting"}
              </Badge>
              <label className="flex items-center gap-2 cursor-pointer justify-center mt-1">
                <input
                  type="checkbox"
                  checked={form.isAcceptingAppointments}
                  onChange={(e) => setForm({ ...form, isAcceptingAppointments: e.target.checked })}
                  className="accent-amber-400"
                />
                <span className="text-xs text-slate-400">Accepting Appointments</span>
              </label>
            </div>
          </div>

          <div className="md:col-span-2 rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <SectionHeader icon={Star} title="Basic Information" />
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Display Name" value={form.displayName} onChange={(v) => setForm({ ...form, displayName: v })} placeholder="Dr. Priya Verma" />
              <Field label="Professional Title" value={form.professionalTitle} onChange={(v) => setForm({ ...form, professionalTitle: v })} placeholder="Senior Vedic Astrologer" />
              <Field label="Experience" type="number" value={form.experience} onChange={(v) => setForm({ ...form, experience: v })} />
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">Experience Unit</label>
                <select value={form.experienceUnit} onChange={(e) => setForm({ ...form, experienceUnit: e.target.value })}
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400/40">
                  <option value="years">Years</option>
                  <option value="months">Months</option>
                </select>
              </div>
              <Field label="Consultation Fee (₹)" type="number" value={form.consultationFee} onChange={(v) => setForm({ ...form, consultationFee: v })} />
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">Consultation Unit</label>
                <select value={form.consultationUnit} onChange={(e) => setForm({ ...form, consultationUnit: e.target.value })}
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400/40">
                  <option value="minute">Per Minute</option>
                  <option value="session">Per Session</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-2 block">Consultation Modes</label>
              <div className="flex gap-2 flex-wrap">
                {MODES.map((m) => (
                  <button type="button" key={m} onClick={() => toggleMode(m)}
                    className={`text-xs rounded-full border px-3 py-1.5 transition-colors capitalize ${form.consultationModes.includes(m) ? "bg-amber-400/15 text-amber-300 border-amber-400/30 font-medium" : "border-slate-700 text-slate-400 hover:text-slate-200"}`}>
                    {m.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Bio</label>
              <textarea rows={4} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400/40 resize-none"
                placeholder="Describe your expertise and background..." />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-5">
          <SectionHeader icon={Layers} title="Specializations & Skills" />
          <div>
            <label className="text-xs text-slate-400 mb-2 block">Specializations</label>
            <div className="flex flex-wrap gap-2">
              {SPECIALIZATIONS.map((s) => (
                <button type="button" key={s} onClick={() => {
                  setForm((f) => ({
                    ...f,
                    specialization: f.specialization.includes(s) ? f.specialization.filter((x) => x !== s) : [...f.specialization, s],
                  }));
                }}
                  className={`text-xs rounded-full border px-3 py-1.5 transition-colors ${form.specialization.includes(s) ? "bg-amber-400/15 text-amber-300 border-amber-400/30 font-medium" : "border-slate-700 text-slate-400 hover:text-slate-200"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <TagInput label="Skills" tags={form.skills} onChange={(v) => setForm({ ...form, skills: v })} />
            <TagInput label="Expertise Areas" tags={form.expertise} onChange={(v) => setForm({ ...form, expertise: v })} />
            <TagInput label="Languages" tags={form.languages} onChange={(v) => setForm({ ...form, languages: v })} />
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <SectionHeader icon={Briefcase} title="Services Offered" />
          {form.services.map((svc, i) => (
            <div key={i} className="relative rounded-lg border border-slate-700 bg-slate-950/50 p-4 space-y-3">
              <button type="button" onClick={() => removeService(i)} className="absolute top-3 right-3 text-slate-600 hover:text-red-400 transition-colors">
                <Trash2 size={15} />
              </button>
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Service Name" value={svc.name} onChange={(v) => updateService(i, "name", v)} placeholder="e.g. Kundli Reading" />
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Price (₹)" type="number" value={svc.price} onChange={(v) => updateService(i, "price", v)} placeholder="500" />
                  <Field label="Duration" type="number" value={svc.duration} onChange={(v) => updateService(i, "duration", v)} placeholder="30" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 mb-1.5 block">Duration Unit</label>
                  <select value={svc.durationUnit} onChange={(e) => updateService(i, "durationUnit", e.target.value)}
                    className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400/40">
                    <option value="minutes">Minutes</option>
                    <option value="hours">Hours</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1.5 block">Description</label>
                  <input value={svc.description} onChange={(e) => updateService(i, "description", e.target.value)} placeholder="Brief description..."
                    className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400/40 placeholder:text-slate-600" />
                </div>
              </div>
            </div>
          ))}
          <button type="button" onClick={addService}
            className="flex items-center gap-2 text-xs text-amber-400 border border-amber-400/30 hover:bg-amber-400/10 px-4 py-2 rounded-lg transition-colors">
            <Plus size={14} /> Add Service
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <SectionHeader icon={GraduationCap} title="Education" />
            {form.education.map((edu, i) => (
              <div key={i} className="relative rounded-lg border border-slate-700 bg-slate-950/50 p-4 space-y-2">
                <button type="button" onClick={() => removeEducation(i)} className="absolute top-3 right-3 text-slate-600 hover:text-red-400">
                  <Trash2 size={14} />
                </button>
                <Field label="Degree" value={edu.degree} onChange={(v) => updateEducation(i, "degree", v)} placeholder="Jyotish Ratna" />
                <Field label="Institution" value={edu.institution} onChange={(v) => updateEducation(i, "institution", v)} placeholder="University / Academy" />
                <Field label="Year" type="number" value={edu.year} onChange={(v) => updateEducation(i, "year", v)} placeholder="2014" />
              </div>
            ))}
            <button type="button" onClick={addEducation}
              className="flex items-center gap-2 text-xs text-amber-400 border border-amber-400/30 hover:bg-amber-400/10 px-4 py-2 rounded-lg transition-colors">
              <Plus size={14} /> Add Education
            </button>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <SectionHeader icon={Star} title="Certifications" />
            {form.certifications.map((cert, i) => (
              <div key={i} className="relative rounded-lg border border-slate-700 bg-slate-950/50 p-4 space-y-3">
                <button type="button" onClick={() => removeCertification(i)} className="absolute top-3 right-3 text-slate-600 hover:text-red-400">
                  <Trash2 size={14} />
                </button>
                <Field label="Certificate Name" value={cert.name} onChange={(v) => updateCertification(i, "name", v)} placeholder="e.g. Jyotish Ratna" />
                <Field label="Issuing Organization" value={cert.issuingOrganization} onChange={(v) => updateCertification(i, "issuingOrganization", v)} placeholder="e.g. All India Federation of Astrologers Societies" />
                
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Year" type="number" value={cert.year} onChange={(v) => updateCertification(i, "year", v)} placeholder="2020" />
                  <Field label="Certificate URL / Link" value={cert.certificateUrl} onChange={(v) => updateCertification(i, "certificateUrl", v)} placeholder="https://..." />
                </div>

                <div>
                  <label className="text-xs text-slate-400 mb-1.5 block">Upload Certificate Image File</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const formData = new FormData();
                          formData.append("certificateImages", file);
                          const res = await api.post("/upload/certificate-images", formData, {
                            headers: { "Content-Type": "multipart/form-data" },
                          });
                          if (res.data?.success && res.data?.data?.imageUrls?.[0]) {
                            updateCertification(i, "certificateUrl", res.data.data.imageUrls[0]);
                          }
                        } catch (err) {
                          alert("Failed to upload certificate image.");
                        }
                      }}
                      className="text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-amber-400/20 file:text-amber-300 hover:file:bg-amber-400/30 cursor-pointer"
                    />
                    {cert.certificateUrl && (
                      <a
                        href={cert.certificateUrl.startsWith("http") ? cert.certificateUrl : `http://localhost:5000${cert.certificateUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-amber-400 underline truncate max-w-[150px]"
                      >
                        View Image
                      </a>
                    )}
                  </div>
                  {cert.certificateUrl && (
                    <div className="mt-2 h-16 w-24 rounded-md border border-slate-700 overflow-hidden bg-slate-900">
                      <img
                        src={cert.certificateUrl.startsWith("http") ? cert.certificateUrl : `http://localhost:5000${cert.certificateUrl}`}
                        alt="Certificate Preview"
                        className="h-full w-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
            <button type="button" onClick={addCertification}
              className="flex items-center gap-2 text-xs text-amber-400 border border-amber-400/30 hover:bg-amber-400/10 px-4 py-2 rounded-lg transition-colors">
              <Plus size={14} /> Add Certification
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <SectionHeader icon={MapPin} title="Location" />
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="City" value={form.location.city} onChange={(v) => setForm({ ...form, location: { ...form.location, city: v } })} placeholder="Mumbai" />
            <Field label="State" value={form.location.state} onChange={(v) => setForm({ ...form, location: { ...form.location, state: v } })} placeholder="Maharashtra" />
            <Field label="Country" value={form.location.country} onChange={(v) => setForm({ ...form, location: { ...form.location, country: v } })} placeholder="India" />
            <Field label="Pincode" value={form.location.pincode} onChange={(v) => setForm({ ...form, location: { ...form.location, pincode: v } })} placeholder="400001" />
            <div className="sm:col-span-2">
              <Field label="Address" value={form.location.address} onChange={(v) => setForm({ ...form, location: { ...form.location, address: v } })} placeholder="Full address…" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <SectionHeader icon={Link2} title="Website & Social Links" />
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Website" value={form.website} onChange={(v) => setForm({ ...form, website: v })} placeholder="https://your-website.com" />
            <Field label="Instagram" value={form.socialLinks.instagram} onChange={(v) => setForm({ ...form, socialLinks: { ...form.socialLinks, instagram: v } })} placeholder="https://instagram.com/..." />
            <Field label="YouTube" value={form.socialLinks.youtube} onChange={(v) => setForm({ ...form, socialLinks: { ...form.socialLinks, youtube: v } })} placeholder="https://youtube.com/..." />
            <Field label="Facebook" value={form.socialLinks.facebook} onChange={(v) => setForm({ ...form, socialLinks: { ...form.socialLinks, facebook: v } })} placeholder="https://facebook.com/..." />
            <Field label="LinkedIn" value={form.socialLinks.linkedin} onChange={(v) => setForm({ ...form, socialLinks: { ...form.socialLinks, linkedin: v } })} placeholder="https://linkedin.com/in/..." />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2 pb-4">
          <button type="button" onClick={() => setIsEditing(false)}
            className="rounded-lg border border-slate-700 text-slate-300 text-sm px-5 py-2.5 hover:bg-slate-800 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-sm font-semibold px-6 py-2.5 disabled:opacity-50 transition-colors">
            {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <>Save changes <ArrowUpRight size={14} /></>}
          </button>
        </div>
      </form>
    </div>
  );
}

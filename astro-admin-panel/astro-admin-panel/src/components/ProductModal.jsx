import React, { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import { useApp } from "../context/AppContext";

const CATEGORIES = ["Yantra", "Gemstones", "Mala & Beads", "Rings", "Reports", "Spiritual Accessories"];
const PRODUCT_TYPES = ["Standard", "Consecrated", "Gold Plated", "Brass Siddha", "Heavy Metal"];

export default function ProductModal({ onClose, onSave, initialData }) {
  const { user } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const isEditMode = Boolean(initialData && (initialData.id || initialData._id));

  const [form, setForm] = useState({
    name: "",
    category: CATEGORIES[0],
    type: "Standard",
    sellingPrice: "",
    originalPrice: "",
    stock: "100",
    badge: "Verified Vedic Ritual",
    shortDescription: "",
    description: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        category: initialData.category || CATEGORIES[0],
        type: initialData.type || "Standard",
        sellingPrice: initialData.sellingPrice || initialData.price || "",
        originalPrice: initialData.originalPrice || initialData.sellingPrice || initialData.price || "",
        stock: initialData.stock !== undefined ? String(initialData.stock) : "100",
        badge: initialData.badge || "Verified Vedic Ritual",
        shortDescription: initialData.shortDescription || "",
        description: initialData.description || "",
      });

      if (initialData.image || (Array.isArray(initialData.images) && initialData.images.length > 0)) {
        const existingImgs = Array.isArray(initialData.images) && initialData.images.length > 0
          ? initialData.images
          : [initialData.image];

        const formattedPreviews = existingImgs.map((img) =>
          typeof img === "string"
            ? img.startsWith("http")
              ? img
              : `http://localhost:5000${img.startsWith("/") ? "" : "/"}${img}`
            : ""
        ).filter(Boolean);

        setImagePreviews(formattedPreviews);
      }
    }
  }, [initialData]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setImageFiles(files);
      const previews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  async function submit(e) {
    e.preventDefault();
    setError("");

    const userId = user?._id || user?.id;

    if (!form.name || !form.sellingPrice || !form.originalPrice) {
      setError("Please fill in required fields: Product Name, Selling Price, and Original Price.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("category", form.category);
      formData.append("type", form.type);
      formData.append("sellingPrice", String(form.sellingPrice));
      formData.append("originalPrice", String(form.originalPrice));
      formData.append("stock", String(form.stock || 100));
      formData.append("badge", form.badge.trim());
      formData.append("shortDescription", form.shortDescription.trim() || form.name);
      formData.append("description", form.description.trim());

      if (userId) {
        formData.append("createdBy", userId);
      }

      if (imageFiles.length > 0) {
        imageFiles.forEach((file) => {
          formData.append("images", file);
        });
      } else if (initialData && (initialData.image || (Array.isArray(initialData.images) && initialData.images.length > 0))) {
        const existingImgs = Array.isArray(initialData.images) && initialData.images.length > 0
          ? initialData.images
          : [initialData.image];

        existingImgs.forEach((imgStr) => {
          if (imgStr && typeof imgStr === "string") {
            formData.append("images", imgStr);
          }
        });
      }

      const res = await onSave(formData);
      if (res && res.success === false) {
        setError(res.message || "Failed to save product");
      } else {
        onClose();
      }
    } catch (err) {
      setError(err.message || "Something went wrong while saving product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 my-8 max-h-[90vh] overflow-y-auto shadow-2xl space-y-4">

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-semibold text-slate-100">
              {isEditMode ? "Edit Product" : "Add New Product"}
            </h3>
            <p className="text-xs text-slate-400">
              {isEditMode ? "Update product details & images" : "Fill in product details & upload image files"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-medium">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4 text-xs">

          {/* Product Image File Input */}
          <div>
            <label className="text-xs font-medium text-slate-300 mb-1.5 block">
              Product Images (File Upload)
            </label>
            <label className="rounded-xl border border-dashed border-slate-700 bg-slate-950/60 p-4 flex flex-col items-center justify-center text-slate-400 hover:border-amber-400/50 hover:text-amber-300 cursor-pointer transition-all">
              <Upload size={22} className="mb-1 text-amber-400" />
              <span className="font-semibold text-slate-200">
                {isEditMode ? "Click to change/add image files" : "Click to select image files"}
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5">Supports JPG, PNG, WEBP (Multipart Form-Data)</span>
              <input
                type="file"
                name="images"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {/* Selected Images Preview */}
            {imagePreviews.length > 0 && (
              <div className="mt-2.5 flex items-center gap-2 overflow-x-auto pb-1">
                {imagePreviews.map((src, idx) => (
                  <div key={idx} className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-700 shrink-0 bg-slate-950">
                    <img src={src} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ))}
                <span className="text-[11px] text-amber-400 font-medium">
                  {imagePreviews.length} image(s)
                </span>
              </div>
            )}
          </div>

          {/* Product Name */}
          <div>
            <label className="text-xs font-medium text-slate-300 mb-1 block">Product Name *</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Energized Copper Shree Yantra"
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
            />
          </div>

          {/* Category & Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-300 mb-1 block">Category *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 mb-1 block">Product Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
              >
                {PRODUCT_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Selling Price & Original Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-300 mb-1 block">Selling Price (₹) *</label>
              <input
                required
                type="number"
                value={form.sellingPrice}
                onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })}
                placeholder="1499"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-400/40 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 mb-1 block">Original MRP (₹) *</label>
              <input
                required
                type="number"
                value={form.originalPrice}
                onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                placeholder="2499"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-400/40 font-mono"
              />
            </div>
          </div>

          {/* Stock Quantity & Badge */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-300 mb-1 block">Stock Quantity</label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                placeholder="100"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-400/40 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 mb-1 block">Badge Tag</label>
              <input
                value={form.badge}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
                placeholder="Verified Vedic Ritual"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
              />
            </div>
          </div>

          {/* Short Description */}
          <div>
            <label className="text-xs font-medium text-slate-300 mb-1 block">Short Summary</label>
            <input
              value={form.shortDescription}
              onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
              placeholder="e.g. Pure copper plate Shree Yantra energized by Vedic Brahmins"
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-medium text-slate-300 mb-1 block">Full Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Detailed description of benefits, usage, and spiritual significance..."
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-400/40 resize-none"
            />
          </div>

          {/* Submit Actions */}
          <div className="flex gap-3 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-xl border border-slate-700 text-slate-300 text-xs py-2.5 hover:bg-slate-800 font-semibold cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 text-xs font-bold py-2.5 cursor-pointer shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>{isEditMode ? "Updating Product..." : "Uploading Product..."}</span>
                </>
              ) : (
                <span>{isEditMode ? "Update Product ✦" : "Save Product ✦"}</span>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

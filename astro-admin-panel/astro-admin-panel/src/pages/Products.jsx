import React, { useState, useEffect } from "react";
import { Plus, Package, Pencil, Trash2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Badge, EmptyState, statusTone } from "../components/ui";
import ProductModal from "../components/ProductModal";

export default function Products() {
  const { role, user, products, addProduct, updateProduct, deleteProduct, fetchDashboardData } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const currentUserId = user?._id || user?.id;

  // Astrologer sees their own products, Admin sees all
  const rows =
    role === "astrologer" && currentUserId
      ? products.filter(
          (p) =>
            p.createdBy === currentUserId ||
            p.astrologer === user?.fullName
        )
      : products;

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">
            {role === "astrologer" ? "My Products" : "All Products"}
          </h2>
          <p className="text-xs text-slate-400">
            Manage your consecrated yantras, gemstones, and spiritual product catalog.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchDashboardData}
            className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 text-xs font-medium transition-colors cursor-pointer"
          >
            ↺ Refresh
          </button>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-sm font-semibold px-3.5 py-2 cursor-pointer shadow-md transition-all"
          >
            <Plus size={15} /> Add product
          </button>
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState text="No products listed yet. Click 'Add product' to create your first item." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rows.map((p) => {
            const productId = p.id || p._id;
            const priceDisplay = Number(p.sellingPrice || p.price || 0);

            const rawImg = p.image || (Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : null);
            const imgUrl = rawImg
              ? rawImg.startsWith("http")
                ? rawImg
                : `http://localhost:5000${rawImg.startsWith("/") ? "" : "/"}${rawImg}`
              : null;

            return (
              <div
                key={productId}
                className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-lg hover:border-slate-700 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Product Image Header */}
                  <div className="h-40 bg-slate-950/80 flex items-center justify-center text-amber-400/70 border-b border-slate-800 relative overflow-hidden">
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          // Fallback to icon if broken
                          e.currentTarget.style.display = "none";
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            const icon = parent.querySelector(".fallback-icon");
                            if (icon) icon.classList.remove("hidden");
                          }
                        }}
                      />
                    ) : null}

                    <div className={`fallback-icon ${imgUrl ? "hidden" : ""} flex flex-col items-center justify-center text-slate-600`}>
                      <Package size={36} className="text-amber-500/50 mb-1" />
                      <span className="text-[10px] text-slate-500">No Image</span>
                    </div>

                    <div className="absolute top-2 right-2 z-10">
                      <Badge tone={statusTone(p.status || (p.isActive ? "active" : "draft"))}>
                        {p.status || (p.isActive ? "active" : "draft")}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-100 leading-snug line-clamp-1">
                        {p.name}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[11px] text-amber-300 font-medium">
                        {p.category || "General"}
                      </span>
                      {role !== "astrologer" && (
                        <span className="truncate max-w-[130px] text-slate-400 text-[11px]">
                          👤 {p.astrologer || "Astrologer"}
                        </span>
                      )}
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
                      <div>
                        <p className="text-base font-bold text-amber-400">
                          ₹{priceDisplay.toLocaleString("en-IN")}
                        </p>
                        {p.originalPrice > priceDisplay && (
                          <span className="text-[10px] text-slate-500 line-through">
                            ₹{Number(p.originalPrice).toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 font-mono">
                        {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Edit & Delete Action Buttons */}
                <div className="p-4 pt-0">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-amber-500/30 text-amber-300 text-xs py-2 hover:bg-amber-500/15 transition-colors cursor-pointer font-medium"
                    >
                      <Pencil size={13} /> Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(productId)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-rose-500/30 text-rose-300 text-xs py-2 hover:bg-rose-500/15 transition-colors cursor-pointer font-medium"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {showModal && (
        <ProductModal
          initialData={editingProduct}
          onClose={() => {
            setShowModal(false);
            setEditingProduct(null);
          }}
          onSave={async (formData) => {
            if (editingProduct) {
              const editId = editingProduct.id || editingProduct._id;
              return await updateProduct(editId, formData);
            } else {
              return await addProduct(formData);
            }
          }}
        />
      )}
    </div>
  );
}

'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { addToCart } from '../utils/cart';

const shopImages: Record<number, string> = {
  0: '/websiteImage/Energized.jpg',
  1: '/websiteImage/BrassSiddha.jpg',
  2: '/websiteImage/GoldPlated.jpg',
  3: '/websiteImage/HeavyNavagraha.jpg',
};

interface ProductDisplay {
  id: string;
  name: string;
  category: string;
  description: string;
  sellingPrice: number;
  originalPrice: number;
  badge: string;
  stock: number;
  image: string;
  astrologer: string;
}

export default function ShopSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<ProductDisplay[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const json = await res.json();

        if (json.success && Array.isArray(json.data)) {
          const mapped: ProductDisplay[] = json.data.map((item: any, idx: number) => {
            const rawImg = Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : null;
            let fullImg = shopImages[idx % 4] || "/websiteImage/Energized.jpg";

            if (rawImg && typeof rawImg === "string") {
              fullImg = rawImg.startsWith("http")
                ? rawImg
                : `http://localhost:5000${rawImg.startsWith("/") ? "" : "/"}${rawImg}`;
            }

            const origP = Number(item.originalPrice) || Number(item.sellingPrice) || 999;
            const sellP = Number(item.sellingPrice) || origP;

            return {
              id: item._id,
              name: item.name || "Energized Spiritual Product",
              category: item.category || "Sacred Item",
              description: item.shortDescription || item.description || "Consecrated and ritualistically energized Vedic product for spiritual growth.",
              sellingPrice: sellP,
              originalPrice: origP > sellP ? origP : Math.round(sellP * 1.25),
              badge: item.badge || "Verified Vedic Ritual",
              stock: item.stock !== undefined ? item.stock : 10,
              image: fullImg,
              astrologer: item.createdBy?.fullName || "Acharya Expert",
            };
          });
          setProducts(mapped);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.warn("Failed to fetch shop products API:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const handleAddToCart = (e: React.MouseEvent, prod: ProductDisplay) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: prod.id,
      name: prod.name,
      price: prod.sellingPrice,
      originalPrice: prod.originalPrice,
      image: prod.image,
      category: prod.category,
    }, 1);

    setToastMessage(`✓ Added "${prod.name}" to Cart!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return (
    <section ref={containerRef} className="py-16 px-4 sm:px-6 lg:px-8 bg-transparent relative z-10 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Floating Add To Cart Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white font-semibold text-xs px-5 py-3 rounded-2xl shadow-[0_0_25px_rgba(16,185,129,0.5)] border border-emerald-400/40 flex items-center gap-3 animate-bounce">
          <span>🛒</span>
          <span>{toastMessage}</span>
          <Link href="/cart" className="underline font-bold text-amber-200 hover:text-white ml-1">
            View Cart →
          </Link>
        </div>
      )}

      <div className="max-w-7xl mx-auto relative z-10">

        {/* ── Section Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 pb-6 border-b border-amber-500/15">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-semibold tracking-widest uppercase mb-3 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              ✦ CONSECRATED SPIRITUAL STORE ✦
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Energized <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">Yantras &amp; Gemstones</span>
            </h2>
          </div>
          <p className="text-slate-100 text-sm sm:text-base leading-relaxed max-w-md font-medium">
            100% authentic, ritualistically energized planetary yantras, copper plates, and certified gemstones to boost positivity and remove doshas.
          </p>
        </div>

        {/* ── Products Display Grid ── */}
        {loading ? (
          <div className="py-16 text-center text-slate-400">
            <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm">Loading spiritual products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center text-slate-400 bg-[#0e1026]/60 rounded-3xl border border-amber-500/20 max-w-md mx-auto space-y-2">
            <span className="text-4xl block">📿</span>
            <h3 className="text-white font-serif text-lg font-bold">No Products Available</h3>
            <p className="text-xs text-slate-300">Spiritual store items will appear here soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((prod, index) => {
              const discount = Math.round(
                ((prod.originalPrice - prod.sellingPrice) / prod.originalPrice) * 100
              );

              return (
                <Link
                  key={prod.id || index}
                  href={`/shop/${prod.id}`}
                  className="relative overflow-hidden rounded-3xl p-5 bg-[#0e1026]/90 backdrop-blur-xl border border-amber-500/35 hover:border-amber-400 hover:shadow-[0_12px_40px_rgba(212,175,55,0.3)] group hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between shadow-[0_8px_30px_rgba(0,0,0,0.7)] cursor-pointer"
                >
                  {/* Top ambient highlight bar */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-transparent via-amber-400/80 to-transparent group-hover:w-full transition-all duration-500" />

                  <div>
                    {/* Product Image Header with Badges */}
                    <div className="relative mb-5 overflow-hidden rounded-2xl h-52 border border-amber-500/30 group-hover:border-amber-400/60 transition-colors shadow-inner">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = shopImages[index % 4] || "/websiteImage/Energized.jpg";
                        }}
                      />

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0e1026] via-transparent to-black/30" />

                      {/* Category Badge */}
                      <span className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold text-[10px] px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                        {prod.category}
                      </span>

                      {/* Discount Tag */}
                      {discount > 0 && (
                        <span className="absolute top-3 right-3 bg-red-600/90 text-white font-bold text-[10px] px-2.5 py-1 rounded-full shadow-md border border-red-400/40">
                          {discount}% OFF
                        </span>
                      )}
                    </div>

                    {/* Product Title */}
                    <h3 className="font-serif text-lg font-bold text-white mb-2 group-hover:text-amber-300 transition-colors leading-snug">
                      {prod.name}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-200 text-xs leading-relaxed line-clamp-2 mb-4 font-normal">
                      {prod.description}
                    </p>
                  </div>

                  {/* Pricing & Add To Cart Button */}
                  <div>
                    <div className="flex items-baseline justify-between mb-4 pt-3 border-t border-amber-500/20">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-serif font-bold text-amber-300">₹{prod.sellingPrice.toLocaleString('en-IN')}</span>
                        {prod.originalPrice > prod.sellingPrice && (
                          <span className="text-xs text-gray-500 line-through">₹{prod.originalPrice.toLocaleString('en-IN')}</span>
                        )}
                      </div>
                      <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                        {prod.badge}
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleAddToCart(e, prod)}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-black font-bold text-xs shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:scale-102 hover:shadow-[0_0_25px_rgba(255,215,0,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>🛒</span>
                      <span>Add To Cart</span>
                    </button>
                  </div>

                </Link>
              );
            })}
          </div>
        )}

        {/* ── Bottom Call To Action Banner ── */}
        <div className="mt-14 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#121430] to-[#1a1d45] border-2 border-amber-400/50 text-amber-300 font-bold text-sm hover:border-amber-300 hover:text-white hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] backdrop-blur-md transition-all duration-300"
          >
            <span>Explore Full Spiritual Store Products &amp; Sacred Yantras</span>
            <span className="text-amber-400 font-bold text-base">→</span>
          </Link>
        </div>

      </div>
    </section>
  );
}

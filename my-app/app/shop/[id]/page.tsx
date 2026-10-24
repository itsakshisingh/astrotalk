'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import AppointmentModal from '../../components/AppointmentModal';
import { addToCart } from '../../utils/cart';

const shopImages: Record<number, string> = {
  0: '/websiteImage/Energized.jpg',
  1: '/websiteImage/BrassSiddha.jpg',
  2: '/websiteImage/GoldPlated.jpg',
  3: '/websiteImage/HeavyNavagraha.jpg',
};

interface ProductDetail {
  id: string;
  name: string;
  category: string;
  description: string;
  shortDescription?: string;
  sellingPrice: number;
  originalPrice: number;
  stock: number;
  images: string[];
  astrologer?: string;
  badge?: string;
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const productId = resolvedParams.id;

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [similarProducts, setSimilarProducts] = useState<ProductDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    async function fetchProductDetails() {
      setLoading(true);
      try {
        // Fetch current product details
        const res = await fetch(`http://localhost:5000/api/products/${productId}`);
        const json = await res.json();

        if (json.success && json.data) {
          const item = json.data;
          const rawImgs = Array.isArray(item.images) && item.images.length > 0 ? item.images : ['/websiteImage/Energized.jpg'];
          
          const fullImgs = rawImgs.map((img: string) => {
            if (typeof img === 'string') {
              return img.startsWith('http') ? img : `http://localhost:5000${img.startsWith('/') ? '' : '/'}${img}`;
            }
            return '/websiteImage/Energized.jpg';
          });

          const origP = Number(item.originalPrice) || Number(item.sellingPrice) || 999;
          const sellP = Number(item.sellingPrice) || origP;

          const prodData: ProductDetail = {
            id: item._id,
            name: item.name || 'Energized Spiritual Product',
            category: item.category || 'Sacred Item',
            description: item.description || item.shortDescription || 'Consecrated and ritualistically energized Vedic product for spiritual growth.',
            shortDescription: item.shortDescription || '',
            sellingPrice: sellP,
            originalPrice: origP > sellP ? origP : Math.round(sellP * 1.25),
            stock: item.stock !== undefined ? item.stock : 10,
            images: fullImgs,
            astrologer: item.createdBy?.fullName || 'Acharya Expert',
            badge: item.badge || 'Verified Vedic Ritual',
          };

          setProduct(prodData);
          setSelectedImage(fullImgs[0]);
        } else {
          setProduct(null);
        }

        // Fetch all products for Similar Products section
        const allRes = await fetch("http://localhost:5000/api/products");
        const allJson = await allRes.json();

        if (allJson.success && Array.isArray(allJson.data)) {
          const mapped: ProductDetail[] = allJson.data
            .filter((p: any) => p._id !== productId)
            .map((item: any, idx: number) => {
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
                images: [fullImg],
                astrologer: item.createdBy?.fullName || "Acharya Expert",
              };
            });

          setSimilarProducts(mapped.slice(0, 4));
        }
      } catch (err) {
        console.warn('Failed to fetch product details:', err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  const handleAddToCart = (itemToAdd: ProductDetail, qty: number = 1, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    addToCart(
      {
        id: itemToAdd.id,
        name: itemToAdd.name,
        price: itemToAdd.sellingPrice,
        originalPrice: itemToAdd.originalPrice,
        image: itemToAdd.images[0] || selectedImage,
        category: itemToAdd.category,
      },
      qty
    );

    setToastMessage(`✓ Added ${qty} item(s) of "${itemToAdd.name}" to Cart!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080914] text-slate-100 font-sans">
      <Header onOpenBooking={() => setModalOpen(true)} />

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

      <main className="flex-1">
        {/* Banner Section */}
        <section className="py-12 px-4 bg-gradient-to-b from-[#0d0f26] via-[#0b0c1e] to-[#080914] border-b border-amber-500/20 text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto">
            <span className="text-amber-400 font-semibold text-xs uppercase tracking-widest block mb-2">
              ✦ SPIRITUAL STORE ✦
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-2">
              PRODUCT <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">DETAILS</span>
            </h1>
            <p className="text-xs text-slate-300 font-medium">
              Home <span className="text-amber-400 mx-1 shadow-sm">//</span> Shop <span className="text-amber-400 mx-1">//</span> {product ? product.name : 'Detail'}
            </p>
          </div>
        </section>

        {/* Product Details Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          {loading ? (
            <div className="py-20 text-center text-slate-400">
              <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm">Loading product details...</p>
            </div>
          ) : !product ? (
            <div className="py-16 text-center text-slate-300 bg-[#0e1026]/80 rounded-3xl border border-amber-500/25 max-w-md mx-auto space-y-4">
              <span className="text-5xl block">📿</span>
              <h2 className="text-white font-serif text-xl font-bold">Product Not Found</h2>
              <p className="text-xs text-slate-300">The product you are looking for does not exist or has been removed.</p>
              <div>
                <Link
                  href="/shop"
                  className="px-6 py-2.5 rounded-full bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition-colors inline-block"
                >
                  Back to Shop →
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-[#0e1026]/90 backdrop-blur-xl rounded-3xl p-6 sm:p-10 border border-amber-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
              
              {/* Product Gallery */}
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden h-80 sm:h-96 border border-amber-500/30 shadow-inner bg-black">
                  <img
                    src={selectedImage}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/websiteImage/Energized.jpg';
                    }}
                  />
                  <span className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                    {product.category}
                  </span>
                </div>

                {/* Thumbnails */}
                {product.images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(img)}
                        className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-black ${
                          selectedImage === img ? 'border-amber-400 scale-105' : 'border-amber-500/20 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Specs & Info */}
              <div className="flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                      {product.badge || 'Verified Vedic Ritual'}
                    </span>
                    <span className="text-xs text-emerald-400 font-medium">
                      ● In Stock ({product.stock})
                    </span>
                  </div>

                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-3 leading-snug">
                    {product.name}
                  </h1>

                  <div className="flex items-baseline gap-3 mb-6">
                    <span className="text-3xl font-serif font-bold text-amber-300">
                      ₹{product.sellingPrice.toLocaleString('en-IN')}
                    </span>
                    {product.originalPrice > product.sellingPrice && (
                      <span className="text-base text-gray-400 line-through">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                    {product.originalPrice > product.sellingPrice && (
                      <span className="text-xs font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                        {Math.round(((product.originalPrice - product.sellingPrice) / product.originalPrice) * 100)}% OFF
                      </span>
                    )}
                  </div>

                  {product.shortDescription && (
                    <div className="mb-4 text-sm text-amber-200/90 italic bg-amber-500/5 p-3 rounded-xl border border-amber-500/15">
                      "{product.shortDescription}"
                    </div>
                  )}

                  <div className="space-y-2 mb-6">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Description &amp; Benefits</h3>
                    <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-line">
                      {product.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-6 border-t border-amber-500/20 pt-6">
                  {/* Quantity & Add to Cart */}
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex items-center border border-amber-500/30 rounded-xl bg-[#080918] overflow-hidden w-full sm:w-auto justify-between sm:justify-start">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="px-4 py-2.5 text-slate-300 hover:text-amber-400 transition-colors font-bold text-base"
                      >
                        -
                      </button>
                      <span className="px-4 text-sm font-bold text-white">{quantity}</span>
                      <button
                        onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                        className="px-4 py-2.5 text-slate-300 hover:text-amber-400 transition-colors font-bold text-base"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product, quantity)}
                      className="w-full sm:flex-1 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-black font-bold text-sm shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-102 hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>🛒</span>
                      <span>Add To Cart</span>
                    </button>
                  </div>

                  {/* Trust Badges */}
                  <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-300 font-medium">
                    <div className="flex items-center gap-2 bg-[#080918] p-2.5 rounded-xl border border-amber-500/15">
                      <span>✨</span>
                      <span>Prana Pratishtha Energized</span>
                    </div>
                    <div className="flex items-center gap-2 bg-[#080918] p-2.5 rounded-xl border border-amber-500/15">
                      <span>🚚</span>
                      <span>Express Free Shipping</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ── Similar Products Section ── */}
          {similarProducts.length > 0 && (
            <div className="mt-16 pt-10 border-t border-amber-500/20">
              <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
                <div>
                  <span className="text-amber-400 font-semibold text-xs uppercase tracking-widest block mb-1">
                    ✦ EXPLORE MORE ✦
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                    Similar <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">Spiritual Products</span>
                  </h2>
                </div>
                <Link
                  href="/shop"
                  className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
                >
                  View All Products →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarProducts.map((simProd, index) => {
                  const discount = Math.round(
                    ((simProd.originalPrice - simProd.sellingPrice) / simProd.originalPrice) * 100
                  );

                  return (
                    <Link
                      key={simProd.id || index}
                      href={`/shop/${simProd.id}`}
                      className="relative overflow-hidden rounded-3xl p-5 bg-[#0e1026]/90 backdrop-blur-xl border border-amber-500/35 hover:border-amber-400 hover:shadow-[0_12px_40px_rgba(212,175,55,0.3)] group hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between shadow-[0_8px_30px_rgba(0,0,0,0.7)] cursor-pointer"
                    >
                      {/* Top ambient highlight bar */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-transparent via-amber-400/80 to-transparent group-hover:w-full transition-all duration-500" />

                      <div>
                        {/* Product Image Header with Badges */}
                        <div className="relative mb-5 overflow-hidden rounded-2xl h-48 border border-amber-500/30 group-hover:border-amber-400/60 transition-colors shadow-inner bg-black">
                          <img
                            src={simProd.images[0]}
                            alt={simProd.name}
                            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = shopImages[index % 4] || "/websiteImage/Energized.jpg";
                            }}
                          />

                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0e1026] via-transparent to-black/30" />

                          {/* Category Badge */}
                          <span className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold text-[10px] px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                            {simProd.category}
                          </span>

                          {/* Discount Tag */}
                          {discount > 0 && (
                            <span className="absolute top-3 right-3 bg-red-600/90 text-white font-bold text-[10px] px-2.5 py-1 rounded-full shadow-md border border-red-400/40">
                              {discount}% OFF
                            </span>
                          )}
                        </div>

                        {/* Product Title */}
                        <h3 className="font-serif text-base font-bold text-white mb-2 group-hover:text-amber-300 transition-colors leading-snug line-clamp-1">
                          {simProd.name}
                        </h3>

                        {/* Description */}
                        <p className="text-slate-300 text-xs leading-relaxed line-clamp-2 mb-4 font-normal">
                          {simProd.description}
                        </p>
                      </div>

                      {/* Pricing & Add To Cart Button */}
                      <div>
                        <div className="flex items-baseline justify-between mb-4 pt-3 border-t border-amber-500/20">
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-serif font-bold text-amber-300">₹{simProd.sellingPrice.toLocaleString('en-IN')}</span>
                            {simProd.originalPrice > simProd.sellingPrice && (
                              <span className="text-xs text-gray-500 line-through">₹{simProd.originalPrice.toLocaleString('en-IN')}</span>
                            )}
                          </div>
                          <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                            {simProd.badge}
                          </span>
                        </div>

                        <button
                          onClick={(e) => handleAddToCart(simProd, 1, e)}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-black font-bold text-xs shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:scale-102 hover:shadow-[0_0_25px_rgba(255,215,0,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>🛒</span>
                          <span>Add To Cart</span>
                        </button>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </main>

      <AppointmentModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <Footer />
    </div>
  );
}

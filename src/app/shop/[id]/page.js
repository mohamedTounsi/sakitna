"use client";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toTND, calculateProductPrice } from '@/lib/currency';

export default function ProductDetails({ params }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;

  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('');
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState('');
  const [hovered, setHovered] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          setActiveImage(data.frontImage || data.image || '');
        }
      } catch (err) {
        console.error('Failed to load product:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
        <p className="text-xl font-black uppercase tracking-tighter">Product not found.</p>
        <Link href="/shop" className="text-xs font-bold uppercase tracking-widest text-black/40 hover:text-black transition">
          ← Back to shop
        </Link>
      </div>
    );
  }

  const frontImage = product.frontImage || product.image || '';
  const backImage = product.backImage || '';
  const galleryImages = product.galleryImages || [];
  const allImages = [
    ...(frontImage ? [frontImage] : []),
    ...(backImage ? [backImage] : []),
    ...galleryImages,
  ];

  const currentPrice = calculateProductPrice(product, quantity);

  const handleAddToCart = () => {
    if (!size) { setError('Select a size first.'); return; }
    setError('');
    addToCart(product, quantity, size);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    if (!size) { setError('Select a size first.'); return; }
    setError('');
    router.push(`/checkout?direct=true&id=${product._id}&qty=${quantity}&size=${size}`);
  };

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <div className="pt-24 sm:pt-28 flex-1 w-full max-w-screen-2xl mx-auto px-5 sm:px-8 md:px-16 pb-16 sm:pb-20">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 py-4 sm:py-6 border-b border-black/10 mb-6 sm:mb-10">
          <Link href="/shop" className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-black/30 hover:text-black transition">
            Shop
          </Link>
          <span className="text-black/20 text-xs">/</span>
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-black truncate max-w-[180px] sm:max-w-none">
            {product.title}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 xl:gap-20">

          {/* LEFT — Images */}
          <div className="w-full lg:w-[55%] flex flex-col gap-3">
            {/* Main image */}
            <div
              className="relative aspect-square bg-[#f2f2f2] overflow-hidden cursor-crosshair"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              {product.isMostWanted && (
                <div className="absolute top-4 left-4 z-10 bg-[#0a1628] text-white text-[9px] font-black uppercase tracking-widest px-3 py-1">
                  Most Wanted
                </div>
              )}

              {(activeImage || frontImage) && (
                <img
                  src={activeImage || frontImage}
                  alt={product.title}
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
                    backImage && activeImage === frontImage && hovered ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
                  }`}
                />
              )}
              {backImage && activeImage === frontImage && (
                <img
                  src={backImage}
                  alt={product.title + ' back'}
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
                    hovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
                  }`}
                />
              )}

              {backImage && activeImage === frontImage && !hovered && (
                <div className="absolute bottom-4 right-4 text-[9px] font-bold uppercase tracking-widest text-black/40 bg-white/80 backdrop-blur-sm px-3 py-1.5">
                  Hover for back
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2">
                {allImages.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(src)}
                    className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 overflow-hidden flex-shrink-0 border-2 transition-all duration-200 ${
                      activeImage === src ? 'border-black' : 'border-transparent opacity-40 hover:opacity-80'
                    }`}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — Info */}
          <div className="w-full lg:w-[45%] flex flex-col">

            {/* Drop tag */}
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#0a1628]/50 mb-3">
              Drop 001 — Foundations
            </p>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter text-[#0a1628] leading-none mb-4 sm:mb-5">
              {product.title}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-8 pb-8 border-b border-black/10">
              <span className="text-2xl font-black text-[#0a1628]">{toTND(calculateProductPrice(product, 1))}</span>
              {product.originalPrice && (
                <span className="line-through text-black/30 text-base font-medium">{toTND(product.originalPrice)}</span>
              )}
            </div>

            {/* Description */}
            <p className="text-black/50 mb-8 leading-relaxed text-sm">
              {product.description || 'No description available for this product.'}
            </p>

            {/* Size */}
            <div className="mb-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-black/40 mb-3">Size</p>
              <div className="flex flex-wrap gap-2">
                {['S', 'M', 'L', 'XL'].map(s => (
                  <button
                    key={s}
                    onClick={() => { setSize(s); setError(''); }}
                    className={`w-12 h-12 border-2 text-xs font-black uppercase tracking-widest transition-all duration-200 ${
                      size === s
                        ? 'border-[#0a1628] bg-[#0a1628] text-white'
                        : 'border-black/15 text-black/40 hover:border-black/40 hover:text-black'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {error && <p className="text-red-500 text-xs font-bold mt-2 uppercase tracking-widest">{error}</p>}
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-black/40 mb-3">Quantity</p>
              <div className="flex items-center gap-6">
                <div className="flex items-center border-2 border-black/15 h-12 w-32">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex-1 h-full font-black text-lg hover:bg-black/5 transition">−</button>
                  <div className="flex-1 text-center font-black text-sm">{quantity}</div>
                  <button onClick={() => setQuantity(quantity + 1)} className="flex-1 h-full font-black text-lg hover:bg-black/5 transition">+</button>
                </div>
                <p className="text-sm text-black/40 font-medium">
                  Total: <span className="text-[#0a1628] font-black">{toTND(currentPrice)}</span>
                </p>
              </div>
            </div>

            {/* Bundle savings */}
            <div className="mb-8 border border-black/10 p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-black/40 mb-4">Bundle Savings</p>
              <div className="flex flex-col gap-2">
                {[
                  { label: '1 Item', highlight: quantity === 1, price: toTND(product.price1) },
                  { label: '2 Items', highlight: quantity === 2, price: toTND(product.price2), original: toTND(product.price1 * 2) },
                  { label: '3+ Items', highlight: quantity >= 3, price: `${toTND(product.price2 + product.price3)} for 3`, original: toTND(product.price1 * 3) },
                ].map(({ label, highlight, price, original }) => (
                  <div
                    key={label}
                    className={`flex justify-between items-center py-2 px-3 transition-all duration-200 ${
                      highlight ? 'bg-[#0a1628] text-white' : 'text-black/50'
                    }`}
                  >
                    <span className={`text-xs font-bold uppercase tracking-widest ${highlight ? 'text-white' : ''}`}>{label}</span>
                    <div className="flex items-center gap-2">
                      {original && <span className={`line-through text-[10px] ${highlight ? 'text-white/40' : 'text-black/30'}`}>{original}</span>}
                      <span className={`text-xs font-black ${highlight ? 'text-white' : ''}`}>{price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleAddToCart}
                className={`w-full py-4 text-xs font-black uppercase tracking-widest border-2 transition-all duration-300 ${
                  addedToCart
                    ? 'bg-green-600 border-green-600 text-white'
                    : 'border-[#0a1628] text-[#0a1628] hover:bg-[#0a1628] hover:text-white'
                }`}
              >
                {addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
              </button>
              <button
                onClick={handleBuyNow}
                className="w-full py-4 text-xs font-black uppercase tracking-widest bg-[#0a1628] text-white border-2 border-[#0a1628] hover:bg-[#0a1628]/80 transition-all duration-300"
              >
                Buy Now
              </button>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

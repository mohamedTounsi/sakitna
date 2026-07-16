"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getProducts } from "@/app/actions/product";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toTND } from "@/lib/currency";

const CATEGORIES = ["All", "Tees", "Hoodies", "Bottoms", "Accessories"];

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [count, setCount] = useState(0);

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data);
      setCount(data.length);
    });
  }, []);

  const filtered =
    activeCategory === "All"
      ? products
      : products.filter(
          (p) =>
            p.category?.toLowerCase() === activeCategory.toLowerCase()
        );

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Page header */}
      <div className="pt-24 sm:pt-28 pb-4 px-5 sm:px-8 md:px-16 max-w-screen-2xl mx-auto w-full flex items-end justify-between border-b border-black/10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter text-[#0a1628]">
          SHOP
        </h1>
        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-black/40 pb-1">
          {filtered.length} / {count}
        </span>
      </div>

      {/* Mobile category scroll row */}
      <div className="flex md:hidden gap-5 px-5 sm:px-8 pt-5 pb-2 overflow-x-auto scrollbar-none border-b border-black/5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 text-[10px] font-black uppercase tracking-widest pb-2 transition-all duration-200 border-b-2 ${
              activeCategory === cat
                ? "text-black border-black"
                : "text-black/30 border-transparent"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Body: sidebar + grid */}
      <div className="flex flex-1 max-w-screen-2xl mx-auto w-full px-5 sm:px-8 md:px-16 py-8 md:py-10 gap-10 md:gap-12">

        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col gap-3 w-36 shrink-0 pt-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-left text-[10px] font-black uppercase tracking-widest transition-all duration-200 py-0.5 ${
                activeCategory === cat
                  ? "text-black"
                  : "text-black/25 hover:text-black/60"
              }`}
            >
              {cat}
            </button>
          ))}
        </aside>

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          {filtered.length === 0 ? (
            <div className="text-xs text-black/30 uppercase tracking-widest font-bold pt-4">
              No products available yet.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-8 sm:gap-y-10">
              {filtered.map((product) => {
                const frontImage = product.frontImage || product.image;
                const backImage = product.backImage;

                return (
                  <Link
                    href={`/shop/${product._id}`}
                    key={product._id}
                    className="group flex flex-col cursor-pointer"
                  >
                    {/* Image */}
                    <div className="relative aspect-square bg-[#f0f0f0] mb-3 overflow-hidden">
                      {product.isMostWanted && (
                        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-white border border-black/10 text-[8px] sm:text-[9px] px-1.5 sm:px-2 py-0.5 z-10 text-black/50 font-bold uppercase tracking-widest">
                          Most wanted
                        </div>
                      )}

                      {frontImage && (
                        <img
                          src={frontImage}
                          alt={product.title}
                          className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
                            backImage
                              ? "group-hover:opacity-0 group-hover:scale-105"
                              : "group-hover:scale-105"
                          }`}
                        />
                      )}

                      {backImage && (
                        <img
                          src={backImage}
                          alt={product.title + " back"}
                          className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                        />
                      )}

                      {/* Hover bar */}
                      <div className="absolute bottom-0 left-0 right-0 h-0 group-hover:h-[3px] bg-[#0a1628] transition-all duration-300" />
                    </div>

                    {/* Info */}
                    <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-black leading-tight">
                      {product.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] sm:text-[11px] font-medium text-black/50">
                        {toTND(product.price1)}
                      </span>
                      {product.originalPrice && (
                        <span className="line-through text-[9px] sm:text-[10px] text-black/30">
                          {toTND(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}

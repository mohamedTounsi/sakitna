"use client";

import Link from "next/link";
import { ShoppingCart, Menu, X } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isLandingPage = pathname === "/";
  const isWhiteText = isLandingPage && !scrolled;
  const textColorClass = isWhiteText ? "text-white" : "text-black";

  return (
    <header
      className={`fixed top-0 w-full z-50 flex items-center justify-between px-8 py-5 transition-all duration-500 ${
        scrolled
          ? "bg-white/30 backdrop-blur-xl shadow-sm border-b border-white/20 py-4"
          : "bg-transparent"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center">
        <Link href="/">
          <Image
            src={isWhiteText ? "/logosakitnawhite.png" : "/logosakitnablack.png"}
            alt="Sakitna Logo"
            width={300}
            height={160}
            className="h-16 w-auto object-contain cursor-pointer"
            priority
          />
        </Link>
      </div>

      {/* Center Nav */}
      <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 space-x-10">
        {[
          { label: "Collection", href: "/shop" },
          { label: "About", href: "#about" },
          { label: "Drops", href: "#drops" },
        ].map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            className={`text-sm font-semibold uppercase tracking-widest transition-all duration-300 hover:opacity-60 ${textColorClass}`}
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* Right — Cart */}
      <div className="flex items-center gap-6">
        <Link
          href="/checkout"
          className={`flex items-center gap-2 text-sm font-semibold uppercase tracking-widest transition-all duration-300 hover:opacity-60 ${textColorClass}`}
        >
          <ShoppingCart size={18} />
          <span>Cart [{cartCount}]</span>
        </Link>

        {/* Mobile hamburger */}
        <button
          className={`md:hidden transition ${textColorClass}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white/80 backdrop-blur-xl border-t border-gray-200 flex flex-col py-6 px-8 gap-4 md:hidden shadow-lg">
          {["Collection", "About", "Drops"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-bold uppercase tracking-widest text-gray-500 hover:opacity-60 transition"
            >
              {item}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

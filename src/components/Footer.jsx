"use client";

import Link from "next/link";

function InstagramIcon({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="relative w-full bg-[#050b14] text-white pt-20 pb-10 px-6 sm:px-12 md:px-20 lg:px-32 border-t border-white/5 texture-grain">
      <div className="max-w-[1440px] mx-auto flex flex-col">

        {/* Main Section: Logo and Link Columns */}
        <div className="flex flex-col lg:flex-row justify-between items-start pb-16 gap-14 lg:gap-8 border-b border-white/10">

          {/* Logo */}
          <div className="shrink-0">
            <Link href="/">
              <img
                src="/logosakitnawhite.png"
                alt="Sakitna Logo"
                className="h-24 w-auto object-contain cursor-pointer opacity-90 hover:opacity-100 transition-opacity duration-300"
              />
            </Link>
          </div>

          {/* Navigation Link Columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 lg:gap-16 w-full lg:w-auto">

            {/* Column 1: Shop */}
            <div>
              <h4 className="text-xs font-black tracking-[0.25em] uppercase text-white mb-6">
                SHOP
              </h4>
              <ul className="flex flex-col gap-3">
                {["All Products", "Hoodies", "T-Shirts", "Accessories"].map((item) => (
                  <li key={item}>
                    <Link
                      href="/shop"
                      className="text-[10px] font-bold tracking-widest text-slate-400 uppercase hover:text-white transition duration-300"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Collections */}
            <div>
              <h4 className="text-xs font-black tracking-[0.25em] uppercase text-white mb-6">
                COLLECTIONS
              </h4>
              <ul className="flex flex-col gap-3">
                {["Foundations", "Sfaxian", "Archive"].map((item) => (
                  <li key={item}>
                    <Link
                      href="/shop"
                      className="text-[10px] font-bold tracking-widest text-slate-400 uppercase hover:text-white transition duration-300"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: About */}
            <div>
              <h4 className="text-xs font-black tracking-[0.25em] uppercase text-white mb-6">
                ABOUT
              </h4>
              <ul className="flex flex-col gap-3">
                {["Our Story", "Heritage", "Community"].map((item) => (
                  <li key={item}>
                    <Link
                      href="#about"
                      className="text-[10px] font-bold tracking-widest text-slate-400 uppercase hover:text-white transition duration-300"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Info */}
            <div>
              <h4 className="text-xs font-black tracking-[0.25em] uppercase text-white mb-6">
                INFO
              </h4>
              <ul className="flex flex-col gap-3">
                {["Shipping", "Returns", "FAQ"].map((item) => (
                  <li key={item}>
                    <Link
                      href="/"
                      className="text-[10px] font-bold tracking-widest text-slate-400 uppercase hover:text-white transition duration-300"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom Bar: Copyright & Instagram */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 text-[10px] tracking-[0.2em] font-bold text-slate-400 uppercase gap-4">
          <div>
            © 2026 SAKITNA &mdash; STREETWEAR INSPIRED BY PASSION
          </div>

          {/* Instagram only */}
          <Link
            href="https://www.instagram.com/sakitna_3011/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-white transition duration-300 group"
          >
            <span className="group-hover:scale-110 transition-transform duration-300">
              <InstagramIcon size={18} />
            </span>
            <span>INSTAGRAM</span>
          </Link>
        </div>

      </div>
    </footer>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bebas_Neue } from "next/font/google";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
});

export default function Hero() {
  return (
    <section className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <motion.div
        initial={{ scale: 1.05, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-[url('/herosakitnablackmobile.png')] md:bg-[url('/herosakitna2.png')]"
      >
        <div className="absolute inset-0 bg-black/50"></div>{" "}
        {/* Overlay to ensure text readability against the image */}
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 w-full h-full max-w-[1920px] mx-auto">
        {/* Left Middle Content */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="absolute top-1/2 -translate-y-1/2 left-4 md:left-8 flex flex-col items-start"
        >
          <div className="flex flex-col items-center">
            <p className="text-white text-[8px] md:text-[11px] uppercase tracking-[0.2em] font-medium mb-1 md:mb-2">
              DROP 001
            </p>
            <h1
              className={`${bebasNeue.className} text-white text-[2.6rem] sm:text-8xl md:text-[9rem] lg:text-[10rem] uppercase tracking-normal leading-[0.8] drop-shadow-2xl`}
            >
              FOUNDATIONS
            </h1>
          </div>
          <p className="hidden md:block text-white text-xs uppercase font-bold tracking-[0.15em] max-w-sm leading-relaxed mt-6 mb-8">
            INSPIRED BY THE SYMBOLS <br /> THAT DEFINE SAKIA.
          </p>
          <Link
            href="/shop"
            className="text-white uppercase text-[8px] md:text-xs font-bold tracking-[0.2em] border-2 border-white/80 rounded-none px-4 py-2 md:px-6 md:py-3 mt-3 md:mt-0 hover:bg-white hover:text-black transition-all duration-300 flex items-center gap-2"
          >
            EXPLORE SHOP &mdash;
          </Link>
        </motion.div>

        {/* Bottom Left Elements */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="absolute bottom-3 left-3 md:bottom-8 md:left-8 flex flex-col gap-1"
        >
          <div className="text-white/90 text-[8px] md:text-[10px] font-bold tracking-[0.2em] select-none uppercase">
            34.7401° N, 10.7601° E
          </div>
          <div className="text-white/90 text-[8px] md:text-[10px] font-bold tracking-[0.2em] select-none uppercase">
            SAKIA - SFAX
          </div>
        </motion.div>

        {/* Bottom Right Elements */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="absolute bottom-4 right-4 md:bottom-6 md:right-8 flex flex-col gap-1 text-right"
        >
          <div className="text-white/90 text-[8px] md:text-[10px] font-bold tracking-[0.2em] select-none uppercase">
            STREETWEAR INSPIRED BY
          </div>
          <div className="text-white/90 text-[8px] md:text-[10px] font-bold tracking-[0.2em] select-none uppercase">
            PASSION - HERITAGE - SFAX.
          </div>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { Bebas_Neue } from "next/font/google";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
});

export default function Countdown({ frontImage, backImage }) {
  const scrollToDrops = (e) => {
    e.preventDefault();
    const dropsSection = document.getElementById("drops");
    if (dropsSection) {
      dropsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#050b14] text-white py-10 sm:py-12 md:py-14 px-6 sm:px-12 md:px-20 lg:px-32 texture-grain border-b border-white/5">
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-4">

        {/* Left Side: Drop announcement */}
        <div className="w-full lg:w-[45%] flex flex-col items-start z-10 order-2 lg:order-1">

          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-white/10 backdrop-blur-md px-3 py-1 text-[9px] tracking-[0.25em] uppercase font-bold text-white/60 mb-3"
          >
            DROP 001
          </motion.div>

          {/* Main headline — single line */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className={`${bebasNeue.className} text-[clamp(3.5rem,8vw,7rem)] uppercase tracking-tight leading-none text-white whitespace-nowrap mb-3`}
          >
            DROP 001 IS HERE.
          </motion.h2>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
            className="w-14 h-px bg-white/30 origin-left mb-4"
          />

          {/* Sub-label */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="text-[10px] sm:text-xs text-slate-400 font-bold tracking-[0.2em] uppercase mb-7"
          >
            FOUNDATIONS &mdash; AVAILABLE NOW
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="flex flex-row gap-3 w-full sm:w-auto"
          >
            <a
              href="#drops"
              onClick={scrollToDrops}
              className="bg-white text-[#050b14] text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] px-6 py-3 border-2 border-white rounded-none hover:bg-transparent hover:text-white transition-all duration-300 cursor-pointer text-center whitespace-nowrap"
            >
              SHOP NOW
            </a>
            <a
              href="#drops"
              onClick={scrollToDrops}
              className="text-white border-2 border-white/20 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] px-6 py-3 rounded-none hover:bg-white hover:text-[#050b14] hover:border-white transition-all duration-300 cursor-pointer text-center whitespace-nowrap"
            >
              VIEW LOOKBOOK
            </a>
          </motion.div>
        </div>

        {/* Right Side: T-shirts — bigger & tighter */}
        <div className="w-full lg:w-[55%] flex items-center justify-center relative h-[380px] sm:h-[460px] md:h-[520px] lg:h-[500px] select-none order-1 lg:order-2">
          <div className="relative w-full h-full max-w-[600px] mx-auto">

            {/* Front Image */}
            <motion.div
              initial={{ opacity: 0, x: -50, rotate: -15 }}
              animate={{ opacity: 1, x: 0, rotate: -8 }}
              transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
              whileHover={{ scale: 1.05, rotate: -4, transition: { duration: 0.3 } }}
              className="absolute left-0 top-[4%] w-[68%] aspect-[3/4] z-10 cursor-pointer drop-shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
            >
              <img
                src="/front.png"
                alt="Foundations T-Shirt Front"
                className="w-full h-full object-contain filter brightness-[0.9] hover:brightness-100 transition-all duration-300"
              />
              <div className="absolute -bottom-2 left-4 bg-white/10 backdrop-blur-md px-2 py-0.5 text-[8px] tracking-wider uppercase font-bold text-white/60">
                FRONT
              </div>
            </motion.div>

            {/* Back Image */}
            <motion.div
              initial={{ opacity: 0, x: 50, rotate: 15 }}
              animate={{ opacity: 1, x: 0, rotate: 8 }}
              transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
              whileHover={{ scale: 1.05, rotate: 4, transition: { duration: 0.3 } }}
              className="absolute right-0 top-[14%] w-[68%] aspect-[3/4] z-20 cursor-pointer drop-shadow-[0_25px_60px_rgba(0,0,0,0.7)]"
            >
              <img
                src="/back.png"
                alt="Foundations T-Shirt Back"
                className="w-full h-full object-contain filter brightness-[0.9] hover:brightness-100 transition-all duration-300"
              />
              <div className="absolute -bottom-2 right-4 bg-white/10 backdrop-blur-md px-2 py-0.5 text-[8px] tracking-wider uppercase font-bold text-white/60">
                BACK
              </div>
            </motion.div>

            {/* Glow */}
            <div className="absolute top-[30%] left-[30%] -translate-x-1/2 -translate-y-1/2 w-[60%] h-[40%] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none z-0" />
          </div>
        </div>

      </div>
    </section>
  );
}

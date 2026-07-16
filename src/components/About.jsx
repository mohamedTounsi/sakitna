import Image from "next/image";

export default function About() {
  return (
    <section
      className="texture-grain relative bg-white py-24 px-8 md:px-16 border-t border-black/8"
      id="about"
    >
      <div className="max-w-screen-2xl mx-auto">
        {/* Section label */}
        <p className="text-[#0a1628]/40 text-xs font-bold uppercase tracking-[0.3em] mb-4">
          Who We Are
        </p>

        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-[#0a1628] leading-none mb-16">
          ABOUT SAKITNA
        </h2>

        <hr className="divider-textured mb-16" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left — Image */}
          <div className="relative aspect-[3/4] bg-[#f2f2f0]">
            <Image
              src="/tower.png"
              alt="Tower"
              fill
              className="object-cover"
              priority
            />
            {/* Subtle navy overlay on image */}
            <div className="absolute inset-0 bg-[#0a1628]/10 mix-blend-multiply pointer-events-none" />
          </div>

          {/* Right — Content */}
          <div className="flex flex-col justify-center lg:pt-8">
            {/* Logo mark */}
            <div
              className="relative w-40 h-24 mb-10"
              style={{
                backgroundImage: "url('/logofull.png')",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
              }}
            />

            {/* Decorative rule */}
            <div className="w-12 h-[3px] bg-[#0a1628] mb-8" />

            <div className="text-[#0a1628]/60 text-base leading-relaxed space-y-5 max-w-md mb-12">
              <p>
                Sakitna is a streetwear brand rooted in the identity of Sfax,
                Tunisia — built on heritage, pride, and the quiet strength of a
                city the world overlooks.
              </p>
              <p>
                Every piece we make is a statement. Not loud. Not fleeting. Just
                real — inspired by the symbols, architecture, and soul of home.
              </p>
            </div>

            {/* Stats row */}
            <div className="flex gap-12 border-t border-black/10 pt-8">
              <div>
                <p className="text-3xl font-black text-[#0a1628]">001</p>
              </div>
              <div>
                <p className="text-3xl font-black text-[#0a1628]">3011</p>
              </div>
              <div>
                <p className="text-3xl font-black text-[#0a1628]">1956</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

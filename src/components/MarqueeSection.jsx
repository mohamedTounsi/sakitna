export default function MarqueeSection() {
  return (
    <div className="w-full bg-black py-4 overflow-hidden flex whitespace-nowrap items-center border-y border-neutral-800">
      <div className="animate-marquee flex space-x-8 items-center text-white uppercase font-black text-2xl tracking-widest">
        {/* Repeat enough times to fill the screen */}
        {[...Array(12)].map((_, i) => (
          <div key={i} className="flex items-center space-x-8">
            <span>DROP 001</span>
            <div className="w-3 h-3 bg-red-600 rotate-45"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

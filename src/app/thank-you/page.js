import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { Bebas_Neue } from 'next/font/google';

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
});

export default function ThankYou() {
  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <section className="texture-grain py-32 px-6 md:px-16 max-w-screen-xl mx-auto flex-1 w-full mt-24 flex flex-col items-center justify-center text-center">
        {/* Brand Logo */}
        <div className="mb-10">
          <Image
            src="/logosakitnablack.png"
            alt="Sakitna Logo"
            width={400}
            height={200}
            className="h-20 w-auto object-contain"
            priority
          />
        </div>

        {/* Heading */}
        <h1 className={`${bebasNeue.className} text-7xl md:text-9xl uppercase tracking-normal text-[#0a1628] leading-none mb-6`}>
          Order Placed
        </h1>
        
        {/* Decorative divider */}
        <hr className="divider-textured w-full max-w-md mb-8" />
        
        {/* Success message */}
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#0a1628]/60 mb-12 max-w-lg leading-relaxed">
          Thank you for shopping with us. Your order has been registered successfully. We will contact you soon to arrange delivery.
        </p>

        {/* CTA Button */}
        <Link 
          href="/shop" 
          className="border-2 border-[#0a1628] text-[#0a1628] hover:bg-[#0a1628] hover:text-white transition-all duration-300 font-black tracking-[0.25em] uppercase rounded-none py-4 px-10 text-[10px]"
        >
          Continue Shopping &mdash;
        </Link>
      </section>
      
      <Footer />
    </main>
  );
}

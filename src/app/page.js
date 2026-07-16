import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Countdown from '@/components/Countdown';
import MarqueeSection from '@/components/MarqueeSection';
import Drops from '@/components/Drops';
import About from '@/components/About';
import Footer from '@/components/Footer';
import { getProducts } from '@/app/actions/product';

export default async function Home() {
  const allProducts = await getProducts();
  const foundationsProduct = allProducts.find(
    (p) => p.title && p.title.toUpperCase().includes('FOUNDATIONS')
  ) || allProducts[0];

  const frontImage = foundationsProduct?.frontImage || foundationsProduct?.image || '';
  const backImage = foundationsProduct?.backImage || '';

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <MarqueeSection />
      <Countdown frontImage={frontImage} backImage={backImage} />
      <About />
      <Drops />
      <Footer />
    </main>
  );
}


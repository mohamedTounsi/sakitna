import Link from 'next/link';
import { getProducts } from '@/app/actions/product';
import { toTND } from '@/lib/currency';

export default async function Drops() {
  const allProducts = await getProducts();
  const products = allProducts.slice(0, 4);

  return (
    <section className="texture-grain bg-white py-24 px-8 md:px-16 border-t border-black/8" id="drops">
      <div className="max-w-screen-2xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-4">
          <div>
            <p className="text-[#0a1628]/40 text-xs font-bold uppercase tracking-[0.3em] mb-3">
              Drop 001
            </p>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-[#0a1628] leading-none">
              FOUNDATIONS
            </h2>
          </div>
          <Link
            href="/shop"
            className="self-start md:self-end text-[#0a1628] border-2 border-[#0a1628]/30 text-xs font-bold uppercase tracking-widest px-6 py-3 hover:bg-[#0a1628] hover:text-white hover:border-[#0a1628] transition-all duration-300"
          >
            View All &mdash;
          </Link>
        </div>

        {/* Dashed divider */}
        <hr className="divider-textured mb-12" />

        {/* Grid */}
        {products.length === 0 ? (
          <div className="text-[#0a1628]/30 text-sm uppercase tracking-widest font-bold">
            No products available yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product, index) => {
              const frontImage = product.frontImage || product.image;
              const backImage = product.backImage;

              return (
                <Link
                  href={`/shop/${product._id}`}
                  key={product._id}
                  className="group flex flex-col cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative aspect-square bg-[#f2f2f0] mb-4 overflow-hidden">
                    {/* Drop number watermark */}
                    <span className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-widest text-[#0a1628]/20 z-10">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    {product.isMostWanted && (
                      <div className="absolute top-3 right-3 bg-[#0a1628] text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 z-10">
                        Hot
                      </div>
                    )}

                    {frontImage && (
                      <img
                        src={frontImage}
                        alt={product.title}
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
                          backImage
                            ? 'group-hover:opacity-0 group-hover:scale-105'
                            : 'group-hover:scale-105'
                        }`}
                      />
                    )}
                    {backImage && (
                      <img
                        src={backImage}
                        alt={product.title + ' back'}
                        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                      />
                    )}

                    {/* Bottom navy bar on hover */}
                    <div className="absolute bottom-0 left-0 right-0 h-0 group-hover:h-1 bg-[#0a1628] transition-all duration-300" />
                  </div>

                  {/* Info */}
                  <p className="text-[#0a1628] text-[11px] font-black uppercase tracking-widest leading-tight">
                    {product.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[#0a1628]/50 text-[11px] font-medium">
                      {toTND(product.price1)}
                    </span>
                    {product.originalPrice && (
                      <span className="line-through text-black/25 text-[10px]">
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
    </section>
  );
}

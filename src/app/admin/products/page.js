import { getProducts } from '@/app/actions/product';
import Link from 'next/link';
import DeleteButton from './DeleteButton';
import { Plus, Pencil, Eye } from 'lucide-react';
import { toTND } from '@/lib/currency';

export default async function AdminProducts() {
  const products = await getProducts();

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="border-b border-white/8 pb-8 flex items-end justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-2">Management</p>
          <h1 className="text-4xl font-black tracking-tight text-white uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.05em' }}>
            Products
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 mt-2">
            {products.length} items in catalogue
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-white text-[#050b14] text-[10px] font-black uppercase tracking-[0.2em] px-6 py-3 hover:bg-white/90 transition-all duration-300"
        >
          <Plus size={13} />
          New Product
        </Link>
      </div>

      {/* Products table */}
      <div className="border border-white/8 bg-[#07101f] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/8">
              {['Product', 'Price ×1', 'Price ×2', 'Status', 'Actions'].map((h) => (
                <th key={h} className="px-6 py-4 text-[9px] font-bold uppercase tracking-[0.25em] text-slate-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-14 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">
                  No products yet.{' '}
                  <Link href="/admin/products/new" className="text-white hover:underline">
                    Add your first one.
                  </Link>
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const displayImage = product.frontImage || product.image;
                const backImage = product.backImage;
                return (
                  <tr key={product._id} className="border-b border-white/5 hover:bg-white/2 transition group">

                    {/* Product with hover image swap */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 flex-shrink-0 bg-white/5 border border-white/8 overflow-hidden">
                          {displayImage && (
                            <img
                              src={displayImage}
                              alt={product.title}
                              className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-300 ${backImage ? 'group-hover:opacity-0' : ''}`}
                            />
                          )}
                          {backImage && (
                            <img
                              src={backImage}
                              alt={product.title + ' back'}
                              className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            />
                          )}
                          {!displayImage && (
                            <span className="absolute inset-0 flex items-center justify-center text-[8px] text-slate-600 uppercase font-bold">IMG</span>
                          )}
                        </div>
                        <span className="text-white font-bold text-sm uppercase tracking-wide">{product.title}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-white font-black text-sm">{toTND(product.price1)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-400 text-sm font-bold">{toTND(product.price2)}</span>
                    </td>

                    <td className="px-6 py-4">
                      {product.isMostWanted ? (
                        <span className="text-[9px] font-black uppercase tracking-[0.15em] border border-white/20 text-white px-3 py-1.5 bg-white/5">
                          ★ Most Wanted
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-600">Standard</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/shop/${product._id}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-slate-500 hover:text-white border border-transparent hover:border-white/15 transition-all duration-200"
                          title="View in store"
                        >
                          <Eye size={11} />
                          View
                        </Link>
                        <Link
                          href={`/admin/products/${product._id}/edit`}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-slate-500 hover:text-white border border-transparent hover:border-white/15 transition-all duration-200"
                          title="Edit product"
                        >
                          <Pencil size={11} />
                          Edit
                        </Link>
                        <DeleteButton productId={product._id} />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

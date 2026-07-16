import { getProducts } from '@/app/actions/product';
import { getOrders } from '@/app/actions/order';
import Link from 'next/link';
import { Package, ShoppingBag, TrendingUp, Plus, Eye, ArrowRight } from 'lucide-react';
import { toTND } from '@/lib/currency';

export default async function AdminDashboard() {
  const products = await getProducts();
  const orders = await getOrders();
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  const stats = [
    {
      label: 'Total Products',
      value: products.length,
      icon: Package,
      sub: 'In catalogue',
    },
    {
      label: 'Total Orders',
      value: orders.length,
      icon: ShoppingBag,
      sub: `${pendingOrders} pending`,
    },
    {
      label: 'Revenue',
      value: toTND(totalRevenue),
      icon: TrendingUp,
      sub: 'All time',
      small: true,
    },
  ];

  return (
    <div className="space-y-8 md:space-y-10">

      {/* Header */}
      <div className="border-b border-white/8 pb-6 md:pb-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-2">Dashboard</p>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.05em' }}>
          Overview
        </h1>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        {stats.map(({ label, value, icon: Icon, sub, small }) => (
          <div
            key={label}
            className="bg-[#07101f] border border-white/8 p-5 md:p-7 hover:border-white/15 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4 md:mb-6">
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-500">{label}</p>
              <div className="w-8 h-8 border border-white/10 flex items-center justify-center flex-shrink-0">
                <Icon size={14} className="text-slate-400" />
              </div>
            </div>
            <p className={`font-black text-white leading-none mb-2 ${small ? 'text-2xl md:text-3xl' : 'text-4xl md:text-5xl'}`}>
              {value}
            </p>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">{sub}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex flex-wrap justify-between items-center gap-3 mb-5">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-1">Latest</p>
            <h2 className="text-lg font-black uppercase tracking-wider text-white">Recent Orders</h2>
          </div>
          <Link
            href="/admin/orders"
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white border border-white/15 px-4 py-2 hover:bg-white hover:text-[#050b14] transition-all duration-300"
          >
            View All <ArrowRight size={11} />
          </Link>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block border border-white/8 bg-[#07101f] overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/8">
                {['Customer', 'Phone', 'Total', 'Date'].map((h) => (
                  <th key={h} className="px-6 py-4 text-[9px] font-bold uppercase tracking-[0.25em] text-slate-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr key={order._id} className="border-b border-white/5 hover:bg-white/2 transition">
                  <td className="px-6 py-4 text-white font-bold text-sm">
                    {order.firstName} {order.lastName}
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-xs font-mono">{order.phone}</td>
                  <td className="px-6 py-4">
                    <span className="text-white font-black text-sm">{toTND(order.totalAmount)}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs">
                    {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-500 text-xs uppercase tracking-widest">
                    No orders yet — share your store link!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-2">
          {orders.length === 0 ? (
            <div className="border border-white/8 bg-[#07101f] px-5 py-10 text-center text-slate-500 text-xs uppercase tracking-widest">
              No orders yet — share your store link!
            </div>
          ) : (
            orders.slice(0, 5).map((order) => (
              <div key={order._id} className="border border-white/8 bg-[#07101f] px-4 py-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-white font-bold text-sm truncate">{order.firstName} {order.lastName}</p>
                  <p className="text-slate-500 text-[10px] font-mono mt-0.5">{order.phone}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-white font-black text-sm">{toTND(order.totalAmount)}</p>
                  <p className="text-slate-600 text-[9px] uppercase tracking-wider mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-4">Actions</p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 bg-white text-[#050b14] text-[10px] font-black uppercase tracking-[0.2em] px-6 py-3 hover:bg-white/90 transition-all duration-300"
          >
            <Plus size={13} />
            Add Product
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center gap-2 border border-white/15 text-white text-[10px] font-black uppercase tracking-[0.2em] px-6 py-3 hover:bg-white hover:text-[#050b14] hover:border-white transition-all duration-300"
          >
            <Eye size={13} />
            View Orders
          </Link>
        </div>
      </div>
    </div>
  );
}

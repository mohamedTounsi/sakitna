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
    <div className="space-y-10">

      {/* Header */}
      <div className="border-b border-white/8 pb-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-2">Dashboard</p>
        <h1 className="text-4xl font-black tracking-tight text-white uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.05em' }}>
          Overview
        </h1>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, sub, small }) => (
          <div
            key={label}
            className="bg-[#07101f] border border-white/8 p-7 hover:border-white/15 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-6">
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-500">{label}</p>
              <div className="w-8 h-8 border border-white/10 flex items-center justify-center">
                <Icon size={14} className="text-slate-400" />
              </div>
            </div>
            <p className={`font-black text-white leading-none mb-2 ${small ? 'text-3xl' : 'text-5xl'}`}>
              {value}
            </p>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">{sub}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex justify-between items-center mb-5">
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

        <div className="border border-white/8 bg-[#07101f] overflow-hidden">
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

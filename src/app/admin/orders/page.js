import { getOrders } from '@/app/actions/order';
import { toTND } from '@/lib/currency';
import MarkShippedButton from './MarkShippedButton';
import { Package, MapPin, Phone } from 'lucide-react';

export default async function AdminOrders() {
  const orders = await getOrders();

  const pending = orders.filter(o => o.status === 'pending').length;
  const shipped = orders.filter(o => o.status === 'completed').length;

  return (
    <div className="space-y-8 md:space-y-10">

      {/* Header */}
      <div className="border-b border-white/8 pb-6 md:pb-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-2">Management</p>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.05em' }}>
              Orders
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 mt-2">
              {orders.length} total &nbsp;·&nbsp; {pending} pending &nbsp;·&nbsp; {shipped} shipped
            </p>
          </div>

          {/* Summary chips */}
          <div className="flex items-center gap-3">
            <div className="border border-white/8 bg-[#07101f] px-4 md:px-5 py-3 text-center">
              <p className="text-xl md:text-2xl font-black text-white">{pending}</p>
              <p className="text-[8px] font-black uppercase tracking-[0.25em] text-slate-500 mt-0.5">Pending</p>
            </div>
            <div className="border border-white/8 bg-[#07101f] px-4 md:px-5 py-3 text-center">
              <p className="text-xl md:text-2xl font-black text-emerald-400">{shipped}</p>
              <p className="text-[8px] font-black uppercase tracking-[0.25em] text-slate-500 mt-0.5">Shipped</p>
            </div>
          </div>
        </div>
      </div>

      {/* Orders */}
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="border border-white/8 bg-[#07101f] px-6 py-20 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">
              No orders yet — share your shop link!
            </p>
          </div>
        ) : (
          orders.map((order, idx) => {
            const isPending = order.status === 'pending';
            const isShipped = order.status === 'completed';
            const isCancelled = order.status === 'cancelled';

            return (
              <div
                key={order._id}
                className={`border bg-[#07101f] transition-all duration-300 ${
                  isPending ? 'border-white/10' : isShipped ? 'border-emerald-500/20' : 'border-red-500/20'
                }`}
              >
                {/* ── Top bar: order meta ── */}
                <div className={`px-4 md:px-6 py-4 border-b ${
                  isPending ? 'border-white/8' : isShipped ? 'border-emerald-500/10' : 'border-red-500/10'
                }`}>
                  {/* Row 1: number + name + phone */}
                  <div className="flex items-start gap-3 md:gap-5 mb-3">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-700 mt-1 flex-shrink-0">
                      #{String(idx + 1).padStart(3, '0')}
                    </span>
                    <div className="min-w-0">
                      <p className="text-white font-black text-sm md:text-base uppercase tracking-wide leading-tight">
                        {order.firstName} {order.lastName}
                      </p>
                      <p className="flex items-center gap-1.5 text-slate-500 text-[10px] font-mono mt-0.5">
                        <Phone size={9} />
                        {order.phone}
                      </p>
                    </div>
                  </div>

                  {/* Row 2: status + total + date + action */}
                  <div className="flex flex-wrap items-center gap-2 md:gap-5 pl-6 md:pl-10">
                    {/* Status badge */}
                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 border ${
                      isShipped
                        ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/8'
                        : isCancelled
                        ? 'border-red-500/40 text-red-400 bg-red-500/8'
                        : 'border-white/15 text-slate-300 bg-white/4'
                    }`}>
                      {isShipped ? '✓ Shipped' : isCancelled ? '✕ Cancelled' : '⟳ Pending'}
                    </span>

                    {/* Total */}
                    <p className="text-white font-black text-base md:text-lg">{toTND(order.totalAmount)}</p>

                    {/* Date */}
                    <p className="text-slate-600 text-[9px] font-bold uppercase tracking-wider">
                      {new Date(order.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>

                    {/* Mark Shipped button */}
                    <MarkShippedButton orderId={order._id} currentStatus={order.status} />
                  </div>
                </div>

                {/* ── Body ── */}
                <div className="divide-y md:divide-y-0 md:grid md:grid-cols-[1fr_auto] md:divide-x divide-white/5">

                  {/* Items */}
                  <div className="px-4 md:px-6 py-5">
                    <p className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-600 mb-4 flex items-center gap-2">
                      <Package size={9} />
                      Items ({order.items.length})
                    </p>
                    <div className="space-y-3">
                      {order.items.map((item, i) => {
                        const productImg = item.product?.frontImage || item.product?.image || null;
                        return (
                          <div key={i} className="flex items-center gap-3 md:gap-4">
                            {/* Image */}
                            {productImg ? (
                              <div className="w-10 h-10 md:w-12 md:h-12 border border-white/8 overflow-hidden flex-shrink-0 bg-white/5">
                                <img src={productImg} alt={item.title} className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <div className="w-10 h-10 md:w-12 md:h-12 border border-white/8 bg-white/5 flex items-center justify-center flex-shrink-0">
                                <span className="text-[7px] text-slate-700 uppercase font-black">IMG</span>
                              </div>
                            )}

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-[11px] font-black uppercase tracking-wider leading-tight truncate">
                                {item.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                {item.size ? (
                                  <span className="text-[9px] font-black uppercase tracking-[0.15em] text-white border border-white/20 bg-white/5 px-2 py-0.5">
                                    SIZE {item.size}
                                  </span>
                                ) : (
                                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-700 border border-white/8 px-2 py-0.5">
                                    No size
                                  </span>
                                )}
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                                  × {item.quantity}
                                </span>
                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-wider">
                                  {toTND(item.price)}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Delivery address */}
                  <div className="px-4 md:px-6 py-5 md:w-64 flex-shrink-0">
                    <p className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-600 mb-3 flex items-center gap-2">
                      <MapPin size={9} />
                      Ship To
                    </p>
                    <p className="text-slate-300 text-[11px] font-medium leading-relaxed">
                      {order.address}
                    </p>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

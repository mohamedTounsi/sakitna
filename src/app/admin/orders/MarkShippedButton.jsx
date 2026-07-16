"use client";

import { useState } from 'react';
import { updateOrderStatus } from '@/app/actions/order';
import { Truck, Loader2 } from 'lucide-react';

export default function MarkShippedButton({ orderId, currentStatus }) {
  const [loading, setLoading] = useState(false);

  if (currentStatus !== 'pending') return null;

  const handleClick = async () => {
    setLoading(true);
    await updateOrderStatus(orderId, 'completed');
    // revalidatePath in the server action will refresh the page
    setLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="flex items-center gap-2 bg-white text-[#050b14] text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 hover:bg-white/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <>
          <Loader2 size={11} className="animate-spin" />
          Updating...
        </>
      ) : (
        <>
          <Truck size={11} />
          Mark Shipped
        </>
      )}
    </button>
  );
}

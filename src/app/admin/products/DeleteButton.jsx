"use client";

import { useState } from 'react';
import { deleteProduct } from '@/app/actions/product';
import { useRouter } from 'next/navigation';
import { Trash2, Loader2 } from 'lucide-react';

export default function DeleteButton({ productId }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    setLoading(true);
    await deleteProduct(productId);
    router.refresh();
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-red-400/50 hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all duration-200 disabled:opacity-40"
      title="Delete product"
    >
      {loading ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />}
      Delete
    </button>
  );
}

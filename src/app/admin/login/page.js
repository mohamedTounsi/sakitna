"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/app/actions/auth';
import Image from 'next/image';

export default function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const formData = new FormData(e.target);
    const res = await login(formData);
    
    if (res.success) {
      router.push('/admin');
    } else {
      setError(res.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050b14] flex items-center justify-center p-8">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <Image
            src="/logosakitnawhite.png"
            alt="Sakitna"
            width={48}
            height={48}
            className="object-contain mb-5"
          />
          <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-slate-500 mb-1">Sakitna</p>
          <h1 className="text-2xl font-black uppercase tracking-[0.15em] text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            Admin Access
          </h1>
          <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-600 mt-1">Authorized Personnel Only</p>
        </div>

        {error && (
          <div className="border border-red-500/30 bg-red-500/8 text-red-400 px-4 py-3 mb-6 text-[10px] font-bold uppercase tracking-[0.2em]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[9px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full bg-[#07101f] border border-white/10 text-white px-4 py-3.5 text-sm focus:outline-none focus:border-white/30 transition-all duration-300 placeholder-slate-700 font-mono"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-[#050b14] py-3.5 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Authenticating...' : 'Enter Dashboard'}
          </button>
        </form>

        <p className="text-center text-[9px] font-bold uppercase tracking-[0.25em] text-slate-700 mt-8">
          © {new Date().getFullYear()} Sakitna
        </p>
      </div>
    </div>
  );
}

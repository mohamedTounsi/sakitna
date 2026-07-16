"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { logout } from '@/app/actions/auth';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Store,
  LogOut,
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const isActive = (item) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <div className="min-h-screen flex bg-[#050b14] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Sidebar */}
      <aside className="w-64 bg-[#07101f] border-r border-white/8 flex flex-col flex-shrink-0">

        {/* Brand */}
        <div className="px-6 py-7 border-b border-white/8">
          <div className="flex items-center gap-3">
            <Image
              src="/logosakitnawhite.png"
              alt="Sakitna"
              width={32}
              height={32}
              className="object-contain"
            />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Sakitna</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = isActive({ href, exact: href === '/admin' });
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-[0.15em] transition-all duration-200 relative ${
                  active
                    ? 'text-white bg-white/6 border border-white/10'
                    : 'text-slate-500 hover:text-white hover:bg-white/4'
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-0 h-full w-[2px] bg-white" />
                )}
                <Icon size={14} className={active ? 'text-white' : 'text-slate-500'} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-4 py-5 border-t border-white/8 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-[0.15em] text-slate-500 hover:text-white hover:bg-white/4 transition-all duration-200"
          >
            <Store size={14} />
            Storefront
          </Link>
          <button
            onClick={async () => await logout()}
            className="flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-[0.15em] text-red-400/60 hover:text-red-400 hover:bg-red-500/8 transition-all duration-200 w-full text-left"
          >
            <LogOut size={14} />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto min-h-screen bg-[#050b14]">
        {/* Top bar */}
        <div className="border-b border-white/8 px-10 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">Live</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-600">
            {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
          </p>
        </div>
        <div className="p-10">
          {children}
        </div>
      </main>
    </div>
  );
}

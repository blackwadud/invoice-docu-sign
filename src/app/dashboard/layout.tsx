'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, FilePlus, ArrowUp, ArrowDown, FileSignature, CheckCircle } from 'lucide-react';
import { logout } from '@/lib/auth';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const onLogout = async () => {
    await logout();
    router.push('/');
  };

  const nav = [
    { label: 'New Invoice',       href: '/dashboard/create',        icon: <FilePlus className="mr-2" size={18} /> },
    { label: 'Outbound',          href: '/dashboard/sent',          icon: <ArrowUp className="mr-2" size={18} /> },
    { label: 'Inbound',           href: '/dashboard/received',      icon: <ArrowDown className="mr-2" size={18} /> },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen font-poppins">
      {/* Mobile header */}
      <div className="flex items-center justify-between p-4 border-b md:hidden">
        <button onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
        <span className="text-lg font-semibold">Dashboard</span>
        <button
          onClick={onLogout}
          className="bg-black text-white px-3 py-1 rounded text-sm"
        >
          Logout
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`bg-white border-r w-64 p-6 space-y-6 md:block ${open ? 'block' : 'hidden'}`}>
        <div className="hidden md:block">
          <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>
        </div>

        <nav className="space-y-2">
          {nav.map((n) => {
            const active = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`flex items-center px-3 py-2 rounded transition ${
                  active
                    ? 'bg-black text-white'
                    : 'hover:bg-gray-200 text-black'
                }`}
              >
                {n.icon}
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto hidden md:block">
          <button
            onClick={onLogout}
            className="w-full bg-black text-white py-2 rounded"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 bg-white">
        {children}
      </main>
    </div>
  );
}

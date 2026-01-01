"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, ClipboardList, Cookie, Calculator, BookOpen, 
  PlayCircle, Ticket, User, LogOut, LayoutDashboard, ShieldCheck 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        setUserRole(data?.role || 'paciente');
      }
    }
    getProfile();
  }, []);

  const menuItems = [
    { label: 'Início', href: '/dashboard', icon: Home },
    { label: 'Fazer Check-in', href: '/dashboard/checkin', icon: ClipboardList },
    { label: 'Monitor de Beliscadas', href: '/dashboard/beliscadas', icon: Cookie },
    { label: 'Calculadora', href: '/dashboard/calculadora', icon: Calculator },
    { label: 'Biblioteca (E-books)', href: '/dashboard/biblioteca', icon: BookOpen },
    { label: 'Aulas Exclusivas', href: '/dashboard/aulas', icon: PlayCircle },
    { label: 'Meus Cupons', href: '/dashboard/cupons', icon: Ticket },
    { label: 'Meu Perfil', href: '/dashboard/perfil', icon: User },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <aside className="w-64 bg-slate-900 h-screen text-white flex flex-col fixed left-0 top-0 overflow-y-auto z-50 border-r border-slate-800">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">GN</div>
        <span className="font-bold text-lg tracking-tight">Garcia<span className="text-blue-500">Nutrição</span></span>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 font-medium' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'} />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}

        {/* Link Admin Visível apenas para o perfil Administrador */}
        {userRole === 'admin' && (
          <div className="mt-6 pt-6 border-t border-slate-800 animate-in fade-in duration-500">
              <Link 
                href="/dashboard/admin" 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  pathname.startsWith('/dashboard/admin')
                    ? 'bg-yellow-600/20 text-yellow-500 border border-yellow-600/30'
                    : 'text-yellow-600 hover:text-yellow-400 hover:bg-slate-800'
                }`}
              >
                <ShieldCheck size={20} />
                <span className="text-sm font-bold">Área do Nutri</span>
              </Link>
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-950/30 hover:text-red-300 transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium text-sm">Sair</span>
        </button>
      </div>
    </aside>
  );
}
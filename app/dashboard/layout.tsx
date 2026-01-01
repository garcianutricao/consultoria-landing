"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, ClipboardList, Cookie, Calculator, BookOpen, 
  PlayCircle, Ticket, User, LogOut, ShieldCheck, Menu, X 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import GlobalAlerts from './components/GlobalAlerts';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingRole, setLoadingRole] = useState(true); // Evita o "pulo" visual
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    async function checkUserRole() {
      const { data: { user } } = await supabase.auth.getUser();

      // 1. Se não houver usuário logado, manda pro login
      if (!user) {
        router.replace('/login');
        return;
      }
      
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        const userIsAdmin = data?.role === 'admin';
        setIsAdmin(userIsAdmin);
        
        // Se for Admin e estiver na raiz /dashboard, redireciona para /dashboard/admin
        if (userIsAdmin && pathname === '/dashboard') {
           router.push('/dashboard/admin');
        }
      }
      setLoadingRole(false);
    }
    checkUserRole();
  }, [pathname, router]);

  const menuItems = [
    { name: 'Início', icon: Home, href: '/dashboard' },
    { name: 'Fazer Check-in', icon: ClipboardList, href: '/dashboard/checkin' },
    { name: 'Monitor de Beliscadas', icon: Cookie, href: '/dashboard/beliscadas' },
    { name: 'Calculadora', icon: Calculator, href: '/dashboard/calculadora' },
    { name: 'Biblioteca (E-books)', icon: BookOpen, href: '/dashboard/biblioteca' },
    { name: 'Aulas Exclusivas', icon: PlayCircle, href: '/dashboard/aulas' },
    { name: 'Meus Cupons', icon: Ticket, href: '/dashboard/cupons' },
    { name: 'Meu Perfil', icon: User, href: '/dashboard/perfil' },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* --- SIDEBAR --- */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out border-r border-slate-800
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 flex flex-col
      `}>
        
        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-slate-800">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold mr-3">
            GN
          </div>
          <span className="font-bold text-xl tracking-tight">Garcia<span className="text-blue-500">Nutrição</span></span>
        </div>

        {/* Navegação */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          
          {/* 1. SE FOR PACIENTE (MOSTRA MENU COMPLETO) */}
          {!isAdmin && !loadingRole && menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50 font-medium' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            );
          })}

          {/* 2. SE FOR ADMIN (MOSTRA APENAS O PAINEL DOURADO) */}
          {isAdmin && !loadingRole && (
            <div className="animate-in fade-in duration-300">
              <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Administração</p>
              <Link 
                href="/dashboard/admin" 
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group border ${
                  pathname.startsWith('/dashboard/admin') 
                    // ESTILO ATIVO (Dourado Brilhante com Fundo)
                    ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 shadow-lg shadow-yellow-900/20' 
                    // ESTILO INATIVO (Dourado Escuro, clareia no hover)
                    : 'text-yellow-600 border-transparent hover:bg-slate-800 hover:text-yellow-400'
                }`}
              >
                <ShieldCheck className="w-5 h-5" />
                <span className="font-bold text-sm">Painel Admin</span>
              </Link>
            </div>
          )}
        </nav>

        {/* Footer Sidebar (Logout) */}
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-950/30 rounded-xl w-full transition group"
          >
            <LogOut className="w-5 h-5 group-hover:text-red-300" />
            <span className="font-medium text-sm group-hover:text-red-300">Sair do Sistema</span>
          </button>
        </div>
      </aside>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Topbar Mobile */}
        <header className="md:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-40 shrink-0">
           <span className="font-bold text-slate-900">Garcia Nutrição</span>
           <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-slate-600 p-2 hover:bg-slate-100 rounded-lg">
             {isSidebarOpen ? <X /> : <Menu />}
           </button> 
        </header>

        {/* Área de Scroll do Conteúdo */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            
            {/* Oculta Alertas Globais para o Admin para limpar a tela */}
            {!isAdmin && <GlobalAlerts />}
            
            {children}
          </div>
        </main>
      </div>

      {/* Overlay Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
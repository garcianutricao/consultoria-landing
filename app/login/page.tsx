"use client";

import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase'; // Importando a conexão real

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Tenta fazer login no Supabase Auth
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      // 2. Se deu certo, verifica se é Admin ou Paciente na tabela 'profiles'
      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        // 3. Redireciona
        if (profile?.role === 'admin') {
          router.push('/dashboard/admin'); // Admin vai pra área dele
        } else {
          router.push('/dashboard'); // Paciente vai pra home dele
        }
      }

    } catch (err: any) {
      console.error(err);
      setError("E-mail ou senha incorretos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        
        <div className="bg-slate-900 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl text-white font-bold text-2xl mb-4 shadow-lg shadow-blue-900/50">
            GN
          </div>
          <h1 className="text-2xl font-bold text-white">Bem-vindo de volta!</h1>
          <p className="text-slate-400 text-sm mt-2">Acesse sua área exclusiva.</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">E-mail</label>
              <div className="relative">
                <Mail className="absolute top-3.5 left-4 w-5 h-5 text-slate-400" />
                <input 
                  type="email" 
                  required
                  placeholder="seu@email.com"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-900"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Senha</label>
              <div className="relative">
                <Lock className="absolute top-3.5 left-4 w-5 h-5 text-slate-400" />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-900"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium animate-pulse">
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  Acessar Plataforma
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

          </form>

          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <p className="text-slate-500 text-sm">
              Esqueceu a senha?{' '}
              <a href="#" className="font-bold text-blue-600 hover:underline">
                Recuperar acesso
              </a>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
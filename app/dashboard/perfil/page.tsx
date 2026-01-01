"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Mail, Phone, Calendar, Shield, CreditCard, 
  LogOut, Camera, Lock, CheckCircle, Clock, Loader2, Edit3 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function PerfilPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Estado inicial dinâmico
  const [user, setUser] = useState({
    id: "",
    nome: "",
    email: "",
    telefone: "",
    nascimento: "",
    objetivo: "",
    plano: "",
    frequenciaCheckin: "",
    inicioPlano: "",
    fimPlano: "",
    senha: "", 
    confirmarSenha: "",
    active: false,
    avatar_url: ""
  });

  // Função auxiliar para calcular data de vencimento
  const calcularVencimento = (inicio: string, plano: string) => {
    if (!inicio) return '--/--/----';
    const dataInicio = new Date(inicio);
    const dataFim = new Date(inicio);
    
    const p = plano?.toLowerCase() || '';
    if (p.includes('trimestral')) dataFim.setMonth(dataFim.getMonth() + 3);
    else if (p.includes('semestral')) dataFim.setMonth(dataFim.getMonth() + 6);
    else if (p.includes('anual')) dataFim.setFullYear(dataFim.getFullYear() + 1);
    else dataFim.setMonth(dataFim.getMonth() + 1); // Padrão Mensal

    return dataFim.toLocaleDateString('pt-BR');
  };

  // 1. BUSCAR DADOS AO CARREGAR
  useEffect(() => {
    async function getProfile() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        router.push('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profile) {
        setUser({
          id: authUser.id,
          nome: profile.full_name || "",
          email: profile.email || authUser.email || "",
          telefone: profile.phone || "",
          // Formata a data para o input type="date" (YYYY-MM-DD)
          nascimento: profile.birth_date ? new Date(profile.birth_date).toISOString().split('T')[0] : "", 
          // Tenta pegar o objetivo, se a coluna não existir, fica vazio sem quebrar
          objetivo: profile.goal || "",
          plano: profile.plan || "Não definido",
          frequenciaCheckin: profile.checkin_freq || "Semanal",
          inicioPlano: profile.start_date ? new Date(profile.start_date).toLocaleDateString('pt-BR') : "",
          fimPlano: calcularVencimento(profile.start_date, profile.plan),
          senha: "",
          confirmarSenha: "",
          active: profile.active,
          avatar_url: profile.avatar_url || ""
        });
      }
      setLoading(false);
    }

    getProfile();
  }, [router]);

  // 2. FUNÇÃO DE UPLOAD DA FOTO
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Selecione uma imagem.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload para o Bucket 'avatars'
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Pegar URL Pública
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Salvar URL no Perfil
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setUser(prev => ({ ...prev, avatar_url: publicUrl }));
      alert('Foto de perfil atualizada com sucesso!');

    } catch (error: any) {
      console.error(error);
      alert('Erro ao atualizar foto: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  // 3. SALVAR DADOS E SENHA
  const handleSave = async () => {
    if (user.senha && user.senha !== user.confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    let mensagens = [];

    // A. Atualizar Dados do Perfil
    try {
      const updateData: any = {
        full_name: user.nome,
        phone: user.telefone,
        // Só tenta salvar goal se tiver valor, para evitar erro se a coluna não existir ainda
        ...(user.objetivo && { goal: user.objetivo }), 
        ...(user.nascimento && { birth_date: user.nascimento })
      };

      const { error: profileError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (profileError) {
        console.error(profileError);
        mensagens.push("Erro ao salvar dados pessoais. Verifique a conexão.");
      } else {
        mensagens.push("Dados pessoais atualizados.");
      }
    } catch (err) {
      mensagens.push("Erro inesperado no perfil.");
    }

    // B. Atualizar Senha (apenas se preenchida)
    if (user.senha) {
      try {
        const { error: authError } = await supabase.auth.updateUser({ password: user.senha });
        if (authError) {
          mensagens.push("Erro ao atualizar senha: " + authError.message);
        } else {
          mensagens.push("Senha alterada com sucesso.");
          setUser(prev => ({ ...prev, senha: "", confirmarSenha: "" }));
        }
      } catch (err) {
        mensagens.push("Erro crítico ao tentar alterar senha.");
      }
    }

    alert(mensagens.join("\n"));
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in duration-500">
      
      {/* Cabeçalho */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <User className="text-blue-600 w-8 h-8" />
            Meu Perfil
          </h1>
          <p className="text-slate-500 mt-2">
            Gerencie seus dados pessoais, assinatura e segurança.
          </p>
        </div>

        <button 
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
            isEditing 
              ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-600/20' 
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          {isEditing ? <CheckCircle className="w-5 h-5"/> : <Edit3 className="w-5 h-5"/>}
          {isEditing ? 'Salvar Alterações' : 'Editar Dados'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- COLUNA ESQUERDA: IDENTIDADE --- */}
        <div className="space-y-6">
          
          {/* Card da Foto */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-600 to-blue-400"></div>
            
            <div className="relative mt-8 mb-4 group">
              <div className="w-32 h-32 bg-slate-200 rounded-full mx-auto border-4 border-white shadow-md flex items-center justify-center text-4xl font-bold text-slate-400 overflow-hidden relative">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="uppercase">{user.nome?.charAt(0) || 'U'}</span>
                )}
                
                {/* Overlay de Loading */}
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                )}
              </div>

              {/* Input Invisível para Foto */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleAvatarUpload} 
                className="hidden" 
                accept="image/*"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute bottom-0 right-1/2 translate-x-12 bg-slate-900 text-white p-2.5 rounded-full hover:bg-blue-600 transition-all shadow-lg hover:scale-110 active:scale-95 disabled:opacity-50 cursor-pointer z-20"
                title="Alterar foto"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <h2 className="text-xl font-bold text-slate-900">{user.nome}</h2>
            <p className="text-slate-500 text-sm mb-4">Paciente Garcia Nutrição</p>

            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${user.active ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
              <Shield className="w-3 h-3" />
              {user.active ? 'Ativo' : 'Inativo'}
            </div>
          </div>

          {/* Botão Sair */}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border border-rose-100 text-rose-600 bg-rose-50 hover:bg-rose-100 hover:border-rose-200 transition-all font-bold"
          >
            <LogOut className="w-5 h-5" />
            Sair da Plataforma
          </button>
        </div>

        {/* --- COLUNA DIREITA: DADOS --- */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 1. Assinatura e Plano */}
          <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              Detalhes do Plano
            </h3>

            <div className="bg-slate-900 text-white rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-blue-600 rounded-full blur-3xl opacity-30"></div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Plano Atual</p>
                    <h4 className="text-3xl font-bold text-white capitalize">{user.plano}</h4>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Renovação</p>
                    <p className="text-white font-medium">{user.fimPlano}</p>
                  </div>
                </div>

                <div className="h-px bg-slate-700/50 mb-4"></div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium">Frequência de Check-in:</span>
                  </div>
                  <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    {user.frequenciaCheckin}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Dados Pessoais */}
          <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Dados Pessoais
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nome Completo</label>
                <input 
                  type="text" 
                  disabled={!isEditing}
                  value={user.nome}
                  onChange={(e) => setUser({...user, nome: e.target.value})}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 disabled:opacity-70 disabled:bg-slate-100 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Data de Nascimento</label>
                <div className="relative">
                  <Calendar className="absolute top-3.5 left-3 w-4 h-4 text-slate-400" />
                  <input 
                    type="date" 
                    disabled={!isEditing}
                    value={user.nascimento}
                    onChange={(e) => setUser({...user, nascimento: e.target.value})}
                    className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 disabled:opacity-70 disabled:bg-slate-100 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Telefone (WhatsApp)</label>
                <div className="relative">
                  <Phone className="absolute top-3.5 left-3 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    disabled={!isEditing}
                    value={user.telefone}
                    onChange={(e) => setUser({...user, telefone: e.target.value})}
                    className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 disabled:opacity-70 disabled:bg-slate-100 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Objetivo Atual</label>
                <input 
                  type="text" 
                  disabled={!isEditing}
                  value={user.objetivo}
                  onChange={(e) => setUser({...user, objetivo: e.target.value})}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-blue-500 disabled:opacity-70 disabled:bg-slate-100 transition-all"
                />
              </div>
            </div>
          </section>

          {/* 3. Acesso e Segurança */}
          <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-600" />
              Acesso e Segurança
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">E-mail de Login</label>
                <div className="relative">
                  <Mail className="absolute top-3.5 left-3 w-4 h-4 text-slate-400" />
                  <input 
                    type="email" 
                    disabled={true} 
                    value={user.email}
                    className="w-full pl-10 p-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-2 ml-1">Este é o e-mail que você usa para entrar na plataforma.</p>
              </div>

              {/* Área de Senha */}
              <div className={`transition-all duration-500 overflow-hidden ${isEditing ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                  <h4 className="font-bold text-slate-700 text-sm">Alterar Senha</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">Nova Senha</label>
                      <input 
                        type="password" 
                        placeholder="••••••••"
                        value={user.senha}
                        onChange={(e) => setUser({...user, senha: e.target.value})}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">Confirmar Senha</label>
                      <input 
                        type="password" 
                        placeholder="••••••••"
                        value={user.confirmarSenha}
                        onChange={(e) => setUser({...user, confirmarSenha: e.target.value})}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-yellow-600">Deixe em branco se não quiser alterar a senha.</p>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  CheckCircle, 
  Send, 
  Calendar,
  Scale,
  Brain,
  Dumbbell,
  Moon,
  Smile,
  FileText,
  Lock,
  Clock,
  ArrowLeft,
  Loader2,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CheckInPage() {
  const router = useRouter();
  
  // --- ESTADOS DE CONTROLE ---
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [jaEnviouHoje, setJaEnviouHoje] = useState(false);

  // --- ESTADO DO FORMULÁRIO ---
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    adherence: '',
    difficulty_explanation: '', 
    dedication_level: '', 
    meals_off: 0,
    alcohol_days: 0,
    strength_training: 0,
    cardio_training: 0,
    mood: '', 
    stress: '',
    anxiety: '',
    routine_eval: '',
    body_evolution: '',
    sleep_quality: '',
    sleep_hours: 7,
    diet_changes: '',
    recommendation: '',
    rating: 10
  });

  // --- 1. BUSCAR DADOS E VERIFICAR DUPLICIDADE ---
  useEffect(() => {
    async function checkStatus() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }

        // Busca o perfil completo
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        setUserProfile(profile);

        // Verifica se já existe um check-in para este usuário na data de hoje
        const hoje = new Date().toISOString().split('T')[0];
        const { data: existente } = await supabase
          .from('checkins')
          .select('id')
          .eq('user_id', user.id)
          .eq('date', hoje)
          .maybeSingle();

        if (existente) {
          setJaEnviouHoje(true);
        }

      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    }
    checkStatus();
  }, [router]);

  // --- 2. LÓGICA DE DISPONIBILIDADE ---
  const getAvailability = () => {
    if (!userProfile) return { status: 'loading' };

    // Bloqueio por envio duplicado no mesmo dia
    if (jaEnviouHoje) {
      return { 
        status: 'bloqueado', 
        titulo: 'Check-in Já Realizado',
        msg: 'Você já enviou sua atualização de hoje! Seus dados já foram encaminhados para análise.',
        info: 'O formulário será liberado novamente no seu próximo dia de atualização.'
      };
    }

    const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const hoje = new Date();
    const diaHojeString = diasSemana[hoje.getDay()];
    
    const inicio = userProfile.start_date ? new Date(userProfile.start_date) : new Date();
    const diffTime = Math.abs(hoje.getTime() - inicio.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    const carencia = userProfile.checkin_freq === 'Semanal' ? 7 : 15;

    if (diffDays < carencia) {
      const diasRestantes = carencia - diffDays;
      return { 
        status: 'bloqueado', 
        titulo: 'Período de Adaptação',
        msg: `Você está nos seus primeiros dias de plano! O primeiro check-in será liberado após ${carencia} dias para termos dados suficientes.`,
        info: `Faltam ${diasRestantes} dias para o primeiro envio.`
      };
    }
    
    if (userProfile.checkin_day && userProfile.checkin_day !== diaHojeString) {
      return { 
        status: 'bloqueado', 
        titulo: 'Check-in Fechado',
        msg: `Seu dia de atualização definido é ${userProfile.checkin_day}.`,
        info: 'O formulário ficará disponível por 24h apenas nesse dia da semana.'
      };
    }
    
    return { status: 'liberado' };
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // --- 3. ENVIAR DADOS ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      if (!userProfile?.id) throw new Error("Usuário não identificado");

      const relatorioDetalhado = `
[COMPORTAMENTO]
Adesão: ${formData.adherence}
Dedicação: ${formData.dedication_level}
Refeições Livres: ${formData.meals_off}
Álcool: ${formData.alcohol_days} dias
Dificuldades: ${formData.difficulty_explanation || 'Nenhuma relatada'}

[TREINO & SONO]
Musculação: ${formData.strength_training} dias
Cardio: ${formData.cardio_training} dias
Sono: ${formData.sleep_hours}h (Qualidade: ${formData.sleep_quality})

[BEM-ESTAR]
Humor/Disposição: ${formData.mood}
Estresse: ${formData.stress}
Ansiedade: ${formData.anxiety}

[ROTINA & CORPO]
Avaliação Rotina: ${formData.routine_eval}
Evolução Corporal: ${formData.body_evolution}

[FINALIZAÇÃO]
Alterações Dieta: ${formData.diet_changes || 'Não solicitou'}
Nota Atendimento: ${formData.rating}
      `;

      const { error } = await supabase
        .from('checkins')
        .insert([{
          user_id: userProfile.id,
          date: formData.date,
          weight: formData.weight ? parseFloat(formData.weight) : 0,
          adherence: formData.adherence,
          difficulty: relatorioDetalhado,
          viewed_by_admin: false
        }]);

      if (error) throw error;

      alert("Check-in enviado com sucesso! Agora me envie as fotos da evolução lá no WhatsApp.");
      router.push("/dashboard");

    } catch (error: any) {
      console.error(error);
      alert("Erro ao enviar: " + error.message);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4"/>
        <p className="text-slate-500 font-medium">Verificando disponibilidade...</p>
      </div>
    );
  }

  const disponibilidade = getAvailability();

  if (disponibilidade.status === 'bloqueado') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6 animate-in zoom-in-95">
        <div className="bg-slate-100 p-8 rounded-full mb-8 shadow-inner ring-8 ring-slate-50">
          {jaEnviouHoje ? (
            <CheckCircle className="w-16 h-16 text-emerald-500" />
          ) : (
            <Lock className="w-16 h-16 text-slate-400" />
          )}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
          {disponibilidade.titulo}
        </h1>
        <p className="text-slate-500 max-w-md mb-8 text-lg leading-relaxed">
          {disponibilidade.msg}
        </p>
        <div className={`px-6 py-4 rounded-2xl font-bold text-sm mb-10 flex items-center gap-3 border shadow-sm ${jaEnviouHoje ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-blue-50 text-blue-800 border-blue-100'}`}>
          <Clock className="w-5 h-5" /> 
          {disponibilidade.info}
        </div>
        <Link 
          href="/dashboard" 
          className="flex items-center gap-2 text-slate-600 font-bold hover:text-blue-600 transition group px-8 py-4 rounded-xl hover:bg-white hover:shadow-md"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 
          Voltar para o Início
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-32 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border border-green-200 shadow-sm">
          <Clock className="w-4 h-4" /> Formulário Liberado
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 flex items-center gap-4 tracking-tight">
          <CheckCircle className="text-blue-600 w-10 h-10 md:w-12 md:h-12" />
          Check-in de Evolução
        </h1>
        <p className="text-slate-500 mt-4 text-lg max-w-2xl leading-relaxed">
          Este é o momento mais importante da sua semana. Preencha com calma e sinceridade.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        
        {/* --- SEÇÃO 0: DADOS INICIAIS --- */}
        <section className="bg-white p-6 md:p-10 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
            <div className="bg-blue-100 p-3 rounded-2xl text-blue-600">
              <Scale className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">0. Dados Iniciais</h2>
              <p className="text-slate-400 text-sm">Informações básicas para registro.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Data do Registro</label>
              <input 
                type="date" 
                required
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Peso Atual (kg)</label>
              <div className="relative">
                <input 
                  type="number" 
                  step="0.1"
                  required
                  placeholder="00.0"
                  className="w-full p-4 pl-6 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-lg"
                  value={formData.weight}
                  onChange={(e) => handleChange('weight', e.target.value)}
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">kg</span>
              </div>
            </div>
          </div>
        </section>

        {/* --- SEÇÃO 1: COMPORTAMENTO --- */}
        <section className="bg-white p-6 md:p-10 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
            <div className="bg-green-100 p-3 rounded-2xl text-green-600">
              <Brain className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">1. Comportamento</h2>
              <p className="text-slate-400 text-sm">Sua relação com a dieta e adesão.</p>
            </div>
          </div>

          <div className="space-y-10">
            <div>
              <label className="block text-base font-bold text-slate-800 mb-4">Aderência ao plano alimentar:</label>
              <div className="space-y-3">
                {[
                  'Estou conseguindo seguir tudo tranquilamente', 
                  'Consigo seguir tudo, mas às vezes passo por alguma dificuldade', 
                  'Não consigo realizar tudo', 
                  'Não estou conseguindo realizar nada'
                ].map((opt) => (
                  <label 
                    key={opt} 
                    className={`flex items-center gap-4 p-5 rounded-2xl border cursor-pointer transition-all duration-200 ${
                      formData.adherence === opt 
                        ? 'bg-green-50 border-green-500 shadow-md ring-1 ring-green-500' 
                        : 'border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="adherence" 
                      value={opt}
                      checked={formData.adherence === opt}
                      onChange={(e) => handleChange('adherence', e.target.value)}
                      className="w-5 h-5 accent-green-600"
                    />
                    <span className={`text-sm md:text-base font-medium ${formData.adherence === opt ? 'text-green-900' : 'text-slate-600'}`}>
                      {opt}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-base font-bold text-slate-800 mb-3">Explicação (se houver dificuldade):</label>
              <textarea 
                rows={4}
                className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                placeholder="Conte o que houve, quais refeições errou, sentimentos..."
                value={formData.difficulty_explanation}
                onChange={(e) => handleChange('difficulty_explanation', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-base font-bold text-slate-800 mb-4">Nível de dedicação geral:</label>
              <div className="space-y-3">
                {['Dei o meu melhor', 'Me dediquei', 'Neutro', 'Poderia ter feito mais', 'Não me dediquei nada'].map((opt) => (
                  <label key={opt} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <input 
                      type="radio" 
                      name="dedication_level" 
                      value={opt} 
                      checked={formData.dedication_level === opt}
                      onChange={(e) => handleChange('dedication_level', e.target.value)} 
                      className="w-4 h-4 accent-blue-600"
                    />
                    <span className={`text-base ${formData.dedication_level === opt ? 'text-blue-700 font-bold' : 'text-slate-600'}`}>{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-6 border-t border-slate-100">
              <div>
                <label className="flex justify-between items-center text-sm font-bold text-slate-700 mb-6">
                  Refeições fora do plano:
                  <span className="text-xl font-extrabold text-blue-600 bg-blue-50 px-4 py-1 rounded-xl">
                    {formData.meals_off}
                  </span>
                </label>
                <input 
                  type="range" min="0" max="20" 
                  value={formData.meals_off} 
                  onChange={(e) => handleChange('meals_off', e.target.value)}
                  className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
              
              <div>
                <label className="flex justify-between items-center text-sm font-bold text-slate-700 mb-6">
                  Dias com álcool:
                  <span className="text-xl font-extrabold text-blue-600 bg-blue-50 px-4 py-1 rounded-xl">
                    {formData.alcohol_days}
                  </span>
                </label>
                <input 
                  type="range" min="0" max="7" 
                  value={formData.alcohol_days} 
                  onChange={(e) => handleChange('alcohol_days', e.target.value)}
                  className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            </div>
          </div>
        </section>

        {/* --- SEÇÃO 2: TREINOS --- */}
        <section className="bg-white p-6 md:p-10 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
            <div className="bg-orange-100 p-3 rounded-2xl text-orange-600">
              <Dumbbell className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">2. Treinos</h2>
              <p className="text-slate-400 text-sm">Frequência de atividade física.</p>
            </div>
          </div>

          <div className="space-y-10">
            <div>
              <label className="flex justify-between items-center text-sm font-bold text-slate-700 mb-6">
                Treinos de força (Musculação):
                <span className="text-xl font-extrabold text-orange-600 bg-orange-50 px-4 py-1 rounded-xl">
                  {formData.strength_training} dias
                </span>
              </label>
              <input 
                type="range" min="0" max="7" 
                value={formData.strength_training} 
                onChange={(e) => handleChange('strength_training', e.target.value)}
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
              />
            </div>
            
            <div>
              <label className="flex justify-between items-center text-sm font-bold text-slate-700 mb-6">
                Treinos aeróbicos (Cardio):
                <span className="text-xl font-extrabold text-orange-600 bg-orange-50 px-4 py-1 rounded-xl">
                  {formData.cardio_training} dias
                </span>
              </label>
              <input 
                type="range" min="0" max="7" 
                value={formData.cardio_training} 
                onChange={(e) => handleChange('cardio_training', e.target.value)}
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
              />
            </div>
          </div>
        </section>

        {/* --- SEÇÃO 3: BEM-ESTAR --- */}
        <section className="bg-white p-6 md:p-10 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
            <div className="bg-yellow-100 p-3 rounded-2xl text-yellow-600">
              <Smile className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">3. Bem-estar</h2>
              <p className="text-slate-400 text-sm">Como você se sentiu mentalmente.</p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <label className="block text-base font-bold text-slate-800 mb-3">Disposição durante o dia:</label>
              <div className="space-y-2 pl-4 border-l-4 border-yellow-100">
                {['Muito disposto(a)', 'Geralmente disposto(a)', 'Depende do dia', 'Geralmente indisposto(a)', 'Zero disposição'].map(opt => (
                  <label key={opt} className="flex items-center gap-3 cursor-pointer py-1">
                    <input 
                      type="radio" name="mood" value={opt} 
                      checked={formData.mood === opt}
                      onChange={(e) => handleChange('mood', e.target.value)} 
                      className="w-4 h-4 accent-yellow-500" 
                    />
                    <span className="text-slate-600">{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-base font-bold text-slate-800 mb-3">Nível de estresse:</label>
                <div className="space-y-2">
                  {['Baixo', 'Moderado', 'Alto'].map(opt => (
                    <label key={opt} className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="radio" name="stress" value={opt} 
                        checked={formData.stress === opt}
                        onChange={(e) => handleChange('stress', e.target.value)} 
                        className="w-4 h-4 accent-yellow-500" 
                      />
                      <span className="text-slate-600">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-base font-bold text-slate-800 mb-3">Nível de ansiedade:</label>
                <div className="space-y-2">
                  {['Baixa', 'Moderada', 'Alta'].map(opt => (
                    <label key={opt} className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="radio" name="anxiety" value={opt} 
                        checked={formData.anxiety === opt}
                        onChange={(e) => handleChange('anxiety', e.target.value)} 
                        className="w-4 h-4 accent-yellow-500" 
                      />
                      <span className="text-slate-600">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- SEÇÃO 4: ROTINA E CORPO --- */}
        <section className="bg-white p-6 md:p-10 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
            <div className="bg-purple-100 p-3 rounded-2xl text-purple-600">
              <Calendar className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">4. Rotina e Corpo</h2>
              <p className="text-slate-400 text-sm">Organização e percepção física.</p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <label className="block text-base font-bold text-slate-800 mb-3">Avaliação da rotina:</label>
              <div className="space-y-2 pl-4 border-l-4 border-purple-100">
                {['Bem estruturada', 'Um pouco desorganizada', 'Muito desorganizada'].map(opt => (
                  <label key={opt} className="flex items-center gap-3 cursor-pointer py-1">
                    <input 
                      type="radio" name="routine_eval" value={opt} 
                      checked={formData.routine_eval === opt}
                      onChange={(e) => handleChange('routine_eval', e.target.value)} 
                      className="w-4 h-4 accent-purple-600" 
                    />
                    <span className="text-slate-600">{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-base font-bold text-slate-800 mb-3">Percepção de evolução corporal:</label>
              <div className="space-y-2 pl-4 border-l-4 border-purple-100">
                {['Bastante evolução', 'Consigo notar evolução', 'Não noto evolução', 'Regredindo'].map(opt => (
                  <label key={opt} className="flex items-center gap-3 cursor-pointer py-1">
                    <input 
                      type="radio" name="body_evolution" value={opt} 
                      checked={formData.body_evolution === opt}
                      onChange={(e) => handleChange('body_evolution', e.target.value)} 
                      className="w-4 h-4 accent-purple-600" 
                    />
                    <span className="text-slate-600">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* --- SEÇÃO 5: SONO --- */}
        <section className="bg-white p-6 md:p-10 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
            <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-600">
              <Moon className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">5. Sono</h2>
              <p className="text-slate-400 text-sm">Qualidade do seu descanso.</p>
            </div>
          </div>

          <div className="space-y-10">
            <div>
              <label className="block text-base font-bold text-slate-800 mb-3">Qualidade do sono:</label>
              <div className="flex flex-wrap gap-2">
                {['Ótimo', 'Bom', 'Neutro', 'Ruim', 'Terrível'].map(opt => (
                  <button 
                    key={opt} type="button"
                    onClick={() => handleChange('sleep_quality', opt)}
                    className={`px-6 py-2 rounded-xl text-sm font-bold border transition-all ${
                      formData.sleep_quality === opt ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex justify-between items-center text-sm font-bold text-slate-700 mb-6">
                Horas de sono (média):
                <span className="text-xl font-extrabold text-indigo-600 bg-indigo-50 px-4 py-1 rounded-xl">
                  {formData.sleep_hours}h
                </span>
              </label>
              <input 
                type="range" min="0" max="12" step="0.5"
                value={formData.sleep_hours} 
                onChange={(e) => handleChange('sleep_hours', e.target.value)}
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          </div>
        </section>

        {/* --- SEÇÃO 6: FINALIZAÇÃO --- */}
        <section className="bg-white p-6 md:p-10 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
            <div className="bg-slate-100 p-3 rounded-2xl text-slate-600">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">6. Finalização</h2>
              <p className="text-slate-400 text-sm">Feedback e ajustes.</p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <label className="block text-base font-bold text-slate-800 mb-3">Deseja alterações no cardápio?</label>
              <textarea 
                rows={4}
                className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 transition-all"
                value={formData.diet_changes}
                onChange={(e) => handleChange('diet_changes', e.target.value)}
                placeholder="Ex: Enjoei do ovo no café da manhã..."
              />
            </div>

            <div>
              <label className="flex justify-between items-center text-sm font-bold text-slate-700 mb-6">
                Avaliação do atendimento (0-10):
                <span className="text-xl font-extrabold text-blue-600 bg-blue-50 px-4 py-1 rounded-xl">
                  {formData.rating}
                </span>
              </label>
              <input 
                type="range" min="0" max="10" 
                value={formData.rating} 
                onChange={(e) => handleChange('rating', e.target.value)}
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end pt-8">
          <button 
            type="submit"
            disabled={sending}
            className="w-full md:w-auto flex items-center justify-center gap-4 bg-slate-900 text-white font-bold py-5 px-12 rounded-2xl hover:bg-blue-700 transition-all shadow-xl disabled:opacity-70 text-lg"
          >
            {sending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin" /> Enviando...
              </span>
            ) : (
              <>Enviar Check-in Completo <Send className="w-6 h-6" /></>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { 
  ArrowRight, Calendar, CheckCircle, Clock, FileText, 
  LayoutDashboard, MessageCircle, Plus, LogOut, Loader2,
  CheckCircle2, X, ChevronDown, ChevronUp, Scale,
  Dumbbell, Activity, Check, Droplets, User as UserIcon,
  ExternalLink
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [checkins, setCheckins] = useState<any[]>([]);
  const [ultimoFeedback, setUltimoFeedback] = useState<any>(null);
  const [isCheckinDay, setIsCheckinDay] = useState(false);
  const [saudacao, setSaudacao] = useState('');

  // Estados dos novos botões de meta diária
  const [treinoFeito, setTreinoFeito] = useState(false);
  const [cardioFeito, setCardioFeito] = useState(false);

  // Estados para controlar os accordions
  const [isHistoryOpen, setIsHistoryOpen] = useState(false); 
  const [openCheckinId, setOpenCheckinId] = useState<number | null>(null); 

  async function getData() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      router.push('/login');
      return;
    }
    setUser(user);

    // 1. Busca perfil completo
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    setProfile(profileData);

    // 2. Busca histórico de check-ins
    const { data: checkinsData } = await supabase
      .from('checkins')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (checkinsData) {
      setCheckins(checkinsData);
      
      const pendenteLeitura = checkinsData.find(c => 
        (c.admin_feedback || c.feedback_nutri) && c.feedback_viewed === false
      );
      setUltimoFeedback(pendenteLeitura || null);

      // 3. Lógica para mostrar aviso de check-in liberado
      const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
      const hojeNome = diasSemana[new Date().getDay()];
      const hojeISO = new Date().toISOString().split('T')[0];

      const jaFezHoje = checkinsData.some(c => c.date === hojeISO);
      
      if (profileData?.checkin_day === hojeNome && !jaFezHoje) {
        setIsCheckinDay(true);
      } else {
        setIsCheckinDay(false);
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    getData();
    
    // Define saudação baseada na hora
    const hour = new Date().getHours();
    if (hour < 12) setSaudacao('Bom dia');
    else if (hour < 18) setSaudacao('Boa tarde');
    else setSaudacao('Boa noite');

    // Recupera status do treino/cardio localmente
    const hoje = new Date().toISOString().split('T')[0];
    const savedDate = localStorage.getItem('last_workout_date');
    
    if (savedDate === hoje) {
      setTreinoFeito(localStorage.getItem('treino_feito') === 'true');
      setCardioFeito(localStorage.getItem('cardio_feito') === 'true');
    } else {
      localStorage.setItem('last_workout_date', hoje);
      localStorage.setItem('treino_feito', 'false');
      localStorage.setItem('cardio_feito', 'false');
    }
  }, [router]);

  const toggleTreino = () => {
    const novoStatus = !treinoFeito;
    setTreinoFeito(novoStatus);
    localStorage.setItem('treino_feito', String(novoStatus));
  };

  const toggleCardio = () => {
    const novoStatus = !cardioFeito;
    setCardioFeito(novoStatus);
    localStorage.setItem('cardio_feito', String(novoStatus));
  };

  // --- FUNÇÕES AUXILIARES VISUAIS ---
  const getProximoCheckin = () => {
    if (!profile?.checkin_day) return { texto: 'Não definido', dias: 0 };
    
    const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const hojeIndex = new Date().getDay();
    const targetIndex = diasSemana.indexOf(profile.checkin_day);
    
    let diff = targetIndex - hojeIndex;
    if (diff < 0) diff += 7;
    
    if (diff === 0) return { texto: 'É Hoje!', dias: 0, isToday: true };
    if (diff === 1) return { texto: 'Amanhã', dias: 1 };
    return { texto: profile.checkin_day, dias: diff };
  };

  const getEvolucaoPeso = () => {
    if (checkins.length < 2) return null;
    const atual = checkins[0].weight;
    const anterior = checkins[checkins.length - 1].weight; 
    const diff = atual - anterior;
    return diff;
  };

  const proximoCheckin = getProximoCheckin();
  const evolucaoPeso = getEvolucaoPeso();

  const marcarComoLido = async (checkinId: number) => {
    const { error } = await supabase
      .from('checkins')
      .update({ feedback_viewed: true })
      .eq('id', checkinId);

    if (!error) {
      setUltimoFeedback(null);
      getData();
    }
  };

  const toggleCheckin = (id: number) => {
    setOpenCheckinId(openCheckinId === id ? null : id);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 animate-in fade-in duration-500">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-lg">Área do Aluno</span>
          </div>
          <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        
        {/* HEADER DE BOAS-VINDAS */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            {saudacao}, {user?.user_metadata?.full_name?.split(' ')[0] || 'Aluno'}! 👋
          </h1>
          <p className="text-slate-500 font-medium mt-1">Seu foco determina sua realidade. Vamos pra cima!</p>
        </div>

        {/* --- WIDGETS DE STATUS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          
          {/* Card Peso */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Scale size={16} /></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Peso Atual</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900">{checkins[0]?.weight || '--'}</span>
                <span className="text-xs font-bold text-slate-400">kg</span>
              </div>
              {evolucaoPeso !== null && (
                <p className={`text-[10px] font-bold mt-1 ${evolucaoPeso <= 0 ? 'text-emerald-500' : 'text-orange-500'}`}>
                  {evolucaoPeso > 0 ? '+' : ''}{evolucaoPeso.toFixed(1)}kg desde o início
                </p>
              )}
            </div>
            <div className="h-10 w-10 rounded-full border-4 border-blue-50 flex items-center justify-center">
               <span className="text-[9px] font-bold text-blue-300">%</span>
            </div>
          </div>

          {/* Card Próximo Check-in */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 bg-orange-50 text-orange-600 rounded-lg"><Calendar size={16} /></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Check-in</span>
              </div>
              <span className={`text-xl font-bold ${proximoCheckin.isToday ? 'text-emerald-600' : 'text-slate-900'}`}>
                {proximoCheckin.texto}
              </span>
              <p className="text-[10px] text-slate-400 font-bold mt-1">
                {proximoCheckin.isToday ? 'Formulário Liberado!' : `Faltam ${proximoCheckin.dias} dias`}
              </p>
            </div>
          </div>

          {/* NOVO: Card Metas de Hoje (Treino e Cardio) */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg"><Activity size={16} /></div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Metas de Hoje</span>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={toggleTreino}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl transition-all duration-300 border ${
                  treinoFeito 
                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-emerald-200 shadow-md' 
                    : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {treinoFeito ? <Check size={16} strokeWidth={4} /> : <Dumbbell size={16} />}
                <span className="text-xs font-bold">{treinoFeito ? 'Feito' : 'Treino'}</span>
              </button>

              <button 
                onClick={toggleCardio}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl transition-all duration-300 border ${
                  cardioFeito 
                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-emerald-200 shadow-md' 
                    : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cardioFeito ? <Check size={16} strokeWidth={4} /> : <Activity size={16} />}
                <span className="text-xs font-bold">{cardioFeito ? 'Feito' : 'Cardio'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* --- AVISO DE DIA DE CHECK-IN (SE FOR O DIA) --- */}
        {isCheckinDay && (
          <Link href="/dashboard/checkin" className="mb-8 block group">
            <div className="bg-emerald-500 rounded-3xl p-6 text-white shadow-lg shadow-emerald-200 border-2 border-emerald-400 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-2xl">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xl">Hoje é dia de Check-in! 🚀</h3>
                    <p className="text-emerald-50 text-sm">Seu formulário de atualização já está liberado.</p>
                  </div>
                </div>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </Link>
        )}

        {/* FEEDBACK EM DESTAQUE (SUMIRÁ AO MARCAR COMO LIDO) */}
        {ultimoFeedback && (
          <div className="mb-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-blue-200 animate-in fade-in zoom-in duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm"><MessageCircle size={20} /></div>
                  <div>
                    <h3 className="font-bold text-lg">Novo Feedback do João</h3>
                    <p className="text-blue-100 text-xs">Sobre seu check-in de {new Date(ultimoFeedback.date).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
                <button onClick={() => marcarComoLido(ultimoFeedback.id)} className="p-2 hover:bg-white/20 rounded-full transition">
                  <X size={18} className="text-white/80" />
                </button>
              </div>
              
              <div className="bg-black/10 p-4 rounded-xl mb-4 backdrop-blur-sm border border-white/10">
                <p className="text-sm leading-relaxed italic">"{ultimoFeedback.admin_feedback || ultimoFeedback.feedback_nutri}"</p>
              </div>

              <button 
                onClick={() => marcarComoLido(ultimoFeedback.id)} 
                className="w-full bg-white text-blue-700 font-bold py-3 rounded-xl hover:bg-blue-50 transition shadow-sm flex items-center justify-center gap-2 text-sm"
              >
                <CheckCircle2 size={16} /> Entendido, João!
              </button>
            </div>
          </div>
        )}

        {/* BOTÕES DE AÇÃO RÁPIDA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <Link href="/dashboard/checkin" className="group bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2 text-slate-900"><Plus className="w-5 h-5 text-blue-600" /> Novo Check-in</h3>
              <p className="text-slate-500 text-xs mt-1">Registre sua semana agora</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl group-hover:bg-blue-100 transition-colors text-blue-600"><ArrowRight className="w-6 h-6" /></div>
          </Link>

          {/* BOTÃO LINK EXTERNO DIETITIAN */}
          <Link 
            href="https://app.dietitian.com.br" // <--- ATENÇÃO: COLOQUE AQUI O SEU LINK CORRETO
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white hover:bg-slate-50 border border-slate-200 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all text-left flex justify-between items-center group"
          >
            <div>
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-400" /> Meu Plano
              </h3>
              <p className="text-slate-400 text-xs mt-1">Acessar App Dietitian</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl group-hover:bg-slate-100 transition-colors text-slate-400">
              <ExternalLink className="w-6 h-6" />
            </div>
          </Link>
        </div>

        {/* --- SEÇÃO DE HISTÓRICO GERAL (ACCORDION PAI) --- */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300">
          <button 
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                <Clock className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Histórico & Feedbacks</h2>
              <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {checkins.length}
              </span>
            </div>
            {isHistoryOpen ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
          </button>

          {isHistoryOpen && (
            <div className="p-6 pt-0 space-y-4 animate-in slide-in-from-top-2 duration-300">
              {checkins.length === 0 ? (
                <div className="py-10 text-center border-t border-dashed border-slate-100 mt-2">
                   <p className="text-slate-500 text-sm">Nenhum registro ainda.</p>
                </div>
              ) : (
                checkins.map((checkin) => {
                  const isOpen = openCheckinId === checkin.id;
                  
                  return (
                    <div key={checkin.id} className={`bg-white rounded-2xl border transition-all duration-200 ${isOpen ? 'border-blue-200 shadow-md ring-1 ring-blue-50' : 'border-slate-100 shadow-sm'}`}>
                      <button 
                        onClick={() => toggleCheckin(checkin.id)}
                        className="w-full p-4 flex items-center justify-between text-left"
                      >
                        <div className="flex items-center gap-4">
                          <div className="bg-slate-50 text-slate-600 font-bold px-3 py-1 rounded-lg border border-slate-100 text-xs">
                            {new Date(checkin.date).toLocaleDateString('pt-BR')}
                          </div>
                          <p className="text-slate-900 font-bold text-sm">{checkin.weight}kg</p>
                          
                          {(checkin.admin_feedback || checkin.feedback_nutri) ? (
                            <span className={`text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-md border flex items-center gap-1 ${checkin.feedback_viewed ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-blue-600 bg-blue-50 border-blue-100 animate-pulse'}`}>
                              {checkin.feedback_viewed ? <CheckCircle className="w-2.5 h-2.5" /> : <MessageCircle className="w-2.5 h-2.5" />}
                              {checkin.feedback_viewed ? 'Lido' : 'Resposta Nova'}
                            </span>
                          ) : (
                            <span className="text-[9px] uppercase font-extrabold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100 flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" /> Pendente
                            </span>
                          )}
                        </div>
                        {isOpen ? <ChevronUp size={16} className="text-blue-500" /> : <ChevronDown size={16} className="text-slate-400" />}
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-4 pt-2 border-t border-slate-50 animate-in fade-in slide-in-from-top-1 duration-200">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                                <UserIcon className="w-3 h-3" /> Seu Relato
                              </p>
                              <div className="text-slate-600 text-sm bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed whitespace-pre-wrap">
                                {checkin.difficulty || "Sem observações detalhadas."}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <p className="text-[10px] font-bold text-blue-600 uppercase flex items-center gap-1">
                                <MessageCircle className="w-3 h-3" /> Feedback do João
                              </p>
                              {(checkin.admin_feedback || checkin.feedback_nutri) ? (
                                <div className="text-blue-900 text-sm bg-blue-50 p-4 rounded-xl border border-blue-100 leading-relaxed shadow-sm">
                                  {checkin.admin_feedback || checkin.feedback_nutri}
                                </div>
                              ) : (
                                <div className="text-slate-400 text-sm italic bg-slate-50/50 p-4 rounded-xl border border-dashed border-slate-200 text-center">
                                  Aguardando análise...
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
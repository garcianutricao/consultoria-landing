"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  X, BarChart3, Activity, Scale, Moon, Dumbbell, Utensils, 
  Smile, Frown, Meh, Loader2, FileText, Calendar, RefreshCw, 
  Check, AlertCircle, Clock, DollarSign, PlayCircle, Plus, 
  Trash2, Send, ChevronRight, Users, Phone, Lock, Apple, Beef, Wheat, Droplet
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Legend
} from 'recharts';

interface AdminModalsProps {
  isOpen: boolean;
  type: string;
  onClose: () => void;
  onSuccess: () => void;
  data?: any;
  onRenewPatient?: (id: string, plan: string, freq: string) => void;
}

export default function AdminModals({ isOpen, type, onClose, onSuccess, data, onRenewPatient }: AdminModalsProps) {
  if (!isOpen) return null;

  const { pacienteSelecionado, checkinsDb, listaPacientes, modalData } = data || {};
  const [saving, setSaving] = useState(false);
  const [tipoTransacao, setTipoTransacao] = useState<'income' | 'expense'>('income');

  // --- FORMULÁRIO: RENOVAÇÃO (NOVO) ---
  const renderFormRenovacao = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-2xl flex gap-3 border border-blue-100">
        <AlertCircle className="text-blue-500 shrink-0" size={20} />
        <p className="text-xs text-blue-700 leading-relaxed">
          A renovação resetará a <strong>Data de Início</strong> para hoje. O histórico de check-ins será preservado.
        </p>
      </div>

      <form onSubmit={async (e) => {
        e.preventDefault();
        setSaving(true);
        const formData = new FormData(e.currentTarget);
        const plano = formData.get('plano') as string;
        const freq = formData.get('freq') as string;

        if (onRenewPatient) {
          await onRenewPatient(pacienteSelecionado.id, plano, freq);
          onClose();
        }
        setSaving(false);
      }}>
        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Selecione o Novo Plano</label>
            <div className="grid grid-cols-2 gap-2">
              {['Mensal', 'Trimestral', 'Semestral', 'Anual'].map((p) => (
                <label key={p} className="relative flex items-center justify-center p-4 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 transition-all">
                  <input type="radio" name="plano" value={p} defaultChecked={pacienteSelecionado?.plano === p} className="absolute opacity-0" required />
                  <span className="text-sm font-bold text-slate-600">{p}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Frequência de Check-in</label>
            <div className="grid grid-cols-2 gap-2">
              {['Semanal', 'Quinzenal'].map((f) => (
                <label key={f} className="relative flex items-center justify-center p-4 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 transition-all">
                  <input type="radio" name="freq" value={f} defaultChecked={pacienteSelecionado?.freq === f} className="absolute opacity-0" required />
                  <span className="text-sm font-bold text-slate-600">{f}</span>
                </label>
              ))}
            </div>
          </div>

          <button disabled={saving} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold mt-4 shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition-all">
            {saving ? <Loader2 className="animate-spin" /> : <><Check size={20} /> Confirmar Renovação</>}
          </button>
        </div>
      </form>
    </div>
  );

  // --- DASHBOARD EVOLUÇÃO (GRÁFICOS) ---
  const renderGraficos = () => {
    if (!pacienteSelecionado || !checkinsDb) return <div>Sem dados.</div>;
    const dataGrafico = checkinsDb.filter((c: any) => c.pacienteId === pacienteSelecionado.id).sort((a: any, b: any) => new Date(a.dataRaw).getTime() - new Date(b.dataRaw).getTime());
    
    return (
      <div className="p-4 h-full flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full overflow-y-auto pb-10">
          <div className="bg-white p-4 rounded-xl border border-slate-200 h-64 shadow-sm"><h4 className="font-bold text-slate-700 mb-2 flex gap-2 text-sm"><Scale className="w-4 h-4 text-purple-600"/> Peso (kg)</h4><ResponsiveContainer width="100%" height="85%"><LineChart data={dataGrafico}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="data" fontSize={10}/><YAxis domain={['auto', 'auto']} fontSize={10}/><RechartsTooltip/><Line type="monotone" dataKey="peso" stroke="#7c3aed" strokeWidth={3} dot={{r:4}}/></LineChart></ResponsiveContainer></div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 h-64 shadow-sm"><h4 className="font-bold text-slate-700 mb-2 flex gap-2 text-sm"><Activity className="w-4 h-4 text-green-600"/> Score (%)</h4><ResponsiveContainer width="100%" height="85%"><AreaChart data={dataGrafico}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="data" fontSize={10}/><YAxis domain={[0, 100]} fontSize={10}/><RechartsTooltip/><Area type="monotone" dataKey="score" stroke="#16a34a" fill="#dcfce7" /></AreaChart></ResponsiveContainer></div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 h-64 shadow-sm"><h4 className="font-bold text-slate-700 mb-2 flex gap-2 text-sm"><Moon className="w-4 h-4 text-indigo-600"/> Sono (h)</h4><ResponsiveContainer width="100%" height="85%"><BarChart data={dataGrafico}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="data" fontSize={10}/><YAxis domain={[0, 12]} fontSize={10}/><RechartsTooltip/><Bar dataKey="sonoHrs" fill="#6366f1" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 h-64 shadow-sm"><h4 className="font-bold text-slate-700 mb-2 flex gap-2 text-sm"><Dumbbell className="w-4 h-4 text-orange-600"/> Treinos</h4><ResponsiveContainer width="100%" height="85%"><BarChart data={dataGrafico}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="data" fontSize={10}/><YAxis fontSize={10}/><RechartsTooltip/><Bar dataKey="forca" name="Musculação" fill="#f97316" stackId="a" /><Bar dataKey="cardio" name="Cardio" fill="#fdba74" stackId="a" /></BarChart></ResponsiveContainer></div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 h-64 shadow-sm"><h4 className="font-bold text-slate-700 mb-2 flex gap-2 text-sm"><Utensils className="w-4 h-4 text-blue-600"/> Furos na Dieta</h4><ResponsiveContainer width="100%" height="85%"><BarChart data={dataGrafico}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="data" fontSize={10}/><YAxis fontSize={10}/><RechartsTooltip/><Legend wrapperStyle={{fontSize: '10px'}}/><Bar dataKey="refLivres" name="Ref. Livres" fill="#3b82f6" /><Bar dataKey="alcool" name="Álcool (dias)" fill="#ef4444" /></BarChart></ResponsiveContainer></div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 h-64 shadow-sm"><h4 className="font-bold text-slate-700 mb-2 flex gap-2 text-sm"><Activity className="w-4 h-4 text-red-600"/> Estresse/Disp.</h4><ResponsiveContainer width="100%" height="85%"><LineChart data={dataGrafico}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="data" fontSize={10}/><YAxis domain={[0, 100]} fontSize={10}/><RechartsTooltip/><Legend wrapperStyle={{fontSize: '10px'}}/><Line type="monotone" dataKey="estresseNum" name="Estresse" stroke="#ef4444" strokeWidth={2} /><Line type="monotone" dataKey="disposicaoNum" name="Disposição" stroke="#eab308" strokeWidth={2} /></LineChart></ResponsiveContainer></div>
        </div>
      </div>
    );
  };

  // --- HEATMAP (ATUALIZADO COM REGRAS ESPECÍFICAS DE TREINO/CARDIO) ---
  const renderHeatmap = () => {
    if (!pacienteSelecionado) return <div>Sem dados.</div>;
    
    // Filtra e ordena checkins
    const historico = checkinsDb
      ?.filter((c: any) => c.pacienteId === pacienteSelecionado.id)
      .sort((a: any, b: any) => new Date(b.dataRaw).getTime() - new Date(a.dataRaw).getTime()) || [];

    // Componentes visuais para as carinhas
    const IconSmile = () => <div className="mx-auto w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm"><Smile size={18} /></div>;
    const IconMeh = () => <div className="mx-auto w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400"><Meh size={18} /></div>;
    const IconFrown = () => <div className="mx-auto w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shadow-sm"><Frown size={18} /></div>;

    // Função auxiliar para definir a "Carinha" e a Cor da Célula
    const getCellStatus = (valor: any, contexto?: 'treino' | 'cardio') => {
      const v = String(valor || '').toLowerCase();
      const n = Number(valor);

      // --- REGRA ESPECÍFICA: TREINO ---
      // "Treinos mais de 3x na semana (4, 5...) coloque como coisa boa"
      if (contexto === 'treino' && !isNaN(n)) {
         if (n > 3) return <IconSmile />; // 4, 5, 6...
         if (n >= 1) return <IconMeh />;  // 1, 2, 3
         return <IconFrown />;            // 0
      }

      // --- REGRA ESPECÍFICA: CARDIO ---
      // "Cardio mais de 4x na semana (5, 6...) coloque como coisa boa"
      if (contexto === 'cardio' && !isNaN(n)) {
         if (n > 4) return <IconSmile />; // 5, 6, 7...
         if (n >= 1) return <IconMeh />;  // 1, 2, 3, 4
         return <IconFrown />;            // 0
      }

      // --- REGRAS GERAIS (Outros campos) ---
      const isGood = 
        v.includes('bom') || v.includes('ótimo') || v.includes('100%') || v.includes('sim') || 
        v.includes('tranquila') || v === 'feito' || (typeof valor === 'number' && valor >= 7);

      const isBad = 
        v.includes('ruim') || v.includes('péssimo') || v.includes('não') || 
        v.includes('dificuldade') || v === 'falha' || (typeof valor === 'number' && valor <= 4);

      if (isGood) return <IconSmile />;
      if (isBad) return <IconFrown />;
      return <IconMeh />;
    };

    return (
      <div className="flex flex-col h-full bg-slate-50/50 p-4 rounded-xl border border-slate-200">
        <div className="flex-1 overflow-auto rounded-xl shadow-inner border border-slate-200 bg-white">
          <table className="w-full text-center border-collapse">
            <thead className="bg-white sticky top-0 shadow-sm z-10">
              <tr>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-left bg-white border-b border-slate-100 min-w-[120px]">Data</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase bg-white border-b border-slate-100">Peso</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase bg-white border-b border-slate-100" title="Aderência">ADE</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase bg-white border-b border-slate-100" title="Treino">TRE</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase bg-white border-b border-slate-100" title="Cardio">CAR</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase bg-white border-b border-slate-100" title="Sono">SON</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase bg-white border-b border-slate-100" title="Hidratação">H2O</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase bg-white border-b border-slate-100" title="Intestino">INT</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase bg-white border-b border-slate-100" title="Disposição">DIS</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase bg-white border-b border-slate-100" title="Humor">HUM</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase bg-white border-b border-slate-100">Score</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase bg-white border-b border-slate-100">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {historico.length === 0 ? (
                <tr><td colSpan={12} className="p-10 text-slate-400 italic">Sem dados para exibir.</td></tr>
              ) : (
                historico.map((c: any) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-3 text-left border-r border-slate-50 font-medium text-slate-700 text-sm whitespace-nowrap">
                       <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 text-slate-400"/> {c.data}
                       </div>
                    </td>
                    
                    {/* Peso */}
                    <td className="p-2"><span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">{c.peso ? `${c.peso} kg` : '-'}</span></td>

                    {/* Colunas com Ícones e Regras Específicas */}
                    <td className="p-2">{getCellStatus(c.aderencia)}</td>
                    
                    {/* TREINO: Usa c.forca (numérico) com contexto 'treino' */}
                    <td className="p-2">{getCellStatus(c.forca !== undefined ? c.forca : c.treino, 'treino')}</td>
                    
                    {/* CARDIO: Usa c.cardio (numérico) com contexto 'cardio' */}
                    <td className="p-2">{getCellStatus(c.cardio, 'cardio')}</td>
                    
                    <td className="p-2">{getCellStatus(c.sonoQual || c.sono)}</td>
                    <td className="p-2">{getCellStatus('sim')}</td> 
                    <td className="p-2">{getCellStatus('sim')}</td> 
                    <td className="p-2">{getCellStatus(c.disposicao)}</td>
                    <td className="p-2">{getCellStatus(c.humor)}</td>

                    {/* Score */}
                    <td className="p-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${c.score >= 80 ? 'text-emerald-700 bg-emerald-100 border border-emerald-200' : c.score >= 50 ? 'text-yellow-700 bg-yellow-100 border border-yellow-200' : 'text-rose-700 bg-rose-100 border border-rose-200'}`}>
                        {c.score}%
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-2">
                      {c.feedbackNutri ? (
                        <span className="text-[10px] font-bold text-emerald-600 border border-emerald-200 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wide">Revisado</span>
                      ) : (
                        <span className="text-[10px] font-bold text-orange-600 border border-orange-200 bg-orange-50 px-2 py-0.5 rounded-full uppercase tracking-wide">Pendente</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex gap-6 text-xs text-slate-500 justify-center bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
           <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600"><Smile size={14}/></div> Bom / Realizado</div>
           <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400"><Meh size={14}/></div> Regular / Médio</div>
           <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center text-rose-600"><Frown size={14}/></div> Ruim / Falha</div>
        </div>
      </div>
    );
  };

  // --- 4. FORMULÁRIO: NOVO PACIENTE (CORRIGIDO) ---
  const renderFormPaciente = () => (
    <form className="space-y-4" onSubmit={async (e) => { 
        e.preventDefault(); 
        setSaving(true);
        const formData = new FormData(e.currentTarget);
        
        try {
          const email = formData.get('email') as string;
          const password = formData.get('password') as string;
          const nome = formData.get('nome') as string;

          // 1. Cria o usuário na Autenticação
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email, 
            password, 
            options: { data: { full_name: nome } }
          });

          if (authError) throw authError;

          // 2. Se deu certo a Auth, insere no banco (AQUI QUE O SQL LIBERA)
          if (authData.user) {
            const { error: profileError } = await supabase.from('profiles').insert([{ 
                id: authData.user.id, 
                email: email, 
                full_name: nome, 
                phone: formData.get('telefone'),
                birth_date: formData.get('nascimento'), // Certifique-se que o banco aceita string ou data
                plan: formData.get('plano'), 
                checkin_freq: formData.get('freq'), 
                checkin_day: formData.get('dia'), 
                start_date: formData.get('inicio'), 
                role: 'paciente', 
                active: true 
            }]);

            if (profileError) {
              console.error("Erro no perfil:", profileError);
              throw new Error("Usuário criado, mas falha ao criar perfil: " + profileError.message);
            }

            alert("Paciente cadastrado com sucesso!"); 
            onSuccess(); // Isso atualiza a lista lá no page.tsx
            onClose();
          }
        } catch (error: any) { 
          alert("Erro ao cadastrar: " + error.message); 
        } finally { 
          setSaving(false); 
        }
      }}>
      <div className="space-y-4">
        {/* Campo Nome */}
        <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Nome Completo</label>
            <input name="nome" type="text" required className="w-full p-4 bg-white border border-slate-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-slate-900 font-bold" />
        </div>

        {/* Linha Telefone + Nascimento */}
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Telefone</label>
                <input name="telefone" type="text" placeholder="(21) 99999-9999" className="w-full p-4 bg-white border border-slate-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-slate-900 font-bold" />
            </div>
            <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Data de Nascimento</label>
                <input name="nascimento" type="date" className="w-full p-4 bg-white border border-slate-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-slate-900 font-bold" />
            </div>
        </div>

        {/* Email e Senha */}
        <div className="grid grid-cols-2 gap-4">
          <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email</label>
              <input name="email" type="email" required className="w-full p-4 bg-white border border-slate-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-slate-900 font-bold" />
          </div>
          <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Senha</label>
              <input name="password" type="text" required className="w-full p-4 bg-white border border-slate-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-slate-900 font-bold" defaultValue="123456" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Plano</label><select name="plano" className="w-full p-4 bg-white border border-slate-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900 font-bold text-slate-900"><option>Mensal</option><option>Trimestral</option><option>Semestral</option><option>Anual</option></select></div>
          <div><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Freq.</label><select name="freq" className="w-full p-4 bg-white border border-slate-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900 font-bold text-slate-900"><option>Semanal</option><option>Quinzenal</option></select></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Dia Check-in</label><select name="dia" className="w-full p-4 bg-white border border-slate-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900 font-bold text-slate-900"><option>Segunda-feira</option><option>Terça-feira</option><option>Quarta-feira</option><option>Quinta-feira</option><option>Sexta-feira</option><option>Sábado</option><option>Domingo</option></select></div>
          <div><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Início</label><input name="inicio" type="date" required className="w-full p-4 bg-white border border-slate-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900 font-bold text-slate-900" defaultValue={new Date().toISOString().split('T')[0]} /></div>
        </div>
        <button disabled={saving} className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-bold mt-4 shadow-xl flex items-center justify-center gap-2 transition-all">
          {saving ? <Loader2 className="animate-spin" /> : <><Plus size={20} /> Cadastrar Paciente</>}
        </button>
      </div>
    </form>
  );

  // --- FORMULÁRIO: FINANCEIRO ---
  const renderFormFinanceiro = () => {
    const [tipoTransacao, setTipoTransacao] = useState<'income' | 'expense'>('income');

    return (
      <form className="space-y-4" onSubmit={async (e) => {
        e.preventDefault(); setSaving(true);
        const formData = new FormData(e.currentTarget);
        
        // Lógica para pegar paciente OU descrição
        const pacienteId = formData.get('pacienteId') as string;
        const pacienteNome = tipoTransacao === 'income' 
          ? listaPacientes?.find((p: any) => p.id === pacienteId)?.nome || 'Desconhecido'
          : null;
        
        const descricao = tipoTransacao === 'expense' 
          ? formData.get('description') as string 
          : `Consultoria - ${pacienteNome}`;

        const { error } = await supabase.from('transactions').insert([{ 
          type: tipoTransacao, // 'income' ou 'expense'
          patient_id: pacienteId || null, // Nulo se for despesa
          patient_name: pacienteNome,
          description: formData.get('description'), // Salva a descrição
          amount: parseFloat(formData.get('amount') as string), 
          plan: formData.get('plan'), 
          method: formData.get('method'), 
          status: formData.get('status'), 
          due_date: formData.get('date') 
        }]);

        if (error) alert("Erro: " + error.message); else { alert("Lançamento salvo!"); onSuccess(); onClose(); }
        setSaving(false);
      }}>
        
        {/* Seletor de Tipo */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
          <button 
            type="button"
            onClick={() => setTipoTransacao('income')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${tipoTransacao === 'income' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <div className={`w-2 h-2 rounded-full ${tipoTransacao === 'income' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
            Receita (Entrada)
          </button>
          <button 
            type="button"
            onClick={() => setTipoTransacao('expense')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${tipoTransacao === 'expense' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <div className={`w-2 h-2 rounded-full ${tipoTransacao === 'expense' ? 'bg-rose-500' : 'bg-slate-300'}`} />
            Despesa (Saída)
          </button>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Data</label>
          <input name="date" type="date" required className="w-full p-3 border rounded-xl" />
        </div>

        {/* Campos Dinâmicos */}
        {tipoTransacao === 'income' ? (
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Paciente</label>
            <select name="pacienteId" className="w-full p-3 border rounded-xl" required>
              <option value="">Selecione...</option>
              {listaPacientes?.map((p: any) => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
          </div>  
        ) : null}
        
        {/* NOVO CAMPO: DESCRIÇÃO / TIPO DE LANÇAMENTO */}
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">
            {tipoTransacao === 'income' ? 'Descrição do Lançamento' : 'Tipo da Despesa'}
          </label>
          <input 
            name="description" 
            type="text" 
            placeholder={tipoTransacao === 'income' ? "Ex: Mensalidade, Renovação..." : "Ex: Aluguel, Anúncios, Luz..."} 
            required 
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 transition-all" 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Valor (R$)</label>
            <input name="amount" type="number" step="0.01" required className="w-full p-3 border rounded-xl" placeholder="0,00" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{tipoTransacao === 'income' ? 'Plano' : 'Categoria'}</label>
            {tipoTransacao === 'income' ? (
              <select name="plan" className="w-full p-3 border rounded-xl">
                <option>Mensal</option>
                <option>Trimestral semanal</option>
                <option>Trimestral quinzenal</option>
                <option>Semestral semanal</option>
                <option>Semestral quinzenal</option>
                <option>Anual (recorrente)</option>
              </select>
            ) : (
              <select name="plan" className="w-full p-3 border rounded-xl">
                <option value="Operacional">Operacional</option>
                <option value="Marketing">Marketing</option>
                <option value="Pessoal">Pessoal</option>
                <option value="Impostos">Impostos</option>
              </select>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Método</label>
            <select name="method" className="w-full p-3 border rounded-xl">
              <option>Pix</option>
              <option>Cartão Crédito</option>
              <option>Boleto</option>
              <option>Dinheiro</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Status</label>
            <select name="status" className="w-full p-3 border rounded-xl">
              <option value="paid">Confirmado</option>
              <option value="pending">Pendente</option>
            </select>
          </div>
        </div>

        <button disabled={saving} className={`w-full text-white py-3 rounded-xl font-bold mt-4 transition-colors ${tipoTransacao === 'income' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'}`}>
          {saving ? 'Salvando...' : (tipoTransacao === 'income' ? 'Lançar Receita' : 'Lançar Despesa')}
        </button>
      </form>
    );
  };

  // --- FORMULÁRIO: CONTEÚDO (Ebook/Aula) ---
  // --- FORMULÁRIO: CONTEÚDO (Ebook/Aula) - COM EDIÇÃO ---
  const renderFormConteudo = (tipo: 'ebook' | 'aula') => {
    // Verifica se estamos editando (modalData contém os dados do item)
    const isEditing = !!modalData?.id; 
    
    return (
      <form className="space-y-4" onSubmit={async (e) => {
        e.preventDefault(); setSaving(true);
        const formData = new FormData(e.currentTarget);
        
        const payload = {
          type: tipo,
          title: formData.get('title'),
          url: formData.get('url'),
          module: formData.get('module') || null,
          description: formData.get('description')
        };

        let error;
        
        if (isEditing) {
          // UPDATE
          const { error: err } = await supabase
            .from('content')
            .update(payload)
            .eq('id', modalData.id);
          error = err;
        } else {
          // INSERT
          const { error: err } = await supabase
            .from('content')
            .insert([payload]);
          error = err;
        }

        if (error) {
          alert("Erro: " + error.message);
        } else {
          alert(isEditing ? "Atualizado com sucesso!" : "Adicionado com sucesso!");
          onSuccess();
          onClose();
        }
        setSaving(false);
      }}>
        {/* Header do Form */}
        <div className="mb-4 pb-2 border-b border-slate-100">
          <h4 className="text-lg font-bold text-slate-800">
            {isEditing ? `Editar ${tipo === 'ebook' ? 'E-book' : 'Aula'}` : `Novo ${tipo === 'ebook' ? 'E-book' : 'Aula'}`}
          </h4>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Título</label>
          <input 
            name="title" 
            type="text" 
            required 
            defaultValue={modalData?.title || ''} 
            className="w-full p-3 border rounded-xl" 
            placeholder="Ex: Guia de Hipertrofia"
          />
        </div>

        {tipo === 'aula' && (
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Módulo</label>
            <input 
              name="module" 
              type="text" 
              defaultValue={modalData?.module || ''} 
              className="w-full p-3 border rounded-xl" 
              placeholder="Ex: Módulo 1 - Conceitos Básicos"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
            {tipo === 'ebook' ? 'Link do PDF (URL)' : 'Link do Vídeo / ID Youtube'}
          </label>
          <input 
            name="url" 
            type="text" 
            required 
            defaultValue={modalData?.url || ''} 
            className="w-full p-3 border rounded-xl" 
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Descrição</label>
          <textarea 
            name="description" 
            rows={3} 
            defaultValue={modalData?.description || ''} 
            className="w-full p-3 border rounded-xl resize-none" 
            placeholder="Breve descrição do conteúdo..."
          />
        </div>

        <button disabled={saving} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold mt-4 hover:bg-slate-800 transition">
          {saving ? 'Salvando...' : (isEditing ? 'Atualizar Conteúdo' : 'Adicionar Conteúdo')}
        </button>
      </form>
    );
  };

  // --- FORMULÁRIO: PARCEIRO ---
const renderFormParceiro = () => (
    <form className="space-y-4" onSubmit={async (e) => {
      e.preventDefault(); setSaving(true);
      const formData = new FormData(e.currentTarget);
      
      const { error } = await supabase.from('partners').insert([{ 
        name: formData.get('name'), 
        category: formData.get('category'),
        discount: formData.get('discount'),
        code: formData.get('code'),
        link: formData.get('link')
      }]);

      if (error) alert("Erro: " + error.message); else { alert("Parceiro adicionado!"); onSuccess(); onClose(); }
      setSaving(false);
    }}>
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome da Loja</label>
        <input name="name" type="text" required className="w-full p-3 border rounded-xl" placeholder="Ex: Growth Supplements" />
      </div>
      
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Categoria</label>
        <select name="category" className="w-full p-3 border rounded-xl">
          <option>Suplementos</option>
          <option>Manipulados</option>
          <option>Roupas / Acessórios</option>
          <option>Alimentação</option>
          <option>Outros</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Desconto</label>
          <input name="discount" type="text" required className="w-full p-3 border rounded-xl" placeholder="Ex: 10% OFF" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cód. Cupom</label>
          <input name="code" type="text" required className="w-full p-3 border rounded-xl" placeholder="Ex: GARCIA" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Link da Loja</label>
        <input name="link" type="text" required className="w-full p-3 border rounded-xl" placeholder="https://..." />
      </div>

      <button disabled={saving} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold mt-4 hover:bg-slate-800 transition">
        {saving ? 'Salvando...' : 'Adicionar Parceiro'}
      </button>
    </form>
  );

  // --- FORMULÁRIO: ARQUIVO DO PACIENTE ---
  const renderFormArquivo = () => (
    <form className="space-y-4" onSubmit={async (e) => {
      e.preventDefault(); setSaving(true);
      const formData = new FormData(e.currentTarget);
      
      const { error } = await supabase.from('patient_files').insert([{
        patient_id: pacienteSelecionado?.id,
        title: formData.get('title'),
        url: formData.get('url')
      }]);

      if (error) {
        alert("Erro ao salvar arquivo: " + error.message);
      } else {
        alert("Arquivo adicionado com sucesso!");
        onSuccess();
        onClose();
      }
      setSaving(false);
    }}>
      <div className="bg-blue-50 p-4 rounded-xl mb-4 border border-blue-100">
        <p className="text-sm text-blue-800">
          Adicionando arquivo para: <strong>{pacienteSelecionado?.nome}</strong>
        </p>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Título do Arquivo</label>
        <input name="title" type="text" required className="w-full p-3 border border-slate-200 rounded-xl" placeholder="Ex: Dieta - Fase 1" />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Link do PDF (URL)</label>
        <input name="url" type="text" required className="w-full p-3 border border-slate-200 rounded-xl" placeholder="https://..." />
        <p className="text-[10px] text-slate-400 mt-1">Cole o link público do arquivo (Supabase Storage, Google Drive, etc).</p>
      </div>

      <button disabled={saving} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold mt-4 hover:bg-slate-800 transition">
        {saving ? 'Salvando...' : 'Salvar Arquivo'}
      </button>
    </form>
  );
  
  // --- 8. NOVO: FORMULÁRIO DE ALIMENTO ---
  const renderFormAlimento = () => (
    <form className="space-y-5" onSubmit={async (e) => {
      e.preventDefault(); 
      setSaving(true);
      const formData = new FormData(e.currentTarget);
      
      try {
        const { error } = await supabase.from('foods').insert([{
          name: formData.get('nome'),
          group_name: formData.get('grupo'),
          calories: parseFloat(formData.get('calorias') as string),
          protein: parseFloat(formData.get('proteina') as string || '0'),
          carbs: parseFloat(formData.get('carboidrato') as string || '0'),
          fat: parseFloat(formData.get('gordura') as string || '0'),
        }]);

        if (error) throw error;
        alert("Alimento adicionado!");
        onSuccess();
        onClose();
      } catch (err: any) {
        alert("Erro ao salvar: " + err.message);
      } finally {
        setSaving(false);
      }
    }}>
      <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 mb-2">
        <p className="text-xs text-emerald-800 font-bold flex items-center gap-2">
          <Scale size={16} /> Dados para 100g do alimento
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Nome do Alimento</label>
          <input name="nome" type="text" placeholder="Ex: Peito de Frango Grelhado" required className="w-full p-4 bg-white border border-slate-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900 font-bold text-slate-900" />
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Grupo Alimentar</label>
          <div className="grid grid-cols-2 gap-2">
            <label className="cursor-pointer">
              <input type="radio" name="grupo" value="proteina" className="peer hidden" required />
              <div className="p-3 rounded-xl border border-slate-200 peer-checked:bg-rose-50 peer-checked:border-rose-500 peer-checked:text-rose-700 flex items-center justify-center gap-2 text-sm font-bold text-slate-500 transition-all">
                <Beef size={16}/> Proteína
              </div>
            </label>
            <label className="cursor-pointer">
              <input type="radio" name="grupo" value="carboidrato" className="peer hidden" required />
              <div className="p-3 rounded-xl border border-slate-200 peer-checked:bg-yellow-50 peer-checked:border-yellow-500 peer-checked:text-yellow-700 flex items-center justify-center gap-2 text-sm font-bold text-slate-500 transition-all">
                <Wheat size={16}/> Carboidrato
              </div>
            </label>
            <label className="cursor-pointer">
              <input type="radio" name="grupo" value="fruta" className="peer hidden" required />
              <div className="p-3 rounded-xl border border-slate-200 peer-checked:bg-emerald-50 peer-checked:border-emerald-500 peer-checked:text-emerald-700 flex items-center justify-center gap-2 text-sm font-bold text-slate-500 transition-all">
                <Apple size={16}/> Fruta
              </div>
            </label>
            <label className="cursor-pointer">
              <input type="radio" name="grupo" value="gordura" className="peer hidden" required />
              <div className="p-3 rounded-xl border border-slate-200 peer-checked:bg-orange-50 peer-checked:border-orange-500 peer-checked:text-orange-700 flex items-center justify-center gap-2 text-sm font-bold text-slate-500 transition-all">
                <Droplet size={16}/> Gordura
              </div>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Calorias (Kcal)</label>
            <input name="calorias" type="number" step="0.1" required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900" />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Proteína (g)</label>
            <input name="proteina" type="number" step="0.1" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Carboidrato (g)</label>
            <input name="carboidrato" type="number" step="0.1" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900" />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Gordura (g)</label>
            <input name="gordura" type="number" step="0.1" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900" />
          </div>
        </div>

        <button disabled={saving} className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-bold mt-4 shadow-xl flex items-center justify-center gap-2 transition-all">
          {saving ? <Loader2 className="animate-spin" /> : <><Plus size={20} /> Salvar Alimento</>}
        </button>
      </div>
    </form>
  );
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`bg-white w-full rounded-3xl shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200 relative overflow-y-auto ${['graficos', 'heatmap'].includes(type) ? 'max-w-6xl h-[90vh]' : 'max-w-lg'}`}>
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 pb-2 border-b border-slate-100">
          <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            {type === 'graficos' && <><BarChart3 className="w-8 h-8 text-blue-600"/> Dashboard</>}
            {type === 'heatmap' && <><Activity className="w-8 h-8 text-orange-600"/> Heatmap</>}
            {type === 'renovacao' && <RefreshCw size={24}/>}
            {type === 'transacao' && 'Lançar Receita'}
            {type === 'ebook' && 'Novo E-book'}
            {type === 'aula' && 'Nova Aula'}
            {type === 'paciente' && 'Novo Paciente'}
            {type === 'parceiro' && 'Novo Parceiro'}
            {type === 'arquivo_paciente' && 'Novo Arquivo'}
          </h3>
          <button onClick={onClose} className="p-2 bg-slate-100 hover:bg-red-50 hover:text-red-500 rounded-full transition"><X className="w-6 h-6" /></button>
        </div>
        {type === 'graficos' && renderGraficos()}
        {type === 'heatmap' && renderHeatmap()}
        {type === 'renovacao' && renderFormRenovacao()}
        {type === 'paciente' && renderFormPaciente()}
        {type === 'transacao' && renderFormFinanceiro()}
        {type === 'ebook' && renderFormConteudo('ebook')}
        {type === 'aula' && renderFormConteudo('aula')}
        {type === 'parceiro' && renderFormParceiro()}
        {type === 'arquivo_paciente' && renderFormArquivo()}
      </div>
    </div>
  );
}
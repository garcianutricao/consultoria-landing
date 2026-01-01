"use client";

import React, { useState } from 'react';
import { 
  Search, Plus, CheckCircle, ArrowLeft, 
  Calendar, MessageCircle, Clock, Cookie, 
  Activity, Send, BarChart3, Trash2, Brain, CreditCard,
  UserCheck, UserMinus, RefreshCw, ChevronDown, ChevronUp, User, FileText
} from 'lucide-react';

interface PatientsTabProps {
  pacientes: any[];
  checkinsDb: any[];
  beliscadasDb: any[];
  patientFiles: any[];
  loading: boolean;
  onToggleStatus: (id: string, status: string) => void;
  onSaveFeedback: (id: number, text: string) => void;
  onOpenModal: (type: string, data?: any) => void;
  onDeleteFile: (id: number) => void;
  onDeletePatient: (id: string) => void;
  onRenewPatient: (id: string, plan: string, freq: string) => void; 
  pacienteSelecionado: any;
  setPacienteSelecionado: (paciente: any) => void;
}

const getStatusColor = (valor: number | string) => {
  if (typeof valor === 'string') {
    if (['bom', 'ótimo', 'otimo', 'feito'].includes(valor.toLowerCase())) return "text-emerald-500 font-bold";
    if (['médio', 'medio', 'regular'].includes(valor.toLowerCase())) return "text-yellow-500 font-bold";
    return "text-rose-500 font-bold";
  }
  const nota = Number(valor);
  if (isNaN(nota)) return "text-slate-500";
  if (nota >= 8) return "text-emerald-500 font-bold";
  if (nota >= 5) return "text-yellow-500 font-bold";
  return "text-rose-500 font-bold";
};

export default function PatientsTab({ 
  pacientes, checkinsDb, beliscadasDb, patientFiles, loading, 
  onToggleStatus, onSaveFeedback, onOpenModal, onDeleteFile, onDeletePatient,
  onRenewPatient, pacienteSelecionado, setPacienteSelecionado
}: PatientsTabProps) {
  
  // Estados para os Accordions
  const [isHistorySectionOpen, setIsHistorySectionOpen] = useState(true); // Seção Geral
  const [isSlipsSectionOpen, setIsSlipsSectionOpen] = useState(false); // Novo accordion para beliscadas
  const [openCheckinId, setOpenCheckinId] = useState<number | null>(null); // Itens individuais

  const getCheckinStatus = (paciente: any) => {
    const hoje = new Date();
    const inicio = new Date(paciente.dataInicio);
    const diffDays = Math.ceil(Math.abs(hoje.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)); 
    if (diffDays < (paciente.freq === 'Semanal' ? 7 : 15)) return { label: 'Carência', style: 'bg-yellow-100 text-yellow-700' };
    const dias = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    if (paciente.diaCheckin === dias[hoje.getDay()]) return { label: 'Liberado', style: 'bg-green-100 text-green-700' };
    return { label: 'Aguardando', style: 'bg-slate-100 text-slate-500' };
  };

  const calcularDatasPlano = (inicio: string, plano: string) => {
    if (!inicio) return { inicio: '--', fim: '--', diasRestantes: 0 };
    const dataInicio = new Date(inicio);
    const dataFim = new Date(inicio);
    const p = plano?.toLowerCase() || '';
    if (p.includes('trimestral')) dataFim.setMonth(dataFim.getMonth() + 3);
    else if (p.includes('semestral')) dataFim.setMonth(dataFim.getMonth() + 6);
    else if (p.includes('anual')) dataFim.setFullYear(dataFim.getFullYear() + 1);
    else dataFim.setMonth(dataFim.getMonth() + 1); 

    const hoje = new Date();
    const diffTime = dataFim.getTime() - hoje.getTime();
    const diasRestantes = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return { inicio: dataInicio.toLocaleDateString('pt-BR'), fim: dataFim.toLocaleDateString('pt-BR'), diasRestantes };
  };

  if (pacienteSelecionado) {
    const historico = checkinsDb.filter(c => c.pacienteId === pacienteSelecionado.id).sort((a, b) => new Date(b.dataRaw).getTime() - new Date(a.dataRaw).getTime());
    const beliscadas = beliscadasDb.filter(b => b.pacienteId === pacienteSelecionado.id);
    const arquivos = (patientFiles || []).filter(f => f.patient_id === pacienteSelecionado.id);
    const datasPlano = calcularDatasPlano(pacienteSelecionado.dataInicio, pacienteSelecionado.plano);

    return (
      <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
        
        {/* CABEÇALHO PERFIL PACIENTE */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-0 z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-start gap-4">
              <button onClick={() => setPacienteSelecionado(null)} className="p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-400 mt-1"><ArrowLeft className="w-6 h-6" /></button>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-slate-900">{pacienteSelecionado.nome}</h2>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${pacienteSelecionado.status === 'Ativo' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${pacienteSelecionado.status === 'Ativo' ? 'bg-emerald-500' : 'bg-slate-400'}`} /> 
                    {pacienteSelecionado.status}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black bg-slate-900 text-white px-2 py-1 rounded-md uppercase tracking-tighter">PLANO {pacienteSelecionado.plano?.toUpperCase()}</span>
                    <span className="text-[10px] font-black bg-blue-600 text-white px-2 py-1 rounded-md uppercase tracking-tighter">{pacienteSelecionado.freq?.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100"><Calendar size={13} /> Início: {datasPlano.inicio}</div>
                    <div className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-lg border ${datasPlano.diasRestantes < 5 ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-50 text-slate-600 border-slate-200'}`}><CreditCard size={13} /> Vence: {datasPlano.fim}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full lg:w-auto flex-wrap lg:flex-nowrap">
              <button onClick={() => onOpenModal('renovacao', { paciente: pacienteSelecionado })} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition-all shadow-md whitespace-nowrap"><RefreshCw size={16}/> Renovar Plano</button>
              <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100 gap-1">
                <button onClick={() => onOpenModal('graficos', { paciente: pacienteSelecionado })} className="px-4 py-2 bg-white text-slate-700 font-bold text-xs rounded-lg border border-slate-200 flex items-center gap-1"><BarChart3 size={14} className="text-blue-500" /> Evolução</button>
                <button onClick={() => onOpenModal('heatmap', { paciente: pacienteSelecionado })} className="px-4 py-2 bg-white text-slate-700 font-bold text-xs rounded-lg border border-slate-200 flex items-center gap-1"><Activity size={14} className="text-orange-500" /> Heatmap</button>
              </div>
              <button onClick={() => onToggleStatus(pacienteSelecionado.id, pacienteSelecionado.status)} className="px-4 py-2.5 bg-white text-slate-600 font-bold text-xs rounded-xl border border-slate-200 hover:bg-slate-50 transition-all flex items-center gap-1 whitespace-nowrap">{pacienteSelecionado.status === 'Ativo' ? <UserMinus size={16}/> : <UserCheck size={16}/>} {pacienteSelecionado.status === 'Ativo' ? 'Desativar' : 'Reativar'}</button>
              <button onClick={() => { if(confirm(`Excluir permanentemente ${pacienteSelecionado.nome}?`)) { onDeletePatient(pacienteSelecionado.id); setPacienteSelecionado(null); } }} className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-500 hover:text-white transition-all border border-rose-100"><Trash2 size={18} /></button>
            </div>
          </div>
        </div> 

        {/* ACCORDION PAI: HISTÓRICO DE RELATOS */}
        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
          <button 
            onClick={() => setIsHistorySectionOpen(!isHistorySectionOpen)}
            className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600"><MessageCircle size={22} /></div>
              <h3 className="font-bold text-slate-800 text-lg">Histórico de Relatos</h3>
              <span className="bg-blue-100 text-blue-700 text-xs font-black px-2.5 py-0.5 rounded-full">{historico.length}</span>
            </div>
            {isHistorySectionOpen ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
          </button>

          {isHistorySectionOpen && (
            <div className="p-6 pt-0 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              {historico.length === 0 ? (
                <div className="p-10 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                  <p className="text-slate-400 font-medium italic text-sm">Nenhum check-in enviado ainda.</p>
                </div>
              ) : (
                historico.map(c => {
                  const isItemOpen = openCheckinId === c.id;
                  return (
                    <div key={c.id} className={`rounded-2xl border transition-all ${isItemOpen ? 'border-blue-200 shadow-md ring-1 ring-blue-50' : 'border-slate-100 bg-slate-50/30'}`}>
                      {/* Header do Check-in Individual */}
                      <button 
                        onClick={() => setOpenCheckinId(isItemOpen ? null : c.id)}
                        className="w-full p-4 flex items-center justify-between text-left"
                      >
                        <div className="flex items-center gap-4">
                          <div className="bg-white p-2 rounded-xl text-blue-600 border border-slate-100 shadow-sm"><Calendar size={18}/></div>
                          <div>
                            <span className="block font-bold text-slate-900 text-base">{c.data}</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Peso: {c.peso}kg • Score: {c.score}%</span>
                          </div>
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-md border flex items-center gap-1 uppercase ${c.feedbackNutri || c.admin_feedback ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-orange-600 bg-orange-50 border-orange-100'}`}>
                             {c.feedbackNutri || c.admin_feedback ? 'Respondido' : 'Pendente'}
                          </span>
                        </div>
                        {isItemOpen ? <ChevronUp size={18} className="text-blue-500" /> : <ChevronDown size={18} className="text-slate-400" />}
                      </button>

                      {/* Conteúdo do Check-in (Accordion Interno) */}
                      {isItemOpen && (
                        <div className="p-4 pt-0 border-t border-slate-100 animate-in fade-in duration-200">
                          <div className="grid grid-cols-3 gap-3 my-4 text-center bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                             <div><p className="text-[9px] text-slate-400 uppercase font-black">Treino</p><p className={getStatusColor(c.treino || c.qualidadeTreino)}>{c.treino || c.qualidadeTreino || '-'}</p></div>
                             <div><p className="text-[9px] text-slate-400 uppercase font-black">Sono</p><p className={getStatusColor(c.sono || c.sonoQual)}>{c.sono || c.sonoQual || '-'}</p></div>
                             <div><p className="text-[9px] text-slate-400 uppercase font-black">Humor</p><p className={getStatusColor(c.humor)}>{c.humor || '-'}</p></div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <div className="flex items-center gap-1.5 text-slate-400">
                                  <User size={12} />
                                  <p className="text-[9px] font-black uppercase tracking-widest">Relato do Aluno</p>
                                </div>
                                <div className="text-xs text-slate-700 bg-white p-4 rounded-xl border border-slate-100 leading-relaxed whitespace-pre-wrap font-medium">
                                  {c.dificuldade || "Sem relato detalhado."}
                                </div>
                              </div>
                              
                              <div className="flex flex-col h-full space-y-2">
                                  <div className="flex items-center gap-1.5 text-blue-600">
                                    <MessageCircle size={12} />
                                    <p className="text-[9px] font-black uppercase tracking-widest">Seu Feedback (João)</p>
                                  </div>
                                  {(c.feedbackNutri || c.admin_feedback) ? (
                                    <div className="flex-1 bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-blue-900 text-xs leading-relaxed font-medium">
                                      {c.feedbackNutri || c.admin_feedback}
                                    </div>
                                  ) : (
                                    <div className="flex flex-col gap-2 h-full">
                                      <textarea 
                                        id={`fb-${c.id}`} 
                                        className="flex-1 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-blue-500 transition-all bg-white min-h-[100px] resize-none" 
                                        placeholder="Escreva as orientações..." 
                                      />
                                      <button 
                                        onClick={() => { 
                                          const el = document.getElementById(`fb-${c.id}`) as HTMLTextAreaElement; 
                                          if (!el.value.trim()) return alert("Digite um feedback."); 
                                          onSaveFeedback(c.id, el.value); 
                                        }} 
                                        className="bg-slate-900 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-lg"
                                      >
                                        <Send size={14} /> Enviar Resposta
                                      </button>
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

        {/* ACCORDION 2: HISTÓRICO DE BELISCADAS */}
        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
          <button 
            onClick={() => setIsSlipsSectionOpen(!isSlipsSectionOpen)}
            className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="bg-orange-50 p-2.5 rounded-xl text-orange-600"><Cookie size={22} /></div>
              <h3 className="font-bold text-slate-800 text-lg">Histórico de Beliscadas</h3>
              <span className="bg-orange-100 text-orange-700 text-xs font-black px-2.5 py-0.5 rounded-full">{beliscadas.length}</span>
            </div>
            {isSlipsSectionOpen ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
          </button>

          {isSlipsSectionOpen && (
            <div className="p-6 pt-0 animate-in fade-in slide-in-from-top-2 duration-300">
              {beliscadas.length === 0 ? (
                <div className="p-10 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                  <p className="text-slate-400 font-medium italic text-sm">Nenhuma beliscada registrada.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {beliscadas.map((b) => (
                    <div key={b.id} className="p-4 bg-orange-50/30 border border-orange-100 rounded-2xl hover:bg-orange-50 transition-all group">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-slate-800 text-sm group-hover:text-orange-700 transition-colors">{b.alimento}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{b.data} • {b.hora}</span>
                      </div>
                      <div className="flex gap-2 flex-wrap mb-3">
                        <span className="text-[9px] bg-white border border-orange-100 px-2 py-0.5 rounded text-orange-700 font-bold uppercase">{b.gatilho}</span>
                        <span className="text-[9px] bg-white border border-blue-100 px-2 py-0.5 rounded text-blue-700 font-bold uppercase">{b.sentimento}</span>
                      </div>
                      {b.estrategia && (
                        <div className="bg-white/60 p-2.5 rounded-xl border border-orange-100/50">
                          <p className="text-[9px] font-bold text-orange-400 uppercase flex items-center gap-1 mb-1"><Brain size={10}/> Estratégia</p>
                          <p className="text-[11px] text-slate-600 italic leading-relaxed">"{b.estrategia}"</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* SEÇÃO FINAL: ARQUIVOS (MANTIDA FORA DE ACCORDION POIS É ACESSO RÁPIDO) */}
        {arquivos.length > 0 && (
           <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><FileText size={20} className="text-slate-400" /> Arquivos Enviados</h3>
              <div className="space-y-2">
                 {arquivos.map((f:any) => (
                    <div key={f.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 transition-all">
                       <span className="text-sm font-bold text-slate-700">{f.title || "Arquivo"}</span>
                       <button onClick={() => onDeleteFile(f.id)} className="text-rose-500 hover:text-rose-700 transition p-1.5 hover:bg-rose-50 rounded-lg"><Trash2 size={16}/></button>
                    </div>
                 ))}
              </div>
           </div>
        )}
      </div>
    );
  }

  {/* MODO LISTA DE PACIENTES */}
  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center gap-4">
        <div className="relative w-full max-w-md"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /><input type="text" placeholder="Buscar por nome ou email..." className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 transition-all shadow-sm" /></div>
        <button onClick={() => onOpenModal('paciente')} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-600 transition-all shadow-lg whitespace-nowrap"><Plus className="w-5 h-5" /> Novo Paciente</button>
      </div>
      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
        {loading ? <div className="p-20 text-center text-slate-400">Carregando pacientes...</div> : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nome / Telefone</th>
                <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Plano</th>
                <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Check-in</th>
                <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {pacientes.map(p => (
                <tr key={p.id} className={`border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors ${p.status === 'Inativo' ? 'opacity-60' : ''}`} onClick={() => setPacienteSelecionado(p)}>
                  <td className="p-5"><div className={`w-2 h-2 rounded-full ${p.status === 'Ativo' ? 'bg-emerald-500' : 'bg-slate-300'}`} /></td>
                  <td className="p-5"><p className="font-bold text-slate-900 text-sm">{p.nome}</p><p className="text-[11px] text-slate-400 font-medium">{p.telefone}</p></td>
                  <td className="p-5"><span className="text-xs font-bold text-slate-600">{p.plano}</span><span className="text-[10px] text-slate-400 block font-bold uppercase">{p.freq}</span></td>
                  <td className="p-5"><span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider ${getCheckinStatus(p).style}`}>{getCheckinStatus(p).label}</span></td>
                  <td className="p-5 text-right"><div className="flex justify-end gap-2"><button className="text-blue-600 font-bold text-[11px] bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-600 hover:text-white transition-all">ABRIR</button><button onClick={(e) => { e.stopPropagation(); if(confirm(`Excluir ${p.nome}?`)) onDeletePatient(p.id); }} className="text-rose-400 p-2 hover:bg-rose-50 rounded-xl transition-colors"><Trash2 size={18} /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
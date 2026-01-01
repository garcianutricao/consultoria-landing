"use client";

import React from 'react';
import { 
  Bell, ArrowRight, Activity, AlertTriangle, 
  Cookie, Utensils, Zap, Users, CheckCircle, Brain
} from 'lucide-react';

interface OverviewTabProps {
  pacientes: any[];
  checkinsPendentes: any[];
  beliscadasDb: any[];
  onNavigateToPatient: (id: string) => void;
  onMarkSlipAsRead: (id: number) => void;
}

export default function OverviewTab({ 
  pacientes, 
  checkinsPendentes, 
  beliscadasDb, 
  onNavigateToPatient,
  onMarkSlipAsRead
}: OverviewTabProps) {

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* CARDS DE MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div><p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total de Pacientes</p><h3 className="text-3xl font-bold text-slate-900 mt-1">{pacientes.length}</h3></div>
          <div className="bg-slate-100 p-3 rounded-xl text-slate-600"><Users className="w-6 h-6" /></div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div><p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Check-ins Pendentes</p><h3 className="text-3xl font-bold text-orange-600 mt-1">{checkinsPendentes.length}</h3></div>
          <div className="bg-orange-100 p-3 rounded-xl text-orange-600"><Bell className="w-6 h-6" /></div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div><p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Beliscadas Pendentes</p><h3 className="text-3xl font-bold text-red-600 mt-1">{beliscadasDb.length}</h3></div>
          <div className="bg-red-100 p-3 rounded-xl text-red-600"><Cookie className="w-6 h-6" /></div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div><p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Engajamento</p><h3 className="text-3xl font-bold text-emerald-600 mt-1">98%</h3></div>
          <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600"><Activity className="w-6 h-6" /></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* COLUNA 1: CHECK-INS PENDENTES */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Bell className="w-5 h-5 text-orange-500" /> Check-ins Pendentes
            </h3>
            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-full">{checkinsPendentes.length} novos</span>
          </div>
          
          <div className="p-6 space-y-4 flex-1 overflow-y-auto max-h-[600px]">
            {checkinsPendentes.length === 0 ? (
              <div className="text-center py-10 text-slate-400">
                <p>Tudo em dia! Nenhum check-in pendente.</p>
              </div>
            ) : (
              checkinsPendentes.map((checkin) => (
                <div key={checkin.id} className="group flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/30 transition-all">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-white text-slate-700 border border-slate-200 flex items-center justify-center font-bold text-sm shadow-sm">
                        {checkin.nome ? checkin.nome.charAt(0) : '?'}
                     </div>
                     <div>
                        <p className="font-bold text-slate-900">{checkin.nome}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <Activity className="w-3 h-3" /> Score: <span className={checkin.score >= 80 ? 'text-green-600 font-bold' : 'text-orange-600 font-bold'}>{checkin.score}%</span> • {checkin.data}
                        </p>
                     </div>
                  </div>
                  <button 
                    onClick={() => onNavigateToPatient(checkin.pacienteId)}
                    className="px-3 py-2 bg-white text-slate-600 border border-slate-200 rounded-lg text-xs font-bold hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-colors flex items-center gap-1 shadow-sm"
                  >
                    Responder <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* COLUNA 2: RADAR DE BELISCADAS (APENAS NÃO LIDOS) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" /> Radar de Escapadas
            </h3>
            <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">
               {beliscadasDb.length > 0 ? `${beliscadasDb.length} novos registros` : 'Tudo limpo'}
            </span>
          </div>

          <div className="p-6 space-y-4 flex-1 overflow-y-auto max-h-[600px]">
             {beliscadasDb.length === 0 ? (
               <div className="text-center py-10 text-slate-400 flex flex-col items-center gap-2">
                 <Cookie className="w-8 h-8 opacity-20" />
                 <p>Nenhuma pendência. Seus alunos estão focados! (Ou você já leu tudo)</p>
               </div>
             ) : (
               beliscadasDb.map((slip) => (
                 <div key={slip.id} className="relative pl-6 pb-2 border-l-2 border-red-100 last:border-0 animate-in slide-in-from-right-2 duration-300">
                    
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-red-100 border-2 border-white shadow-sm flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                    </div>

                    <div className="p-4 rounded-xl border bg-slate-50 border-slate-200 hover:shadow-sm transition-all">
                       <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{slip.nome || 'Paciente'}</p>
                            <span className="text-[10px] font-mono text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-100">
                              {slip.data} • {slip.hora}
                            </span>
                          </div>
                          
                          {/* Botão de Marcar como Lido - AO CLICAR, ITEM SOME */}
                          <button 
                            onClick={() => onMarkSlipAsRead(slip.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 transition-colors shadow-sm group"
                            title="Marcar como lido e remover da lista"
                          >
                            <CheckCircle size={14} className="text-slate-400 group-hover:text-emerald-500"/> 
                            Marcar visto
                          </button>
                       </div>
                       
                       <div className="flex items-start gap-3 mt-3">
                          <div className="mt-0.5 p-1.5 rounded-lg border bg-white border-slate-200 text-orange-500">
                             <Utensils className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                             <p className="text-sm text-slate-700 font-medium">Comeu: <span className="text-slate-900 font-bold">{slip.alimento}</span></p>
                             <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                {slip.gatilho && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded uppercase tracking-wide">
                                    <Zap className="w-3 h-3" /> {slip.gatilho}
                                  </span>
                                )}
                                {slip.sentimento && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded uppercase tracking-wide">
                                    {slip.sentimento}
                                  </span>
                                )}
                             </div>
                             
                             {/* Estratégia Futura */}
                             {slip.estrategia && (
                               <div className="mt-3 bg-blue-50/50 p-2.5 rounded-lg border border-blue-100 flex gap-2 items-start">
                                  <Brain className="w-4 h-4 text-blue-400 mt-0.5" />
                                  <div>
                                    <p className="text-[10px] font-bold text-blue-500 uppercase">Estratégia Futura</p>
                                    <p className="text-xs text-blue-800 italic leading-relaxed">"{slip.estrategia}"</p>
                                  </div>
                               </div>
                             )}
                          </div>
                       </div>
                       
                       <button 
                         onClick={() => onNavigateToPatient(slip.pacienteId)}
                         className="mt-3 w-full py-1.5 text-xs font-bold text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors text-center border border-transparent hover:border-blue-100"
                       >
                         Ver prontuário do paciente
                       </button>
                    </div>
                 </div>
               ))
             )}
          </div>
        </div>

      </div>
    </div>
  );
}
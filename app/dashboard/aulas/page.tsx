"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  PlayCircle, X, Lock, Clock, GraduationCap, ChevronDown, 
  CheckCircle2, Play, Loader2
} from 'lucide-react';

export default function AulasPage() {
  
  const [videoAberto, setVideoAberto] = useState<string | null>(null);
  const [moduloAberto, setModuloAberto] = useState<string | null>(null); // Agora usa o nome do módulo (string)
  const [loading, setLoading] = useState(true);
  
  // Estado que armazenará os dados agrupados
  const [modulos, setModulos] = useState<any[]>([]);

  // --- BUSCAR AULAS DO BANCO ---
  useEffect(() => {
    async function fetchAulas() {
      try {
        const { data, error } = await supabase
          .from('content')
          .select('*')
          .eq('type', 'aula')
          .order('created_at', { ascending: true }); // Aulas mais antigas primeiro (ordem de cadastro)

        if (error) throw error;

        // Agrupando a lista plana em módulos
        const aulasAgrupadas = (data || []).reduce((acc: any, item: any) => {
          const nomeModulo = item.module || "Aulas Extras"; // Se não tiver módulo, vai para "Extras"
          
          if (!acc[nomeModulo]) {
            acc[nomeModulo] = {
              titulo: nomeModulo,
              descricao: "Conteúdo exclusivo para sua evolução.", // Descrição padrão (já que o banco não tem tabela de módulos)
              aulas: []
            };
          }

          // Extrai o ID do Youtube da URL salva
          const videoId = getYoutubeId(item.url);

          acc[nomeModulo].aulas.push({
            id: item.id,
            titulo: item.title,
            duracao: "Aula", // Como não salvamos duração, deixamos genérico
            videoId: videoId, 
            liberado: true, // Por padrão liberado (podemos criar lógica de travar depois)
            progresso: 0 // Sem tabela de progresso ainda, iniciamos em 0
          });

          return acc;
        }, {});

        // Converte objeto em array
        setModulos(Object.values(aulasAgrupadas));
        
        // Abre o primeiro módulo automaticamente se existir
        const primeiroModulo = Object.keys(aulasAgrupadas)[0];
        if (primeiroModulo) setModuloAberto(primeiroModulo);

      } catch (err) {
        console.error("Erro ao carregar aulas:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAulas();
  }, []);

  // Helper para extrair ID do Youtube
  const getYoutubeId = (url: string) => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const toggleModulo = (titulo: string) => {
    setModuloAberto(moduloAberto === titulo ? null : titulo);
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-8 p-4 md:p-0">
      
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <GraduationCap className="text-blue-600 w-8 h-8" />
          Aulas Exclusivas
        </h1>
        <p className="text-slate-500 mt-2">
          Sua trilha de conhecimento. Clique nos módulos abaixo para assistir.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mb-4" />
          <p>Carregando conteúdo...</p>
        </div>
      ) : modulos.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
          <p className="text-slate-400">Nenhuma aula disponível no momento.</p>
        </div>
      ) : (
        /* Lista de Módulos (Accordion) */
        <div className="space-y-4">
          {modulos.map((modulo, index) => {
            const isOpen = moduloAberto === modulo.titulo;
            
            // Conta quantas aulas foram concluídas neste módulo (Lógica futura)
            const concluidas = modulo.aulas.filter((a: any) => a.progresso === 100).length;
            const total = modulo.aulas.length;
            
            return (
              <div key={index} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md">
                
                {/* Cabeçalho do Módulo */}
                <button 
                  onClick={() => toggleModulo(modulo.titulo)}
                  className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <h2 className={`text-xl font-bold ${isOpen ? 'text-blue-600' : 'text-slate-900'}`}>
                      {modulo.titulo}
                    </h2>
                    <p className="text-sm text-slate-500 mt-1 max-w-xl">
                      {modulo.descricao}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Barra de progresso do Módulo */}
                    <div className="hidden md:flex flex-col items-end gap-1">
                      <span className="text-xs font-bold text-slate-400">
                        {concluidas}/{total} aulas
                      </span>
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full transition-all duration-500"
                          style={{ width: `${total > 0 ? (concluidas / total) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className={`p-2 rounded-full bg-slate-100 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-blue-100 text-blue-600' : ''}`}>
                      <ChevronDown className="w-6 h-6" />
                    </div>
                  </div>
                </button>

                {/* Área das Aulas */}
                {isOpen && (
                  <div className="p-6 bg-slate-50 border-t border-slate-100 animate-in slide-in-from-top-2 fade-in duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {modulo.aulas.map((aula: any) => {
                        const isConcluida = aula.progresso === 100;
                        const isIniciada = aula.progresso > 0 && aula.progresso < 100;

                        return (
                          <div key={aula.id} className="group flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative">
                            
                            {/* Thumbnail */}
                            <div className="relative aspect-video bg-slate-900 overflow-hidden cursor-pointer" onClick={() => aula.liberado && setVideoAberto(aula.videoId)}>
                              <img 
                                src={`https://img.youtube.com/vi/${aula.videoId}/maxresdefault.jpg`} 
                                alt={aula.titulo}
                                className={`w-full h-full object-cover transition-all duration-300 
                                  ${!aula.liberado ? 'opacity-40 grayscale' : 'group-hover:opacity-90'}
                                  ${isConcluida ? 'opacity-60' : ''}
                                `}
                                onError={(e) => {
                                  // Fallback se a imagem maxres não existir
                                  (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${aula.videoId}/hqdefault.jpg`;
                                }}
                              />
                              
                              {/* Overlay de Concluída */}
                              {isConcluida && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                  <div className="bg-green-500 text-white p-2 rounded-full shadow-lg transform scale-100 transition-transform">
                                    <CheckCircle2 className="w-8 h-8" />
                                  </div>
                                </div>
                              )}

                              {/* Botão Play (Se não concluída) */}
                              {!isConcluida && aula.liberado && (
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <div className="bg-white/20 backdrop-blur-sm border border-white/50 text-white p-3 rounded-full">
                                    <PlayCircle className="w-10 h-10 fill-current" />
                                  </div>
                                </div>
                              )}

                              {/* Lock Icon */}
                              {!aula.liberado && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="bg-slate-900/80 p-3 rounded-full border border-slate-700">
                                    <Lock className="w-6 h-6 text-slate-400" />
                                  </div>
                                </div>
                              )}

                              {/* Duração */}
                              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                                <Clock size={10} />
                                {aula.duracao}
                              </div>
                            </div>

                            {/* Info */}
                            <div className="p-4 flex-1 flex flex-col">
                              <h3 className={`text-base font-bold leading-snug mb-2 transition-colors line-clamp-2 ${isConcluida ? 'text-slate-500' : 'text-slate-900 group-hover:text-blue-700'}`}>
                                {aula.titulo}
                              </h3>
                              
                              <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                                {isConcluida ? (
                                  <span className="flex items-center gap-1 font-bold text-green-600">
                                    <CheckCircle2 className="w-3 h-3" /> Concluída
                                  </span>
                                ) : isIniciada ? (
                                  <span className="flex items-center gap-1 font-bold text-blue-600">
                                    <Play className="w-3 h-3 fill-current" /> Continuar
                                  </span>
                                ) : aula.liberado ? (
                                  <span className="flex items-center gap-1 font-medium group-hover:text-blue-600 transition-colors">
                                    <PlayCircle className="w-3 h-3" /> Assistir aula
                                  </span>
                                ) : (
                                  <span className="text-red-400 font-bold bg-red-50 px-2 py-0.5 rounded">Em breve</span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* --- CINEMA (MODAL) --- */}
      {videoAberto && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl relative">
            <button 
              onClick={() => setVideoAberto(null)}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <iframe 
              src={`https://www.youtube.com/embed/${videoAberto}?autoplay=1&rel=0`} 
              title="YouTube video player"
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

    </div>
  );
}
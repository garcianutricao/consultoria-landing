"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // Importando seu cliente Supabase
import { BookOpen, Download, X, Eye, Maximize2, Loader2 } from 'lucide-react';

export default function BibliotecaPage() {
  
  // Estado para controlar qual ebook está aberto (Leitor)
  const [ebookAberto, setEbookAberto] = useState<string | null>(null);
  
  // Estado para armazenar os ebooks vindos do banco
  const [listaEbooks, setListaEbooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Cores do seu tema para distribuir entre os cards
  const coresCards = ["bg-blue-600", "bg-orange-500", "bg-green-600", "bg-purple-600"];

  // --- BUSCAR DO SUPABASE ---
  useEffect(() => {
    async function fetchEbooks() {
      try {
        const { data, error } = await supabase
          .from('content')
          .select('*')
          .eq('type', 'ebook') // Filtra apenas ebooks
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Formata os dados do banco para o formato visual
        const ebooksFormatados = (data || []).map((item, index) => ({
          id: item.id,
          titulo: item.title,
          descricao: item.description,
          arquivo: item.url, // A URL salva no banco
          cor: coresCards[index % coresCards.length] // Atribui cor ciclicamente
        }));

        setListaEbooks(ebooksFormatados);
      } catch (err) {
        console.error("Erro ao carregar ebooks:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchEbooks();
  }, []);

  return (
    <div className="max-w-6xl mx-auto pb-20 p-4 md:p-0">
      
      {/* Cabeçalho */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <BookOpen className="text-blue-600 w-8 h-8" />
          Biblioteca Digital
        </h1>
        <p className="text-slate-500 mt-2">
          Materiais exclusivos para acelerar seu resultado. Leia agora mesmo ou baixe para depois.
        </p>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mb-4" />
          <p>Carregando sua estante...</p>
        </div>
      ) : (
        /* Grid de Livros */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listaEbooks.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
              <p className="text-slate-400">Nenhum material disponível no momento.</p>
            </div>
          ) : (
            listaEbooks.map((ebook) => (
              <div key={ebook.id} className="group bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
                
                {/* Capa do Livro (Simulada) */}
                <div className={`h-48 ${ebook.cor} relative p-6 flex flex-col justify-between`}>
                  <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform duration-500">
                    <BookOpen className="w-24 h-24 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="text-white font-bold text-xl leading-tight shadow-black/10 drop-shadow-md line-clamp-3">
                      {ebook.titulo}
                    </h3>
                  </div>
                </div>

                {/* Conteúdo e Botões */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <p className="text-slate-500 text-sm mb-6 leading-relaxed line-clamp-3">
                    {ebook.descricao || "Sem descrição disponível."}
                  </p>

                  <div className="flex gap-3">
                    {/* Botão de LER ONLINE (Principal) */}
                    <button 
                      onClick={() => setEbookAberto(ebook.arquivo)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold bg-slate-900 text-white hover:bg-blue-600 transition-colors shadow-lg shadow-slate-900/20"
                    >
                      <Eye className="w-4 h-4" />
                      Ler Agora
                    </button>

                    {/* Botão de DOWNLOAD (Secundário) */}
                    <a 
                      href={ebook.arquivo} 
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center p-3 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                      title="Baixar PDF"
                    >
                      <Download className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* --- LEITOR DE PDF (MODAL) --- */}
      {ebookAberto && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm animate-in fade-in duration-200">
          
          {/* Container do Leitor */}
          <div className="bg-white w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden relative">
            
            {/* Barra de Topo do Leitor */}
            <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center">
              <h3 className="font-bold text-slate-700 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Leitor de Ebook
              </h3>
              
              <div className="flex gap-2">
                {/* Botão Abrir em Nova Aba */}
                <a 
                  href={ebookAberto} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 text-slate-500 hover:bg-slate-200 rounded-lg transition"
                  title="Expandir / Abrir em nova aba"
                >
                  <Maximize2 className="w-5 h-5" />
                </a>

                {/* Botão Fechar */}
                <button 
                  onClick={() => setEbookAberto(null)}
                  className="p-2 text-slate-500 hover:bg-red-100 hover:text-red-600 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* O PDF em si (Iframe) */}
            <div className="flex-1 bg-slate-200">
              <iframe 
                src={ebookAberto} 
                className="w-full h-full"
                title="Leitor de PDF"
              />
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
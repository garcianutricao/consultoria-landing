"use client";

import React from 'react';
import { 
  Ticket, Plus, Edit3, Trash2, ExternalLink, ShoppingBag, Pill, Shirt 
} from 'lucide-react';

interface PartnersTabProps {
  parceiros: any[];
  onOpenModal: (type: string, data?: any) => void;
  onDelete: (id: number) => void;
}

export default function PartnersTab({ parceiros, onOpenModal, onDelete }: PartnersTabProps) {
  
  // Função auxiliar para escolher ícone (baseado no nome ou categoria)
  const getIcon = (categoria: string) => {
    const cat = categoria.toLowerCase();
    if (cat.includes('suplemento')) return <ShoppingBag size={24} />;
    if (cat.includes('farma') || cat.includes('manipulado')) return <Pill size={24} />;
    if (cat.includes('roupa') || cat.includes('vestuário')) return <Shirt size={24} />;
    return <Ticket size={24} />;
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Ticket className="text-purple-600" /> Clube de Descontos
          </h2>
          <p className="text-slate-500 text-sm mt-1">Gerencie os benefícios exclusivos para seus alunos.</p>
        </div>
        <button 
          onClick={() => onOpenModal('parceiro')}
          className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all"
        >
          <Plus size={20} /> Novo Parceiro
        </button>
      </div>

      {/* Lista de Parceiros */}
      {parceiros.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
          <Ticket className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Nenhum parceiro cadastrado.</p>
          <p className="text-sm text-slate-400">Adicione lojas para seus alunos economizarem.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {parceiros.map((parceiro) => (
            <div key={parceiro.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition group flex flex-col sm:flex-row items-center gap-6">
              
              {/* Logo/Ícone */}
              <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                {getIcon(parceiro.category || '')}
              </div>

              {/* Infos */}
              <div className="flex-1 w-full text-center sm:text-left">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{parceiro.name}</h3>
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded uppercase tracking-wide">
                      {parceiro.category || 'Geral'}
                    </span>
                  </div>
                  
                  {/* Botões de Ação */}
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onDelete(parceiro.id)}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-center sm:justify-start gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Desconto</p>
                    <p className="text-emerald-600 font-bold">{parceiro.discount}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Cupom</p>
                    <p className="text-slate-800 font-mono font-bold bg-slate-100 px-2 rounded">
                      {parceiro.code || 'LINK'}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
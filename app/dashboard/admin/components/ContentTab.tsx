"use client";

import React from 'react';
import { 
  BookOpen, Video, Plus, Edit3, Trash2, ExternalLink, PlayCircle 
} from 'lucide-react';

interface ContentTabProps {
  ebooks: any[];
  aulas: any[];
  onOpenModal: (type: string, data?: any) => void;
  onDelete: (id: number) => void;
}

export default function ContentTab({ ebooks, aulas, onOpenModal, onDelete }: ContentTabProps) {
  
  const renderCard = (item: any, type: 'ebook' | 'aula') => (
    <div key={item.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition group">
      <div className="flex justify-between items-start mb-3">
        <div className={`p-2.5 rounded-lg ${type === 'ebook' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
          {type === 'ebook' ? <BookOpen size={20} /> : <Video size={20} />}
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onOpenModal(type, item)} // Abre modal com dados para editar
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
            title="Editar"
          >
            <Edit3 size={16} />
          </button>
          <button 
            onClick={() => onDelete(item.id)}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
            title="Excluir"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <h3 className="font-bold text-slate-900 mb-1 line-clamp-1">{item.title}</h3>
      <p className="text-sm text-slate-500 mb-4 line-clamp-2 min-h-[40px]">
        {item.description || "Sem descrição definida."}
      </p>

      {type === 'aula' && item.module && (
        <span className="inline-block text-[10px] font-bold uppercase bg-slate-100 text-slate-600 px-2 py-1 rounded mb-3">
          {item.module}
        </span>
      )}

      <a 
        href={item.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-bold transition ${
          type === 'ebook' 
            ? 'bg-orange-50 text-orange-700 hover:bg-orange-100' 
            : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
        }`}
      >
        {type === 'ebook' ? 'Baixar PDF' : 'Assistir Aula'} 
        <ExternalLink size={14} />
      </a>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in">
      
      {/* SEÇÃO EBOOKS */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="text-orange-500" /> Biblioteca de E-books
          </h2>
          <button 
            onClick={() => onOpenModal('ebook')}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition shadow-lg"
          >
            <Plus size={16} /> Novo E-book
          </button>
        </div>

        {ebooks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
            <p className="text-slate-400">Nenhum e-book cadastrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ebooks.map(ebook => renderCard(ebook, 'ebook'))}
          </div>
        )}
      </div>

      {/* SEÇÃO AULAS */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <PlayCircle className="text-blue-500" /> Aulas Exclusivas
          </h2>
          <button 
            onClick={() => onOpenModal('aula')}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition shadow-lg"
          >
            <Plus size={16} /> Nova Aula
          </button>
        </div>

        {aulas.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
            <p className="text-slate-400">Nenhuma aula cadastrada.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {aulas.map(aula => renderCard(aula, 'aula'))}
          </div>
        )}
      </div>

    </div>
  );
}
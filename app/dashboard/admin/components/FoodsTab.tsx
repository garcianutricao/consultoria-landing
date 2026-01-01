"use client";

import React from 'react';
import { Trash2, Search, Apple, Beef, Wheat, Droplet } from 'lucide-react';

interface FoodsTabProps {
  foods: any[];
  onDelete: (id: string) => void;
  onOpenModal: () => void;
}

export default function FoodsTab({ foods, onDelete, onOpenModal }: FoodsTabProps) {
  const getIcon = (grupo: string) => {
    switch(grupo) {
      case 'proteina': return <Beef size={16} className="text-rose-500"/>;
      case 'carboidrato': return <Wheat size={16} className="text-yellow-500"/>;
      case 'fruta': return <Apple size={16} className="text-emerald-500"/>;
      case 'gordura': return <Droplet size={16} className="text-orange-500"/>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header da Aba */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <Apple className="text-slate-400" size={20} /> 
          Banco de Alimentos ({foods.length})
        </h3>
        <button 
          onClick={onOpenModal}
          className="bg-slate-900 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-md"
        >
          + Adicionar Alimento
        </button>
      </div>

      {/* Tabela de Alimentos */}
      <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Alimento</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Grupo</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Kcal (100g)</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Macros (P/C/G)</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {foods.map((food) => (
                <tr key={food.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-slate-700 text-sm">{food.name}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-bold text-slate-600 capitalize">
                      {getIcon(food.group_name)} {food.group_name}
                    </span>
                  </td>
                  <td className="p-4 text-center font-bold text-slate-900">{food.calories}</td>
                  <td className="p-4 text-center text-xs font-medium text-slate-500">
                    <span className="text-rose-600 font-bold" title="Proteína">{food.protein}g</span> / {' '}
                    <span className="text-yellow-600 font-bold" title="Carboidrato">{food.carbs}g</span> / {' '}
                    <span className="text-orange-600 font-bold" title="Gordura">{food.fat}g</span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => onDelete(food.id)}
                      className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {foods.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400 italic">Nenhum alimento cadastrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
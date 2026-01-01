"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Ticket, ExternalLink, Copy, Check, ShoppingBag, Pill, Shirt, Loader2 } from 'lucide-react';

export default function CuponsPage() {
  const [copiadoId, setCopiadoId] = useState<number | null>(null);
  const [parceiros, setParceiros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchParceiros() {
      try {
        const { data } = await supabase.from('partners').select('*').order('created_at', { ascending: false });
        if (data) setParceiros(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchParceiros();
  }, []);

  const copiarCodigo = (codigo: string, id: number) => {
    navigator.clipboard.writeText(codigo);
    setCopiadoId(id);
    setTimeout(() => setCopiadoId(null), 2000);
  };

  const getIcon = (categoria: string) => {
    const cat = (categoria || '').toLowerCase();
    if (cat.includes('suplemento')) return ShoppingBag;
    if (cat.includes('farma') || cat.includes('manipulado')) return Pill;
    if (cat.includes('roupa')) return Shirt;
    return Ticket;
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 p-4 md:p-0">
      
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <Ticket className="text-blue-600 w-8 h-8" />
          Clube de Vantagens
        </h1>
        <p className="text-slate-500 mt-2">
          Economize nas suas compras com os parceiros oficiais do time Garcia.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>
      ) : parceiros.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400">
          Nenhum cupom disponível no momento.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {parceiros.map((parceiro) => {
            const Icone = getIcon(parceiro.category);
            
            return (
              <div key={parceiro.id} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
                
                <div className="w-20 h-20 flex-shrink-0 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-gray-200">
                  <Icone className="w-10 h-10" />
                </div>

                <div className="flex-1 w-full text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row justify-between items-center mb-1">
                    <h3 className="font-bold text-lg text-slate-900">{parceiro.name}</h3>
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded uppercase tracking-wide mt-1 sm:mt-0">
                      {parceiro.category}
                    </span>
                  </div>
                  
                  <p className="text-emerald-600 font-bold text-sm mb-4">
                    {parceiro.discount} em todo o site
                  </p>

                  <div className="flex gap-2">
                    <div className="flex-1 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-between px-4 py-2 relative group">
                      <span className="font-mono font-bold text-slate-700 tracking-wider text-lg">
                        {parceiro.code}
                      </span>
                      
                      <button 
                        onClick={() => copiarCodigo(parceiro.code, parceiro.id)}
                        className="p-2 hover:bg-white rounded-lg transition-colors text-slate-400 hover:text-blue-600"
                        title="Copiar código"
                      >
                        {copiadoId === parceiro.id ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                      </button>
                      
                      {copiadoId === parceiro.id && (
                        <span className="absolute -top-8 right-0 bg-black text-white text-xs px-2 py-1 rounded shadow-lg animate-bounce">
                          Copiado!
                        </span>
                      )}
                    </div>

                    <a 
                      href={parceiro.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-slate-900 text-white p-3 rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center"
                      title="Ir para a loja"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
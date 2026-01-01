"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; 
import { AlertTriangle, X, Clock } from 'lucide-react';

export default function GlobalAlerts() {
  const [avisosAtivos, setAvisosAtivos] = useState<any[]>([]);
  const [visivel, setVisivel] = useState(true);

  useEffect(() => {
    async function fetchAvisos() {
      try {
        const { data } = await supabase.from('app_settings').select('value').eq('key', 'global_alert').single();
        if (data && Array.isArray(data.value)) {
          const agora = new Date();
          const ativos = data.value.filter((aviso: any) => {
            const validade = new Date(aviso.validade);
            return validade > agora;
          });
          setAvisosAtivos(ativos);
        }
      } catch (err) { console.error(err); }
    }
    fetchAvisos();
  }, []);

  if (!visivel || avisosAtivos.length === 0) return null;

  return (
    <div className="w-full space-y-2 mb-6 animate-in slide-in-from-top-2 duration-500">
      {avisosAtivos.map((aviso) => (
        <div key={aviso.id} className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-xl shadow-sm flex items-start gap-3 relative">
          <div className="text-yellow-600 mt-0.5"><AlertTriangle size={20} /></div>
          <div className="flex-1">
            <p className="text-sm font-bold text-yellow-800">Aviso Importante</p>
            <p className="text-sm text-yellow-700 mt-1 leading-relaxed">{aviso.texto}</p>
            <p className="text-[10px] text-yellow-600/60 mt-2 flex items-center gap-1 font-medium">
              <Clock size={10} /> Expira em: {new Date(aviso.validade).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})} - {new Date(aviso.validade).toLocaleDateString('pt-BR')}
            </p>
          </div>
          <button onClick={() => setVisivel(false)} className="text-yellow-400 hover:text-yellow-600 transition-colors p-1"><X size={18} /></button>
        </div>
      ))}
    </div>
  );
}
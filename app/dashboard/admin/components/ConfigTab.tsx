"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Settings, Save, Plus, Trash2, AlertTriangle, 
  ListChecks, Loader2, Clock, Hourglass 
} from 'lucide-react';

interface ConfigTabProps {
  onSaveAviso?: () => void;
  onSavePerguntas?: () => void;
}

export default function ConfigTab(props: ConfigTabProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Estados para Avisos
  const [avisos, setAvisos] = useState<any[]>([]);
  const [novoAvisoTexto, setNovoAvisoTexto] = useState("");
  const [duracaoMinutos, setDuracaoMinutos] = useState(""); // Novo estado para minutos

  // Estados para Perguntas
  const [perguntas, setPerguntas] = useState<string[]>([]);
  const [novaPergunta, setNovaPergunta] = useState("");

  // Buscar configurações ao carregar
  useEffect(() => {
    fetchConfigs();
  }, []);

  async function fetchConfigs() {
    try {
      const { data } = await supabase.from('app_settings').select('*');
      
      if (data) {
        const alertData = data.find(d => d.key === 'global_alert');
        const questionsData = data.find(d => d.key === 'checkin_questions');

        if (alertData && Array.isArray(alertData.value)) {
          setAvisos(alertData.value);
        } else {
          setAvisos([]); 
        }

        if (questionsData && Array.isArray(questionsData.value)) {
          setPerguntas(questionsData.value);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // --- LÓGICA DE AVISOS (TEMPO REAL) ---

  const handleAddAviso = async () => {
    if (!novoAvisoTexto.trim() || !duracaoMinutos) {
      return alert("Preencha o texto e a duração em minutos.");
    }

    setSaving(true);
    
    // Calcula a data de expiração baseada nos minutos informados
    const minutos = parseInt(duracaoMinutos);
    const dataAtual = new Date();
    const dataExpiracao = new Date(dataAtual.getTime() + minutos * 60000); // 60000ms = 1 minuto

    const novoItem = {
      id: Date.now(),
      texto: novoAvisoTexto,
      validade: dataExpiracao.toISOString(), // Salva o timestamp futuro calculado
      criadoEm: dataAtual.toISOString(),
      duracaoOriginal: minutos // Guardamos só para referência se precisar mostrar
    };

    const novaLista = [novoItem, ...avisos];
    setAvisos(novaLista);

    // Salva no banco
    await supabase.from('app_settings').upsert({ key: 'global_alert', value: novaLista }, { onConflict: 'key' });
    
    setNovoAvisoTexto("");
    setDuracaoMinutos("");
    setSaving(false);
  };

  const handleDeleteAviso = async (id: number) => {
    if(!confirm("Excluir este aviso?")) return;
    
    const novaLista = avisos.filter(a => a.id !== id);
    setAvisos(novaLista);
    await supabase.from('app_settings').upsert({ key: 'global_alert', value: novaLista }, { onConflict: 'key' });
  };

  // --- LÓGICA DE PERGUNTAS ---

  const handleSavePerguntas = async (novaLista: string[]) => {
    setPerguntas(novaLista);
    await supabase.from('app_settings').upsert({ key: 'checkin_questions', value: novaLista }, { onConflict: 'key' });
  };

  const addPergunta = () => {
    if (!novaPergunta.trim()) return;
    const novaLista = [...perguntas, novaPergunta];
    handleSavePerguntas(novaLista);
    setNovaPergunta("");
  };

  const removePergunta = (index: number) => {
    const novaLista = perguntas.filter((_, i) => i !== index);
    handleSavePerguntas(novaLista);
  };

  if (loading) return <div className="p-10 text-center text-slate-400"><Loader2 className="w-8 h-8 animate-spin mx-auto"/> Carregando ajustes...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in">
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Settings className="text-slate-600" /> Configurações do Sistema
        </h2>
        <p className="text-slate-500 text-sm mt-1">Personalize a experiência dos seus alunos.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        
        {/* --- CARD 1: QUADRO DE AVISOS TEMPORÁRIOS --- */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Avisos Temporários</h3>
              <p className="text-xs text-slate-400">Mensagens rápidas que somem após o tempo definido.</p>
            </div>
          </div>

          {/* Formulário de Novo Aviso */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3 mb-6">
            <label className="text-xs font-bold text-slate-500 uppercase">Mensagem do Aviso</label>
            <textarea 
              className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-yellow-400 min-h-[80px]"
              placeholder="Ex: Pessoal, a live vai atrasar 10 minutinhos..."
              value={novoAvisoTexto}
              onChange={(e) => setNovoAvisoTexto(e.target.value)}
            />
            
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Duração (Minutos)</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input 
                    type="number" 
                    min="1"
                    placeholder="Ex: 60"
                    className="w-full pl-10 p-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-yellow-400"
                    value={duracaoMinutos}
                    onChange={(e) => setDuracaoMinutos(e.target.value)}
                  />
                </div>
              </div>
              <button 
                onClick={handleAddAviso}
                disabled={saving}
                className="px-6 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition flex items-center gap-2"
              >
                {saving ? <Loader2 className="animate-spin w-4 h-4"/> : <Plus size={16} />}
                Publicar
              </button>
            </div>
          </div>

          {/* Lista de Avisos Ativos */}
          <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
            <Hourglass size={16} className="text-slate-400" /> Linha do Tempo ({avisos.length})
          </h4>
          
          <div className="space-y-2">
            {avisos.length === 0 ? (
              <p className="text-slate-400 text-sm italic text-center py-4">Nenhum aviso ativo no momento.</p>
            ) : (
              avisos.map((aviso) => {
                const dataValidade = new Date(aviso.validade);
                const vencido = dataValidade < new Date();

                return (
                  <div key={aviso.id} className={`flex justify-between items-start p-3 rounded-xl border transition ${vencido ? 'bg-slate-100 border-slate-200 opacity-60' : 'bg-white border-yellow-200 shadow-sm'}`}>
                    <div>
                      <p className={`text-sm font-medium ${vencido ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                        {aviso.texto}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`text-[10px] flex items-center gap-1 font-bold ${vencido ? 'text-slate-400' : 'text-yellow-600'}`}>
                          <Clock size={10} /> 
                          {vencido 
                            ? `Expirou às ${dataValidade.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}`
                            : `Expira hoje às ${dataValidade.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}`
                          }
                        </span>
                        {/* Mostra a data se não for hoje */}
                        {dataValidade.getDate() !== new Date().getDate() && !vencido && (
                           <span className="text-[10px] text-slate-400">({dataValidade.toLocaleDateString('pt-BR')})</span>
                        )}
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleDeleteAviso(aviso.id)}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                      title="Excluir aviso"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* --- CARD 2: PERGUNTAS DO CHECK-IN --- */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <ListChecks size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Formulário de Check-in</h3>
              <p className="text-xs text-slate-400">Defina quais perguntas os alunos devem responder semanalmente.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              {perguntas.map((p, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl group hover:border-slate-200 transition">
                  <span className="text-sm text-slate-700 font-medium">
                    <span className="text-slate-400 mr-2 font-bold">{index + 1}.</span> {p}
                  </span>
                  <button 
                    onClick={() => removePergunta(index)}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <input 
                type="text" 
                className="flex-1 p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                placeholder="Digite uma nova pergunta..."
                value={novaPergunta}
                onChange={(e) => setNovaPergunta(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addPergunta()}
              />
              <button 
                onClick={addPergunta}
                className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
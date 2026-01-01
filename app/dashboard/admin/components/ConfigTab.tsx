"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Settings, Save, Plus, Trash2, AlertTriangle, 
  ListChecks, Loader2, Clock, Hourglass, GripVertical, 
  AlignLeft, List, CheckCircle2, Circle, X
} from 'lucide-react';

interface ConfigTabProps {
  onSaveAviso?: () => void;
  onSavePerguntas?: () => void;
}

// Tipo para estruturar a pergunta
type Question = {
  id: string;
  text: string;
  type: 'text' | 'options'; // Texto livre ou Seleção
  options: string[]; // Lista de alternativas (se type === 'options')
};

export default function ConfigTab(props: ConfigTabProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Estados para Avisos
  const [avisos, setAvisos] = useState<any[]>([]);
  const [novoAvisoTexto, setNovoAvisoTexto] = useState("");
  const [duracaoMinutos, setDuracaoMinutos] = useState("");

  // Estados para Perguntas (Agora é um array de objetos Question)
  const [questions, setQuestions] = useState<Question[]>([]);

  // Buscar configurações ao carregar
  useEffect(() => {
    fetchConfigs();
  }, []);

  async function fetchConfigs() {
    try {
      const { data } = await supabase.from('app_settings').select('*');
      
      if (data) {
        const alertData = data.find(d => d.key === 'global_alert');
        const questionsData = data.find(d => d.key === 'checkin_form_structure'); // Nova chave para estrutura complexa

        if (alertData && Array.isArray(alertData.value)) {
          setAvisos(alertData.value);
        } else {
          setAvisos([]); 
        }

        if (questionsData && Array.isArray(questionsData.value)) {
          setQuestions(questionsData.value);
        } else {
          // Se não existir, inicia com o padrão
          setQuestions([
            { id: '1', text: 'Como foi sua adesão à dieta (0-10)?', type: 'options', options: ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1', '0'] },
            { id: '2', text: 'Sentiu dificuldade no treino?', type: 'text', options: [] },
            { id: '3', text: 'Como está seu sono?', type: 'options', options: ['Ótimo', 'Bom', 'Regular', 'Ruim'] },
            { id: '4', text: 'Intestino funcionou bem?', type: 'options', options: ['Sim', 'Não', 'Mais ou menos'] },
            { id: '5', text: 'Algo a relatar?', type: 'text', options: [] }
          ]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // --- LÓGICA DE AVISOS ---
  const handleAddAviso = async () => {
    if (!novoAvisoTexto.trim() || !duracaoMinutos) {
      return alert("Preencha o texto e a duração em minutos.");
    }
    setSaving(true);
    const minutos = parseInt(duracaoMinutos);
    const dataExpiracao = new Date(new Date().getTime() + minutos * 60000);
    const novoItem = {
      id: Date.now(),
      texto: novoAvisoTexto,
      validade: dataExpiracao.toISOString(),
      criadoEm: new Date().toISOString(),
      duracaoOriginal: minutos
    };
    const novaLista = [novoItem, ...avisos];
    setAvisos(novaLista);
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

  // --- LÓGICA DE PERGUNTAS (NOVA) ---

  const handleSaveQuestions = async () => {
    setSaving(true);
    try {
      await supabase.from('app_settings').upsert({ key: 'checkin_form_structure', value: questions }, { onConflict: 'key' });
      alert("Formulário de check-in atualizado!");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar formulário.");
    } finally {
      setSaving(false);
    }
  };

  const addQuestion = () => {
    const newQ: Question = {
      id: Date.now().toString(),
      text: '',
      type: 'text',
      options: []
    };
    setQuestions([...questions, newQ]);
  };

  const removeQuestion = (id: string) => {
    if (confirm('Remover esta pergunta?')) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const updateQuestion = (id: string, field: keyof Question, value: any) => {
    setQuestions(questions.map(q => {
      if (q.id === id) {
        if (field === 'type' && value === 'text') return { ...q, [field]: value, options: [] };
        if (field === 'type' && value === 'options' && q.options.length === 0) return { ...q, [field]: value, options: ['Opção 1'] };
        return { ...q, [field]: value };
      }
      return q;
    }));
  };

  const addOption = (qId: string) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) return { ...q, options: [...q.options, `Nova Opção`] };
      return q;
    }));
  };

  const updateOption = (qId: string, idx: number, text: string) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        const newOpts = [...q.options];
        newOpts[idx] = text;
        return { ...q, options: newOpts };
      }
      return q;
    }));
  };

  const removeOption = (qId: string, idx: number) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        const newOpts = q.options.filter((_, i) => i !== idx);
        return { ...q, options: newOpts };
      }
      return q;
    }));
  };

  if (loading) return <div className="p-10 text-center text-slate-400"><Loader2 className="w-8 h-8 animate-spin mx-auto"/> Carregando ajustes...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in pb-20">
      
      {/* Cabeçalho */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Settings className="text-slate-600" /> Configurações do Sistema
        </h2>
        <p className="text-slate-500 text-sm mt-1">Personalize a experiência dos seus alunos.</p>
      </div>

      {/* --- CARD 1: QUADRO DE AVISOS --- */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg"><AlertTriangle size={24} /></div>
          <div><h3 className="font-bold text-slate-800">Avisos Temporários</h3><p className="text-xs text-slate-400">Mensagens rápidas na home do aluno.</p></div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3 mb-6">
          <label className="text-xs font-bold text-slate-500 uppercase">Mensagem</label>
          <textarea className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-yellow-400 min-h-[80px]" placeholder="Ex: Live hoje às 20h!" value={novoAvisoTexto} onChange={(e) => setNovoAvisoTexto(e.target.value)} />
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Duração (Min)</label>
              <div className="relative"><Clock className="absolute left-3 top-3 w-4 h-4 text-slate-400" /><input type="number" min="1" placeholder="60" className="w-full pl-10 p-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-yellow-400" value={duracaoMinutos} onChange={(e) => setDuracaoMinutos(e.target.value)} /></div>
            </div>
            <button onClick={handleAddAviso} disabled={saving} className="px-6 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition flex items-center gap-2">{saving ? <Loader2 className="animate-spin w-4 h-4"/> : <Plus size={16} />} Publicar</button>
          </div>
        </div>

        <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2"><Hourglass size={16} className="text-slate-400" /> Ativos ({avisos.length})</h4>
        <div className="space-y-2">
          {avisos.length === 0 ? <p className="text-slate-400 text-sm italic text-center py-4">Nenhum aviso.</p> : avisos.map((aviso) => {
            const dataValidade = new Date(aviso.validade);
            const vencido = dataValidade < new Date();
            return (
              <div key={aviso.id} className={`flex justify-between items-start p-3 rounded-xl border transition ${vencido ? 'bg-slate-100 border-slate-200 opacity-60' : 'bg-white border-yellow-200 shadow-sm'}`}>
                <div><p className={`text-sm font-medium ${vencido ? 'text-slate-500 line-through' : 'text-slate-800'}`}>{aviso.texto}</p><div className="flex items-center gap-3 mt-1"><span className={`text-[10px] flex items-center gap-1 font-bold ${vencido ? 'text-slate-400' : 'text-yellow-600'}`}><Clock size={10} /> {vencido ? 'Expirou' : 'Expira'} às {dataValidade.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</span></div></div>
                <button onClick={() => handleDeleteAviso(aviso.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 size={16} /></button>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- CARD 2: CONSTRUTOR DE FORMULÁRIO --- */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><ListChecks size={24} /></div>
            <div><h3 className="font-bold text-slate-800">Editor de Check-in</h3><p className="text-xs text-slate-400">Personalize as perguntas.</p></div>
          </div>
          <button onClick={handleSaveQuestions} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-bold shadow-lg shadow-emerald-100 flex items-center gap-2 transition-all text-sm disabled:opacity-50">
            {saving ? <Loader2 className="animate-spin w-4 h-4"/> : <Save size={16} />} Salvar Alterações
          </button>
        </div>

        <div className="space-y-4">
          {questions.map((q, index) => (
            <div key={q.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm group hover:border-blue-200 transition-all">
              <div className="flex items-start gap-4 mb-3">
                <div className="mt-3 cursor-grab text-slate-300 hover:text-slate-500"><GripVertical size={20} /></div>
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Pergunta {index + 1}</label>
                      <input type="text" value={q.text} onChange={(e) => updateQuestion(q.id, 'text', e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-blue-500 transition-all" placeholder="Digite a pergunta..." />
                    </div>
                    <div className="w-full md:w-48">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Tipo</label>
                      <div className="flex bg-slate-100 p-1 rounded-xl">
                        <button onClick={() => updateQuestion(q.id, 'type', 'options')} className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${q.type === 'options' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}><List size={14} /> Opções</button>
                        <button onClick={() => updateQuestion(q.id, 'type', 'text')} className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${q.type === 'text' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}><AlignLeft size={14} /> Texto</button>
                      </div>
                    </div>
                  </div>

                  {q.type === 'options' && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-500"/> Alternativas:</p>
                      <div className="space-y-2">
                        {q.options.map((opt, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <Circle size={14} className="text-slate-300" />
                            <input type="text" value={opt} onChange={(e) => updateOption(q.id, idx, e.target.value)} className="flex-1 p-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-400" />
                            <button onClick={() => removeOption(q.id, idx)} className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"><X size={14} /></button>
                          </div>
                        ))}
                        <button onClick={() => addOption(q.id)} className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-2 px-2 py-1 hover:bg-blue-50 rounded-lg transition-all w-fit"><Plus size={14} /> Nova Alternativa</button>
                      </div>
                    </div>
                  )}
                </div>
                <button onClick={() => removeQuestion(q.id)} className="mt-4 p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100"><Trash2 size={20} /></button>
              </div>
            </div>
          ))}
        </div>

        <button onClick={addQuestion} className="w-full py-4 mt-4 border-2 border-dashed border-slate-300 rounded-2xl text-slate-400 font-bold hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
          <Plus size={20} /> Adicionar Nova Pergunta
        </button>
      </div>

    </div>
  );
}
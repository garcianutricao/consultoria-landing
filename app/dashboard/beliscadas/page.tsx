"use client";

import React, { useState, useEffect } from 'react';
// CORREÇÃO AQUI: Usando o seu cliente existente em vez da biblioteca externa
import { supabase } from '@/lib/supabase'; 
import { 
  PlusCircle, 
  Calendar, 
  Clock, 
  Utensils, 
  AlertCircle, 
  Smile, 
  Brain,
  Trash2,
  TrendingUp,
  Loader2
} from 'lucide-react';

export default function MonitorBeliscadas() {
  // Não precisamos mais instanciar o cliente aqui, pois importamos ele pronto lá em cima
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  // Estado para armazenar o formulário
  const [formData, setFormData] = useState({
    data: new Date().toISOString().split('T')[0], // Já inicia com a data de hoje
    hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }), // Hora atual
    alimento: '',
    gatilho: '',
    sentimento: '',
    estrategia: ''
  });

  // Estado para armazenar a lista de registros (Dados Reais)
  const [registros, setRegistros] = useState<any[]>([]);

  // 1. BUSCAR DADOS AO CARREGAR
  useEffect(() => {
    fetchRegistros();
  }, []);

  async function fetchRegistros() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('slips') // Nome da tabela no banco
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Mapear os dados do banco (inglês) para o formato do seu front (português)
      const registrosFormatados = (data || []).map((item: any) => ({
        id: item.id,
        // Separa data e hora do created_at (ex: 2023-12-28T15:30:00)
        data: new Date(item.created_at).toLocaleDateString('en-CA'), // Formato YYYY-MM-DD para input date
        dataDisplay: new Date(item.created_at).toLocaleDateString('pt-BR'), // Formato PT-BR para exibir
        hora: new Date(item.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        alimento: item.food,
        gatilho: item.trigger,
        sentimento: item.feeling,
        estrategia: item.strategy || '' // Garante que não quebre se for null
      }));

      setRegistros(registrosFormatados);
    } catch (error) {
      console.error("Erro ao buscar:", error);
    } finally {
      setLoadingData(false);
    }
  }

  // 2. SALVAR NO BANCO
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Erro: Usuário não logado.");
        return;
      }

      // Combina data e hora do form para criar o Timestamp do banco
      const dataCompleta = new Date(`${formData.data}T${formData.hora}`).toISOString();

      const { error } = await supabase.from('slips').insert({
        user_id: user.id,
        food: formData.alimento,
        trigger: formData.gatilho,
        feeling: formData.sentimento,
        strategy: formData.estrategia, // Certifique-se de criar essa coluna 'strategy' no Supabase se não existir
        created_at: dataCompleta
      });

      if (error) throw error;

      alert("Registro salvo com sucesso! Continue observando seus hábitos.");
      
      // Limpa o formulário e recarrega a lista
      setFormData({
        data: new Date().toISOString().split('T')[0],
        hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        alimento: '',
        gatilho: '',
        sentimento: '',
        estrategia: ''
      });
      fetchRegistros();

    } catch (error: any) {
      alert("Erro ao salvar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. DELETAR DO BANCO
  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja apagar este registro?")) return;

    try {
      const { error } = await supabase.from('slips').delete().eq('id', id);
      if (error) throw error;
      
      // Atualiza a lista local removendo o item deletado
      setRegistros(registros.filter(item => item.id !== id));
    } catch (error: any) {
      alert("Erro ao deletar: " + error.message);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 md:p-0">
      
      {/* Cabeçalho */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-3">
          <Brain className="text-orange-500 w-8 h-8" />
          Monitor de Beliscadas
        </h1>
        <p className="text-slate-500 mt-2 max-w-2xl">
          Não se julgue. O objetivo desta ferramenta é identificar padrões e gatilhos. 
          Entender o "porquê" você comeu é mais importante do que "o que" você comeu.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- COLUNA DA ESQUERDA: FORMULÁRIO --- */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-8">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-blue-600" />
              Novo Registro
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Data e Hora */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Data</label>
                  <input 
                    required
                    type="date" 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                    value={formData.data}
                    onChange={(e) => setFormData({...formData, data: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Hora</label>
                  <input 
                    required
                    type="time" 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                    value={formData.hora}
                    onChange={(e) => setFormData({...formData, hora: e.target.value})}
                  />
                </div>
              </div>

              {/* O que comeu */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">O que você comeu?</label>
                <div className="relative">
                  <Utensils className="absolute top-3 left-3 w-4 h-4 text-slate-400" />
                  <input 
                    required
                    type="text" 
                    placeholder="Ex: 1 barra de chocolate..."
                    className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                    value={formData.alimento}
                    onChange={(e) => setFormData({...formData, alimento: e.target.value})}
                  />
                </div>
              </div>

              {/* Gatilho */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Qual foi o gatilho/motivo?</label>
                <div className="relative">
                  <AlertCircle className="absolute top-3 left-3 w-4 h-4 text-slate-400" />
                  <input 
                    required
                    type="text"
                    placeholder="Ex: Ansiedade, Tédio, Fome Social..."
                    className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                    value={formData.gatilho}
                    onChange={(e) => setFormData({...formData, gatilho: e.target.value})}
                  />
                </div>
              </div>

              {/* Sentimento */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Como se sentiu depois?</label>
                <div className="relative">
                  <Smile className="absolute top-3 left-3 w-4 h-4 text-slate-400" />
                  <input 
                    required
                    type="text" 
                    placeholder="Ex: Culpado, Aliviado, Indiferente..."
                    className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                    value={formData.sentimento}
                    onChange={(e) => setFormData({...formData, sentimento: e.target.value})}
                  />
                </div>
              </div>

              {/* Estratégia */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">O que fazer para não repetir?</label>
                <textarea 
                  required
                  rows={3}
                  placeholder="Ex: Beber água antes, sair para caminhar, não comprar o doce..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 resize-none"
                  value={formData.estrategia}
                  onChange={(e) => setFormData({...formData, estrategia: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition shadow-lg shadow-slate-900/20 flex justify-center items-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin"/> : "Salvar Registro"}
              </button>

            </form>
          </div>
        </div>

        {/* --- COLUNA DA DIREITA: LISTA DE REGISTROS --- */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Seu Histórico</h2>
            <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {registros.length} registros
            </span>
          </div>

          {loadingData ? (
             <div className="text-center py-12">
               <Loader2 className="w-8 h-8 text-slate-400 animate-spin mx-auto"/>
               <p className="text-slate-400 text-sm mt-2">Carregando histórico...</p>
             </div>
          ) : registros.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
              <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">Nenhum registro ainda.</p>
              <p className="text-sm text-slate-400">Ou você esqueceu de anotar? 👀</p>
            </div>
          ) : (
            <div className="space-y-4">
              {registros.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition group relative">
                  
                  {/* Botão de Excluir (Só aparece no hover) */}
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100 p-2"
                    title="Excluir registro"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex justify-between items-start mb-4 pr-8">
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {item.dataDisplay}
                      </span>
                      <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {item.hora}
                      </span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">O que comeu</p>
                      <p className="text-slate-900 font-medium text-lg">{item.alimento}</p>
                      
                      <div className="mt-4">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Gatilho / Motivo</p>
                        <span className="inline-block bg-orange-50 text-orange-700 px-3 py-1 rounded-lg text-sm font-semibold border border-orange-100">
                          {item.gatilho}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Sentimento Pós</p>
                        <p className="text-slate-700 text-sm">{item.sentimento}</p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">Estratégia Futura</p>
                        <p className="text-blue-800 text-sm italic">"{item.estrategia}"</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
"use client";

import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, AlertCircle, Calendar, 
  ArrowUpRight, ArrowDownRight, Wallet, Plus, 
  TrendingDown, PieChart, BarChart3, Trash2, Filter, X
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine
} from 'recharts';

interface FinanceTabProps {
  transacoes: any[];
  onOpenModal: (type: string) => void;
  onDelete: (id: number) => void;
}

export default function FinanceTab({ transacoes, onOpenModal, onDelete }: FinanceTabProps) {

  // --- ESTADOS DE FILTRO ---
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  // --- CÁLCULOS AVANÇADOS (COM FILTRO) ---
  const { metricas, dadosFiltrados } = useMemo(() => {
    
    // 1. Filtragem Inicial
    const filtrados = transacoes.filter((t) => {
      if (!dataInicio && !dataFim) return true; // Se não tem filtro, mostra tudo

      const dataItem = new Date(t.due_date || t.created_at).getTime();
      const inicio = dataInicio ? new Date(dataInicio).setHours(0,0,0,0) : null;
      const fim = dataFim ? new Date(dataFim).setHours(23,59,59,999) : null;

      if (inicio && dataItem < inicio) return false;
      if (fim && dataItem > fim) return false;
      return true;
    });

    // 2. Cálculos baseados APENAS nos filtrados
    let totalReceita = 0;
    let totalDespesa = 0;
    let pendente = 0;
    let qtdVendas = 0;
    const mesesUnicos = new Set();
    const dadosGraficoMap = new Map();

    filtrados.forEach(t => {
      const valor = Number(t.amount);
      const data = new Date(t.due_date || t.created_at);
      const mesNome = data.toLocaleDateString('pt-BR', { month: 'short' });
      
      if (t.status === 'paid') {
        mesesUnicos.add(`${data.getMonth()}/${data.getFullYear()}`);
      }

      if (!dadosGraficoMap.has(mesNome)) {
        dadosGraficoMap.set(mesNome, { name: mesNome, receita: 0, despesa: 0, saldo: 0 });
      }
      const dadosMes = dadosGraficoMap.get(mesNome);

      if (t.status === 'paid') {
        if (t.type === 'expense') {
          totalDespesa += valor;
          dadosMes.despesa += valor;
          dadosMes.saldo -= valor;
        } else {
          totalReceita += valor;
          dadosMes.receita += valor;
          dadosMes.saldo += valor;
          qtdVendas++;
        }
      } 
      else if (t.status === 'pending') {
        if (t.type !== 'expense') pendente += valor;
      }
    });

    const grafico = Array.from(dadosGraficoMap.values());
    const saldoLiquido = totalReceita - totalDespesa;
    const ticketMedio = qtdVendas > 0 ? totalReceita / qtdVendas : 0;
    const qtdMeses = mesesUnicos.size || 1;
    const mediaMensal = totalReceita / qtdMeses;

    return { 
      dadosFiltrados: filtrados,
      metricas: { totalReceita, totalDespesa, saldoLiquido, pendente, ticketMedio, mediaMensal, grafico }
    };
  }, [transacoes, dataInicio, dataFim]);

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const limparFiltros = () => {
    setDataInicio("");
    setDataFim("");
  };

  const isFiltrado = dataInicio !== "" || dataFim !== "";

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* CABEÇALHO COM FILTROS */}
      <div className="flex flex-col xl:flex-row justify-between items-end gap-6 bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
        
        <div className="flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto">
          <div className="flex items-center gap-2 text-slate-500 font-bold text-sm uppercase tracking-wider min-w-fit">
            <Filter size={16} /> Período:
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <input 
                type="date" 
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="pt-3 pb-3 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition-all w-full"
              />
            </div>
            
            <span className="text-slate-300 font-bold">à</span>

            <div className="relative w-full md:w-auto">
              <input 
                type="date" 
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="pt-3 pb-3 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition-all w-full"
              />
            </div>
          </div>

          {/* Botão Limpar / Desde o Início */}
          <button 
            onClick={limparFiltros}
            className={`px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wide transition-all border flex items-center gap-2 whitespace-nowrap ${!isFiltrado ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
          >
            {isFiltrado ? <X size={14}/> : <Calendar size={14}/>}
            {isFiltrado ? 'Limpar Filtro' : 'Desde o Início'}
          </button>
        </div>

        <button 
          onClick={() => onOpenModal('transacao')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-100 transition-all w-full xl:w-auto justify-center"
        >
          <Plus size={20} /> Novo Lançamento
        </button>
      </div>

      {/* --- LINHA 1: KPIs PRINCIPAIS --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Saldo Líquido */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Saldo Líquido</p>
            <div className={`p-2 rounded-lg ${metricas.saldoLiquido >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
              <Wallet size={18} />
            </div>
          </div>
          <h3 className={`text-2xl font-bold ${metricas.saldoLiquido >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {formatMoney(metricas.saldoLiquido)}
          </h3>
          <p className="text-xs text-slate-400 mt-1">{isFiltrado ? 'No período selecionado' : 'Total acumulado'}</p>
        </div>

        {/* Ticket Médio */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Ticket Médio</p>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <PieChart size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">{formatMoney(metricas.ticketMedio)}</h3>
          <p className="text-xs text-slate-400 mt-1">Média por venda</p>
        </div>

        {/* Média Mensal */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Média Mensal</p>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <BarChart3 size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">{formatMoney(metricas.mediaMensal)}</h3>
          <p className="text-xs text-slate-400 mt-1">Faturamento recorrente</p>
        </div>

        {/* Despesas */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Despesas</p>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
              <TrendingDown size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-rose-600">{formatMoney(metricas.totalDespesa)}</h3>
          <p className="text-xs text-slate-400 mt-1">Total de saídas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- GRÁFICO (Receitas x Despesas) --- */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-slate-500" /> Balanço Mensal
          </h3>
          
          <div className="h-72 w-full">
            {metricas.grafico.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metricas.grafico} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12}} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12}} 
                    tickFormatter={(val) => `R$${val/1000}k`}
                  />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                    formatter={(value: any) => formatMoney(value)}
                  />
                  <ReferenceLine y={0} stroke="#cbd5e1" />
                  <Bar dataKey="receita" name="Receitas" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="despesa" name="Despesas" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 rounded-xl">
                <p>Sem dados neste período.</p>
              </div>
            )}
          </div>
        </div>

        {/* --- EXTRATO (Lista Filtrada) --- */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[450px] lg:h-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800">Extrato {isFiltrado ? 'Filtrado' : 'Recente'}</h3>
            <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded">{dadosFiltrados.length} itens</span>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {dadosFiltrados.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm">Nenhum lançamento encontrado.</div>
            ) : (
              dadosFiltrados.map((t) => {
                const isExpense = t.type === 'expense';
                const isPaid = t.status === 'paid';

                return (
                  <div key={t.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100 group relative">
                    
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isExpense ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'}`}>
                        {isExpense ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm line-clamp-1">
                          {isExpense ? (t.description || 'Despesa') : (t.patient_name || 'Paciente')}
                        </p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">
                          {new Date(t.due_date || t.created_at).toLocaleDateString('pt-BR')} • {t.method}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className={`font-bold text-sm ${isExpense ? 'text-rose-600' : 'text-emerald-600'} ${!isPaid && 'opacity-50'}`}>
                          {isExpense ? '-' : '+'} {formatMoney(t.amount)}
                        </p>
                        {!isPaid && <span className="text-[9px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded">Pendente</span>}
                      </div>

                      {/* Botão de Excluir */}
                      <button 
                        onClick={() => onDelete(t.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Excluir lançamento"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
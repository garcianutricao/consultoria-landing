"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Users, PlayCircle, Ticket, Settings, DollarSign, BarChart4, Loader2, Apple
} from 'lucide-react';

import PatientsTab from './components/PatientsTab';
import OverviewTab from './components/OverviewTab';
import FinanceTab from './components/FinanceTab';
import ContentTab from './components/ContentTab';
import PartnersTab from './components/PartnersTab';
import ConfigTab from './components/ConfigTab';
import AdminModals from './components/AdminModals';
import { useAdmin } from '@/hooks/useAdmin';
import FoodsTab from './components/FoodsTab';

export default function SuperAdminPage() {
  // 1. Estados de Autenticação e Navegação
  const { isAdmin, loading: authLoading } = useAdmin();
  const [activeTab, setActiveTab] = useState('visao-geral');
  const [loading, setLoading] = useState(true);

  // 2. Estados de Modais
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalData, setModalData] = useState<any>(null);

  // 3. Estados de Dados
  const [pacienteSelecionado, setPacienteSelecionado] = useState<any>(null);
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [checkinsDb, setCheckinsDb] = useState<any[]>([]);
  const [beliscadasDb, setBeliscadasDb] = useState<any[]>([]);
  const [transacoes, setTransacoes] = useState<any[]>([]);
  const [ebooks, setEbooks] = useState<any[]>([]);
  const [aulas, setAulas] = useState<any[]>([]);
  const [parceiros, setParceiros] = useState<any[]>([]);
  const [patientFiles, setPatientFiles] = useState<any[]>([]);
  const [foodsDb, setFoodsDb] = useState<any[]>([]);

  // 4. Carregamento de Dados (Só dispara se for Admin)
  useEffect(() => { 
    if (isAdmin) fetchDados(); 
  }, [isAdmin]);

  async function fetchDados() {
    setLoading(true);
    try {
      const { data: profiles } = await supabase.from('profiles').select('*').neq('role', 'admin').order('created_at', { ascending: false });
      const { data: checkins } = await supabase.from('checkins').select('*').order('date', { ascending: true });
      const { data: slips } = await supabase.from('slips').select('*').order('created_at', { ascending: false });
      const { data: content } = await supabase.from('content').select('*').order('created_at', { ascending: false });
      const { data: alimentos } = await supabase.from('foods').select('*').order('name', { ascending: true });
      const { data: transactions } = await supabase.from('transactions').select('*').order('created_at', { ascending: false });
      const { data: partners } = await supabase.from('partners').select('*').order('created_at', { ascending: false });
      const { data: files } = await supabase.from('patient_files').select('*').order('created_at', { ascending: false });


      const profilesMap = new Map(profiles?.map(p => [p.id, p.full_name || 'Sem Nome']));

      const pacFmt = (profiles || []).map(p => ({
        id: p.id, 
        nome: p.full_name, 
        email: p.email, 
        telefone: p.phone || 'Sem telefone',
        plano: p.plan, 
        freq: p.checkin_freq, 
        diaCheckin: p.checkin_day, 
        dataInicio: p.start_date || new Date().toISOString(), 
        status: p.active ? 'Ativo' : 'Inativo'
      }));

      const checkFmt = (checkins || []).map(c => ({
        id: c.id, 
        pacienteId: c.user_id, 
        nome: profilesMap.get(c.user_id),
        dataRaw: c.date, 
        data: new Date(c.date).toLocaleDateString('pt-BR', {day:'2-digit', month:'2-digit'}),
        peso: Number(c.weight), 
        aderencia: c.adherence, 
        dificuldade: c.difficulty, 
        feedbackNutri: c.feedback_nutri,
        score: c.score || 100,
        treino: c.training_status || 'Feito',
        sono: c.sleep_status || 'Bom',
        humor: c.mood_status || 'Bom'
      }));

      const slipFmt = (slips || []).map(b => ({
        id: b.id, pacienteId: b.user_id, nome: profilesMap.get(b.user_id),
        data: new Date(b.created_at).toLocaleDateString('pt-BR'),
        hora: new Date(b.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        alimento: b.food, gatilho: b.trigger, sentimento: b.feeling,
        estrategia: b.strategy,
        viewed: b.viewed
      }));

      setPacientes(pacFmt);
      setCheckinsDb(checkFmt);
      setBeliscadasDb(slipFmt);
      setTransacoes(transactions || []); 
      setEbooks((content || []).filter(c => c.type === 'ebook'));
      setAulas((content || []).filter(c => c.type === 'aula'));
      setParceiros(partners || []);
      setPatientFiles(files || []);
      setFoodsDb(alimentos || []); // Set Alimentos

    } catch (err) { console.error(err); } finally { setLoading(false); }
  }

  // 5. Handlers de Ação
  const handleSelectPatientFromOverview = (pacienteId: string) => {
    const alvo = pacientes.find(p => p.id === pacienteId);
    if (alvo) { setPacienteSelecionado(alvo); setActiveTab('pacientes'); }
  };

  const handleOpenModal = (type: string, data?: any) => {
    setModalType(type);
    setModalData(data);
    setShowModal(true);
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newActiveState = currentStatus !== 'Ativo';
    await supabase.from('profiles').update({ active: newActiveState }).eq('id', id);
    await fetchDados();
    if (pacienteSelecionado?.id === id) {
      setPacienteSelecionado((prev: any) => prev ? ({ ...prev, status: newActiveState ? 'Ativo' : 'Inativo' }) : null);
    }
  };

  const handleRenewPatient = async (id: string, newPlan: string, newFreq: string) => {
    const today = new Date().toISOString();
    const { error } = await supabase.from('profiles').update({ 
      plan: newPlan, checkin_freq: newFreq, start_date: today, active: true 
    }).eq('id', id);

    if (error) {
      alert("Erro ao renovar: " + error.message);
    } else {
      alert("Plano renovado com sucesso!");
      await fetchDados();
      if (pacienteSelecionado?.id === id) {
        setPacienteSelecionado((prev: any) => prev ? ({...prev, plano: newPlan, freq: newFreq, dataInicio: today, status: 'Ativo'}) : null);
      }
    }
  };

  const handleSaveFeedback = async (id: number, text: string) => {
      await supabase.from('checkins').update({feedback_nutri: text, viewed_by_admin: true}).eq('id', id);
      alert("Enviado!");
      fetchDados();
  };

  const handleMarkSlipAsRead = async (id: number) => {
    await supabase.from('slips').update({ viewed: true }).eq('id', id);
    fetchDados(); 
  };

  const handleDeletePatient = async (id: string) => {
    if(!confirm("Deseja realmente excluir?")) return;
    await supabase.from('profiles').delete().eq('id', id);
    setPacientes(prev => prev.filter(p => p.id !== id));
    alert("Removido.");
  };

  const handleDeleteItem = async (table: string, id: number) => {
    if(confirm("Excluir item?")) {
      await supabase.from(table).delete().eq('id', id);
      fetchDados();
    }
  };

  const handleDeleteFood = async (id: string) => {
    if(confirm("Excluir este alimento?")) {
      await supabase.from('foods').delete().eq('id', id);
      fetchDados();
    }
  };

  // 6. Renderização Condicional de Segurança
  if (authLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 font-bold animate-pulse">Verificando credenciais...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Central Admin</h1>
          <p className="text-slate-500 font-medium">Gestão inteligente.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
          {[
            {id:'visao-geral', icon: BarChart4, label:'Visão Geral'}, 
            {id:'pacientes', icon: Users, label:'Pacientes'},
            {id:'financeiro', icon: DollarSign, label:'Financeiro'},
            {id:'conteudo', icon: PlayCircle, label:'Conteúdo'},
            {id:'parceiros', icon: Ticket, label:'Parceiros'},
            {id:'config', icon: Settings, label:'Configurações'},
            {id:'alimentos', icon: Apple, label:'Alimentos'}
          ].map(t => (
            <button 
              key={t.id} 
              onClick={()=> {
                setActiveTab(t.id);
                if (t.id !== 'pacientes') setPacienteSelecionado(null); 
              }} 
              className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${activeTab===t.id ? 'bg-slate-900 text-white shadow-lg':'text-slate-500 hover:bg-slate-50'}`}
            >
              <t.icon className="w-4 h-4"/> {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="min-h-[500px]">
        {activeTab === 'visao-geral' && (
          <OverviewTab 
            pacientes={pacientes} 
            checkinsPendentes={checkinsDb.filter(c=>!c.feedbackNutri)} 
            beliscadasDb={beliscadasDb.filter(b => !b.viewed)} 
            onNavigateToPatient={handleSelectPatientFromOverview} 
            onMarkSlipAsRead={handleMarkSlipAsRead}
          />
        )}
        
        {activeTab === 'pacientes' && (
          <PatientsTab 
            pacientes={pacientes}
            checkinsDb={checkinsDb}
            beliscadasDb={beliscadasDb}
            patientFiles={patientFiles}
            loading={loading}
            pacienteSelecionado={pacienteSelecionado}
            setPacienteSelecionado={setPacienteSelecionado}
            onToggleStatus={handleToggleStatus}
            onSaveFeedback={handleSaveFeedback}
            onOpenModal={handleOpenModal}
            onDeleteFile={(id) => handleDeleteItem('patient_files', id)}
            onDeletePatient={handleDeletePatient}
            onRenewPatient={handleRenewPatient}
          />
        )}
        
        {activeTab === 'financeiro' && (<FinanceTab transacoes={transacoes} onOpenModal={(t) => handleOpenModal(t)} onDelete={(id) => handleDeleteItem('transactions', id)} />)}
        {activeTab === 'conteudo' && (<ContentTab ebooks={ebooks} aulas={aulas} onOpenModal={(t, d) => handleOpenModal(t, d)} onDelete={(id) => handleDeleteItem('content', id)} />)}
        {activeTab === 'alimentos' && (
    <FoodsTab 
      foods={foodsDb} 
      onDelete={handleDeleteFood} 
      onOpenModal={() => handleOpenModal('alimento')} 
    />
  )}
        {activeTab === 'parceiros' && <PartnersTab parceiros={parceiros} onOpenModal={(t) => handleOpenModal(t)} onDelete={(id) => handleDeleteItem('partners', id)} />}
        {activeTab === 'config' && <ConfigTab />}

      </div>

      {/* Modal Central */}
      <AdminModals 
        isOpen={showModal}
        type={modalType}
        onClose={() => setShowModal(false)}
        onSuccess={() => fetchDados()}
        onRenewPatient={handleRenewPatient}
        data={{ 
          pacienteSelecionado: modalData?.paciente || pacienteSelecionado, 
          checkinsDb: checkinsDb, 
          listaPacientes: pacientes,
          modalData: modalData 
        }}
      />
    </div>
  );
}
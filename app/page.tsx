"use client";

import React, { useState } from 'react';
import { 
  Check, 
  Brain, 
  Microscope, 
  Smartphone, 
  ArrowRight, 
  Menu, 
  X, 
  Instagram 
} from 'lucide-react';

export default function LandingPage() {
  // Estado para o Menu Mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Estado para o Preço (Toggle Semanal/Quinzenal)
  const [isWeekly, setIsWeekly] = useState(false);

  // Dados dos Planos
  const plans = [
    {
      name: "Mensal",
      description: "Liberdade total. Ideal para começar sem fidelidade.",
      isRecurrent: true,
      price: { quinzenal: 230, semanal: 310 },
      installments: 1,
      features: [
        "Plano Alimentar Individualizado",
        "Acesso a plataforma da comunidade Base",
        "Análise de Exames Laboratoriais",
        "Suporte direto via WhatsApp",
      ],
      cta: "Começar Mensal",
      highlight: false
    },
    {
      name: "Semestral",
      description: "O tempo necessário para uma mudança comportamental real.",
      isRecurrent: false,
      price: { quinzenal: 1100, semanal: 1500 },
      installments: 6,
      features: [
        "Tudo do plano mensal",
        "Videoconferência Mensal de Alinhamento",
        "E-book Exclusivo de Receitas",
        "Prioridade na agenda de consultas",
        "Acesso vitalício à Comunidade Base"
      ],
      cta: "Garantir Vaga Semestral",
      highlight: true
    },
    {
      name: "Trimestral",
      description: "Compromisso médio para consolidar os primeiros resultados.",
      isRecurrent: false,
      price: { quinzenal: 600, semanal: 840 },
      installments: 3,
      features: [
        "Plano Alimentar Individualizado",
        "Acesso ao App Comunidade Base",
        "Análise de Exames Laboratoriais",
        "Suporte direto via WhatsApp",
      ],
      cta: "Escolher Trimestral",
      highlight: false
    }
  ];

  const scrollToPricing = () => {
    document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                GN
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">Garcia<span className="text-blue-600">Nutrição</span></span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8 items-center">
              <a href="#metodologia" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition">Metodologia</a>
              <a href="#plataforma" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition">Plataforma</a>
              <a href="#sobre" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition">Sobre Mim</a>
              <button 
                onClick={scrollToPricing}
                className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-slate-800 transition"
              >
                Ver Planos
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600">
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-100 px-4 py-4 space-y-4">
            <a href="#metodologia" className="block text-slate-600 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Metodologia</a>
            <a href="#plataforma" className="block text-slate-600 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Plataforma</a>
            <button 
              onClick={() => { scrollToPricing(); setIsMobileMenuOpen(false); }}
              className="w-full bg-blue-600 text-white px-5 py-3 rounded-lg text-sm font-bold"
            >
              Consultoria Online
            </button>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold mb-6 border border-blue-100">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Agenda aberta para Janeiro 2026
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
          Nutrição baseada em evidência, <br className="hidden md:block"/>
          <span className="text-blue-600">sem terrorismo.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Uma abordagem comportamental para você fazer as pazes com a comida e atingir seus objetivos com estratégias científicas, não com dietas da moda.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={scrollToPricing}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-600/20"
          >
            Quero agendar consultoria
            <ArrowRight className="w-5 h-5" />
          </button>
          <a href="#metodologia" className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-lg font-semibold text-slate-600 hover:bg-slate-50 transition border border-slate-200">
            Entender metodologia
          </a>
        </div>

        {/* Prova Social Simples */}
        <div className="mt-12 text-sm text-slate-500 font-medium">
          +50 pessoas na lista de espera para o novo protocolo
        </div>
      </section>

      {/* --- METODOLOGIA (3 PILLARS) --- */}
      <section id="metodologia" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Por que funciona?</h2>
            <p className="mt-4 text-slate-600">Três pilares que sustentam o seu resultado a longo prazo.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Pilar 1 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                <Microscope className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Ciência, não "Achismo"</h3>
              <p className="text-slate-600 leading-relaxed">
                Minhas condutas não seguem modismos de internet. Tudo é baseado no que a literatura científica aponta como seguro e eficiente.
              </p>
            </div>

            {/* Pilar 2 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-6">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Comportamental</h3>
              <p className="text-slate-600 leading-relaxed">
                Não adianta um papel perfeito se você não consegue seguir. Trabalhamos a sua relação com a comida e a rotina real.
              </p>
            </div>

            {/* Pilar 3 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Tecnologia Própria</h3>
              <p className="text-slate-600 leading-relaxed">
                Acesso exclusivo à <strong>Comunidade Base</strong>. Uma plataforma onde você controla sua evolução e aprende a ter autonomia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- PRICING SECTION --- */}
      <section id="planos" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl tracking-tight">
              Invista na sua Base
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Escolha a intensidade do acompanhamento que se adapta à sua rotina.
            </p>
          </div>

          {/* Toggle */}
          <div className="flex justify-center items-center mb-16 space-x-6 select-none">
            <span className={`text-sm font-semibold cursor-pointer transition-colors ${!isWeekly ? 'text-blue-700' : 'text-slate-400'}`} onClick={() => setIsWeekly(false)}>
              Check-in Quinzenal
            </span>
            
            <button
              onClick={() => setIsWeekly(!isWeekly)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isWeekly ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform ${
                  isWeekly ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
            
            <span className={`text-sm font-semibold cursor-pointer transition-colors ${isWeekly ? 'text-blue-700' : 'text-slate-400'}`} onClick={() => setIsWeekly(true)}>
              Check-in Semanal
            </span>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {plans.map((plan, index) => {
              const currentTotal = isWeekly ? plan.price.semanal : plan.price.quinzenal;
              const installmentValue = plan.isRecurrent 
                ? currentTotal 
                : Math.ceil(currentTotal / plan.installments);

              return (
                <div 
                  key={index} 
                  className={`relative flex flex-col rounded-2xl p-8 transition-all duration-300 border ${
                    plan.highlight 
                      ? 'bg-white shadow-2xl border-blue-600 scale-105 z-10' 
                      : 'bg-white shadow-lg border-slate-100 hover:border-blue-200'
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                      Mais Recomendado
                    </div>
                  )}

                  <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                  <p className="mt-2 text-slate-500 text-sm h-10">{plan.description}</p>
                  
                  <div className="mt-6 flex items-baseline">
                    <span className="text-4xl font-extrabold text-slate-900">
                      R$ {installmentValue}
                    </span>
                    <span className="ml-1 text-xl font-medium text-slate-500">/mês</span>
                  </div>
                  
                  <div className="mt-1 h-6">
                    {!plan.isRecurrent && (
                      <p className="text-xs text-slate-400 font-medium">
                        Total de R$ {currentTotal} {plan.installments > 1 ? `em até ${plan.installments}x` : 'à vista'}
                      </p>
                    )}
                  </div>

                  <ul className="mt-8 space-y-4 flex-1">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className="flex-shrink-0">
                          <Check className="h-5 w-5 text-blue-600" />
                        </div>
                        <span className="ml-3 text-sm text-slate-700 leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href="https://wa.me/5521966887924?text=Ola,%20vi%20seu%20site%20e%20gostaria%20de%20saber%20mais%20sobre%20a%20consultoria"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-8 block w-full py-4 px-6 rounded-xl text-center font-bold transition-all ${
                      plan.highlight
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/30'
                        : 'bg-slate-50 text-blue-700 hover:bg-blue-50 hover:text-blue-800'
                    }`}
                  >
                    {plan.cta}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center gap-6 mb-8">
            <a href="#" className="hover:text-white transition"><Instagram className="w-6 h-6"/></a>
          </div>
          <p className="mb-4">
            &copy; 2026 João Victor Garcia. Todos os direitos reservados.
          </p>
          <p className="text-sm text-slate-600">
            Niterói, RJ • CRN XXXXX
          </p>
        </div>
      </footer>
    </div>
  );
}
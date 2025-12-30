"use client";

import React, { useState } from 'react';
import Image from 'next/image'; 
import { 
  Check, 
  Brain, 
  Microscope, 
  Smartphone, 
  ArrowRight, 
  Menu, 
  X, 
  Instagram,
  BarChart3,
  BookOpen,
  MessageCircle,
  Calendar,
  Zap,
  ClipboardList, // Icone para Anamnese
  Video, // Icone para Consulta
  Camera, // Icone para Avaliação
  Utensils, // Icone para Dieta
  HelpCircle, // Icone para Suporte
  RefreshCw // Icone para Check-in
} from 'lucide-react';

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWeekly, setIsWeekly] = useState(false); // false = Quinzenal, true = Semanal

  // --- DADOS DOS PLANOS ---
  const plans = [
    {
      name: "Mensal",
      description: "Ideal para testar a metodologia sem fidelidade.",
      isRecurrent: true,
      price: { quinzenal: 230, semanal: 310 },
      installmentPrice: { quinzenal: 230, semanal: 310 },
      installments: 1,
      features: [
        { text: "Plano Alimentar Individualizado", included: true },
        { text: "Consulta online com tela compartilhada", included: true },
        { text: "Suporte via WhatsApp", included: true },
        { text: "Acesso completo a plataforma A BASE", included: false },
        { text: "Ferramenta Monitor de Beliscadas", included: false },
        { text: "Acesso aos Ebooks", included: false },
        { text: "Acesso a aulas exclusivas", included: false },
        { text: "Acesso ao Guia de Suplementação baseado em evidências", included: false, isSpecial: true },
      ],
      cta: "Começar Mensal",
      highlight: false
    },
    {
      name: "Semestral",
      description: "O melhor custo-benefício para mudança real.",
      isRecurrent: false,
      price: { quinzenal: 1100, semanal: 1500 },
      installmentPrice: { quinzenal: 191.60, semanal: 265.00 },
      installments: 6,
      features: [
        { text: "Plano Alimentar Individualizado", included: true },
        { text: "Consulta online com tela compartilhada", included: true },
        { text: "Suporte via WhatsApp", included: true },
        { text: "Acesso completo a plataforma A BASE", included: true },
        { text: "Ferramenta Monitor de Beliscadas", included: true },
        { text: "Acesso aos Ebooks", included: true },
        { text: "Acesso a aulas exclusivas", included: true },
        { text: "Acesso ao Guia de Suplementação baseado em evidências", included: true, isSpecial: true },
      ],
      cta: "Garantir Semestral",
      highlight: true
    },
    {
      name: "Trimestral",
      description: "Compromisso médio para resultados sólidos.",
      isRecurrent: false,
      price: { quinzenal: 600, semanal: 840 },
      installmentPrice: { quinzenal: 206.60, semanal: 295.00 },
      installments: 3,
      features: [
        { text: "Plano Alimentar Individualizado", included: true },
        { text: "Consulta online com tela compartilhada", included: true },
        { text: "Suporte via WhatsApp", included: true },
        { text: "Acesso completo a plataforma A BASE", included: true },
        { text: "Ferramenta Monitor de Beliscadas", included: true },
        { text: "Acesso aos Ebooks", included: true },
        { text: "Acesso a aulas exclusivas", included: true },
        { text: "Acesso ao Guia de Suplementação baseado em evidências", included: false, isSpecial: true },
      ],
      cta: "Escolher Trimestral",
      highlight: false
    }
  ];

  // --- DADOS DO PASSO A PASSO ---
  const steps = [
    {
      title: "1. Anamnese Detalhada",
      desc: "Você recebe um questionário completo para que eu possa entender sua rotina, preferências, histórico de saúde antes mesmo de falarmos. Você envia fotos e medidas seguindo minhas orientações. Eu avalio sua composição corporal à distância com precisão.",
      icon: ClipboardList
    },
    {
      title: "2. Consulta Online",
      desc: "Um encontro por vídeo onde vamos alinhar objetivos e traçar a estratégia. Nada de conversa rápida, aqui eu te escuto.",
      icon: Video
    },
    {
      title: "3. Plataforma exclusiva - A BASE",
      desc: "Vou liberar seu acesso a plataforma exclusiva que criei para que você tenha acesso a todos os conteúdos.",
      icon: Smartphone
    },
    {
      title: "4. Dieta no App",
      desc: "Seu plano alimentar estará disponível em um aplicativo. Prático, na palma da mão e fácil de seguir.",
      icon: Utensils
    },
    {
      title: "5. Suporte Contínuo",
      desc: "Dúvidas no mercado? Vai sair pra jantar? Me chama no WhatsApp. O suporte é contínuo para você não errar.",
      icon: HelpCircle
    },
    {
      title: "6. Check-ins de Evolução",
      desc: "Semanal ou quinzenalmente (você escolhe), você preenche o check-in na plataforma para ajustarmos a rota.",
      icon: RefreshCw
    }
  ];

  const scrollToPricing = () => {
    document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                GN
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">Garcia<span className="text-blue-600">Nutrição</span></span>
            </div>

            <div className="hidden md:flex space-x-8 items-center">
              <a href="#metodologia" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition">Metodologia</a>
              <a href="#como-funciona" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition">Como Funciona</a>
              <a href="#plataforma" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition">A Base</a>
              <button 
                onClick={scrollToPricing}
                className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-slate-800 transition"
              >
                Ver Planos
              </button>
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600">
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
        
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-100 px-4 py-4 space-y-4 shadow-xl">
            <a href="#metodologia" className="block text-slate-600 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Metodologia</a>
            <a href="#como-funciona" className="block text-slate-600 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Como Funciona</a>
            <a href="#plataforma" className="block text-slate-600 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Plataforma A Base</a>
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
          Uma abordagem comportamental para você fazer as pazes com a comida e atingir seus objetivos com estratégias científicas.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={scrollToPricing}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 shadow-blue-600/20"
          >
            Quero agendar consultoria
            <ArrowRight className="w-5 h-5" />
          </button>
          <a 
            href="#plataforma" 
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-lg font-semibold text-slate-600 border border-slate-200 bg-white transition-all duration-300 hover:shadow-xl hover:border-blue-300 hover:text-blue-600 hover:-translate-y-1"
          >
            Conhecer A Base
          </a>
        </div>
      </section>

      {/* --- METODOLOGIA (4 PILARES) --- */}
      <section id="metodologia" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Por que funciona?</h2>
            <p className="mt-4 text-slate-600">Quatro pilares que sustentam o seu resultado a longo prazo.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. Ciência */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                <Microscope className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Ciência, não "Achismo"</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Condutas baseadas no que a literatura científica atual aponta como seguro e eficiente.
              </p>
            </div>

            {/* 2. Comportamental */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-4">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Comportamental</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                O plano se adapta à sua vida. Focamos na sua relação com a comida e na adesão a longo prazo.
              </p>
            </div>

            {/* 3. Check-in */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-4">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Check-in Constante</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Feedback contínuo para ajustar a rota. Não te deixo sozinho(a) com a dieta na mão.
              </p>
            </div>

            {/* 4. Plataforma */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-4">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Plataforma A Base</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                App exclusivo para centralizar sua dieta, treino e aprendizado em um só lugar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- COMO FUNCIONA (NOVA SEÇÃO!) --- */}
      <section id="como-funciona" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Como funciona a Consultoria?</h2>
            <p className="mt-4 text-slate-600">O passo a passo da sua jornada após entrar no time.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-start p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm mb-4">
                  <step.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PLATAFORMA "A BASE" --- */}
      <section id="plataforma" className="py-24 overflow-hidden bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Texto Explicativo */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold mb-6 border border-purple-200">
                <Smartphone className="w-4 h-4" />
                Tecnologia Exclusiva
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Muito mais que um PDF. <br />
                Bem-vindo à <span className="text-blue-600">Base.</span>
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Desenvolvi uma plataforma própria para que você tenha autonomia. 
                Aqui, você não apenas segue uma dieta, você aprende e acompanha sua evolução em tempo real.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-blue-600">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Monitor de beliscadas</h4>
                    <p className="text-sm text-slate-600 mt-1">Anote seus deslizes na dieta para analisarmos juntos o que motivou esse comportamento</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-blue-600">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Central Educativa</h4>
                    <p className="text-sm text-slate-600 mt-1">Materiais e vídeos para você entender o "porquê" de cada escolha alimentar.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-blue-600">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Check-in</h4>
                    <p className="text-sm text-slate-600 mt-1">Seu check-in funciona dentro da plataforma. Com o check-in conseguiremos ver suas evoluções e comportamentos de forma mais assertiva.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* --- IMAGEM DA PLATAFORMA --- */}
            <div className="relative flex justify-center items-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-blue-100/50 rounded-full blur-3xl -z-10"></div>
                
                <Image
                    src="/mockup-plataforma.png" 
                    alt="Telas da plataforma exclusiva do paciente A Base"
                    width={2500} 
                    height={3750}
                    quality={100} 
                    priority 
                    className="w-full lg:w-[170%] lg:max-w-none lg:-ml-48 transform rotate-[-2deg] hover:rotate-0 transition duration-700 ease-in-out z-10 drop-shadow-2xl"
                />
            </div>

          </div>
        </div>
      </section>

      {/* --- PRICING SECTION --- */}
      <section id="planos" className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold sm:text-4xl tracking-tight">
              Invista na sua Base
            </h2>
            <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
              Escolha a intensidade do acompanhamento que se adapta à sua rotina.
            </p>
          </div>

          {/* Toggle */}
          <div className="flex flex-col items-center mb-16">
            <div className="flex items-center space-x-6 select-none bg-slate-800 p-2 rounded-full border border-slate-700">
              <span 
                className={`text-sm font-bold px-4 py-2 rounded-full cursor-pointer transition-all ${!isWeekly ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'}`} 
                onClick={() => setIsWeekly(false)}
              >
                Quinzenal
              </span>
              
              <button
                onClick={() => setIsWeekly(!isWeekly)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  isWeekly ? 'bg-blue-500' : 'bg-slate-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isWeekly ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              
              <span 
                className={`text-sm font-bold px-4 py-2 rounded-full cursor-pointer transition-all ${isWeekly ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`} 
                onClick={() => setIsWeekly(true)}
              >
                Semanal
              </span>
            </div>

            <div className="mt-6 text-center h-8 animate-fade-in transition-all">
              {isWeekly ? (
                <p className="text-blue-400 font-medium text-sm bg-blue-400/10 px-4 py-2 rounded-lg inline-block border border-blue-400/20">
                  ⚡ <strong>Semanal:</strong> Feedback a cada 7 dias. Ideal para quem precisa de ajustes rápidos e alta "cobrança".
                </p>
              ) : (
                <p className="text-slate-400 font-medium text-sm bg-slate-800 px-4 py-2 rounded-lg inline-block border border-slate-700">
                  🍃 <strong>Quinzenal:</strong> Feedback a cada 15 dias. Ideal para quem já tem certa autonomia e quer manutenção.
                </p>
              )}
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {plans.map((plan, index) => {
              const totalValue = isWeekly ? plan.price.semanal : plan.price.quinzenal;
              const installmentValue = isWeekly ? plan.installmentPrice.semanal : plan.installmentPrice.quinzenal;

              return (
                <div 
                  key={index} 
                  className={`relative flex flex-col rounded-2xl p-8 transition-all duration-300 border ${
                    plan.highlight 
                      ? 'bg-slate-800 border-blue-500 shadow-2xl shadow-blue-900/20 scale-105 z-10' 
                      : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg whitespace-nowrap">
                      Maior custo-benefício
                    </div>
                  )}

                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <p className="mt-2 text-slate-400 text-sm h-10">{plan.description}</p>
                  
                  <div className="mt-6 flex items-baseline">
                    <span className="text-4xl font-extrabold text-white">
                      R$ {installmentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="ml-1 text-xl font-medium text-slate-400">
                        {plan.installments > 1 ? '/mês' : ' à vista'}
                    </span>
                  </div>
                  
                  <div className="mt-1 h-6">
                    {!plan.isRecurrent && (
                      <p className="text-xs text-slate-500 font-medium">
                         R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (Pix) ou {plan.installments}x de R$ {installmentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    )}
                  </div>

                  <ul className="mt-8 space-y-4 flex-1">
                    {/* Item Fixo: Check-in */}
                    <li className="flex items-start bg-slate-700/50 p-2 rounded-lg border border-slate-600/50">
                        <div className="flex-shrink-0">
                          <MessageCircle className={`h-5 w-5 ${isWeekly ? 'text-blue-400' : 'text-green-400'}`} />
                        </div>
                        <span className="ml-3 text-sm font-bold text-white leading-tight">
                          Check-in de Evolução {isWeekly ? 'SEMANAL' : 'QUINZENAL'}
                        </span>
                    </li>

                    {/* Features Dinâmicas com DESTAQUE NOVO (Highlight do Guia) */}
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start px-2">
                        <div className="flex-shrink-0 mt-0.5">
                          {feature.included ? (
                            <Check className={`h-5 w-5 ${feature.isSpecial ? 'text-yellow-400' : 'text-green-400'}`} />
                          ) : (
                            <X className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                        <span 
                          className={`ml-3 text-sm leading-tight transition-all ${
                            feature.included 
                              // Se for especial: Amarelo + Negrito + Fundo
                              ? (feature.isSpecial ? 'text-yellow-400 font-bold bg-yellow-400/10 px-2 py-1 rounded -mt-1' : 'text-slate-300')
                              : 'text-slate-600 line-through decoration-slate-600'
                          }`}
                        >
                          {feature.text}
                          {/* Ícone de Raio Extra */}
                          {feature.included && feature.isSpecial && (
                            <Zap className="inline-block w-3 h-3 ml-2 text-yellow-400 fill-yellow-400 animate-pulse" />
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={`https://wa.me/5521SEUNUMERO?text=Oi,%20Garcia!%20Quero%20saber%20mais%20sobre%20o%20plano%20${plan.name}!`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-8 block w-full py-4 px-6 rounded-xl text-center font-bold transition-all ${
                      plan.highlight
                        ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20'
                        : 'bg-slate-700 text-white hover:bg-slate-600'
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
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center gap-6 mb-8">
            <a href="https://www.instagram.com/garcianutricao" target="_blank" rel="noopener noreferrer" className="hover:text-white transition"><Instagram className="w-6 h-6"/></a>
          </div>
          <p className="mb-4">
            &copy; 2026 Garcia Nutrição. Todos os direitos reservados.
          </p>
          <p className="text-sm text-slate-600">
            Niterói, RJ • CRN Em Breve
          </p>
        </div>
      </footer>
    </div>
  );
}
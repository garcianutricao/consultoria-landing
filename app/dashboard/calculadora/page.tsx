"use client";

import React, { useState, useEffect } from 'react';
import { Calculator, ArrowRight, ArrowLeftRight, Utensils, Scale } from 'lucide-react';

// --- TIPO DE DADOS ---
type Alimento = {
  id: string;
  nome: string;
  grupo: string; // 'proteina' | 'carboidrato' | 'gordura' | 'fruta'
  calorias: number; // Kcal em 100g
};

// --- BANCO DE DADOS COMPLETO (Baseado nas tabelas enviadas) ---
const alimentosDb: Alimento[] = [
  // --- PROTEÍNAS (Prot) ---
  { id: 'p1', nome: 'Acém moído cozido', grupo: 'proteina', calorias: 212 },
  { id: 'p2', nome: 'Acém moído cru', grupo: 'proteina', calorias: 137 },
  { id: 'p3', nome: 'Atum conserva em óleo', grupo: 'proteina', calorias: 166 },
  { id: 'p4', nome: 'Atum fresco cru', grupo: 'proteina', calorias: 118 },
  { id: 'p5', nome: 'Bacalhau salgado cru', grupo: 'proteina', calorias: 136 },
  { id: 'p6', nome: 'Bacalhau salgado refogado', grupo: 'proteina', calorias: 140 },
  { id: 'p7', nome: 'Cação posta cozida', grupo: 'proteina', calorias: 116 },
  { id: 'p8', nome: 'Cação posta crua', grupo: 'proteina', calorias: 83 },
  { id: 'p9', nome: 'Coração de frango cru', grupo: 'proteina', calorias: 222 },
  { id: 'p10', nome: 'Coração de frango grelhado', grupo: 'proteina', calorias: 207 },
  { id: 'p11', nome: 'Coxa de frango sem pele cozida', grupo: 'proteina', calorias: 167 },
  { id: 'p12', nome: 'Coxa de frango sem pele crua', grupo: 'proteina', calorias: 120 },
  { id: 'p13', nome: 'Coxão duro sem gordura cozido', grupo: 'proteina', calorias: 217 },
  { id: 'p14', nome: 'Coxão duro sem gordura cru', grupo: 'proteina', calorias: 148 },
  { id: 'p15', nome: 'Coxão mole sem gordura cozido', grupo: 'proteina', calorias: 219 },
  { id: 'p16', nome: 'Coxão mole sem gordura cru', grupo: 'proteina', calorias: 169 },
  { id: 'p17', nome: 'Fígado bovino cru', grupo: 'proteina', calorias: 141 },
  { id: 'p18', nome: 'Fígado bovino grelhado', grupo: 'proteina', calorias: 225 },
  { id: 'p19', nome: 'Filé de merluza assado/grelhado', grupo: 'proteina', calorias: 122 },
  { id: 'p20', nome: 'Filé de merluza cru', grupo: 'proteina', calorias: 89 },
  { id: 'p21', nome: 'Filé mignon cru', grupo: 'proteina', calorias: 143 },
  { id: 'p22', nome: 'Filé mignon grelhado', grupo: 'proteina', calorias: 220 },
  { id: 'p23', nome: 'Lagarto cozido', grupo: 'proteina', calorias: 222 },
  { id: 'p24', nome: 'Lagarto cru', grupo: 'proteina', calorias: 135 },
  { id: 'p25', nome: 'Lombo suíno assado', grupo: 'proteina', calorias: 210 },
  { id: 'p26', nome: 'Lombo suíno cru', grupo: 'proteina', calorias: 176 },
  { id: 'p27', nome: 'Miolo de alcatra cru', grupo: 'proteina', calorias: 163 },
  { id: 'p28', nome: 'Miolo de alcatra grelhado', grupo: 'proteina', calorias: 241 },
  { id: 'p29', nome: 'Moela de frango cozida', grupo: 'proteina', calorias: 126 },
  { id: 'p30', nome: 'Músculo cozido', grupo: 'proteina', calorias: 194 },
  { id: 'p31', nome: 'Músculo cru', grupo: 'proteina', calorias: 142 },
  { id: 'p32', nome: 'Paleta sem gordura cozida', grupo: 'proteina', calorias: 194 },
  { id: 'p33', nome: 'Paleta sem gordura crua', grupo: 'proteina', calorias: 141 },
  { id: 'p34', nome: 'Patinho cru', grupo: 'proteina', calorias: 133 },
  { id: 'p35', nome: 'Patinho grelhado/moído', grupo: 'proteina', calorias: 219 },
  { id: 'p36', nome: 'Peito de frango cru', grupo: 'proteina', calorias: 119 },
  { id: 'p37', nome: 'Peito de frango grelhado', grupo: 'proteina', calorias: 159 },
  { id: 'p38', nome: 'Pernil suíno assado', grupo: 'proteina', calorias: 262 },
  { id: 'p39', nome: 'Pernil suíno cru', grupo: 'proteina', calorias: 186 },
  { id: 'p40', nome: 'Pintado assado', grupo: 'proteina', calorias: 192 },
  { id: 'p41', nome: 'Pintado cru', grupo: 'proteina', calorias: 91 },
  { id: 'p42', nome: 'Salmão cru', grupo: 'proteina', calorias: 170 },
  { id: 'p43', nome: 'Salmão grelhado', grupo: 'proteina', calorias: 243 },
  { id: 'p44', nome: 'Sardinha assada', grupo: 'proteina', calorias: 164 },
  { id: 'p45', nome: 'Sardinha conserva em óleo', grupo: 'proteina', calorias: 285 },
  { id: 'p46', nome: 'Sobrecoxa sem pele assada', grupo: 'proteina', calorias: 233 },
  { id: 'p47', nome: 'Sobrecoxa sem pele crua', grupo: 'proteina', calorias: 162 },
  { id: 'p48', nome: 'Whey protein concentrado', grupo: 'proteina', calorias: 387 },

  // --- CARBOIDRATOS (Carbo) ---
  { id: 'c1', nome: 'Abóbora cabotian cozida', grupo: 'carboidrato', calorias: 48 },
  { id: 'c2', nome: 'Abóbora cabotian crua', grupo: 'carboidrato', calorias: 39 },
  { id: 'c3', nome: 'Arroz branco cozido', grupo: 'carboidrato', calorias: 128 },
  { id: 'c4', nome: 'Arroz branco cru', grupo: 'carboidrato', calorias: 358 },
  { id: 'c5', nome: 'Aveia em flocos', grupo: 'carboidrato', calorias: 394 },
  { id: 'c6', nome: 'Batata baroa cozida', grupo: 'carboidrato', calorias: 80 },
  { id: 'c7', nome: 'Batata baroa crua', grupo: 'carboidrato', calorias: 101 },
  { id: 'c8', nome: 'Batata doce cozida', grupo: 'carboidrato', calorias: 77 },
  { id: 'c9', nome: 'Batata doce crua', grupo: 'carboidrato', calorias: 118 },
  { id: 'c10', nome: 'Batata frita congelada', grupo: 'carboidrato', calorias: 106 },
  { id: 'c11', nome: 'Batata inglesa cozida', grupo: 'carboidrato', calorias: 52 },
  { id: 'c12', nome: 'Batata inglesa crua', grupo: 'carboidrato', calorias: 64 },
  { id: 'c13', nome: 'Bisnaguinha', grupo: 'carboidrato', calorias: 312 },
  { id: 'c14', nome: 'Cará cozido', grupo: 'carboidrato', calorias: 78 },
  { id: 'c15', nome: 'Cará cru', grupo: 'carboidrato', calorias: 96 },
  { id: 'c16', nome: 'Farelo de aveia', grupo: 'carboidrato', calorias: 246 },
  { id: 'c17', nome: 'Farinha de arroz', grupo: 'carboidrato', calorias: 363 },
  { id: 'c18', nome: 'Farinha de aveia', grupo: 'carboidrato', calorias: 370 },
  { id: 'c19', nome: 'Feijão cozido', grupo: 'carboidrato', calorias: 77 },
  { id: 'c20', nome: 'Feijão cru', grupo: 'carboidrato', calorias: 324 },
  { id: 'c21', nome: 'Flocão de milho cru (cuscuz)', grupo: 'carboidrato', calorias: 360 },
  { id: 'c22', nome: 'Grão de bico cozido', grupo: 'carboidrato', calorias: 480 },
  { id: 'c23', nome: 'Grão-de-bico cru', grupo: 'carboidrato', calorias: 355 },
  { id: 'c24', nome: 'Inhame cozido', grupo: 'carboidrato', calorias: 89 },
  { id: 'c25', nome: 'Inhame cru', grupo: 'carboidrato', calorias: 97 },
  { id: 'c26', nome: 'Lentilha cozida', grupo: 'carboidrato', calorias: 93 },
  { id: 'c27', nome: 'Macarrão cozido', grupo: 'carboidrato', calorias: 126 },
  { id: 'c28', nome: 'Macarrão cru', grupo: 'carboidrato', calorias: 371 },
  { id: 'c29', nome: 'Mandioca/aipim cozida', grupo: 'carboidrato', calorias: 125 },
  { id: 'c30', nome: 'Mandioca/aipim crua', grupo: 'carboidrato', calorias: 151 },
  { id: 'c31', nome: 'Milho de pipoca', grupo: 'carboidrato', calorias: 328 },
  { id: 'c32', nome: 'Milho verde enlatado drenado', grupo: 'carboidrato', calorias: 98 },
  { id: 'c33', nome: 'Pão de forma', grupo: 'carboidrato', calorias: 253 },
  { id: 'c34', nome: 'Pão de forma integral', grupo: 'carboidrato', calorias: 253 },
  { id: 'c35', nome: 'Pão de milho', grupo: 'carboidrato', calorias: 292 },
  { id: 'c36', nome: 'Pão francês', grupo: 'carboidrato', calorias: 300 },
  { id: 'c37', nome: 'Rap 10 normal', grupo: 'carboidrato', calorias: 293 },
  { id: 'c38', nome: 'Tapioca', grupo: 'carboidrato', calorias: 242 },

  // --- FRUTAS (Fruta) ---
  { id: 'f1', nome: 'Abacate', grupo: 'fruta', calorias: 96 },
  { id: 'f2', nome: 'Abacaxi', grupo: 'fruta', calorias: 48 },
  { id: 'f3', nome: 'Açaí polpa congelada', grupo: 'fruta', calorias: 58 },
  { id: 'f4', nome: 'Acerola', grupo: 'fruta', calorias: 33 },
  { id: 'f5', nome: 'Acerola polpa congelada', grupo: 'fruta', calorias: 22 },
  { id: 'f6', nome: 'Ameixa', grupo: 'fruta', calorias: 53 },
  { id: 'f7', nome: 'Atemóia', grupo: 'fruta', calorias: 97 },
  { id: 'f8', nome: 'Banana prata', grupo: 'fruta', calorias: 98 },
  { id: 'f9', nome: 'Caju', grupo: 'fruta', calorias: 43 },
  { id: 'f10', nome: 'Caju polpa congelada', grupo: 'fruta', calorias: 37 },
  { id: 'f11', nome: 'Carambola', grupo: 'fruta', calorias: 46 },
  { id: 'f12', nome: 'Figo', grupo: 'fruta', calorias: 41 },
  { id: 'f13', nome: 'Goiaba branca', grupo: 'fruta', calorias: 52 },
  { id: 'f14', nome: 'Goiaba vermelha', grupo: 'fruta', calorias: 54 },
  { id: 'f15', nome: 'Jabuticaba', grupo: 'fruta', calorias: 58 },
  { id: 'f16', nome: 'Jaca', grupo: 'fruta', calorias: 88 },
  { id: 'f17', nome: 'Kiwi', grupo: 'fruta', calorias: 51 },
  { id: 'f18', nome: 'Laranja crua', grupo: 'fruta', calorias: 45 },
  { id: 'f19', nome: 'Maçã', grupo: 'fruta', calorias: 56 },
  { id: 'f20', nome: 'Mamão', grupo: 'fruta', calorias: 40 },
  { id: 'f21', nome: 'Manga', grupo: 'fruta', calorias: 72 },
  { id: 'f22', nome: 'Manga polpa congelada', grupo: 'fruta', calorias: 48 },
  { id: 'f23', nome: 'Maracujá', grupo: 'fruta', calorias: 68 },
  { id: 'f24', nome: 'Maracujá polpa congelada', grupo: 'fruta', calorias: 39 },
  { id: 'f25', nome: 'Melancia', grupo: 'fruta', calorias: 33 },
  { id: 'f26', nome: 'Melão', grupo: 'fruta', calorias: 29 },
  { id: 'f27', nome: 'Morango', grupo: 'fruta', calorias: 30 },
  { id: 'f28', nome: 'Nêspera', grupo: 'fruta', calorias: 43 },
  { id: 'f29', nome: 'Pêra', grupo: 'fruta', calorias: 53 },
  { id: 'f30', nome: 'Pêssego', grupo: 'fruta', calorias: 36 },
  { id: 'f31', nome: 'Suco de laranja', grupo: 'fruta', calorias: 37 },
  { id: 'f32', nome: 'Tangerina', grupo: 'fruta', calorias: 38 },
  { id: 'f33', nome: 'Uva', grupo: 'fruta', calorias: 49 },

  // --- GORDURAS (Gord) ---
  { id: 'g1', nome: 'Amêndoa torrada salgada', grupo: 'gordura', calorias: 581 },
  { id: 'g2', nome: 'Amendoim torrado salgado', grupo: 'gordura', calorias: 606 },
  { id: 'g3', nome: 'Azeite de dendê', grupo: 'gordura', calorias: 884 },
  { id: 'g4', nome: 'Azeite de oliva extra virgem', grupo: 'gordura', calorias: 884 },
  { id: 'g5', nome: 'Castanha-de-caju torrada salgada', grupo: 'gordura', calorias: 570 },
  { id: 'g6', nome: 'Castanha-do-Brasil', grupo: 'gordura', calorias: 643 },
  { id: 'g7', nome: 'Coco', grupo: 'gordura', calorias: 406 },
  { id: 'g8', nome: 'Manteiga', grupo: 'gordura', calorias: 726 },
  { id: 'g9', nome: 'Margarina', grupo: 'gordura', calorias: 596 },
  { id: 'g10', nome: 'Noz', grupo: 'gordura', calorias: 620 },
  { id: 'g11', nome: 'Óleo vegetal', grupo: 'gordura', calorias: 884 },
  { id: 'g12', nome: 'Pasta de amendoim saborizada', grupo: 'gordura', calorias: 573 },
];

export default function CalculadoraSubstituicao() {
  // Estados
  const [grupoSelecionado, setGrupoSelecionado] = useState<string>('carboidrato');
  const [origemId, setOrigemId] = useState<string>('');
  const [destinoId, setDestinoId] = useState<string>('');
  const [qtdOrigem, setQtdOrigem] = useState<number>(100);
  const [resultado, setResultado] = useState<number | null>(null);

  // Filtra alimentos baseados no grupo e ordena alfabeticamente
  const alimentosFiltrados = alimentosDb
    .filter(a => a.grupo === grupoSelecionado)
    .sort((a, b) => a.nome.localeCompare(b.nome));

  // Função de Cálculo Automático
  useEffect(() => {
    if (origemId && destinoId && qtdOrigem > 0) {
      const alimentoOrigem = alimentosDb.find(a => a.id === origemId);
      const alimentoDestino = alimentosDb.find(a => a.id === destinoId);

      if (alimentoOrigem && alimentoDestino) {
        const totalKcal = (alimentoOrigem.calorias * qtdOrigem) / 100;
        const qtdDestino = (totalKcal * 100) / alimentoDestino.calorias;
        setResultado(Math.round(qtdDestino)); 
      }
    } else {
      setResultado(null);
    }
  }, [origemId, destinoId, qtdOrigem]);

  // Resetar seleções quando troca de grupo
  const handleGrupoChange = (novoGrupo: string) => {
    setGrupoSelecionado(novoGrupo);
    setOrigemId('');
    setDestinoId('');
    setResultado(null);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      
      {/* Cabeçalho */}
      <div className="text-center">
        <div className="inline-flex p-4 bg-blue-100 text-blue-600 rounded-2xl mb-4 shadow-sm">
          <Calculator className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Calculadora de Substituição</h1>
        <p className="text-slate-500 mt-2">
          Troque seus alimentos mantendo as mesmas calorias do plano.
        </p>
      </div>

      {/* Box Principal */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        
        {/* Abas de Grupo */}
        <div className="flex border-b border-slate-100 overflow-x-auto">
          {[
            { id: 'proteina', label: 'Proteínas' },
            { id: 'carboidrato', label: 'Carboidratos' },
            { id: 'fruta', label: 'Frutas' },
            { id: 'gordura', label: 'Gorduras' }
          ].map((grupo) => (
            <button
              key={grupo.id}
              onClick={() => handleGrupoChange(grupo.id)}
              className={`flex-1 py-4 px-2 text-sm font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
                grupoSelecionado === grupo.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
              }`}
            >
              {grupo.label}
            </button>
          ))}
        </div>

        <div className="p-6 md:p-8 space-y-8">
          
          <div className="grid md:grid-cols-2 gap-8 items-center relative">
            
            {/* LADO A: DIETA */}
            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                Alimento que está na dieta
              </label>
              
              <div className="relative">
                <Utensils className="absolute top-3.5 left-3 w-5 h-5 text-slate-400" />
                <select 
                  className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 appearance-none"
                  value={origemId}
                  onChange={(e) => setOrigemId(e.target.value)}
                >
                  <option value="" disabled>Escolha o alimento...</option>
                  {alimentosFiltrados.map(a => (
                    <option key={a.id} value={a.id}>{a.nome}</option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <Scale className="absolute top-3.5 left-3 w-5 h-5 text-slate-400" />
                <input 
                  type="number" 
                  placeholder="Quantidade (g)"
                  className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-blue-500"
                  value={qtdOrigem}
                  onChange={(e) => setQtdOrigem(Number(e.target.value))}
                />
                <span className="absolute right-4 top-3.5 text-xs font-bold text-slate-400">gramas</span>
              </div>
            </div>

            {/* Divisor Mobile/Desktop */}
            <div className="hidden md:flex justify-center">
              <div className="bg-slate-100 p-3 rounded-full text-slate-400">
                <ArrowRight className="w-6 h-6" />
              </div>
            </div>
            <div className="md:hidden flex justify-center -my-4 z-10">
               <div className="bg-slate-100 p-2 rounded-full text-slate-400 rotate-90">
                <ArrowRight className="w-6 h-6" />
              </div>
            </div>

            {/* LADO B: SUBSTITUTO */}
            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                Quero trocar por
              </label>
              
              <div className="relative">
                <ArrowLeftRight className="absolute top-3.5 left-3 w-5 h-5 text-slate-400" />
                <select 
                  className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 appearance-none"
                  value={destinoId}
                  onChange={(e) => setDestinoId(e.target.value)}
                >
                  <option value="" disabled>Escolha o substituto...</option>
                  {alimentosFiltrados.map(a => (
                    <option key={a.id} value={a.id}>{a.nome}</option>
                  ))}
                </select>
              </div>

              {/* Resultado Placeholder (Visual) */}
              <div className="h-[50px] md:h-[50px]"></div> 
            </div>

          </div>

          {/* RESULTADO FINAL */}
          <div className={`transition-all duration-500 ease-in-out transform ${resultado !== null ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {resultado !== null && (
              <div className="bg-slate-900 rounded-2xl p-8 text-center text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-500 rounded-full blur-2xl opacity-20"></div>
                
                <p className="text-slate-400 font-medium mb-2 uppercase tracking-widest text-xs">Você pode comer</p>
                <div className="text-6xl font-extrabold mb-2 tracking-tight text-blue-400">
                  {resultado}<span className="text-2xl font-medium text-white ml-1">g</span>
                </div>
                <p className="text-lg font-medium text-slate-300">
                  de {alimentosDb.find(a => a.id === destinoId)?.nome}
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
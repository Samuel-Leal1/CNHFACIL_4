import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { 
  Shield, Timer, ArrowLeft, ArrowRight, CheckCircle2, 
  XCircle, AlertTriangle, Play, ChevronLeft, ChevronRight 
} from 'lucide-react';

export default function Simulado({ onNavigate }) {
  // Estados de Fluxo: 'config' | 'playing' | 'results'
  const [stage, setStage] = useState('config'); 
  
  // Configurações do simulado
  const [tipo, setTipo] = useState('geral');
  const [materia, setMateria] = useState('Legislação de Trânsito');
  const [quantidade, setQuantidade] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Simulado ativo
  const [simuladoId, setSimuladoId] = useState(null);
  const [questoes, setQuestoes] = useState([]);
  const [respostas, setRespostas] = useState({}); // { [questaoId]: selectedOptionIndex }
  const [currentIndex, setCurrentIndex] = useState(0);

  // Timer/Cronômetro
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const timerRef = useRef(null);

  // Resultados e Feedback
  const [resultado, setResultado] = useState(null);

  // Temas das matérias de trânsito disponíveis no backend
  const materiasDisponiveis = [
    'Legislação de Trânsito',
    'Normas de Circulação',
    'Sinalização',
    'Direção Defensiva',
    'Primeiros Socorros',
    'Mecânica Básica',
    'Meio Ambiente e Cidadania'
  ];

  // Inicia o cronômetro
  const startTimer = () => {
    setSecondsElapsed(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);
  };

  // Para o cronômetro
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopTimer();
  }, []);

  // Formata os segundos em MM:SS
  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Gerar o simulado no backend
  const handleGerarSimulado = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/simulados/gerar', {
        tipo,
        materia: tipo === 'materia' ? materia : undefined,
        quantidade,
      });

      const data = response.data;
      if (!data.questoes || data.questoes.length === 0) {
        throw new Error('Não há questões suficientes no servidor para os filtros selecionados.');
      }

      setSimuladoId(data.simuladoId);
      setQuestoes(data.questoes);
      
      // Inicializa objeto de respostas vazio
      const initialRespostas = {};
      data.questoes.forEach(q => {
        initialRespostas[q.id] = null;
      });
      setRespostas(initialRespostas);

      setCurrentIndex(0);
      setStage('playing');
      startTimer();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.erro || err.message || 'Erro ao carregar o simulado.');
    } finally {
      setLoading(false);
    }
  };

  // Marca uma opção para a questão atual
  const handleSelectOption = (optionIndex) => {
    const activeQuestion = questoes[currentIndex];
    setRespostas(prev => ({
      ...prev,
      [activeQuestion.id]: optionIndex
    }));
  };

  // Enviar e corrigir o simulado no backend
  const handleFinalizarSimulado = async () => {
    stopTimer();
    setLoading(true);
    setError('');

    // Prepara as respostas no formato esperado pelo backend: [{ questionId, selectedOption }]
    const listaRespostas = questoes.map(q => ({
      questionId: q.id,
      selectedOption: respostas[q.id]
    }));

    try {
      const response = await api.post('/simulados/enviar', {
        materia: tipo === 'materia' ? materia : 'Geral',
        respostas: listaRespostas
      });

      setResultado(response.data);
      setStage('results');
    } catch (err) {
      console.error(err);
      setError('Erro ao corrigir o simulado. Tente enviar novamente.');
      startTimer(); // Reinicia o timer se der erro no envio
    } finally {
      setLoading(false);
    }
  };

  const countUnanswered = () => {
    return questoes.filter(q => respostas[q.id] === null).length;
  };

  // Renderizador de telas
  return (
    <div className="min-h-screen bg-brand-dark font-sans text-gray-200 pb-12">
      
      {/* Background decoration */}
      <div className="absolute top-[20%] left-[-10%] w-[35rem] h-[35rem] rounded-full bg-blue-600/5 blur-[100px] pointer-events-none"></div>

      {/* Navigation Header */}
      <header className="glass sticky top-0 z-50 border-b border-white/5 py-4 px-6 sm:px-12 flex justify-between items-center">
        <button 
          onClick={() => {
            if (stage === 'playing' && !window.confirm('Quer mesmo sair? Seu progresso do simulado ativo será perdido.')) {
              return;
            }
            onNavigate('dashboard');
          }}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-all bg-gray-900 border border-gray-800 hover:border-gray-700 px-3 py-1.5 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Painel
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm text-white">Simulador CNHFácil</span>
        </div>

        {stage === 'playing' ? (
          <div className="flex items-center gap-2 text-blue-400 font-mono text-sm bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-500/20">
            <Timer className="w-4 h-4" /> {formatTime(secondsElapsed)}
          </div>
        ) : (
          <div className="w-[100px]"></div>
        )}
      </header>

      {/* Main content body */}
      <main className="max-w-4xl mx-auto px-4 mt-8">
        
        {error && (
          <div className="p-4 mb-6 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> {error}
          </div>
        )}

        {/* --------------------- STAGE 1: CONFIGURATION --------------------- */}
        {stage === 'config' && (
          <div className="glass p-8 rounded-3xl border border-white/5 shadow-2xl animate-fade-in space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-white mb-2">Simulado Inteligente DETRAN</h2>
              <p className="text-sm text-gray-400">
                Selecione suas preferências para treinar com questões atualizadas da prova teórica.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {/* Card 1: Tipo */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Categoria do Exame</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setTipo('geral')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      tipo === 'geral' 
                        ? 'bg-blue-600/10 border-blue-500 text-white shadow-lg shadow-blue-500/10' 
                        : 'bg-gray-900/40 border-gray-800 hover:border-gray-700 text-gray-400'
                    }`}
                  >
                    <div className="font-semibold text-sm">Geral Completo</div>
                    <div className="text-[10px] opacity-70 mt-1">Mistura todas as matérias exigidas</div>
                  </button>
                  <button
                    onClick={() => setTipo('materia')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      tipo === 'materia' 
                        ? 'bg-blue-600/10 border-blue-500 text-white shadow-lg shadow-blue-500/10' 
                        : 'bg-gray-900/40 border-gray-800 hover:border-gray-700 text-gray-400'
                    }`}
                  >
                    <div className="font-semibold text-sm">Por Matéria</div>
                    <div className="text-[10px] opacity-70 mt-1">Foco em um tema específico</div>
                  </button>
                </div>
              </div>

              {/* Card 2: Quantidade */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Tamanho da Prova</label>
                <div className="grid grid-cols-3 gap-2">
                  {[10, 30, 40].map((num) => (
                    <button
                      key={num}
                      onClick={() => setQuantidade(num)}
                      className={`py-3.5 rounded-xl border text-center transition-all font-bold text-sm ${
                        quantidade === num 
                          ? 'bg-blue-600/10 border-blue-500 text-white shadow-lg' 
                          : 'bg-gray-900/40 border-gray-800 hover:border-gray-700 text-gray-400'
                      }`}
                    >
                      {num} <span className="text-[10px] font-normal block">Questões</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Selection for specific theme */}
            {tipo === 'materia' && (
              <div className="space-y-2 pt-2 animate-fade-in">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Selecione o Tema Específico</label>
                <select
                  value={materia}
                  onChange={(e) => setMateria(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  {materiasDisponiveis.map((m, idx) => (
                    <option key={idx} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Launch button */}
            <div className="pt-6 border-t border-gray-800">
              <button
                onClick={handleGerarSimulado}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-medium py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-blue-600/20"
              >
                {loading ? 'Preparando caderno de questões...' : 'Gerar e Iniciar Simulado'}
                {!loading && <Play className="w-4 h-4 fill-white" />}
              </button>
            </div>
          </div>
        )}

        {/* --------------------- STAGE 2: QUIZ PLAYER --------------------- */}
        {stage === 'playing' && questoes.length > 0 && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Top overview grid of all questions for quick navigation */}
            <div className="glass p-4 rounded-2xl border border-white/5">
              <div className="flex justify-between items-center text-xs text-gray-400 mb-3 font-semibold">
                <span>SELECIONE A QUESTÃO DIRETAMENTE</span>
                <span>{countUnanswered()} restando</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {questoes.map((q, idx) => {
                  const isAnswered = respostas[q.id] !== null;
                  const isActive = idx === currentIndex;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`w-9 h-9 rounded-lg font-bold text-sm transition-all flex items-center justify-center ${
                        isActive 
                          ? 'bg-blue-600 text-white border-2 border-white/20' 
                          : isAnswered 
                            ? 'bg-blue-950/60 text-blue-300 border border-blue-500/30' 
                            : 'bg-gray-900 border border-gray-800 hover:border-gray-700 text-gray-400'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Progress bar visual */}
            <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questoes.length) * 100}%` }}
              ></div>
            </div>

            {/* Active Question Box */}
            <div className="glass p-8 rounded-3xl border border-white/5 shadow-2xl relative">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-semibold px-2.5 py-1 bg-gray-900 border border-gray-800 text-gray-400 rounded-full">
                  Matéria: {questoes[currentIndex].theme}
                </span>
                <span className="text-xs font-bold text-blue-400">
                  Questão {currentIndex + 1} de {questoes.length}
                </span>
              </div>

              {/* Question Text */}
              <h3 className="text-lg font-bold text-white mb-8 leading-relaxed">
                {questoes[currentIndex].text}
              </h3>

              {/* Options Grid */}
              <div className="space-y-3">
                {questoes[currentIndex].options.map((option, idx) => {
                  const isSelected = respostas[questoes[currentIndex].id] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full p-4 rounded-xl border text-left transition-all flex items-start gap-3 text-sm leading-relaxed ${
                        isSelected 
                          ? 'bg-blue-600/10 border-blue-500 text-white shadow-lg' 
                          : 'bg-gray-900/30 border-gray-800 hover:border-gray-700 hover:bg-gray-900/50 text-gray-300'
                      }`}
                    >
                      {/* Option letter code */}
                      <span className={`w-6 h-6 rounded-full font-bold text-xs flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{option}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Lower Navigation Buttons */}
            <div className="flex justify-between items-center gap-4">
              <button
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="bg-gray-900 border border-gray-800 hover:bg-gray-800 text-white px-5 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" /> Anterior
              </button>

              {currentIndex < questoes.length - 1 ? (
                <button
                  onClick={() => setCurrentIndex(prev => Math.min(questoes.length - 1, prev + 1))}
                  className="bg-gray-900 border border-gray-800 hover:bg-gray-800 text-white px-5 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-1"
                >
                  Próxima <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    const unanswered = countUnanswered();
                    if (unanswered > 0) {
                      if (!window.confirm(`Você possui ${unanswered} questões sem resposta. Deseja finalizar mesmo assim?`)) {
                        return;
                      }
                    }
                    handleFinalizarSimulado();
                  }}
                  disabled={loading}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-600/20"
                >
                  {loading ? 'Corrigindo...' : 'Finalizar Simulado'}
                </button>
              )}
            </div>

          </div>
        )}

        {/* --------------------- STAGE 3: RESULTS & FEEDBACK --------------------- */}
        {stage === 'results' && resultado && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Header score card */}
            <div className={`glass p-8 rounded-3xl border border-white/5 text-center relative overflow-hidden ${
              resultado.aprovado ? 'bg-gradient-to-b from-emerald-500/5 to-transparent' : 'bg-gradient-to-b from-red-500/5 to-transparent'
            }`}>
              
              {resultado.aprovado ? (
                <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
              ) : (
                <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              )}

              <h2 className="text-3xl font-extrabold text-white leading-tight">
                {resultado.aprovado ? 'Aprovado no Simulado!' : 'Nota Insuficiente'}
              </h2>
              <p className="text-sm text-gray-400 mt-2 max-w-md mx-auto">
                {resultado.mensagem}
              </p>

              {/* Big score numbers */}
              <div className="flex justify-center items-center gap-8 py-6">
                <div>
                  <span className="text-4xl font-extrabold text-white">{resultado.notaPercent}%</span>
                  <span className="text-xs text-gray-500 block">Nota Final</span>
                </div>
                <div className="w-px h-10 bg-gray-800"></div>
                <div>
                  <span className="text-4xl font-extrabold text-white">{resultado.acertos}</span>
                  <span className="text-xs text-gray-500 block">Acertos / {resultado.total}</span>
                </div>
                <div className="w-px h-10 bg-gray-800"></div>
                <div>
                  <span className="text-4xl font-extrabold text-white">{formatTime(secondsElapsed)}</span>
                  <span className="text-xs text-gray-500 block">Tempo Gasto</span>
                </div>
              </div>

              <div className="text-xs text-gray-500">
                Mínimo necessário exigido pelo DETRAN: <span className="font-bold text-gray-300">70%</span> de acertos.
              </div>

              {/* Return to Dashboard */}
              <div className="mt-8">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 px-6 rounded-xl text-sm transition-all"
                >
                  Voltar ao Dashboard principal
                </button>
              </div>
            </div>

            {/* Commented correction sheet */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white mb-2">Gabarito Oficial Comentado</h3>
              
              {resultado.feedback.map((f, idx) => {
                return (
                  <div 
                    key={idx} 
                    className={`p-6 rounded-2xl bg-gray-900/30 border transition-all ${
                      f.wasCorrect ? 'border-emerald-500/20' : 'border-red-500/20'
                    }`}
                  >
                    {/* Header: Question N and Result Tag */}
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <span className="text-xs font-semibold px-2.5 py-1 bg-gray-900 border border-gray-800 text-gray-400 rounded-full">
                        Matéria: {f.theme}
                      </span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        f.wasCorrect 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        Questão {idx + 1}: {f.wasCorrect ? 'Acertou' : 'Errou'}
                      </span>
                    </div>

                    {/* Question text */}
                    <h4 className="text-sm font-bold text-white mb-4">{f.text}</h4>

                    {/* Options list */}
                    <div className="space-y-2 text-xs">
                      {f.options.map((option, optIdx) => {
                        const isUserOption = f.userOption === optIdx;
                        const isCorrectOption = f.correctOption === optIdx;
                        
                        let optStyle = 'bg-gray-950/20 border-gray-900 text-gray-400';
                        if (isCorrectOption) {
                          optStyle = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-medium';
                        } else if (isUserOption && !f.wasCorrect) {
                          optStyle = 'bg-red-500/10 border-red-500/30 text-red-400 font-medium';
                        }

                        return (
                          <div 
                            key={optIdx} 
                            className={`p-3 rounded-lg border flex items-start gap-2.5 leading-normal ${optStyle}`}
                          >
                            <span className={`w-5 h-5 rounded-full font-bold text-[10px] flex items-center justify-center shrink-0 ${
                              isCorrectOption 
                                ? 'bg-emerald-500 text-white' 
                                : isUserOption 
                                  ? 'bg-red-500 text-white' 
                                  : 'bg-gray-800 text-gray-400'
                            }`}>
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{option}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

      </main>
    </div>
  );
}

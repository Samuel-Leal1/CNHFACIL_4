import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  ArrowLeft, Shield, Plus, Edit2, Trash2, X, Check, Filter, AlertCircle 
} from 'lucide-react';

export default function AdminQuestoes({ onNavigate }) {
  const [questoes, setQuestoes] = useState([]);
  const [temaFiltro, setTemaFiltro] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Estados do Modal
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null); // null = Criando, senão editando
  
  // Campos do formulário
  const [theme, setTheme] = useState('Legislação de Trânsito');
  const [text, setText] = useState('');
  const [op0, setOp0] = useState('');
  const [op1, setOp1] = useState('');
  const [op2, setOp2] = useState('');
  const [op3, setOp3] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState(0);

  // Lista de matérias para seleção no form
  const materias = [
    'Legislação de Trânsito',
    'Normas de Circulação',
    'Sinalização',
    'Direção Defensiva',
    'Primeiros Socorros',
    'Mecânica Básica',
    'Meio Ambiente e Cidadania'
  ];

  // Carrega as questões do backend
  const fetchQuestoes = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/questoes', {
        params: temaFiltro ? { tema: temaFiltro } : {}
      });
      setQuestoes(response.data);
    } catch (err) {
      console.error(err);
      setError('Falha ao obter lista de questões do servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestoes();
  }, [temaFiltro]);

  // Excluir questão
  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza absoluta de que deseja excluir esta questão?')) return;
    setError('');
    setSuccess('');
    try {
      await api.delete(`/questoes/${id}`);
      setSuccess('Questão excluída com sucesso!');
      fetchQuestoes();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.erro || 'Erro ao excluir questão.');
    }
  };

  // Abre modal para criação
  const handleOpenCreate = () => {
    setEditId(null);
    setTheme('Legislação de Trânsito');
    setText('');
    setOp0('');
    setOp1('');
    setOp2('');
    setOp3('');
    setCorrectAnswer(0);
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  // Abre modal para edição
  const handleOpenEdit = (q) => {
    setEditId(q.id);
    setTheme(q.theme);
    setText(q.text);
    setOp0(q.options[0] || '');
    setOp1(q.options[1] || '');
    setOp2(q.options[2] || '');
    setOp3(q.options[3] || '');
    setCorrectAnswer(q.correctAnswer ?? 0);
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  // Salva formulário (criar ou editar)
  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const options = [op0, op1, op2, op3];
    if (options.some(op => !op.trim())) {
      setError('Todas as 4 alternativas devem ser preenchidas.');
      return;
    }

    const payload = {
      theme,
      text,
      options,
      correctAnswer: Number(correctAnswer)
    };

    try {
      if (editId) {
        // Atualizar
        await api.put(`/questoes/${editId}`, payload);
        setSuccess('Questão atualizada com sucesso!');
      } else {
        // Criar
        await api.post('/questoes', payload);
        setSuccess('Questão cadastrada com sucesso!');
      }
      setShowModal(false);
      fetchQuestoes();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.erro || 'Erro ao salvar questão.');
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark font-sans text-gray-200 pb-12">
      
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-white/5 py-4 px-6 sm:px-12 flex justify-between items-center">
        <button 
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-all bg-gray-900 border border-gray-800 hover:border-gray-700 px-3 py-1.5 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Painel
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm text-white">Administrador de Questões</span>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs px-3 py-2 rounded-lg flex items-center gap-1 shadow-lg shadow-blue-600/10"
        >
          <Plus className="w-4 h-4" /> Nova Questão
        </button>
      </header>

      {/* Main content body */}
      <main className="max-w-6xl mx-auto px-4 mt-8">
        
        {/* Status Alerts */}
        {error && (
          <div className="p-4 mb-4 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-sm flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-5 h-5" /> {error}
          </div>
        )}
        {success && (
          <div className="p-4 mb-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-2 animate-fade-in">
            <Check className="w-5 h-5" /> {success}
          </div>
        )}

        {/* Filter bar */}
        <div className="glass p-4 rounded-xl mb-6 border border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Filter className="w-4 h-4 text-blue-500" />
            <span>Filtro de Matéria:</span>
          </div>

          <select
            value={temaFiltro}
            onChange={(e) => setTemaFiltro(e.target.value)}
            className="bg-gray-900 border border-gray-800 rounded-lg py-1.5 px-3 text-xs text-white focus:outline-none focus:border-blue-500 w-full sm:w-[250px]"
          >
            <option value="">Todas as matérias</option>
            {materias.map((m, idx) => (
              <option key={idx} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {/* Questions list */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 text-sm">Carregando lista de questões...</p>
          </div>
        ) : questoes.length === 0 ? (
          <div className="glass p-12 rounded-2xl text-center border border-white/5">
            <p className="text-gray-500 text-sm">Nenhuma questão encontrada para este tema.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {questoes.map((q) => (
              <div key={q.id} className="glass p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-fade-in">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md">
                      ID: {q.id}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 bg-gray-800 text-gray-400 border border-gray-700 rounded-md">
                      {q.theme}
                    </span>
                  </div>
                  
                  <h4 className="text-sm font-bold text-white leading-relaxed">{q.text}</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const isCorrect = q.correctAnswer === optIdx;
                      return (
                        <div key={optIdx} className={`text-xs p-2 rounded-lg border ${
                          isCorrect 
                            ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400 font-medium' 
                            : 'bg-gray-950/20 border-gray-900 text-gray-400'
                        }`}>
                          <span className="font-semibold">{String.fromCharCode(65 + optIdx)})</span> {opt}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Operations buttons */}
                <div className="flex gap-2 self-end md:self-center">
                  <button
                    onClick={() => handleOpenEdit(q)}
                    className="p-2 rounded-lg bg-gray-900 border border-gray-800 hover:bg-blue-500/10 hover:border-blue-500/20 text-blue-400 hover:text-blue-300 transition-all"
                    title="Editar questão"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="p-2 rounded-lg bg-gray-900 border border-gray-800 hover:bg-red-500/10 hover:border-red-500/20 text-red-400 hover:text-red-300 transition-all"
                    title="Excluir questão"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* --------------------- MODAL: CREATE / EDIT --------------------- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-white/5 shrink-0">
              <h3 className="text-lg font-bold text-white">
                {editId ? `Editar Questão (ID: ${editId})` : 'Nova Questão para Simulado'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto flex-1">
              
              {/* Theme */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Matéria/Tema</label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  {materias.map((m, idx) => (
                    <option key={idx} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Text */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Enunciado da Questão</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Qual a velocidade regulamentada..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>

              {/* Options */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Alternativas</label>
                
                {/* Op 0 */}
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-gray-400">A)</span>
                  <input
                    type="text"
                    required
                    placeholder="Opção A"
                    value={op0}
                    onChange={(e) => setOp0(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Op 1 */}
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-gray-400">B)</span>
                  <input
                    type="text"
                    required
                    placeholder="Opção B"
                    value={op1}
                    onChange={(e) => setOp1(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Op 2 */}
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-gray-400">C)</span>
                  <input
                    type="text"
                    required
                    placeholder="Opção C"
                    value={op2}
                    onChange={(e) => setOp2(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Op 3 */}
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-gray-400">D)</span>
                  <input
                    type="text"
                    required
                    placeholder="Opção D"
                    value={op3}
                    onChange={(e) => setOp3(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Correct Answer selection */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Qual alternativa é a correta?</label>
                <select
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl py-2.5 px-3 text-sm text-emerald-400 font-semibold focus:outline-none focus:border-blue-500"
                >
                  <option value={0}>Opção A (Correta)</option>
                  <option value={1}>Opção B (Correta)</option>
                  <option value={2}>Opção C (Correta)</option>
                  <option value={3}>Opção D (Correta)</option>
                </select>
              </div>

              {/* Form operations buttons */}
              <div className="pt-4 border-t border-white/5 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-900 border border-gray-800 hover:bg-gray-800 text-white px-4 py-2 rounded-xl text-xs transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl text-xs font-semibold transition-colors"
                >
                  Salvar Questão
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

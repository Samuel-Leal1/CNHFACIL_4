import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  LogOut, Shield, Award, Calendar, BookOpen, Car, CheckCircle, 
  Clock, DollarSign, FileCheck, ArrowUpRight, Play, AlertCircle, PlusCircle 
} from 'lucide-react';

export default function Dashboard({ onNavigate }) {
  const { user, logout, isAdminOrInstructor } = useAuth();
  const [perfil, setPerfil] = useState(null);
  const [desempenho, setDesempenho] = useState(null);
  const [aulas, setAulas] = useState([]);
  const [veiculos, setVeiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError('');
      try {
        // Obter dados do perfil (que inclui financeiro e jornada)
        const resPerfil = await api.get('/perfil');
        setPerfil(resPerfil.data);

        // Obter métricas de simulados (desempenho)
        try {
          const resDesempenho = await api.get('/desempenho');
          setDesempenho(resDesempenho.data);
        } catch (err) {
          console.warn('Não foi possível carregar o desempenho. Usando dados padrão.', err);
        }

        // Obter aulas
        const resAulas = await api.get('/aulas');
        setAulas(resAulas.data);

        // Obter frota de veículos
        const resVeiculos = await api.get('/veiculos');
        setVeiculos(resVeiculos.data);
      } catch (err) {
        console.error('Erro ao carregar dados do dashboard:', err);
        setError('Houve um problema ao sincronizar dados com o servidor.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center text-gray-200">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400 font-medium">Carregando painel do CNHFácil...</p>
      </div>
    );
  }

  // Se for admin ou instrutor, mostra tela simplificada com redirecionamento ao CRUD de questões
  const showAdminUI = isAdminOrInstructor;

  return (
    <div className="min-h-screen bg-brand-dark font-sans text-gray-200 pb-12">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[30rem] h-[30rem] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none"></div>

      {/* Header / Navbar */}
      <nav className="glass sticky top-0 z-50 border-b border-white/5 py-4 px-6 sm:px-12 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white m-0">CNH<span className="text-blue-500">Fácil</span></span>
            <span className="text-[10px] text-gray-400 ml-1 uppercase font-semibold">Autoescola</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold text-white">{perfil?.nome || user?.nome}</div>
            <div className="text-xs text-blue-400 font-medium capitalize">{perfil?.cargo || user?.cargo}</div>
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
            Cat. {perfil?.categoria || user?.categoria || 'B'}
          </span>

          <button 
            onClick={logout} 
            className="p-2 rounded-lg bg-gray-900 border border-gray-800 hover:bg-red-500/10 hover:border-red-500/20 text-gray-400 hover:text-red-400 transition-all duration-200"
            title="Sair do sistema"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Welcome Alert */}
        <div className="glass p-6 rounded-2xl mb-8 border border-white/5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Olá, {perfil?.nome || user?.nome}! 👋
            </h1>
            <p className="text-sm text-gray-400">
              {showAdminUI 
                ? 'Você está no painel de administração. Gerencie as questões do simulado e verifique os recursos da escola.' 
                : 'Acompanhe seu progresso de aprendizagem, aulas práticas e prepare-se para passar de primeira.'}
            </p>
          </div>
          
          <div className="flex gap-3">
            {showAdminUI && (
              <button
                onClick={() => onNavigate('admin-questoes')}
                className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20"
              >
                <PlusCircle className="w-4 h-4" /> Gerenciar Questões
              </button>
            )}
            {!showAdminUI && (
              <button
                onClick={() => onNavigate('simulado')}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20 animate-pulse"
              >
                <Play className="w-4 h-4 fill-white" /> Iniciar Simulado DETRAN
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="p-4 mb-6 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-sm flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-5 h-5" /> {error}
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Main content (Dashboard metrics & lists) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* 1. Aluno Metrics Card Grid */}
            {!showAdminUI && desempenho && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fade-in">
                
                {/* Metric 1 */}
                <div className="glass p-5 rounded-2xl border border-white/5">
                  <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider block mb-1">Simulados</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold text-white">{desempenho.simuladosRealizados}</span>
                    <span className="text-xs text-gray-500">feitos</span>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-2 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-blue-500" /> Histórico ativo
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="glass p-5 rounded-2xl border border-white/5">
                  <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider block mb-1">Média Acertos</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className={`text-3xl font-extrabold ${desempenho.mediaAcertos >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {desempenho.mediaAcertos}%
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-2">
                    {desempenho.mediaAcertos >= 70 ? 'Aprovado no DETRAN' : 'Abaixo da nota mínima'}
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="glass p-5 rounded-2xl border border-white/5">
                  <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider block mb-1">Melhor Nota</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold text-blue-400">{desempenho.melhorDesempenho}%</span>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-2 flex items-center gap-1">
                    <Award className="w-3 h-3 text-blue-400" /> Recorde pessoal
                  </div>
                </div>

                {/* Metric 4 */}
                <div className="glass p-5 rounded-2xl border border-white/5">
                  <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider block mb-1">Questões</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold text-white">{desempenho.questoesRespondidas}</span>
                    <span className="text-xs text-gray-500">total</span>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-2">Aulas + simulados</div>
                </div>

              </div>
            )}

            {/* 2. Teórico Aulas (Progress List) */}
            <div className="glass p-6 rounded-2xl border border-white/5">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white m-0">Aulas Teóricas</h3>
                  <p className="text-xs text-gray-400">Status por matérias obrigatórias</p>
                </div>
                <BookOpen className="w-5 h-5 text-gray-400" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aulas.map((aula) => (
                  <div key={aula.id} className="p-4 rounded-xl bg-gray-900/40 border border-gray-800 flex flex-col justify-between">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg" style={{ color: aula.cor }}>■</span>
                        <h4 className="text-sm font-semibold text-white line-clamp-1">{aula.titulo}</h4>
                      </div>
                      <span className="text-xs text-gray-400 font-medium">
                        {aula.aulasConcluidas}/{aula.aulasTotais}
                      </span>
                    </div>

                    <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${aula.progresso}%`, backgroundColor: aula.cor }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Conclusão</span>
                      <span className="text-xs font-bold" style={{ color: aula.cor }}>{aula.progresso}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Frota da Autoescola (Veículos) */}
            <div className="glass p-6 rounded-2xl border border-white/5">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white m-0">Frota e Veículos</h3>
                  <p className="text-xs text-gray-400">Veículos disponíveis para aulas práticas</p>
                </div>
                <Car className="w-5 h-5 text-gray-400" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {veiculos.map((v) => (
                  <div key={v.id} className="p-4 rounded-xl bg-gray-900/40 border border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl p-2 bg-gray-950 rounded-lg">{v.icone}</span>
                      <div>
                        <h4 className="text-sm font-bold text-white">{v.nome}</h4>
                        <p className="text-xs text-gray-400">Placa: {v.placa}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold px-2 py-0.5 bg-gray-800 text-gray-300 rounded border border-gray-700 block mb-1">
                        Categoria {v.categoria}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {v.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Aluno Simulado History (Only Student) */}
            {!showAdminUI && desempenho && desempenho.historico && (
              <div className="glass p-6 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white m-0">Histórico de Simulados</h3>
                    <p className="text-xs text-gray-400">Seus exames realizados recentemente</p>
                  </div>
                  <Clock className="w-5 h-5 text-gray-400" />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-gray-800 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        <th className="pb-3">Data</th>
                        <th className="pb-3">Categoria</th>
                        <th className="pb-3">Acertos</th>
                        <th className="pb-3 text-right">Nota %</th>
                        <th className="pb-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {desempenho.historico.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="py-6 text-center text-gray-500">
                            Nenhum simulado realizado ainda. Comece hoje mesmo!
                          </td>
                        </tr>
                      ) : (
                        desempenho.historico.map((h) => {
                          const aprovado = h.notaPercent >= 70;
                          return (
                            <tr key={h.id} className="text-gray-300 hover:text-white transition-colors">
                              <td className="py-3 font-medium flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-gray-500" /> {h.data}
                              </td>
                              <td className="py-3 text-gray-400">{h.categoria}</td>
                              <td className="py-3">
                                <span className="font-semibold text-white">{h.acertos}</span>/{h.total}
                              </td>
                              <td className="py-3 text-right font-bold">
                                {h.notaPercent}%
                              </td>
                              <td className="py-3 text-right">
                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                                  aprovado 
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                }`}>
                                  {aprovado ? 'Aprovado' : 'Reprovado'}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: Sidebar (Profile & Finance) */}
          <div className="lg:col-span-4 space-y-8">

            {/* 1. Aluno Profile Info & Documents */}
            <div className="glass p-6 rounded-2xl border border-white/5">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-500" />
                Dados do Aluno
              </h3>
              
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-gray-400 block">CPF</span>
                  <span className="text-sm font-semibold text-gray-200">{perfil?.cpf || '123.456.789-00'}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block">Data de Nascimento</span>
                  <span className="text-sm font-semibold text-gray-200">{perfil?.dataNascimento || '15/04/2004'}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block">Categoria Desejada</span>
                  <span className="text-sm font-bold text-blue-400">Categoria {perfil?.categoria || 'B'}</span>
                </div>

                {perfil?.descricao && (
                  <div className="pt-3 border-t border-gray-800 text-xs text-gray-400 italic">
                    "{perfil.descricao}"
                  </div>
                )}

                {/* Documents status */}
                <div className="pt-4 border-t border-gray-800">
                  <span className="text-xs font-semibold text-gray-400 uppercase block mb-3">Documentação</span>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-300">Exame Médico</span>
                      <span className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                        perfil?.documentos?.exameMedico === 'Concluído' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>{perfil?.documentos?.exameMedico || 'Pendente'}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-300">Psicotécnico</span>
                      <span className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                        perfil?.documentos?.psicotecnico === 'Concluído' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>{perfil?.documentos?.psicotecnico || 'Pendente'}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-300">Documentos Legais</span>
                      <span className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                        perfil?.documentos?.documentosLegais === 'Concluído' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>{perfil?.documentos?.documentosLegais || 'Pendente'}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* 2. Financeiro Card */}
            {perfil?.financeiro && (
              <div className="glass p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-gray-900/30 to-blue-900/10">
                <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-500" />
                  Painel Financeiro
                </h3>

                <div className="space-y-4">
                  
                  {/* Progress bar */}
                  <div>
                    <div className="flex justify-between items-center mb-1 text-xs">
                      <span className="text-gray-400">Total Pago</span>
                      <span className="text-emerald-400 font-semibold">{perfil.financeiro.progressoPercent}%</span>
                    </div>
                    <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{ width: `${perfil.financeiro.progressoPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Pricing grid */}
                  <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs">
                    <div>
                      <span className="text-gray-400 block">Total do Curso</span>
                      <span className="font-bold text-white">R$ {perfil.financeiro.valorTotal.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Valor Pago</span>
                      <span className="font-bold text-emerald-400">R$ {perfil.financeiro.valorPago.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Falta Pagar</span>
                      <span className="font-bold text-red-400">R$ {perfil.financeiro.faltaPagar.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Próxima Parcela</span>
                      <span className="font-bold text-white flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-gray-500" /> {perfil.financeiro.proximaParcela}
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* 3. Simulado Action Widget */}
            {!showAdminUI && (
              <div className="glass-accent p-6 rounded-2xl border border-blue-500/20 text-left space-y-4 relative overflow-hidden">
                <div className="absolute top-[-20%] right-[-20%] w-[10rem] h-[10rem] rounded-full bg-blue-500/10 blur-[40px] pointer-events-none"></div>
                <h4 className="text-white font-bold text-sm m-0">⚡ Treino Rápido DETRAN</h4>
                <p className="text-xs text-gray-300">
                  Pronto para testar seus conhecimentos? O simulado possui tempo controlado e correção automática imediata.
                </p>
                <button
                  onClick={() => onNavigate('simulado')}
                  className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-medium py-2 rounded-xl text-xs transition-all flex items-center justify-center gap-1"
                >
                  Criar Simulado Personalizado <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

          </div>

        </div>

      </main>
    </div>
  );
}

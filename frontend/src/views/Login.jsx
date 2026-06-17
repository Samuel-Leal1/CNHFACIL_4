import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Mail, Lock, User, FileText, ArrowRight, Activity } from 'lucide-react';

export default function Login() {
  const { login, registro, error: authError } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [cargo, setCargo] = useState('ALUNO');
  const [categoria, setCategoria] = useState('B');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(email, senha);
      } else {
        if (!nome || !email || !senha) {
          throw new Error('Todos os campos obrigatórios devem ser preenchidos.');
        }
        await registro(nome, email, senha, cargo, categoria);
        setSuccessMsg('Conta criada com sucesso! Faça login abaixo.');
        setIsLogin(true);
        // Limpa campos de registro
        setNome('');
      }
    } catch (err) {
      setLocalError(err.message || 'Ocorreu um erro.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-brand-dark overflow-hidden relative font-sans text-gray-200">
      
      {/* Background circles for premium styling */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] rounded-full bg-blue-600/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none"></div>

      {/* Left Column: Form Card */}
      <div className="lg:col-span-5 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 z-10">
        <div className="w-full max-w-md mx-auto">
          
          {/* Logo / Title */}
          <div className="flex items-center gap-3 mb-8 animate-fade-in">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white m-0">CNH<span className="text-blue-500">Fácil</span></h1>
              <p className="text-xs text-gray-400">Sua aprovação no DETRAN começa aqui</p>
            </div>
          </div>

          {/* Form container */}
          <div className="glass p-8 rounded-2xl shadow-2xl shadow-black/40 border border-white/5 animate-fade-in">
            <h2 className="text-xl font-semibold text-white mb-2">
              {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              {isLogin ? 'Acesse seu painel do aluno e treine para o exame.' : 'Cadastre-se para iniciar seus estudos e simulados.'}
            </p>

            {/* Error or Success Alerts */}
            {(localError || authError) && (
              <div className="p-3 mb-4 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 text-sm animate-fade-in">
                {localError || authError}
              </div>
            )}
            {successMsg && (
              <div className="p-3 mb-4 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm animate-fade-in">
                {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Name (Only Register) */}
              {!isLogin && (
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Nome Completo</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      placeholder="Ex: Maria Silva"
                      required
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="w-full bg-gray-900/50 border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">E-mail</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <input
                    type="email"
                    placeholder="aluno@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-900/50 border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Senha</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <input
                    type="password"
                    placeholder="******"
                    required
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="w-full bg-gray-900/50 border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Extras (Only Register) */}
              {!isLogin && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Categoria CNH</label>
                    <select
                      value={categoria}
                      onChange={(e) => setCategoria(e.target.value)}
                      className="w-full bg-gray-900/50 border border-gray-800 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-all duration-200"
                    >
                      <option value="A">Moto (A)</option>
                      <option value="B">Carro (B)</option>
                      <option value="AB">Carro/Moto (A e B)</option>
                      <option value="C">Caminhão (C)</option>
                      <option value="D">Ônibus (D)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Perfil</label>
                    <select
                      value={cargo}
                      onChange={(e) => setCargo(e.target.value)}
                      className="w-full bg-gray-900/50 border border-gray-800 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-all duration-200"
                    >
                      <option value="ALUNO">Aluno</option>
                      <option value="INSTRUTOR">Instrutor</option>
                      <option value="ADMIN">Administrador</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Aguardando...' : isLogin ? 'Entrar na Plataforma' : 'Criar minha Conta'}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            {/* Toggle Login/Register */}
            <div className="mt-6 text-center text-sm text-gray-400">
              {isLogin ? (
                <span>Não tem uma conta?{' '}
                  <button onClick={() => setIsLogin(false)} className="text-blue-500 hover:underline font-semibold focus:outline-none">
                    Registre-se
                  </button>
                </span>
              ) : (
                <span>Já possui registro?{' '}
                  <button onClick={() => setIsLogin(true)} className="text-blue-500 hover:underline font-semibold focus:outline-none">
                    Conecte-se
                  </button>
                </span>
              )}
            </div>

          </div>

          {/* Prompt standard login account for fast testing */}
          <div className="mt-8 p-4 rounded-xl bg-gray-900/40 border border-gray-800 text-xs text-gray-400 animate-fade-in">
            <p className="font-semibold text-gray-300 mb-1">💡 Credenciais Rápidas de Teste:</p>
            <div className="flex flex-col gap-1 mt-2">
              <div><span className="text-gray-300 font-medium">Aluno:</span> duda.aluno@email.com <span className="opacity-70">(Senha: 12345678)</span></div>
              <div><span className="text-gray-300 font-medium">Admin:</span> admin@cnhfacil.com <span className="opacity-70">(Senha: 123456)</span></div>
            </div>
          </div>

        </div>
      </div>

      {/* Right Column: Hero Art Panel */}
      <div className="hidden lg:col-span-7 lg:flex flex-col justify-between p-12 bg-gradient-to-br from-blue-900/20 via-indigo-950/20 to-black relative border-l border-white/5">
        
        {/* Glow behind stats graphic */}
        <div className="absolute top-[30%] left-[20%] w-[30rem] h-[30rem] rounded-full bg-blue-500/5 blur-[80px] pointer-events-none"></div>

        <div className="flex justify-between items-center z-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
            Versão 2026.1
          </span>
          <span className="text-sm text-gray-400 flex items-center gap-1">
            <Activity className="w-4 h-4 text-emerald-400" /> Servidores 100% online
          </span>
        </div>

        <div className="max-w-xl my-auto text-left z-10 animate-slide-in">
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Estude com Inteligência,<br />
            Conquiste sua CNH Sem Complicação.
          </h2>
          <p className="text-lg text-gray-300 mb-8 font-light">
            Monitore seu progresso financeiro e teórico, visualize a frota de veículos disponíveis da autoescola e realize simulados dinâmicos e atualizados com o gabarito oficial do DETRAN.
          </p>

          {/* Quick stats items */}
          <div className="grid grid-cols-3 gap-6">
            <div className="glass p-4 rounded-xl border border-white/5">
              <div className="text-2xl font-bold text-white">70%+</div>
              <div className="text-xs text-gray-400">Nota Mínima do DETRAN</div>
            </div>
            <div className="glass p-4 rounded-xl border border-white/5">
              <div className="text-2xl font-bold text-blue-400">100%</div>
              <div className="text-xs text-gray-400">Gabarito Comentado</div>
            </div>
            <div className="glass p-4 rounded-xl border border-white/5">
              <div className="text-2xl font-bold text-emerald-400">Instante</div>
              <div className="text-xs text-gray-400">Correção no Servidor</div>
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-500 z-10">
          © {new Date().getFullYear()} CNHFácil Autoescola Digital. Desenvolvido para máxima portabilidade.
        </div>
      </div>

    </div>
  );
}

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { cadastrar } from '../../services/api'

const LOGO = 'https://i.postimg.cc/zbX1SvHr/image.png'

const CATEGORIAS_CNH = ['A', 'B', 'AB', 'C', 'D', 'E']

export default function Cadastro() {
  const navigate = useNavigate()
  const [role, setRole] = useState('aluno')          // 'aluno' | 'instrutor'
  const [form, setForm] = useState({
    nome: '', cpf: '', email: '', senha: '', confirmarSenha: '',
    credencial: '', categoriaCnh: 'B', valorAula: '',
  })
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')

    if (form.senha !== form.confirmarSenha) {
      setErro('As senhas não coincidem.')
      return
    }

    if (role === 'instrutor') {
      if (!form.credencial.trim()) {
        setErro('Informe o número de credencial.')
        return
      }
      if (!form.valorAula || Number(form.valorAula) <= 0) {
        setErro('Informe um valor de aula válido.')
        return
      }
    }

    setLoading(true)
    try {
      await cadastrar({
        nome: form.nome,
        cpf: form.cpf,
        email: form.email,
        senha: form.senha,
        cargo: role,
        // campos específicos de instrutor
        credencial: role === 'instrutor' ? form.credencial : undefined,
        categoriaCnh: role === 'instrutor' ? form.categoriaCnh : undefined,
        valorAula: role === 'instrutor' ? form.valorAula : undefined,
      })
      navigate('/login')
    } catch (err) {
      setErro(err.response?.data?.erro || err.response?.data?.mensagem || 'Erro ao realizar cadastro.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-split">
      {/* ── Painel esquerdo ── */}
      <div className="auth-left">
        <img src={LOGO} alt="CNH Fácil" className="auth-left-logo" />
        <p className="auth-left-tagline">Comece sua jornada rumo à aprovação</p>
        <p className="auth-left-sub">
          Crie sua conta em minutos e tenha acesso a todo o conteúdo de preparação para a CNH.
        </p>
        <div className="auth-features">
          <div className="auth-feature-item">
            <div className="auth-feature-icon">✅</div>
            <span>Cadastro gratuito e sem burocracia</span>
          </div>
          <div className="auth-feature-item">
            <div className="auth-feature-icon">📋</div>
            <span>50+ questões por tópico do DETRAN</span>
          </div>
          <div className="auth-feature-item">
            <div className="auth-feature-icon">🏆</div>
            <span>Acompanhe sua evolução e taxa de acertos</span>
          </div>
          <div className="auth-feature-item">
            <div className="auth-feature-icon">🧑‍🏫</div>
            <span>Instrutores credenciados disponíveis</span>
          </div>
        </div>
      </div>

      {/* ── Painel direito ── */}
      <div className="auth-right">
        <div className="auth-box">
          <h2 className="auth-box-title">Criar conta</h2>
          <p className="auth-box-sub">Escolha seu perfil e preencha os dados abaixo.</p>

          {/* Seletor de perfil */}
          <div className="role-toggle">
            <button
              type="button"
              className={`role-btn${role === 'aluno' ? ' active' : ''}`}
              onClick={() => setRole('aluno')}
            >
              🎓 Sou Aluno
            </button>
            <button
              type="button"
              className={`role-btn${role === 'instrutor' ? ' active' : ''}`}
              onClick={() => setRole('instrutor')}
            >
              🧑‍🏫 Sou Instrutor
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {/* Campos comuns */}
            <div className="form-group">
              <label>Nome Completo</label>
              <input
                className="form-control"
                name="nome"
                placeholder="Ex: João da Silva"
                value={form.nome}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>CPF</label>
                <input
                  className="form-control"
                  name="cpf"
                  placeholder="000.000.000-00"
                  value={form.cpf}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>E-mail</label>
                <input
                  className="form-control"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Senha</label>
                <input
                  className="form-control"
                  name="senha"
                  type="password"
                  placeholder="Crie uma senha"
                  value={form.senha}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirmar Senha</label>
                <input
                  className="form-control"
                  name="confirmarSenha"
                  type="password"
                  placeholder="Repita a senha"
                  value={form.confirmarSenha}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Campos exclusivos de instrutor */}
            {role === 'instrutor' && (
              <>
                <div
                  style={{
                    borderTop: '1px solid #e2e8f0',
                    paddingTop: 12,
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '.5px',
                    color: '#64748b',
                    textTransform: 'uppercase',
                  }}
                >
                  Dados Profissionais
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Nº de Credencial</label>
                    <input
                      className="form-control"
                      name="credencial"
                      placeholder="Ex: DETRAN-12345"
                      value={form.credencial}
                      onChange={handleChange}
                      required={role === 'instrutor'}
                    />
                  </div>
                  <div className="form-group">
                    <label>Categoria CNH</label>
                    <select
                      className="form-control"
                      name="categoriaCnh"
                      value={form.categoriaCnh}
                      onChange={handleChange}
                    >
                      {CATEGORIAS_CNH.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Valor da Aula (R$)</label>
                  <input
                    className="form-control"
                    name="valorAula"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Ex: 120.00"
                    value={form.valorAula}
                    onChange={handleChange}
                    required={role === 'instrutor'}
                  />
                </div>
              </>
            )}

            {erro && (
              <p style={{ color: '#dc2626', fontSize: 13, textAlign: 'center', margin: 0 }}>
                {erro}
              </p>
            )}

            <button className="btn-primary" type="submit" disabled={loading}>
              {loading
                ? 'Cadastrando...'
                : role === 'instrutor'
                  ? 'Cadastrar como Instrutor'
                  : 'Criar Minha Conta'}
            </button>
          </form>

          <div className="auth-footer">
            Já tem conta?{' '}
            <Link to="/login">Faça login aqui</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

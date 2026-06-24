import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { login as apiLogin } from '../../services/api'

const LOGO = 'https://i.postimg.cc/zbX1SvHr/image.png'

export default function Login() {
  const [role, setRole] = useState('aluno')       // 'aluno' | 'instrutor'
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setLoading(true)
    try {
      const res = await apiLogin(email, senha)
      const { token, usuario } = res.data

      // Verifica se o perfil selecionado bate com a conta
      const nivelReal = (usuario.usuario_nivel_acesso || '').toLowerCase()
      const nivelEsperado = role === 'instrutor' ? 'instrutor' : 'aluno'

      if (nivelReal !== 'admin' && nivelReal !== nivelEsperado) {
        const msg = role === 'instrutor'
          ? 'Esta conta não está cadastrada como instrutor.'
          : 'Esta conta não está cadastrada como aluno.'
        setErro(msg)
        setLoading(false)
        return
      }

      login(usuario, token)
      navigate('/inicio')
    } catch (err) {
      setErro(err.response?.data?.erro || err.response?.data?.mensagem || 'E-mail ou senha inválidos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-split">
      {/* ── Painel esquerdo ── */}
      <div className="auth-left">
        <img src={LOGO} alt="CNH Fácil" className="auth-left-logo" />
        <p className="auth-left-tagline">Sua CNH mais perto do que você imagina</p>
        <p className="auth-left-sub">
          Simulados, aulas e instrutores credenciados em uma única plataforma.
        </p>
        <div className="auth-features">
          <div className="auth-feature-item">
            <div className="auth-feature-icon">📋</div>
            <span>Simulados idênticos à prova do DETRAN</span>
          </div>
          <div className="auth-feature-item">
            <div className="auth-feature-icon">🎓</div>
            <span>Aulas teóricas em vídeo e texto</span>
          </div>
          <div className="auth-feature-item">
            <div className="auth-feature-icon">📊</div>
            <span>Acompanhe seu desempenho em tempo real</span>
          </div>
          <div className="auth-feature-item">
            <div className="auth-feature-icon">🧑‍🏫</div>
            <span>Conecte-se com instrutores credenciados</span>
          </div>
        </div>
      </div>

      {/* ── Painel direito ── */}
      <div className="auth-right">
        <div className="auth-box">
          <h2 className="auth-box-title">Bem-vindo de volta!</h2>
          <p className="auth-box-sub">Selecione seu perfil e entre com sua conta.</p>

          {/* Seletor de perfil */}
          <div className="role-toggle">
            <button
              type="button"
              className={`role-btn${role === 'aluno' ? ' active' : ''}`}
              onClick={() => { setRole('aluno'); setErro('') }}
            >
              🎓 Sou Aluno
            </button>
            <button
              type="button"
              className={`role-btn${role === 'instrutor' ? ' active' : ''}`}
              onClick={() => { setRole('instrutor'); setErro('') }}
            >
              🧑‍🏫 Sou Instrutor
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>E-mail</label>
              <input
                className="form-control"
                type="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <div className="form-group-header">
                <label>Senha</label>
                <a href="#">Esqueceu a senha?</a>
              </div>
              <input
                className="form-control"
                type="password"
                placeholder="Digite sua senha"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                required
              />
            </div>

            {erro && (
              <p style={{ color: '#dc2626', fontSize: 13, textAlign: 'center', margin: 0 }}>
                {erro}
              </p>
            )}

            <button className="btn-primary" type="submit" disabled={loading}>
              {loading
                ? 'Entrando...'
                : role === 'instrutor'
                  ? 'Entrar como Instrutor'
                  : 'Entrar como Aluno'}
            </button>
          </form>

          <div className="auth-footer">
            Ainda não tem conta?{' '}
            <Link to="/cadastro">Cadastre-se aqui</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

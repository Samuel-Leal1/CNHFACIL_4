import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { login as apiLogin } from '../../services/api'

export default function Login() {
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
      login(usuario, token)
      navigate('/inicio')
    } catch (err) {
      setErro(err.response?.data?.mensagem || 'Email ou senha inválidos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-logo">
          <div style={{ fontSize: 36 }}>🚗</div>
          <div className="auth-logo-text"><span>CNH</span> <em>Fácil</em></div>
        </div>
        <p className="auth-subtitle">Olá, futuro motorista!</p>

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
            <p style={{ color: '#dc2626', fontSize: 13, textAlign: 'center' }}>{erro}</p>
          )}

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar no Sistema'}
          </button>
        </form>

        <div className="auth-footer">
          Ainda não é aluno? <Link to="/cadastro">Cadastre-se aqui</Link>
        </div>
      </div>
    </div>
  )
}

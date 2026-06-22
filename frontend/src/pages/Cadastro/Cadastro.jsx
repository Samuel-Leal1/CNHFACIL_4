import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { cadastrar } from '../../services/api'

export default function Cadastro() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ nome: '', cpf: '', email: '', senha: '', confirmarSenha: '' })
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
    setLoading(true)
    try {
      await cadastrar({ nome: form.nome, cpf: form.cpf, email: form.email, senha: form.senha })
      navigate('/login')
    } catch (err) {
      setErro(err.response?.data?.erro || err.response?.data?.mensagem || 'Erro ao realizar cadastro.')
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
        <p className="auth-subtitle">Crie sua conta para começar a estudar</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome Completo</label>
            <input className="form-control" name="nome" placeholder="Ex: João da Silva"
              value={form.nome} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>CPF</label>
            <input className="form-control" name="cpf" placeholder="000.000.000-00"
              value={form.cpf} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>E-mail</label>
            <input className="form-control" name="email" type="email" placeholder="Digite seu melhor e-mail"
              value={form.email} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Senha</label>
              <input className="form-control" name="senha" type="password" placeholder="Crie uma senha"
                value={form.senha} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Confirmar Senha</label>
              <input className="form-control" name="confirmarSenha" type="password" placeholder="Repita a senha"
                value={form.confirmarSenha} onChange={handleChange} required />
            </div>
          </div>

          {erro && <p style={{ color: '#dc2626', fontSize: 13, textAlign: 'center' }}>{erro}</p>}

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Realizar Cadastro'}
          </button>
        </form>

        <div className="auth-footer">
          Já é aluno da autoescola? <Link to="/login">Faça login aqui</Link>
        </div>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import Topbar from '../../components/Topbar'
import { getPerfil, updatePerfil } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

function initials(name = '') {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

export default function Perfil() {
  const { user } = useAuth()
  const [form, setForm] = useState({
    nome: '', email: '', cpf: '', celular: '', novaSenha: '', confirmarSenha: ''
  })
  const [autoescola, setAutoescola] = useState(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    getPerfil().then(r => {
      const p = r.data
      setForm(f => ({
        ...f,
        nome: p.nome || '',
        email: p.email || '',
        cpf: p.cpf || '',
        celular: p.celular || '',
      }))
      setAutoescola(p.autoescola || null)
    }).catch(() => {
      // fallback do contexto
      setForm(f => ({
        ...f,
        nome: user?.nome || '',
        email: user?.email || '',
        cpf: user?.cpf || '',
      }))
    })
  }, [])

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSave(e) {
    e.preventDefault()
    await updatePerfil(form).catch(() => {})
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const nome = form.nome || user?.nome || 'Usuário'

  return (
    <>
      <Topbar title="Meu Perfil" />
      <div className="page-content">
        <div className="perfil-layout">
          {/* Card lateral */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="perfil-card">
              <div className="perfil-avatar">{initials(nome)}</div>
              <div>
                <div className="perfil-name">{nome}</div>
                <div className="perfil-id">Aluno ID: #{user?.id || '849.204'}</div>
                <div style={{ marginTop: 8 }}>
                  <span className="perfil-cat">CATEGORIA: A E B (CARRO/MOTO)</span>
                </div>
              </div>

              {autoescola && (
                <div className="autoescola-info">
                  <div className="autoescola-title">AUTOESCOLA VINCULADA</div>
                  <div className="autoescola-item"><span>🏢</span> <span><strong>Nome:</strong> {autoescola.nome}</span></div>
                  <div className="autoescola-item"><span>📍</span> <span><strong>Unidade:</strong> {autoescola.unidade}</span></div>
                  <div className="autoescola-item"><span>📞</span> <span><strong>Contato:</strong> {autoescola.contato}</span></div>
                </div>
              )}
            </div>
          </div>

          {/* Formulário */}
          <div className="perfil-form-card">
            <form onSubmit={handleSave}>
              <div className="form-section-title">Informações Cadastrais</div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Nome Completo</label>
                  <input className="form-control" name="nome" value={form.nome} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>E-mail</label>
                  <input className="form-control" name="email" type="email" value={form.email} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>CPF</label>
                  <input className="form-control" name="cpf" value={form.cpf} disabled />
                </div>
                <div className="form-group">
                  <label>Celular/WhatsApp</label>
                  <input className="form-control" name="celular" value={form.celular} onChange={handleChange} />
                </div>
              </div>

              <div className="form-section-title">Segurança</div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Nova Senha</label>
                  <input className="form-control" name="novaSenha" type="password"
                    placeholder="••••••••" value={form.novaSenha} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Confirmar Nova Senha</label>
                  <input className="form-control" name="confirmarSenha" type="password"
                    placeholder="••••••••" value={form.confirmarSenha} onChange={handleChange} />
                </div>
              </div>

              <button className="btn-save" type="submit">
                {saved ? 'SALVO ✓' : 'SALVAR ALTERAÇÕES'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

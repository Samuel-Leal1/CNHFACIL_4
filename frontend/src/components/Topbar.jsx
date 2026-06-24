import { useAuth } from '../context/AuthContext'

function initials(name = '') {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

export default function Topbar({ title }) {
  const { user } = useAuth()
  const nome = user?.usuario_nome || user?.nome || user?.name || 'Usuário'
  const perfil = user?.perfil === 'admin' ? 'Gestor Geral' : 'Aluno'

  return (
    <div className="topbar">
      <h1 className="topbar-title">{title}</h1>
      <div className="topbar-user">
        <div className="user-info">
          <div className="user-name">{nome.split(' ')[0]}</div>
          <div className="user-role">{perfil}</div>
        </div>
        <div className="avatar">{initials(nome)}</div>
      </div>
    </div>
  )
}

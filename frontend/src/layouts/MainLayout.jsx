import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { to: '/inicio',      label: 'Início',        icon: '🏠' },
  { to: '/perfil',      label: 'Perfil',         icon: '👤' },
  { to: '/cursos',      label: 'Cursos',         icon: '🎓' },
  { to: '/simulados',   label: 'Simulados',      icon: '📋' },
  { to: '/instrutores', label: 'Instrutores',    icon: '🧑‍🏫' },
  { to: '/desempenho',  label: 'Meu desempenho', icon: '📊' },
]

function initials(name = '') {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

export default function MainLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-mark">
            <div className="logo-icon">🚗</div>
            <div><span>CNH</span> <em>Fácil</em></div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}

          {user?.perfil === 'admin' && (
            <NavLink
              to="/admin"
              className={({ isActive }) => `nav-item admin${isActive ? ' active' : ''}`}
            >
              <span className="nav-icon">⚙️</span>
              Admin/Config
            </NavLink>
          )}

          {/* Logout no fundo */}
          <button
            onClick={handleLogout}
            style={{ marginTop: 'auto', color: '#dc2626' }}
            className="nav-item"
          >
            <span className="nav-icon">🚪</span>
            Sair
          </button>
        </nav>
      </aside>

      <div className="main">
        <Outlet />
      </div>
    </div>
  )
}

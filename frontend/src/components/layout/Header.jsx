import { NavLink } from 'react-router-dom';

function Header() {
  return (
    <header className="site-header">
      <NavLink className="brand" to="/">
        CNH Facil
      </NavLink>

      <nav className="site-nav" aria-label="Navegacao principal">
        <NavLink to="/">Inicio</NavLink>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/login">Login</NavLink>
      </nav>
    </header>
  );
}

export default Header;

import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <main className="auth-page">
      <section className="not-found">
        <p className="eyebrow">404</p>
        <h1>Pagina nao encontrada</h1>
        <Link to="/">Voltar para o inicio</Link>
      </section>
    </main>
  );
}

export default NotFound;

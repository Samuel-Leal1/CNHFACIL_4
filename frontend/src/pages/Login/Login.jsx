import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Button from '../../components/ui/Button.jsx';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const response = await api.post('/auth/login', {
        email,
        senha,
      });

      const { token, usuario } = response.data;

      // Salvar token e dados do usuário
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(usuario));

      // Redirecionar para dashboard
      navigate('/dashboard');
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao fazer login. Tente novamente.');
      console.error('Erro no login:', err);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <main className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <div>
          <p className="eyebrow">Acesso</p>
          <h1>Entrar</h1>
        </div>

        {erro && <div className="erro-message" style={{ color: 'red', marginBottom: '1rem' }}>{erro}</div>}

        <label>
          Email
          <input 
            type="email" 
            name="email" 
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Senha
          <input 
            type="password" 
            name="password" 
            autoComplete="current-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </label>

        <Button type="submit" disabled={carregando}>
          {carregando ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>
    </main>
  );
}

export default Login;

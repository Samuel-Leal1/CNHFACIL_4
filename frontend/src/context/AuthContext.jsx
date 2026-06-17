import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Carrega o usuário e token salvos no localStorage ao inicializar
    const storedToken = localStorage.getItem('cnhfacil_token');
    const storedUser = localStorage.getItem('cnhfacil_usuario');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);

    // Escuta evento de sessão expirada (do interceptor da API)
    const handleSessionExpired = () => {
      logout();
      alert('Sua sessão expirou. Por favor, faça login novamente.');
    };

    window.addEventListener('auth_session_expired', handleSessionExpired);
    return () => {
      window.removeEventListener('auth_session_expired', handleSessionExpired);
    };
  }, []);

  const login = async (email, senha) => {
    setError(null);
    try {
      const response = await api.post('/auth/login', { email, senha });
      const { token: jwtToken, usuario } = response.data;

      localStorage.setItem('cnhfacil_token', jwtToken);
      localStorage.setItem('cnhfacil_usuario', JSON.stringify(usuario));

      setToken(jwtToken);
      setUser(usuario);
      return usuario;
    } catch (err) {
      const msg = err.response?.data?.erro || 'Falha na autenticação. Verifique suas credenciais.';
      setError(msg);
      throw new Error(msg);
    }
  };

  const registro = async (nome, email, senha, cargo = 'ALUNO', categoria = 'B') => {
    setError(null);
    try {
      const response = await api.post('/auth/registro', {
        nome,
        email,
        senha,
        cargo,
        categoria,
      });
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.erro || 'Erro ao criar conta. Tente outro e-mail.';
      setError(msg);
      throw new Error(msg);
    }
  };

  const logout = () => {
    localStorage.removeItem('cnhfacil_token');
    localStorage.removeItem('cnhfacil_usuario');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        registro,
        logout,
        isAuthenticated: !!token,
        isAdminOrInstructor: user?.cargo === 'ADMIN' || user?.cargo === 'INSTRUTOR',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

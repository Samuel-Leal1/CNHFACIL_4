import axios from 'axios';

// Criação da instância do Axios conectada com a rota base /api do backend (através do proxy do Vite)
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token JWT automaticamente em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cnhfacil_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de resposta para tratar erros globais (ex: token inválido/expirado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Se receber 401 não autorizado, podemos forçar o logout limpando o localStorage
      localStorage.removeItem('cnhfacil_token');
      localStorage.removeItem('cnhfacil_usuario');
      // Apenas dispara um evento personalizado ou deixa o AuthContext tratar
      window.dispatchEvent(new Event('auth_session_expired'));
    }
    return Promise.reject(error);
  }
);

export default api;

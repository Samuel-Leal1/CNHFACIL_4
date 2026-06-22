import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
})

// Injeta token em todas as requisições
api.interceptors.request.use(config => {
  const token = localStorage.getItem('cnhfacil_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Redireciona para login se 401
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('cnhfacil_token')
      localStorage.removeItem('cnhfacil_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ---- Auth ----
export const login = (email, senha) =>
  api.post('/auth/login', { email, senha })

export const cadastrar = (dados) =>
  api.post('/auth/cadastro', dados)

// ---- Perfil ----
export const getPerfil = () =>
  api.get('/perfil')

export const updatePerfil = (dados) =>
  api.put('/perfil', dados)

// ---- Dashboard ----
export const getDashboard = () =>
  api.get('/perfil/dashboard')

// ---- Cursos / Aulas ----
export const getCursos = () =>
  api.get('/aulas/cursos')

export const getAulas = (cursoId) =>
  api.get(`/aulas/curso/${cursoId}`)

export const concluirAula = (aulaId) =>
  api.post(`/aulas/${aulaId}/concluir`)

// ---- Simulados ----
export const getSimulados = () =>
  api.get('/simulado')

export const iniciarSimulado = (tipo, materia) =>
  api.post('/simulado/iniciar', { tipo, materia })

export const responderQuestao = (simuladoId, questaoId, resposta) =>
  api.post(`/simulado/${simuladoId}/responder`, { questaoId, resposta })

export const finalizarSimulado = (simuladoId) =>
  api.post(`/simulado/${simuladoId}/finalizar`)

// ---- Desempenho ----
export const getDesempenho = () =>
  api.get('/simulado/desempenho')

// ---- Questões ----
export const getQuestoes = (materia) =>
  api.get('/questoes', { params: { materia } })

// ---- Veículos / Instrutores ----
export const getVeiculos = () =>
  api.get('/veiculo')

// ---- Admin ----
export const getAlunos = () =>
  api.get('/admin/alunos')

export default api

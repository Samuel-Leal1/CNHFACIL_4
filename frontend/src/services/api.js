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
  api.post('/auth/registro', dados)

// ---- Perfil ----
export const getPerfil = () =>
  api.get('/perfil')

export const updatePerfil = (dados) =>
  api.put('/perfil', dados)

// ---- Dashboard ----
export const getDashboard = () =>
  api.get('/perfil/dashboard')

// ---- Cursos / Aulas ----
// Backend expõe apenas GET /api/aulas que retorna resumo dos módulos.
// Aqui adaptamos para derivar cursos/aulas do retorno disponível.
export const getCursos = async () => {
  const res = await api.get('/aulas')
  return {
    ...res,
    data: res.data.map(c => ({
      id: c.id,
      nome: c.titulo,
      icon: c.icone || c.icon || '📚',
      aulas: c.aulasConcluidas ?? c.aulas ?? 0,
      totalAulas: c.aulasTotais ?? c.totalAulas ?? 5,
      progresso: c.progresso ?? 0,
    })),
  }
}

export const getAulas = async (cursoId) => {
  const res = await api.get('/aulas')
  const curso = res.data.find(c => String(c.id) === String(cursoId))
  const totais = curso?.aulasTotais ?? curso?.totalAulas ?? 5
  const concluidas = curso?.aulasConcluidas ?? curso?.aulas ?? Math.floor(totais / 2)
  const aulas = Array.from({ length: totais }).map((_, i) => ({
    id: i + 1,
    titulo: `${i + 1}. Aula ${i + 1}`,
    status: i < concluidas ? 'done' : (i === concluidas ? 'current' : 'locked'),
  }))
  return { ...res, data: aulas }
}

// Conclusão de aula não tem endpoint no backend — simulamos localmente.
export const concluirAula = async (aulaId) => {
  return Promise.resolve({ data: { ok: true } })
}

// ---- Simulados ----
export const getSimulados = () =>
  api.get('/simulado')

// Mapeia o formato do backend para o formato que o frontend (Questoes.jsx) espera
const mapearQuestoes = (questoes = []) =>
  questoes.map(q => ({
    id: q.id ?? q.questao_id,
    materia: q.theme ?? q.questao_categoria ?? 'Geral',
    enunciado: q.text ?? q.questao_enunciado,
    opcoes: Array.isArray(q.options)
      ? q.options.map((texto, i) => ({ letra: ['A','B','C','D'][i], texto }))
      : [
          { letra: 'A', texto: q.questao_alternativa_a },
          { letra: 'B', texto: q.questao_alternativa_b },
          { letra: 'C', texto: q.questao_alternativa_c },
          { letra: 'D', texto: q.questao_alternativa_d },
        ],
    correta: q.correta ?? null, // backend não expõe o gabarito, fica null
  }))

export const iniciarSimulado = async (tipo, materia) => {
  const res = await api.post('/simulado/iniciar', { tipo, materia })
  return {
    ...res,
    data: {
      ...res.data,
      id: res.data.simuladoId ?? res.data.id,
      questoes: mapearQuestoes(res.data.questoes),
    },
  }
}

// Backend não possui rota individual para respostas por questão;
// responderQuestao é um noop local para evitar 404 no clique.
export const responderQuestao = (simuladoId, questaoId, resposta) =>
  Promise.resolve({ data: { ok: true } })

// Finalizar simulado: o backend espera um array de respostas em { questionId, selectedOption }
export const finalizarSimulado = (simuladoId, respostas = {}) => {
  const rows = Object.entries(respostas).map(([questionId, letra]) => ({
    questionId: Number(questionId),
    selectedOption: ['A','B','C','D'].indexOf(letra),
  }))
  return api.post('/simulado/finalizar', { respostas: rows })
}

// ---- Desempenho ----
export const getDesempenho = () =>
  api.get('/desempenho')

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
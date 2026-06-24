import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Topbar from '../../components/Topbar'
import { getDesempenho } from '../../services/api'

const MATERIAS = [
  { id: 'legislacao',  nome: 'Legislação de Trânsito', icon: '📋', questoes: 10, progresso: 80 },
  { id: 'defensiva',   nome: 'Direção Defensiva',       icon: '🛡️', questoes: 10, progresso: 40 },
  { id: 'socorros',    nome: 'Primeiros Socorros',       icon: '🩺', questoes: 10, progresso: 0  },
  { id: 'ambiente',    nome: 'Meio Ambiente e Cidadania',icon: '🌿', questoes: 10, progresso: 100},
  { id: 'mecanica',    nome: 'Mecânica Básica',          icon: '🔧', questoes: 10, progresso: 10 },
]

const normalizeString = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]/gi, '')
    .toLowerCase();

export default function Simulados() {
  const navigate = useNavigate()
  const [materias, setMaterias] = useState(MATERIAS)

  useEffect(() => {
    getDesempenho()
      .then(r => {
        const perf = r.data.desempenhoPorMateria || {}
        const perfNormalizado = Object.fromEntries(
          Object.entries(perf).map(([k, v]) => [normalizeString(k), v])
        )
        setMaterias(MATERIAS.map(m => {
          const real = perfNormalizado[normalizeString(m.nome)]
          return { ...m, progresso: real !== undefined ? real : m.progresso }
        }))
      })
      .catch(() => {})
  }, [])

  return (
    <>
      <Topbar title="Simulados Disponíveis" />
      <div className="page-content">
        {/* Hero */}
        <div className="simulados-hero">
          <div>
            <div className="simulados-hero-tag">RECOMENDADO</div>
            <h2>Simulado Geral Oficial</h2>
            <p>Treine com 30 questões sorteadas idênticas às da prova real do DETRAN. Tempo limite de 30 minutos.</p>
          </div>
          <button
            className="btn-iniciar"
            onClick={() => navigate('/questoes?materia=geral')}
          >
            INICIAR SIMULADO OFICIAL
          </button>
        </div>

        {/* Matérias */}
        <div className="section-title">Treinar por Matéria Específica</div>
        <div className="materias-grid">
          {materias.map(m => (
            <div className="materia-card" key={m.id}>
              <div className="materia-header">
                <span className="materia-name">{m.nome}</span>
                <span className="materia-icon">{m.icon}</span>
              </div>
              <div className="materia-count">{m.questoes} questões</div>
              <div className="materia-progress">
                <span>Progresso de acertos</span>
                <strong>{m.progresso}%</strong>
              </div>
              <div className="progress-bar-wrap">
                <div className="progress-bar-fill" style={{ width: `${m.progresso}%` }} />
              </div>
              <button
                className="btn-praticar"
                onClick={() => navigate(`/questoes?materia=${m.id}`)}
              >
                PRATICAR QUESTÕES
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

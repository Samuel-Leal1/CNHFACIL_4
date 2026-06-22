import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Topbar from '../../components/Topbar'
import { getCursos } from '../../services/api'

const MOCK = [
  { id: 1, nome: 'Legislação de Trânsito', icon: '⚖️', aulas: 12, totalAulas: 15, progresso: 80 },
  { id: 2, nome: 'Direção Defensiva',       icon: '⚠️', aulas: 6,  totalAulas: 10, progresso: 60 },
  { id: 3, nome: 'Noções de Mecânica',      icon: '🔧', aulas: 1,  totalAulas: 5,  progresso: 20 },
]

export default function Cursos() {
  const [cursos, setCursos] = useState(MOCK)
  const navigate = useNavigate()

  useEffect(() => {
    getCursos().then(r => setCursos(r.data)).catch(() => {})
  }, [])

  return (
    <>
      <Topbar title="Meus Cursos e Aulas" />
      <div className="page-content">
        <p style={{ color: 'var(--gray-500)', fontSize: 13, marginBottom: 24 }}>
          Plataforma de Ensino Premium
        </p>
        <div className="courses-grid">
          {cursos.map(curso => (
            <div className="course-card" key={curso.id}>
              <div className="course-card-header">
                <span className="course-icon">{curso.icon}</span>
                <span className="course-aulas">{curso.aulas}/{curso.totalAulas} aulas</span>
              </div>
              <div className="course-name">{curso.nome}</div>
              <div className="progress-bar-wrap">
                <div className="progress-bar-fill" style={{ width: `${curso.progresso}%` }} />
              </div>
              <button
                className="btn-outline"
                onClick={() => navigate(`/aulas/${curso.id}`)}
              >
                Acessar Aulas →
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

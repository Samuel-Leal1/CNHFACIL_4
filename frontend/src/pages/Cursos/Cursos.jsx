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
    // Carrega cursos inicialmente
    getCursos().then(r => setCursos(r.data)).catch(() => {})

    // Ouve evento global disparado quando uma aula é concluída
    const handler = (e) => {
      try {
        const detail = e?.detail || null
        if (detail && Array.isArray(detail.cursos)) {
          // Se o evento trouxe a lista completa, substitui diretamente
          setCursos(detail.cursos)
          return
        }
        if (detail && typeof detail.cursoId === 'number' && detail.concluidasCount != null) {
          // Atualiza somente o curso afetado para resposta instantânea
          setCursos(prev => prev.map(c => {
            if (Number(c.id) === Number(detail.cursoId)) {
              const total = Number(c.totalAulas) || 1
              const aulas = Number(detail.concluidasCount)
              const progresso = total > 0 ? Math.round((aulas / total) * 100) : 0
              return { ...c, aulas, progresso }
            }
            return c
          }))
        } else {
          // fallback: recarrega do backend
          getCursos().then(r => setCursos(r.data)).catch(() => {})
        }
      } catch (err) {
        console.warn('Erro ao tratar evento aulaConcluida', err)
        getCursos().then(r => setCursos(r.data)).catch(() => {})
      }
    }

    window.addEventListener('aulaConcluida', handler)
    return () => window.removeEventListener('aulaConcluida', handler)
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

import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Topbar from '../../components/Topbar'
import { getAulas, concluirAula } from '../../services/api'

const MOCK_AULAS = [
  { id: 1, titulo: '1. Posicionamento preventivo', status: 'done' },
  { id: 2, titulo: '2. Condições adversas',        status: 'current' },
  { id: 3, titulo: '3. Ações corretivas',           status: 'locked' },
]

export default function Aulas() {
  const { cursoId } = useParams()
  const navigate = useNavigate()
  const [aulas, setAulas] = useState(MOCK_AULAS)
  const [atual, setAtual] = useState(MOCK_AULAS[1])

  useEffect(() => {
    if (cursoId) {
      getAulas(cursoId).then(r => {
        const lista = r.data
        setAulas(lista)
        setAtual(lista.find(a => a.status === 'current') || lista[0])
      }).catch(() => {})
    }
  }, [cursoId])

  async function handleConcluir() {
    try {
      await concluirAula(atual.id)
      setAulas(prev => prev.map(a => a.id === atual.id ? { ...a, status: 'done' } : a))
    } catch { }
  }

  return (
    <>
      <Topbar title="Vídeo-Aulas Teóricas" />
      <div className="page-content">
        <button className="btn-back" onClick={() => navigate('/cursos')}>
          ← Voltar
        </button>

        <div className="aulas-layout" style={{ marginTop: 12 }}>
          {/* Vídeo */}
          <div>
            <div className="video-player">
              <div className="video-play-btn">▶</div>
              <div className="video-caption">
                Assistindo agora: {atual?.titulo?.replace(/^\d+\.\s*/, 'Módulo X - Aula X: ')}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="aulas-sidebar-card">
            <div className="aulas-sidebar-title">Aulas do Módulo</div>
            {aulas.map(aula => (
              <div
                key={aula.id}
                className={`aula-item ${aula.status}`}
                onClick={() => aula.status !== 'locked' && setAtual(aula)}
              >
                {aula.status === 'done'    && '✅ '}
                {aula.status === 'current' && '▶ '}
                {aula.status === 'locked'  && '🔒 '}
                {aula.titulo}
              </div>
            ))}
            <button className="btn-concluir" onClick={handleConcluir}>
              CONCLUIR ESTA AULA
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

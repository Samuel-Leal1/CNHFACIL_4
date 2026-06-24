import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Topbar from '../../components/Topbar'
import { getAulas, concluirAula, getCursos } from '../../services/api'

export default function Aulas() {
  const { cursoId } = useParams()
  const navigate    = useNavigate()
  const [aulas, setAulas]   = useState([])
  const [atual, setAtual]   = useState(null)
  const [salvo, setSalvo]   = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!cursoId) return
    setLoading(true)
    getAulas(cursoId)
      .then(r => {
        const lista = r.data ?? []
        setAulas(lista)
        // Abre a primeira aula não concluída, ou a primeira da lista
        const abrir = lista.find(a => a.status === 'current' || a.status === 'available') || lista[0]
        setAtual(abrir || null)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [cursoId])

  async function handleConcluir() {
    if (!atual) return
    try {
      const res = await concluirAula(atual.id)

      // Recarrega a lista de aulas do backend para refletir o estado persistido
      const aulasRes = await getAulas(cursoId)
      const lista = aulasRes.data ?? []
      setAulas(lista)

      // Ajusta aula atual para a próxima não concluída (backend já marca statuses)
      const abrir = lista.find(a => a.status === 'current' || a.status === 'available') || lista.find(a => a.id === atual.id) || lista[0]
      setAtual(abrir || null)

      setSalvo(true)

      // Recarrega lista de cursos do backend e notifica a UI com o dataset completo
      try {
        const cursosRes = await getCursos()
        const detail = { cursos: cursosRes.data, cursoId: Number(cursoId), concluidasCount: res?.data?.concluidasCount ?? null }
        window.dispatchEvent(new CustomEvent('aulaConcluida', { detail }))
      } catch (e) { console.warn('Não foi possível emitir evento de conclusão', e) }

      setTimeout(() => setSalvo(false), 2000)
    } catch (err) {
      console.error('Erro ao concluir aula', err)
    }
  }

  function abrirAula(aula) {
    // Permite abrir qualquer aula que não esteja locked
    if (aula.status !== 'locked') setAtual(aula)
  }

  const statusIcon = (status) => {
    if (status === 'done')      return '✅'
    if (status === 'current')   return '▶'
    if (status === 'available') return '🔓'
    return '🔒'
  }

  if (loading) return <><Topbar title="Vídeo-Aulas Teóricas" /><div className="page-content">Carregando...</div></>

  return (
    <>
      <Topbar title="Vídeo-Aulas Teóricas" />
      <div className="page-content">
        <button className="btn-back" onClick={() => navigate('/cursos')}>
          ← Voltar
        </button>

        <div className="aulas-layout" style={{ marginTop: 12 }}>
          {/* Player / Conteúdo */}
          <div>
            {atual?.videoUrl ? (
              <div style={{ borderRadius: 12, overflow: 'hidden', background: '#000', lineHeight: 0 }}>
                <iframe
                  width="100%"
                  height="400"
                  src={atual.videoUrl}
                  title={atual.titulo}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ display: 'block' }}
                />
              </div>
            ) : atual?.conteudo ? (
              <div style={{ background: '#fff', borderRadius: 12, padding: '24px 28px', boxShadow: '0 1px 4px rgba(0,0,0,.08)', lineHeight: 1.75 }}>
                <h3 style={{ marginTop: 0, marginBottom: 16, color: '#18337c', fontSize: 18 }}>{atual.titulo}</h3>
                {atual.conteudo.split('\n\n').map((bloco, i) =>
                  bloco.startsWith('### ') ? (
                    <h4 key={i} style={{ marginTop: 20, marginBottom: 6, color: '#1a2b4a', fontSize: 15 }}>
                      {bloco.replace('### ', '')}
                    </h4>
                  ) : (
                    <p key={i} style={{ margin: '0 0 12px', color: '#374151', fontSize: 14, whiteSpace: 'pre-line' }}>
                      {bloco}
                    </p>
                  )
                )}
              </div>
            ) : (
              <div className="video-player">
                <div className="video-play-btn">▶</div>
                <div className="video-caption">
                  {atual
                    ? `Assistindo agora: ${atual.titulo}`
                    : 'Selecione uma aula para começar'}
                </div>
              </div>
            )}
            {atual && atual.descricao && !atual.conteudo && (
              <p style={{ marginTop: 12, color: 'var(--gray-500)', fontSize: 14 }}>
                {atual.descricao}
              </p>
            )}
          </div>

          {/* Sidebar */}
          <div className="aulas-sidebar-card">
            <div className="aulas-sidebar-title">Aulas do Módulo</div>
            {aulas.map(aula => (
              <div
                key={aula.id}
                className={`aula-item ${aula.status} ${atual?.id === aula.id ? 'active' : ''}`}
                onClick={() => abrirAula(aula)}
                style={{ cursor: aula.status === 'locked' ? 'not-allowed' : 'pointer', opacity: aula.status === 'locked' ? 0.5 : 1 }}
                title={aula.status === 'locked' ? 'Conclua a aula anterior para desbloquear' : ''}
              >
                {statusIcon(aula.status)} {aula.titulo}
                {aula.duracao && <span style={{ float: 'right', fontSize: 12, color: 'var(--gray-400)' }}>{aula.duracao}min</span>}
              </div>
            ))}

            {atual && atual.status !== 'done' && (
              <button className="btn-concluir" onClick={handleConcluir}>
                {salvo ? 'SALVO ✓' : 'CONCLUIR ESTA AULA'}
              </button>
            )}
            {atual && atual.status === 'done' && (
              <div style={{ textAlign: 'center', color: 'green', marginTop: 12, fontWeight: 600 }}>
                ✅ Aula já concluída
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

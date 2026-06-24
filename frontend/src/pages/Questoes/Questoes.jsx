import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Topbar from '../../components/Topbar'
import { getQuestoes, iniciarSimulado, finalizarSimulado } from '../../services/api'

const MOCK_QUESTOES = [
  {
    id: 1,
    materia: 'Legislação de Trânsito',
    enunciado: 'De acordo com o Código de Trânsito Brasileiro, o condutor que dirigir sob a influência de álcool ou de qualquer outra substância psicoativa que determine dependência comete infração:',
    opcoes: [
      { letra: 'A', texto: 'Gravíssima, com multa e suspensão do direito de dirigir.' },
      { letra: 'B', texto: 'Grave, com multa e retenção do veículo.' },
      { letra: 'C', texto: 'Média, com multa.' },
      { letra: 'D', texto: 'Leve, apenas com advertência por escrito.' },
    ],
    correta: 'A'
  },
  {
    id: 2,
    materia: 'Legislação de Trânsito',
    enunciado: 'Em qual situação o condutor pode usar o acostamento para circulação de veículos?',
    opcoes: [
      { letra: 'A', texto: 'Para ultrapassagem de veículos lentos.' },
      { letra: 'B', texto: 'Em situações de emergência ou quando sinalizado.' },
      { letra: 'C', texto: 'Quando o tráfego estiver congestionado.' },
      { letra: 'D', texto: 'Apenas para motocicletas.' },
    ],
    correta: 'B'
  },
]

function formatTime(s) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
}

export default function Questoes() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const materia = params.get('materia') || 'geral'

  const [questoes, setQuestoes] = useState(MOCK_QUESTOES)
  const [idx, setIdx] = useState(0)
  const [respostas, setRespostas] = useState({})
  const [tempo, setTempo] = useState(30 * 60)
  const [simuladoId, setSimuladoId] = useState(null)

  const timerRef = useRef(null)

  useEffect(() => {
    iniciarSimulado(materia === 'geral' ? 'geral' : 'materia', materia)
      .then(r => {
        setSimuladoId(r.data.id)
        if (r.data.questoes?.length) setQuestoes(r.data.questoes)
      })
      .catch(() => {})

    timerRef.current = setInterval(() => setTempo(t => Math.max(0, t - 1)), 1000)
    return () => clearInterval(timerRef.current)
  }, [])

  const q = questoes[idx]
  const progresso = Math.round((Object.keys(respostas).length / questoes.length) * 100)

  function selecionar(letra) {
    setRespostas(r => ({ ...r, [q.id]: letra }))
  }

  async function handleFinalizar() {
    if (simuladoId) await finalizarSimulado(simuladoId, respostas, materia).catch(() => {})
    navigate('/desempenho')
  }

  if (!q) return null

  return (
    <>
      <Topbar title="Simulado em Andamento" />
      <div className="page-content">
        <div className="questao-layout">
          {/* Coluna principal */}
          <div>
            {/* Meta bar */}
            <div className="questao-meta">
              <div className="questao-meta-item timer">
                <label>TEMPO RESTANTE</label>
                <strong>⏱ {formatTime(tempo)}</strong>
              </div>
              <div className="questao-meta-item">
                <label>QUESTÃO</label>
                <strong>{String(idx + 1).padStart(2,'0')} de {String(questoes.length).padStart(2,'0')}</strong>
              </div>
              <div className="questao-meta-item">
                <label>PROGRESSO</label>
                <strong>{progresso}%</strong>
              </div>
              <div className="progress-bar-meta">
                <div className="progress-bar-meta-fill" style={{ width: `${progresso}%` }} />
              </div>
            </div>

            {/* Questão */}
            <div className="questao-card">
              <span className="questao-tag">{q.materia}</span>
              <p className="questao-text">{q.enunciado}</p>
              {q.opcoes.map(op => (
                <div
                  key={op.letra}
                  className={`opcao ${respostas[q.id] === op.letra ? 'selected' : ''}`}
                  onClick={() => selecionar(op.letra)}
                >
                  <div className="opcao-letra">{op.letra}</div>
                  {op.texto}
                </div>
              ))}
            </div>

            {/* Navegação */}
            <div className="questao-nav">
              <button
                className="btn-nav btn-nav-prev"
                onClick={() => setIdx(i => Math.max(0, i - 1))}
                disabled={idx === 0}
              >
                ← ANTERIOR
              </button>
              <button
                className="btn-nav btn-nav-next"
                onClick={() => setIdx(i => Math.min(questoes.length - 1, i + 1))}
                disabled={idx === questoes.length - 1}
              >
                PRÓXIMA →
              </button>
            </div>
          </div>

          {/* Sidebar navegação */}
          <div className="nav-sidebar">
            <div className="info-card">
              <div className="nav-grid-title">NAVEGAÇÃO</div>
              <div className="nav-legend">
                <div className="legend-item">
                  <div className="legend-dot" style={{ background: 'var(--navy)' }} />
                  Respondida
                </div>
                <div className="legend-item">
                  <div className="legend-dot" style={{ border: '1px solid #ccc' }} />
                  Não respondida
                </div>
              </div>
              <div className="nav-grid">
                {questoes.map((qn, i) => (
                  <div
                    key={qn.id}
                    className={`nav-num ${i === idx ? 'active' : ''} ${respostas[qn.id] ? 'answered' : ''}`}
                    onClick={() => setIdx(i)}
                  >
                    {String(i + 1).padStart(2,'0')}
                  </div>
                ))}
              </div>
            </div>

            <div className="info-card">
              <div className="info-title">INFORMAÇÕES</div>
              <div className="info-item">📄 <span>Simulado: <strong>Avaliação Geral</strong></span></div>
              <div className="info-item">📋 <span>Total de questões: <strong>{questoes.length}</strong></span></div>
              <div className="info-item">⏱ <span>Tempo total: <strong>30 minutos</strong></span></div>
              <button className="btn-finalizar" onClick={handleFinalizar}>
                🏁 FINALIZAR SIMULADO
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

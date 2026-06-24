import { useEffect, useState } from 'react'
import Topbar from '../../components/Topbar'
import { getDesempenho } from '../../services/api'

const MOCK = {
  totalQuestoes: 360,
  acertos: 281,
  taxa: 78.05,
  topicos: [
    { nome: 'Legislação de Trânsito', pct: 90, cor: 'bar-green' },
    { nome: 'Direção Defensiva',       pct: 75, cor: 'bar-navy'  },
    { nome: 'Primeiros Socorros',      pct: 60, cor: 'bar-yellow'},
    { nome: 'Meio Ambiente e Mecânica',pct: 45, cor: 'bar-red'   },
  ],
  simulados: [
    { label: 'Sim. 9',  pct: 55 },
    { label: 'Sim. 10', pct: 68 },
    { label: 'Sim. 11', pct: 72 },
    { label: 'Sim. 12', pct: 90 },
  ]
}

export default function Desempenho() {
  const [data, setData] = useState(MOCK)

  useEffect(() => {
    getDesempenho().then(r => {
      const src = r.data || {}

      const totalQuestoes = src.questoesRespondidas ?? 0
      const acertos = src.totalAcertos ?? 0
      const taxa = src.mediaAcertos ?? 0

      const colorMap = {
        'Legislação de Trânsito': 'bar-green',
        'Direção Defensiva':      'bar-navy',
        'Primeiros Socorros':     'bar-yellow',
        'Meio Ambiente e Cidadania': 'bar-red',
        'Mecânica Básica':        'bar-red',
      }
      const desempenhoPorMateria = src.desempenhoPorMateria || {}
      const topicos = Object.entries(desempenhoPorMateria).length > 0
        ? Object.entries(desempenhoPorMateria).map(([nome, pct]) => ({ nome, pct, cor: colorMap[nome] || 'bar-navy' }))
        : MOCK.topicos

      const hist = src.historico || []
      const simulados = hist.length > 0
        ? hist.slice(-4).map((h, i) => ({
            label: h.titulo ? h.titulo.replace(/^Simulado\s*[-–]\s*/i, '').slice(0, 12) : `Sim. ${i + 1}`,
            pct: h.notaPercent ?? h.nota ?? 0
          }))
        : MOCK.simulados

      setData({ totalQuestoes, acertos, taxa, topicos, simulados })
    }).catch(() => {})
  }, [])

  return (
    <>
      <Topbar title="Meu Desempenho" />
      <div className="page-content">
        {/* KPIs */}
        <div className="desempenho-kpis">
          <div className="kpi-card">
            <div className="kpi-label">TOTAL DE QUESTÕES RESPONDIDAS</div>
            <div className="kpi-value blue">{data.totalQuestoes}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">RESPOSTAS CORRETAS</div>
            <div className="kpi-value green">{data.acertos} acertos</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">TAXA GERAL DE APROVAÇÃO</div>
            <div className="kpi-value yellow">{data.taxa?.toFixed?.(2) || data.taxa}%</div>
          </div>
        </div>

        <div className="desempenho-grid">
          {/* Tópicos */}
          <div className="card card-body">
            <div className="section-title">Taxa de Acertos por Tópico</div>
            <div className="topicos-list">
              {data.topicos.map(t => (
                <div className={`topico-item ${t.cor}`} key={t.nome}>
                  <div className="topico-header">
                    <span>{t.nome}</span>
                    <span className="topico-pct">{t.pct}%</span>
                  </div>
                  <div className="progress-bar-wrap">
                    <div className="progress-bar-fill" style={{ width: `${t.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Evolução */}
          <div className="card card-body">
            <div className="section-title">Evolução nos Últimos 4 Simulados</div>
            <div className="chart-container">
              {data.simulados.map((s, i) => (
                <div className="chart-bar-wrap" key={s.label}>
                  <div
                    className={`chart-bar ${i === data.simulados.length - 1 ? 'active' : ''}`}
                    style={{ height: `${s.pct}%` }}
                    title={`${s.pct}%`}
                  />
                  <span className="chart-label">{s.label}</span>
                </div>
              ))}
            </div>
            <p className="chart-hint">Passe o mouse por cima das barras para ver a pontuação exata.</p>
          </div>
        </div>
      </div>
    </>
  )
}

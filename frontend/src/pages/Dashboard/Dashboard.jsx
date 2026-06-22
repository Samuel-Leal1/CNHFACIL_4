import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Topbar from '../../components/Topbar'
import { useAuth } from '../../context/AuthContext'
import { getDashboard } from '../../services/api'

const MOCK = {
  aulasAssistidas: 18, totalAulas: 30,
  simuladosFeitos: 12,
  mediaAcertos: 78,
  tempoEstudo: '14.5',
  progressoGeral: 45,
  historico: [
    { titulo: 'Simulado Geral #12', data: 'Hoje às 10:24', pontuacao: 24, total: 30, status: 'Aprovado' },
    { titulo: 'Legislação de Trânsito - Revisão', data: 'Ontem', pontuacao: 27, total: 30, status: 'Aprovado' },
    { titulo: 'Direção Defensiva Avançado', data: '29 de Mai', pontuacao: 18, total: 30, status: 'Reprovado' },
  ]
}

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState(MOCK)
  const nome = user?.nome || user?.name || 'Aluno'

  useEffect(() => {
    getDashboard().then(r => setData(r.data)).catch(() => {})
  }, [])

  return (
    <>
      <Topbar title="Painel do Aluno" />
      <div className="page-content">
        {/* Hero */}
        <div className="hero-banner">
          <h2>Olá, {nome.split(' ')[0]}! 👋</h2>
          <p>
            Bem-vindo de volta à sua plataforma. Você já completou{' '}
            <strong>{data.progressoGeral || 45}%</strong> do curso teórico.<br />
            Falta pouco para estar pronto para o exame oficial!
          </p>
          <div className="hero-actions">
            <button className="btn-hero-primary" onClick={() => navigate('/cursos')}>
              Continuar Assistindo
            </button>
            <button className="btn-hero-secondary" onClick={() => navigate('/simulados')}>
              Fazer Simulado
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <div>
              <div className="stat-label">Aulas Assistidas</div>
              <div className="stat-value">{data.aulasAssistidas} / {data.totalAulas}</div>
            </div>
            <span className="stat-icon">📺</span>
          </div>
          <div className="stat-card">
            <div>
              <div className="stat-label">Simulados Feitos</div>
              <div className="stat-value">{data.simuladosFeitos} Provas</div>
            </div>
            <span className="stat-icon">📝</span>
          </div>
          <div className="stat-card">
            <div>
              <div className="stat-label">Média de Acertos</div>
              <div className="stat-value">{data.mediaAcertos}%</div>
            </div>
            <span className="stat-icon">🎯</span>
          </div>
          <div className="stat-card">
            <div>
              <div className="stat-label">Tempo de Estudo</div>
              <div className="stat-value">{data.tempoEstudo} horas</div>
            </div>
            <span className="stat-icon">⏱️</span>
          </div>
        </div>

        {/* Histórico */}
        <div className="section-title">Histórico de atividade recente</div>
        <div className="history-grid">
          {(data.historico || MOCK.historico).map((item, i) => (
            <div className="history-card" key={i}>
              <div className="history-card-header">
                <span style={{ fontSize: 20 }}>📄</span>
                <span className={`badge ${item.status === 'Aprovado' ? 'badge-green' : 'badge-red'}`}>
                  {item.status}
                </span>
              </div>
              <div className="history-title">{item.titulo}</div>
              <div className="history-date">{item.data}</div>
              <div className="history-score">
                <span>Pontuação:</span>
                <strong>{item.pontuacao}/{item.total}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

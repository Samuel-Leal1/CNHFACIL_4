import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Topbar from '../../components/Topbar'
import { useAuth } from '../../context/AuthContext'
import { getDashboard } from '../../services/api'

const EMPTY = {
  aulasAssistidas: 0, totalAulas: 0,
  simuladosFeitos: 0,
  mediaAcertos: 0,
  tempoEstudo: '0',
  progressoGeral: 0,
  historico: [],
}

function formatarData(valor) {
  if (!valor) return '—'
  if (typeof valor === 'string' && /\d{2}\/\d{2}\/\d{4}/.test(valor)) return valor
  const d = new Date(valor)
  if (isNaN(d)) return String(valor)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState(EMPTY)
  const nome = user?.usuario_nome || user?.nome || user?.name || 'Usuário'

  useEffect(() => {
    getDashboard()
      .then(r => {
        const src = r.data || {}
        const resumo = src.resumo || {}
        setData({
          aulasAssistidas: resumo.aulasAssistidas ?? 0,
          totalAulas: resumo.aulasTotais ?? 0,
          simuladosFeitos: resumo.simuladosRealizados ?? 0,
          mediaAcertos: resumo.mediaAcertos ?? 0,
          tempoEstudo: resumo.tempoEstudo ?? '0',
          progressoGeral: resumo.progressoGeral ?? 0,
          historico: (src.historico || []).map(h => ({
            titulo: h.titulo,
            data: formatarData(h.data),
            pontuacao: h.pontuacao ?? h.acertos ?? 0,
            total: h.total ?? 30,
            status: h.status ?? (h.aprovado ? 'Aprovado' : 'Reprovado'),
          })),
        })
      })
      .catch(() => {})
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
            <strong>{data.progressoGeral}%</strong> do curso teórico.<br />
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
              <div className="stat-value">{data.aulasAssistidas} / {data.totalAulas || '—'}</div>
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
        {data.historico.length === 0 ? (
          <p style={{ color: 'var(--gray-400)', fontSize: 14 }}>
            Nenhum simulado realizado ainda. <button className="btn-hero-secondary" style={{ fontSize: 13 }} onClick={() => navigate('/simulados')}>Fazer primeiro simulado</button>
          </p>
        ) : (
          <div className="history-grid">
            {data.historico.map((item, i) => (
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
        )}
      </div>
    </>
  )
}

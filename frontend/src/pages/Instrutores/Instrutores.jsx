import { useEffect, useState } from 'react'
import Topbar from '../../components/Topbar'
import { getInstrutores } from '../../services/api'

const INSTRUTORES_FALLBACK = [
  {
    id: 1, nome: 'Roberto Almeida', avaliacao: 4.9, avaliacoes: 124,
    categorias: ['B'], veiculo: 'VW Gol (Manual)',
    bio: 'Especialista em alunos iniciantes. Foco em controle de embreagem e baliza com didática paciente.',
    avatar: '👨', whatsapp: '11999990001'
  },
  {
    id: 2, nome: 'Carlos Machado', avaliacao: 5.0, avaliacoes: 89,
    categorias: ['A'], veiculo: 'Frota Diversa',
    bio: 'Aulas práticas de moto, com foco em pilotagem defensiva urbana e adaptação rápida.',
    avatar: '👨‍🦱', whatsapp: '11999990002'
  },
  {
    id: 3, nome: 'Amanda Costa', avaliacao: 4.8, avaliacoes: 210,
    categorias: ['B'], veiculo: 'Fiat Mobi (Manual)',
    bio: 'Foco em alunos com trauma ou medo de dirigir. Treinamento prático intensivo em vias rápidas.',
    avatar: '👩', whatsapp: '11999990003'
  },
  {
    id: 4, nome: 'Felipe Santos', avaliacao: 4.7, avaliacoes: 95,
    categorias: ['B', 'A'], veiculo: 'Chevrolet Up! / Honda CG',
    bio: 'Preparação focada estritamente no percurso do exame final do DETRAN. Alto índice de aprovação.',
    avatar: '👨‍🦳', whatsapp: '11999990004'
  },
  {
    id: 5, nome: 'Juliana Freitas', avaliacao: 4.9, avaliacoes: 142,
    categorias: ['B'], veiculo: 'Toyota Argo (Automático)',
    bio: 'Especialista em trânsito noturno e direção defensiva avançada. Aulas focadas em rodovias.',
    avatar: '👩‍🦰', whatsapp: '11999990005'
  },
  {
    id: 6, nome: 'Marcos Paulo', avaliacao: 4.8, avaliacoes: 68,
    categorias: ['D'], veiculo: 'Micro-ônibus Marcopolo',
    bio: 'Foco em veículos pesados e categorias profissionais. Aulas práticas de manobras de grande porte.',
    avatar: '🧔', whatsapp: '11999990006'
  },
]

const CAT_CLASS = { A: 'a', B: 'b', C: 'b', D: 'd', E: 'd' }

export default function Instrutores() {
  const [busca, setBusca] = useState('')
  const [instrutores, setInstrutores] = useState(INSTRUTORES_FALLBACK)

  useEffect(() => {
    getInstrutores()
      .then(r => {
        if (Array.isArray(r.data) && r.data.length > 0) {
          setInstrutores(r.data)
        }
      })
      .catch(() => {})
  }, [])

  const filtrados = instrutores.filter(i =>
    i.nome.toLowerCase().includes(busca.toLowerCase()) ||
    i.veiculo.toLowerCase().includes(busca.toLowerCase()) ||
    i.categorias.some(c => c.toLowerCase().includes(busca.toLowerCase()))
  )

  return (
    <>
      <Topbar title="Instrutores Disponíveis" />
      <div className="page-content">
        <div className="instrutores-search-bar">
          <h3>Encontre o seu instrutor prático</h3>
          <div className="search-input-wrap">
            <span>🔍</span>
            <input
              placeholder="Buscar por nome, veículo ou categoria..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
            />
          </div>
        </div>

        <div className="instrutores-grid">
          {filtrados.map(inst => (
            <div className="instrutor-card" key={inst.id}>
              <div className="instrutor-header">
                <div className="instrutor-avatar">{inst.avatar}</div>
                <div>
                  <div className="instrutor-name">{inst.nome}</div>
                  <div className="instrutor-stars">
                    ⭐ <span className="instrutor-rating">
                      {inst.avaliacao}
                      {inst.avaliacoes > 0 && ` (${inst.avaliacoes} avaliações)`}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                {inst.categorias.map(c => (
                  <span key={c} className={`cat-tag ${CAT_CLASS[c] || 'b'}`}>Categoria {c}</span>
                ))}
              </div>

              <div className="instrutor-veiculo">🚗 <span>Veículo: <strong>{inst.veiculo}</strong></span></div>
              <div className="instrutor-bio">💬 <span>{inst.bio}</span></div>

              {inst.whatsapp ? (
                <a
                  href={`https://wa.me/55${inst.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-whatsapp"
                >
                  💬 Entrar em Contato
                </a>
              ) : (
                <button className="btn-whatsapp" disabled style={{ opacity: 0.5, cursor: 'default' }}>
                  💬 Contato não disponível
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

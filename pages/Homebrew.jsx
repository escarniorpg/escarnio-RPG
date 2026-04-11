import { Link } from 'react-router-dom'
import { useLocalStorage } from '../hooks/useLocalStorage'

const HB_SECTIONS = [
  {
    to: '/homebrew/equipamentos',
    icon: '⚔️',
    title: 'Equipamentos',
    desc: 'Armas, armaduras, itens mágicos e consumíveis',
    color: '#c8900a',
    key: 'ldv_hb_equip',
  },
  {
    to: '/homebrew/racas',
    icon: '🧬',
    title: 'Raças',
    desc: 'Raças personalizadas com atributos e habilidades únicas',
    color: '#2a8fa8',
    key: 'ldv_hb_racas',
  },
  {
    to: '/homebrew/criaturas',
    icon: '🐲',
    title: 'Criaturas',
    desc: 'Bestiário de criaturas com ND, atributos e habilidades',
    color: '#d42020',
    key: 'ldv_hb_criaturas',
  },
  {
    to: '/homebrew/cidades',
    icon: '🏙️',
    title: 'Cidades & Regiões',
    desc: 'Locais, NPCs, pontos de interesse e história',
    color: '#14b478',
    key: 'ldv_hb_cidades',
  },
  {
    to: '/homebrew/afiliacoes',
    icon: '🏛️',
    title: 'Afiliações',
    desc: 'Guildas, facções, ordens e organizações secretas',
    color: '#8a20e0',
    key: 'ldv_hb_afiliacoes',
  },
]

export default function Homebrew() {
  return (
    <div className="page-wrap" style={{ padding: '80px 20px 40px', maxWidth: 960, margin: '0 auto' }}>
      <div className="page-title">
        <h1>HOMEBREW</h1>
        <p>Crie e compartilhe conteúdo personalizado</p>
      </div>

      <div className="hb-hub-grid">
        {HB_SECTIONS.map(s => (
          <HBCard key={s.to} {...s} />
        ))}
      </div>

      <div className="divider" style={{ margin: '32px 0 20px' }} />

      <div style={{ textAlign: 'center' }}>
        <p style={{ color: 'var(--highlight-dim)', fontFamily: 'Rajdhani, sans-serif', fontSize: '0.82rem', letterSpacing: 2, textTransform: 'uppercase' }}>
          Todo conteúdo é salvo localmente · Firebase necessário para publicação
        </p>
      </div>
    </div>
  )
}

function HBCard({ to, icon, title, desc, color, key: storageKey }) {
  const [items] = useLocalStorage(storageKey, [])
  return (
    <Link
      to={to}
      className="hb-hub-card"
      style={{ '--hb-color': color }}
    >
      <div className="hb-hub-card-icon">{icon}</div>
      <div className="hb-hub-card-title">{title}</div>
      <div className="hb-hub-card-desc">{desc}</div>
      <div className="hb-hub-card-count">
        {items.length === 0 ? 'Nenhum item criado' : `${items.length} ${items.length === 1 ? 'item' : 'itens'}`}
      </div>
    </Link>
  )
}

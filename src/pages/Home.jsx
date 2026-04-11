import { Link } from 'react-router-dom'

const CARDS = [
  {
    to: '/fichas',
    icon: '📜',
    title: 'Fichas',
    desc: 'Crie e gerencie até 5 fichas de personagem',
    color: '#2a8fa8',
  },
  {
    to: '/campanhas',
    icon: '🐉',
    title: 'Campanhas',
    desc: 'Entre ou crie campanhas e gerencie seus jogadores',
    color: '#6040c8',
  },
  {
    to: '/homebrew',
    icon: '🪶',
    title: 'Homebrew',
    desc: 'Crie equipamentos, raças, criaturas e cidades',
    color: '#14b478',
  },
]

export default function Home() {
  return (
    <div className="home-wrap">
      {/* Background SVG waves */}
      <svg className="home-bg-svg" viewBox="0 0 1400 800" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,600 Q350,520 700,580 Q1050,640 1400,560 L1400,800 L0,800 Z" fill="#2a8fa8"/>
        <path d="M0,650 Q350,590 700,640 Q1050,700 1400,620 L1400,800 L0,800 Z" fill="#1a6a8a"/>
        <path d="M0,700 Q350,660 700,695 Q1050,740 1400,680 L1400,800 L0,800 Z" fill="#0e4a6a"/>
      </svg>

      <div className="home-logo">LIVRO DA VIDA</div>
      <div className="home-logo-sub">Sistema de Fichas · Livro da Vida RPG</div>
      <div className="home-divider" />
      <div className="home-rune">~ O abismo te observa ~</div>

      <div className="home-cards">
        {CARDS.map(card => (
          <Link
            key={card.to}
            to={card.to}
            className="home-card"
            style={{ '--card-top-color': card.color }}
          >
            <div className="home-card-line" />
            <div className="home-card-icon">{card.icon}</div>
            <div className="home-card-title">{card.title}</div>
            <div className="home-card-desc">{card.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/',         label: 'Início',     icon: 'fas fa-home',        exact: true },
  { to: '/fichas',   label: 'Fichas',     icon: 'fas fa-scroll' },
  { to: '/campanhas',label: 'Campanhas',  icon: 'fas fa-dragon' },
  { to: '/homebrew', label: 'Homebrew',   icon: 'fas fa-feather-alt' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  const isActive = (to, exact) => {
    if (exact) return location.pathname === to
    return location.pathname.startsWith(to)
  }

  // Build breadcrumb label
  const getBreadcrumb = () => {
    const p = location.pathname
    if (p === '/') return null
    const segments = p.split('/').filter(Boolean)
    const labels = {
      fichas: 'Fichas',
      campanhas: 'Campanhas',
      homebrew: 'Homebrew',
      equipamentos: 'Equipamentos',
      racas: 'Raças',
      criaturas: 'Criaturas',
      cidades: 'Cidades',
      afiliacoes: 'Afiliações',
    }
    return segments.map(s => {
      // If it looks like an ID (starts with 'char_' or is numeric), show 'Ficha'
      if (/^char_/.test(s)) return 'Ficha'
      return labels[s] || s
    })
  }

  const crumbs = getBreadcrumb()

  return (
    <>
      <nav className="navbar">
        <NavLink to="/" className="nav-logo" onClick={() => setOpen(false)}>
          <i className="fas fa-book-open nav-logo-icon" />
          Livro <span>da Vida</span>
        </NavLink>

        {/* Desktop links */}
        <div className="nav-links">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={() => `nav-link${isActive(item.to, item.exact) ? ' active' : ''}`}
              end={item.exact}
            >
              <i className={item.icon} />
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Breadcrumb + URL */}
        {crumbs && (
          <div className="nav-breadcrumb">
            <span>Início</span>
            {crumbs.map((c, i) => (
              <span key={i}>
                <span className="sep"> › </span>
                <span className={i === crumbs.length - 1 ? 'current' : ''}>{c}</span>
              </span>
            ))}
          </div>
        )}

        <div className="nav-url-display" style={{ marginLeft: crumbs ? '12px' : 'auto' }}>
          {location.pathname}
        </div>

        {/* Mobile hamburger */}
        <button
          className="nav-hamburger"
          onClick={() => setOpen(o => !o)}
          aria-label="Menu"
        >
          <i className={open ? 'fas fa-times' : 'fas fa-bars'} />
        </button>
      </nav>

      {/* Mobile menu */}
      <div className={`nav-mobile-menu${open ? ' open' : ''}`}>
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={() => `nav-link${isActive(item.to, item.exact) ? ' active' : ''}`}
            onClick={() => setOpen(false)}
            end={item.exact}
          >
            <i className={item.icon} />
            {item.label}
          </NavLink>
        ))}
      </div>
    </>
  )
}

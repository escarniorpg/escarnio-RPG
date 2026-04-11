import { Link } from 'react-router-dom'

/**
 * Reusable list + detail panel for homebrew sections.
 * Props:
 *  items        — array of objects
 *  selected     — currently selected id (or null)
 *  onSelect     — (id) => void
 *  onDelete     — (id) => void
 *  backTo       — link href for back button (default /homebrew)
 *  title        — page title string
 *  color        — CSS color for accent (--hb-color)
 *  renderItem   — (item) => { icon, name, meta }
 *  renderDetail — (item) => JSX detail panel
 *  renderForm   — JSX form for creating new item
 *  formTitle    — title of creator panel
 */
export default function HBListPanel({
  items = [],
  selected,
  onSelect,
  onDelete,
  backTo = '/homebrew',
  title,
  color,
  renderItem,
  renderDetail,
  renderForm,
}) {
  const sel = items.find(i => i.id === selected)

  return (
    <div className="page-wrap" style={{ padding: '72px 16px 40px', maxWidth: 1100, margin: '0 auto' }}>
      {/* Back bar */}
      <div className="hb-backbar">
        <Link to={backTo} className="btn btn-ghost" style={{ fontSize: '0.72rem' }}>
          <i className="fas fa-arrow-left" /> Homebrew
        </Link>
        <div className="hb-backbar-title" style={{ color }}>{title}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: sel ? '1fr 1.1fr' : '1fr', gap: 20, alignItems: 'start' }}>
        {/* Left: list + form */}
        <div>
          {items.length === 0
            ? <div className="empty-state" style={{ padding: '30px 10px', marginBottom: 20 }}>
                <i className="fas fa-feather-alt" />
                <p>Nenhum item criado ainda</p>
              </div>
            : (
              <div className="hb-list" style={{ '--hb-color': color }}>
                {items.map(item => {
                  const { icon, name, meta } = renderItem(item)
                  return (
                    <div
                      key={item.id}
                      className="hb-item"
                      style={{
                        '--hb-color': color,
                        background: selected === item.id ? `rgba(0,0,0,0.8)` : undefined,
                        borderLeftColor: color,
                      }}
                      onClick={() => onSelect(item.id === selected ? null : item.id)}
                    >
                      <div className="hb-item-icon">{icon}</div>
                      <div className="hb-item-info">
                        <div className="hb-item-name">{name}</div>
                        {meta && <div className="hb-item-meta">{meta}</div>}
                      </div>
                      <div className="hb-item-actions">
                        <button
                          className="hb-item-btn del"
                          onClick={e => { e.stopPropagation(); onDelete(item.id) }}
                        >
                          <i className="fas fa-trash-alt" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          }

          {/* Creator form */}
          {renderForm}
        </div>

        {/* Right: detail */}
        {sel && (
          <div className="container" style={{ padding: 20, '--hb-color': color }}>
            {renderDetail(sel)}
          </div>
        )}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLocalStorage } from '../hooks/useLocalStorage'

const MAX_SLOTS = 5

const RACAS = ['Humano', 'Élfico', 'Anão', 'Draconato', 'Meio-Orc', 'Gnomo', 'Halfling', 'Tiefling', 'Aasimar', 'Tabaxi']
const CLASSES = ['Guerreiro', 'Mago', 'Ladino', 'Clérigo', 'Bárbaro', 'Druida', 'Paladino', 'Arqueiro', 'Bardo', 'Monge', 'Feiticeiro', 'Bruxo']

function newChar(name, raca, classe) {
  return {
    id: 'char_' + Date.now(),
    name,
    raca,
    classe,
    level: 1,
    createdAt: Date.now(),
    // Stats
    hpCur: 10, hpMax: 10,
    defesa: 10, velocidade: 9, sorte: 3, circulos: 0, mana: 0,
    // Attributes
    forca: 1, destreza: 1, constituicao: 1, inteligencia: 1, sabedoria: 1, carisma: 1,
    // Free text sections
    habilidades: [],
    anotacoes: '',
    // Theme
    theme: '',
  }
}

export default function Fichas() {
  const [chars, setChars] = useLocalStorage('ldv_chars', [])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', raca: 'Humano', classe: 'Guerreiro' })
  const navigate = useNavigate()

  const handleCreate = () => {
    if (!form.name.trim()) return
    const c = newChar(form.name.trim(), form.raca, form.classe)
    setChars(prev => [...prev, c])
    setShowModal(false)
    setForm({ name: '', raca: 'Humano', classe: 'Guerreiro' })
    navigate(`/fichas/${c.id}`)
  }

  const handleDelete = (e, id) => {
    e.preventDefault()
    e.stopPropagation()
    if (confirm('Excluir esta ficha permanentemente?')) {
      setChars(prev => prev.filter(c => c.id !== id))
    }
  }

  const emptySlots = MAX_SLOTS - chars.length

  return (
    <div className="fichas-wrap">
      {/* Header */}
      <div className="page-title">
        <h1>FICHAS</h1>
        <p>Selecione ou crie uma ficha de personagem</p>
      </div>

      <div className="slot-list">
        {/* Existing characters */}
        {chars.map((c, i) => (
          <Link key={c.id} to={`/fichas/${c.id}`} className="slot-row has-char">
            <div className="slot-num">{i + 1}</div>
            <div className="slot-avatar">
              {c.avatar
                ? <img src={c.avatar} alt={c.name} />
                : <i className="fas fa-user" style={{ color: 'var(--highlight-dim)' }} />}
            </div>
            <div className="slot-info">
              <div className="slot-name">{c.name || 'Sem Nome'}</div>
              <div className="slot-meta">
                {c.raca} · {c.classe} · Nv {c.level}
              </div>
            </div>
            <button
              className="slot-del btn"
              onClick={e => handleDelete(e, c.id)}
              title="Excluir ficha"
            >
              <i className="fas fa-trash-alt" />
            </button>
          </Link>
        ))}

        {/* Empty slots */}
        {chars.length < MAX_SLOTS && Array.from({ length: emptySlots }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="slot-row empty"
            onClick={() => setShowModal(true)}
            style={{ cursor: 'pointer' }}
          >
            <div className="slot-num">{chars.length + i + 1}</div>
            <div className="slot-avatar">
              <i className="fas fa-plus" style={{ fontSize: '0.85rem', color: 'var(--border-bright)' }} />
            </div>
            <div className="slot-info">
              <div className="slot-name" style={{ color: 'var(--border-bright)' }}>Slot vazio</div>
              <div className="slot-meta" style={{ fontStyle: 'italic' }}>Clique para criar uma nova ficha</div>
            </div>
          </div>
        ))}
      </div>

      {/* New character button */}
      {chars.length < MAX_SLOTS && (
        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <i className="fas fa-plus" /> Nova Ficha
          </button>
        </div>
      )}

      {/* Create modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>
              <i className="fas fa-times" />
            </button>
            <div className="modal-title">
              <i className="fas fa-scroll" style={{ color: 'var(--highlight)' }} />
              Nova Ficha de Personagem
            </div>

            <div className="create-char-form">
              <div className="field-group">
                <label>Nome do Personagem</label>
                <input
                  type="text"
                  placeholder="Ex: Arandir das Sombras"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && handleCreate()}
                  autoFocus
                />
              </div>

              <div className="field-row field-row-2">
                <div className="field-group">
                  <label>Raça</label>
                  <select value={form.raca} onChange={e => setForm(f => ({ ...f, raca: e.target.value }))}>
                    {RACAS.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div className="field-group">
                  <label>Classe</label>
                  <select value={form.classe} onChange={e => setForm(f => ({ ...f, classe: e.target.value }))}>
                    {CLASSES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancelar</button>
                <button
                  className="btn btn-save"
                  onClick={handleCreate}
                  disabled={!form.name.trim()}
                >
                  <i className="fas fa-check" /> Criar Ficha
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

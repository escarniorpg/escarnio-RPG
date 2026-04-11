import { useState, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useLocalStorage } from '../hooks/useLocalStorage'

/* ── Attribute / Skill definitions ──────────────────────────── */
const ATTRS = [
  {
    sigla: 'FOR', full: 'Força', key: 'forca',
    skills: [
      { name: 'Atletismo', key: 'atletismo' },
      { name: 'Intimidação Física', key: 'intimidFisica' },
    ],
  },
  {
    sigla: 'DES', full: 'Destreza', key: 'destreza',
    skills: [
      { name: 'Acrobacia', key: 'acrobacia' },
      { name: 'Furtividade', key: 'furtividade' },
      { name: 'Prestidigitação', key: 'prestidigitacao' },
    ],
  },
  {
    sigla: 'CON', full: 'Constituição', key: 'constituicao',
    skills: [
      { name: 'Resistência', key: 'resistencia' },
      { name: 'Vitalidade', key: 'vitalidade' },
    ],
  },
  {
    sigla: 'INT', full: 'Inteligência', key: 'inteligencia',
    skills: [
      { name: 'Arcana', key: 'arcana' },
      { name: 'História', key: 'historia' },
      { name: 'Investigação', key: 'investigacao' },
      { name: 'Natureza', key: 'natureza' },
    ],
  },
  {
    sigla: 'SAB', full: 'Sabedoria', key: 'sabedoria',
    skills: [
      { name: 'Percepção', key: 'percepcao' },
      { name: 'Sobrevivência', key: 'sobrevivencia' },
      { name: 'Medicina', key: 'medicina' },
    ],
  },
  {
    sigla: 'CAR', full: 'Carisma', key: 'carisma',
    skills: [
      { name: 'Persuasão', key: 'persuasao' },
      { name: 'Enganação', key: 'enganacao' },
      { name: 'Atuação', key: 'atuacao' },
    ],
  },
]

const TABS = ['Atributos', 'Habilidades', 'Inventário', 'Anotações']

function calcMod(val) {
  return Math.floor((val - 10) / 2)
}
function fmtMod(mod) {
  return mod >= 0 ? `+${mod}` : `${mod}`
}
function skillTotal(attrVal, bonus = 0) {
  return calcMod(attrVal) + bonus
}

/* ── Dice roller ─────────────────────────────────────────────── */
function rollDice(sides) {
  return Math.floor(Math.random() * sides) + 1
}

export default function FichaHeroi() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [chars, setChars] = useLocalStorage('ldv_chars', [])

  const charIdx = chars.findIndex(c => c.id === id)
  const char = chars[charIdx]

  const [activeTab, setActiveTab] = useState(0)
  const [diceResult, setDiceResult] = useState(null) // { result, label, sides }
  const [rollHistory, setRollHistory] = useState([])

  /* ── Helpers ── */
  const update = useCallback((patch) => {
    setChars(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c))
  }, [id, setChars])

  const roll = (sides, label = '') => {
    const r = rollDice(sides)
    setDiceResult({ result: r, label, sides })
    setRollHistory(h => [{ result: r, label, sides, ts: Date.now() }, ...h].slice(0, 20))
  }

  /* ── Not found ── */
  if (!char) {
    return (
      <div className="page-wrap" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <div className="empty-state">
          <i className="fas fa-ghost" />
          <p>Ficha não encontrada</p>
        </div>
        <Link to="/fichas" className="btn btn-primary">
          <i className="fas fa-arrow-left" /> Voltar para Fichas
        </Link>
      </div>
    )
  }

  /* ── Header fields ── */
  const headerFields = [
    { label: 'Nome', key: 'name', span: 2 },
    { label: 'Raça', key: 'raca' },
    { label: 'Classe', key: 'classe' },
    { label: 'Nível', key: 'level', type: 'number', min: 1, max: 20 },
    { label: 'Pronome', key: 'pronome' },
    { label: 'Origem', key: 'origem' },
  ]

  /* ── Render ── */
  return (
    <div className="page-wrap" style={{ padding: '72px 16px 40px' }}>
      <div className="container" style={{ maxWidth: 1100 }}>

        {/* Toolbar */}
        <div className="char-toolbar">
          <button className="btn btn-ghost" onClick={() => navigate('/fichas')}>
            <i className="fas fa-arrow-left" /> Fichas
          </button>
          <span style={{ flex: 1, fontFamily: 'Cinzel, serif', color: '#d8eaf2', fontSize: '1rem', letterSpacing: 2 }}>
            {char.name || 'Sem Nome'}
          </span>
          <span className="badge badge-teal">Nv {char.level}</span>
          <span className="badge badge-gold">{char.raca}</span>
          <span className="badge badge-green">{char.classe}</span>
          <button className="btn btn-save" onClick={() => alert('Salvo localmente!')}>
            <i className="fas fa-save" /> Salvar
          </button>
        </div>

        {/* Header grid */}
        <div className="char-header">
          {headerFields.map(f => (
            <div className="field-group" key={f.key} style={f.span ? { gridColumn: `span ${f.span}` } : {}}>
              <label>{f.label}</label>
              <input
                type={f.type || 'text'}
                min={f.min} max={f.max}
                value={char[f.key] ?? ''}
                onChange={e => update({ [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value })}
              />
            </div>
          ))}
        </div>

        {/* Status row */}
        <div className="status-row">
          {/* HP */}
          <div className="status-box">
            <span className="status-label">Pontos de Vida</span>
            <div className="hp-wrap">
              <div className="hp-row">
                <input className="hp-cur"
                  type="number" value={char.hpCur ?? 10}
                  onChange={e => update({ hpCur: Number(e.target.value) })} />
                <span className="hp-sep">/</span>
                <input className="status-input hp-max"
                  style={{ width: 44, fontSize: '1.3rem' }}
                  type="number" value={char.hpMax ?? 10}
                  onChange={e => update({ hpMax: Number(e.target.value) })} />
              </div>
              <div className="hp-btns">
                <button className="hp-btn hp-btn-dec" onClick={() => update({ hpCur: Math.max(0, (char.hpCur ?? 10) - 1) })}>−</button>
                <button className="hp-btn hp-btn-inc" onClick={() => update({ hpCur: Math.min(char.hpMax ?? 10, (char.hpCur ?? 10) + 1) })}>+</button>
              </div>
            </div>
          </div>

          {[
            { label: 'Defesa', key: 'defesa', default: 10 },
            { label: 'Velocidade', key: 'velocidade', default: 9 },
            { label: 'Sorte', key: 'sorte', default: 3 },
            { label: 'Círculos', key: 'circulos', default: 0 },
            { label: 'Mana', key: 'mana', default: 0 },
          ].map(s => (
            <div className="status-box" key={s.key}>
              <span className="status-label">{s.label}</span>
              <input
                className="status-input"
                type="number"
                value={char[s.key] ?? s.default}
                onChange={e => update({ [s.key]: Number(e.target.value) })}
              />
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="tab-bar">
          {TABS.map((t, i) => (
            <button
              key={t}
              className={`tab-btn${activeTab === i ? ' active' : ''}`}
              onClick={() => setActiveTab(i)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── TAB 0: Atributos ── */}
        {activeTab === 0 && (
          <div className="char-main-grid">
            {/* Left: attribute cards */}
            <div>
              <div className="points-badge">
                Pontos de Atributo: {Object.values({
                  forca: char.forca, destreza: char.destreza,
                  constituicao: char.constituicao, inteligencia: char.inteligencia,
                  sabedoria: char.sabedoria, carisma: char.carisma,
                }).reduce((a, v) => a + (v || 1), 0)} / 30
              </div>

              {ATTRS.map(attr => {
                const val = char[attr.key] ?? 1
                const mod = calcMod(val)
                return (
                  <div className="attr-card" key={attr.key}>
                    <div className="attr-main">
                      <div>
                        <div className="attr-sigla">{attr.sigla}</div>
                        <div className="attr-full">{attr.full}</div>
                      </div>
                      <div className="attr-controls">
                        <button className="btn-circle"
                          disabled={val <= 1}
                          onClick={() => update({ [attr.key]: val - 1 })}>−</button>
                        <div className="attr-val">{val}</div>
                        <button className="btn-circle"
                          disabled={val >= 10}
                          onClick={() => update({ [attr.key]: val + 1 })}>+</button>
                      </div>
                    </div>
                    <div className="skill-list">
                      {attr.skills.map(sk => {
                        const total = skillTotal(val, char[`sk_${sk.key}`] || 0)
                        return (
                          <div className="skill-item" key={sk.key}>
                            <span className="skill-name">{sk.name}</span>
                            <div className="pericia-val-wrap" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <button
                                className="skill-dice"
                                title={`Rolar ${sk.name}`}
                                onClick={() => roll(20, sk.name)}
                              >🎲</button>
                              <span className="skill-val">{fmtMod(total)}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Right: dice history */}
            <div>
              <div className="section-header">
                <i className="fas fa-dice-d20 section-header-icon" />
                <h2>Histórico de Rolagens</h2>
              </div>

              {rollHistory.length === 0
                ? <div className="empty-state" style={{ padding: '30px 10px' }}>
                    <i className="fas fa-dice" style={{ fontSize: '2rem' }} />
                    <p style={{ marginTop: 8 }}>Clique em 🎲 para rolar</p>
                  </div>
                : <div className="roll-history">
                    {rollHistory.map((r, i) => (
                      <div className="roll-entry" key={i}>
                        <span className="roll-die">d{r.sides}</span>
                        <span className="roll-num">{r.result}</span>
                        <span className="roll-context">{r.label}</span>
                      </div>
                    ))}
                  </div>
              }

              {/* Quick dice */}
              <div className="section-header" style={{ marginTop: 24 }}>
                <i className="fas fa-dice section-header-icon" />
                <h2>Rolar Dado</h2>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[4, 6, 8, 10, 12, 20, 100].map(d => (
                  <button key={d} className="btn btn-primary" onClick={() => roll(d, `d${d}`)}>
                    d{d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 1: Habilidades ── */}
        {activeTab === 1 && (
          <HabilidadesTab char={char} update={update} />
        )}

        {/* ── TAB 2: Inventário ── */}
        {activeTab === 2 && (
          <InventarioTab char={char} update={update} />
        )}

        {/* ── TAB 3: Anotações ── */}
        {activeTab === 3 && (
          <div>
            <div className="section-header">
              <i className="fas fa-book-open section-header-icon" />
              <h2>Anotações</h2>
            </div>
            <textarea
              style={{ width: '100%', minHeight: 320, fontSize: '1rem', lineHeight: 1.6 }}
              placeholder="Histórico do personagem, notas de sessão, segredos..."
              value={char.anotacoes ?? ''}
              onChange={e => update({ anotacoes: e.target.value })}
            />
          </div>
        )}
      </div>

      {/* Dice result popup */}
      {diceResult && (
        <div className="dice-modal-overlay" onClick={() => setDiceResult(null)}>
          <div className="dice-modal" onClick={e => e.stopPropagation()}>
            <div className="dice-info">d{diceResult.sides} · {diceResult.label}</div>
            <div className="dice-result">{diceResult.result}</div>
            {diceResult.sides === 20 && (
              <div className="dice-info" style={{ marginTop: 6 }}>
                {diceResult.result === 20 && '✨ Acerto Crítico!'}
                {diceResult.result === 1 && '💀 Falha Crítica!'}
              </div>
            )}
            <button className="btn btn-ghost" style={{ marginTop: 16 }} onClick={() => setDiceResult(null)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Sub-tabs ──────────────────────────────────────────────────── */

function HabilidadesTab({ char, update }) {
  const [nome, setNome] = useState('')
  const [desc, setDesc] = useState('')

  const habs = char.habilidades || []

  const add = () => {
    if (!nome.trim()) return
    update({ habilidades: [...habs, { id: Date.now(), nome, desc }] })
    setNome(''); setDesc('')
  }
  const remove = (id) => update({ habilidades: habs.filter(h => h.id !== id) })

  return (
    <div>
      <div className="section-header">
        <i className="fas fa-star section-header-icon" />
        <h2>Habilidades & Poderes</h2>
      </div>

      {habs.length === 0
        ? <div className="empty-state" style={{ padding: '30px 10px' }}>
            <i className="fas fa-scroll" />
            <p>Nenhuma habilidade registrada</p>
          </div>
        : <div style={{ marginBottom: 20 }}>
            {habs.map(h => (
              <div className="ability-item" key={h.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <div className="ability-name">{h.nome}</div>
                  <button className="btn btn-delete" style={{ padding: '3px 8px', fontSize: '0.65rem' }}
                    onClick={() => remove(h.id)}>
                    <i className="fas fa-trash-alt" />
                  </button>
                </div>
                {h.desc && <div className="ability-desc">{h.desc}</div>}
              </div>
            ))}
          </div>
      }

      <div className="hb-form-card">
        <div className="hb-form-title">
          <i className="fas fa-plus" /> Nova Habilidade
        </div>
        <div className="field-group" style={{ marginBottom: 10 }}>
          <label>Nome da Habilidade</label>
          <input value={nome} onChange={e => setNome(e.target.value)}
            placeholder="Ex: Toque das Sombras" />
        </div>
        <div className="field-group" style={{ marginBottom: 12 }}>
          <label>Descrição</label>
          <textarea value={desc} onChange={e => setDesc(e.target.value)}
            placeholder="Descreva o efeito da habilidade..." style={{ minHeight: 70 }} />
        </div>
        <button className="btn btn-save" onClick={add} disabled={!nome.trim()}>
          <i className="fas fa-plus" /> Adicionar
        </button>
      </div>
    </div>
  )
}

function InventarioTab({ char, update }) {
  const [item, setItem] = useState('')
  const [qty, setQty] = useState(1)
  const inv = char.inventario || []

  const add = () => {
    if (!item.trim()) return
    update({ inventario: [...inv, { id: Date.now(), nome: item, qty }] })
    setItem(''); setQty(1)
  }
  const remove = (id) => update({ inventario: inv.filter(i => i.id !== id) })

  return (
    <div>
      <div className="section-header">
        <i className="fas fa-backpack section-header-icon" />
        <h2>Inventário</h2>
        <span className="badge badge-teal" style={{ marginLeft: 'auto' }}>
          {inv.length} {inv.length === 1 ? 'item' : 'itens'}
        </span>
      </div>

      {inv.length === 0
        ? <div className="empty-state" style={{ padding: '30px 10px' }}>
            <i className="fas fa-sack" />
            <p>Inventário vazio</p>
          </div>
        : <div style={{ marginBottom: 20 }}>
            {inv.map(it => (
              <div key={it.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 12px', borderBottom: '1px solid var(--border)',
              }}>
                <span className="badge badge-teal">{it.qty}×</span>
                <span style={{ flex: 1, fontFamily: "'Crimson Pro', serif", fontSize: '1rem' }}>{it.nome}</span>
                <button className="btn btn-delete" style={{ padding: '3px 8px', fontSize: '0.65rem' }}
                  onClick={() => remove(it.id)}>
                  <i className="fas fa-trash-alt" />
                </button>
              </div>
            ))}
          </div>
      }

      <div className="hb-form-card">
        <div className="hb-form-title"><i className="fas fa-plus" /> Adicionar Item</div>
        <div className="field-row field-row-2" style={{ marginBottom: 10 }}>
          <div className="field-group">
            <label>Nome do Item</label>
            <input value={item} onChange={e => setItem(e.target.value)} placeholder="Ex: Espada Longa +1" />
          </div>
          <div className="field-group">
            <label>Quantidade</label>
            <input type="number" min={1} value={qty} onChange={e => setQty(Number(e.target.value))} />
          </div>
        </div>
        <button className="btn btn-save" onClick={add} disabled={!item.trim()}>
          <i className="fas fa-plus" /> Adicionar
        </button>
      </div>
    </div>
  )
}

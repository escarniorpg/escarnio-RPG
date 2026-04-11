import { useState } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import HBListPanel from '../../components/HBListPanel'

const ATTR_KEYS = ['FOR', 'DES', 'CON', 'INT', 'SAB', 'CAR']

const EMPTY = {
  nome: '', subtipo: '', descricao: '',
  bonusAtrs: { FOR: 0, DES: 0, CON: 0, INT: 0, SAB: 0, CAR: 0 },
  habilidades: [],
  origens: '',
  tamanho: 'Médio',
  velocidade: 9,
}

export default function HBRacas() {
  const [items, setItems] = useLocalStorage('ldv_hb_racas', [])
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ ...EMPTY, bonusAtrs: { ...EMPTY.bonusAtrs } })
  const [habNome, setHabNome] = useState('')
  const [habDesc, setHabDesc] = useState('')

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const addHab = () => {
    if (!habNome.trim()) return
    f('habilidades', [...form.habilidades, { id: Date.now(), nome: habNome, desc: habDesc }])
    setHabNome(''); setHabDesc('')
  }

  const handleSave = () => {
    if (!form.nome.trim()) return
    setItems(prev => [...prev, { id: 'raca_' + Date.now(), ...form }])
    setForm({ ...EMPTY, bonusAtrs: { ...EMPTY.bonusAtrs }, habilidades: [] })
  }

  const handleDelete = (id) => {
    if (confirm('Excluir raça?')) {
      setItems(prev => prev.filter(i => i.id !== id))
      if (selected === id) setSelected(null)
    }
  }

  return (
    <HBListPanel
      items={items}
      selected={selected}
      onSelect={setSelected}
      onDelete={handleDelete}
      title="Raças"
      color="#2a8fa8"
      renderItem={item => ({
        icon: '🧬',
        name: item.nome,
        meta: [item.subtipo, item.tamanho].filter(Boolean).join(' · '),
      })}
      renderDetail={item => (
        <div>
          <div className="section-header"><h2>{item.nome}</h2></div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            {item.subtipo && <span className="badge badge-teal">{item.subtipo}</span>}
            <span className="badge badge-green">{item.tamanho}</span>
            <span className="badge badge-teal">Vel. {item.velocidade}m</span>
          </div>

          {/* Attr bonuses */}
          <div style={{ fontFamily: 'Rajdhani', fontSize: '0.72rem', color: 'var(--highlight)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Bônus de Atributo</div>
          <div className="attr-mini-grid" style={{ marginBottom: 16 }}>
            {ATTR_KEYS.map(k => (
              <div className="attr-mini" key={k}>
                <label>{k}</label>
                <div style={{ fontFamily: 'Rajdhani', fontSize: '1.1rem', color: item.bonusAtrs[k] > 0 ? 'var(--highlight-bright)' : 'var(--text-color)', fontWeight: 700 }}>
                  {item.bonusAtrs[k] > 0 ? `+${item.bonusAtrs[k]}` : item.bonusAtrs[k] || '—'}
                </div>
              </div>
            ))}
          </div>

          {item.descricao && <p style={{ fontFamily: "'Crimson Pro', serif", fontSize: '1rem', lineHeight: 1.6, marginBottom: 14 }}>{item.descricao}</p>}

          {item.habilidades?.length > 0 && (
            <>
              <div className="divider" />
              <div style={{ fontFamily: 'Rajdhani', fontSize: '0.72rem', color: 'var(--highlight)', letterSpacing: 1, textTransform: 'uppercase', margin: '12px 0 8px' }}>Habilidades Raciais</div>
              {item.habilidades.map(h => (
                <div className="ability-item" key={h.id}>
                  <div className="ability-name">{h.nome}</div>
                  {h.desc && <div className="ability-desc">{h.desc}</div>}
                </div>
              ))}
            </>
          )}

          {item.origens && (
            <>
              <div className="divider" />
              <div style={{ fontFamily: 'Rajdhani', fontSize: '0.72rem', color: 'var(--highlight)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Origens & Lore</div>
              <p style={{ fontFamily: "'Crimson Pro', serif", fontSize: '0.95rem', lineHeight: 1.6, fontStyle: 'italic', color: 'var(--text-color)' }}>{item.origens}</p>
            </>
          )}
        </div>
      )}
      renderForm={
        <div className="hb-form-card">
          <div className="hb-form-title">🧬 Nova Raça</div>

          <div className="field-row field-row-2" style={{ marginBottom: 10 }}>
            <div className="field-group">
              <label>Nome da Raça</label>
              <input value={form.nome} onChange={e => f('nome', e.target.value)} placeholder="Ex: Aquídeo" />
            </div>
            <div className="field-group">
              <label>Subtipo</label>
              <input value={form.subtipo} onChange={e => f('subtipo', e.target.value)} placeholder="Ex: Humanoide aquático" />
            </div>
          </div>

          <div className="field-row field-row-2" style={{ marginBottom: 10 }}>
            <div className="field-group">
              <label>Tamanho</label>
              <select value={form.tamanho} onChange={e => f('tamanho', e.target.value)}>
                {['Minúsculo','Pequeno','Médio','Grande','Enorme'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="field-group">
              <label>Velocidade (m)</label>
              <input type="number" min={1} value={form.velocidade} onChange={e => f('velocidade', Number(e.target.value))} />
            </div>
          </div>

          {/* Attr bonuses */}
          <div style={{ marginBottom: 10 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>Bônus de Atributos</label>
            <div className="attr-mini-grid">
              {ATTR_KEYS.map(k => (
                <div className="attr-mini" key={k}>
                  <label>{k}</label>
                  <input
                    type="number" min={-4} max={4}
                    value={form.bonusAtrs[k]}
                    onChange={e => f('bonusAtrs', { ...form.bonusAtrs, [k]: Number(e.target.value) })}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="field-group" style={{ marginBottom: 10 }}>
            <label>Descrição</label>
            <textarea value={form.descricao} onChange={e => f('descricao', e.target.value)}
              placeholder="Aparência, cultura, costumes..." style={{ minHeight: 70 }} />
          </div>

          {/* Habilidades */}
          <div style={{ marginBottom: 10 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>Habilidades Raciais</label>
            {form.habilidades.map((h, i) => (
              <div className="ability-entry" key={h.id}>
                <div style={{ flex: 1 }}>
                  <div className="ability-entry-name">{h.nome}</div>
                  {h.desc && <div className="ability-entry-desc">{h.desc}</div>}
                </div>
                <button className="hb-item-btn del"
                  onClick={() => f('habilidades', form.habilidades.filter((_, j) => j !== i))}>
                  <i className="fas fa-times" />
                </button>
              </div>
            ))}
            <div className="add-ability-row">
              <input value={habNome} onChange={e => setHabNome(e.target.value)}
                placeholder="Nome da habilidade" style={{ flex: 1 }} />
              <input value={habDesc} onChange={e => setHabDesc(e.target.value)}
                placeholder="Descrição breve" style={{ flex: 2 }} />
              <button className="btn btn-primary" onClick={addHab} disabled={!habNome.trim()}>
                <i className="fas fa-plus" />
              </button>
            </div>
          </div>

          <div className="field-group" style={{ marginBottom: 14 }}>
            <label>Origens & Lore</label>
            <textarea value={form.origens} onChange={e => f('origens', e.target.value)}
              placeholder="História, mitos e origens da raça..." style={{ minHeight: 60 }} />
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-save" onClick={handleSave} disabled={!form.nome.trim()}>
              <i className="fas fa-save" /> Salvar Raça
            </button>
            <button className="btn btn-ghost" onClick={() => setForm({ ...EMPTY, bonusAtrs: { ...EMPTY.bonusAtrs }, habilidades: [] })}>
              <i className="fas fa-undo" /> Limpar
            </button>
          </div>
        </div>
      }
    />
  )
}

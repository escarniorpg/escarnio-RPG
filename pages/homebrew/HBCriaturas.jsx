import { useState } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import HBListPanel from '../../components/HBListPanel'

const ND_CONFIG = [
  { nd: '1/8', label: 'ND 1/8', cls: 'nd-easy',   hp: [2,6],   xp: 25 },
  { nd: '1/4', label: 'ND 1/4', cls: 'nd-easy',   hp: [4,8],   xp: 50 },
  { nd: '1/2', label: 'ND 1/2', cls: 'nd-easy',   hp: [6,12],  xp: 100 },
  { nd: '1',   label: 'ND 1',   cls: 'nd-easy',   hp: [8,16],  xp: 200 },
  { nd: '2',   label: 'ND 2',   cls: 'nd-easy',   hp: [10,24], xp: 450 },
  { nd: '3',   label: 'ND 3',   cls: 'nd-medium', hp: [14,36], xp: 700 },
  { nd: '4',   label: 'ND 4',   cls: 'nd-medium', hp: [18,48], xp: 1100 },
  { nd: '5',   label: 'ND 5',   cls: 'nd-medium', hp: [22,64], xp: 1800 },
  { nd: '7',   label: 'ND 7',   cls: 'nd-medium', hp: [30,90], xp: 2900 },
  { nd: '10',  label: 'ND 10',  cls: 'nd-hard',   hp: [40,130],xp: 5900 },
  { nd: '15',  label: 'ND 15',  cls: 'nd-hard',   hp: [60,200],xp: 13000 },
  { nd: '20',  label: 'ND 20',  cls: 'nd-deadly', hp: [100,300],xp: 25000 },
  { nd: '30',  label: 'ND 30',  cls: 'nd-deadly', hp: [200,500],xp: 155000 },
]

const ATTR_KEYS = ['FOR', 'DES', 'CON', 'INT', 'SAB', 'CAR']
const TIPOS = ['Besta', 'Humanoide', 'Construto', 'Morto-vivo', 'Demônio', 'Dragão', 'Fada', 'Gigante', 'Monstruosidade', 'Planta', 'Elemental', 'Celestial']

const EMPTY = {
  nome: '', tipo: 'Besta', nd: '1', descricao: '', raca: '', reino: '', tamanho: '',
  attrs: { FOR: 10, DES: 10, CON: 10, INT: 4, SAB: 10, CAR: 4 },
  hp: 8, defesa: 10,
  habilidades: [], passivas: [], lendarias: [],
}

function calcMod(v) { const m = Math.floor((v - 10) / 2); return m >= 0 ? `+${m}` : `${m}` }

export default function HBCriaturas() {
  const [items, setItems] = useLocalStorage('ldv_hb_criaturas', [])
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ ...EMPTY, attrs: { ...EMPTY.attrs }, habilidades: [], passivas: [], lendarias: [] })
  const [habNome, setHabNome] = useState('')
  const [habDesc, setHabDesc] = useState('')
  const [habMode, setHabMode] = useState('habilidades')

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const addEntry = () => {
    if (!habNome.trim()) return
    f(habMode, [...form[habMode], { id: Date.now(), nome: habNome, desc: habDesc }])
    setHabNome(''); setHabDesc('')
  }

  const ndInfo = ND_CONFIG.find(n => n.nd === form.nd) || ND_CONFIG[3]

  const handleSave = () => {
    if (!form.nome.trim()) return
    setItems(prev => [...prev, { id: 'cr_' + Date.now(), ...form }])
    setForm({ ...EMPTY, attrs: { ...EMPTY.attrs }, habilidades: [], passivas: [], lendarias: [] })
  }

  const handleDelete = (id) => {
    if (confirm('Excluir criatura?')) {
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
      title="Criaturas"
      color="#d42020"
      renderItem={item => ({
        icon: item.tipo === 'Dragão' ? '🐲' : item.tipo === 'Morto-vivo' ? '💀' : item.tipo === 'Humanoide' ? '👤' : '🐉',
        name: item.nome,
        meta: `${item.tipo} · ND ${item.nd} · HP ${item.hp}`,
      })}
      renderDetail={item => {
        const ndConf = ND_CONFIG.find(n => n.nd === item.nd)
        return (
          <div>
            <div className="section-header"><h2>{item.nome}</h2></div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
              <span className="badge badge-red">ND {item.nd}</span>
              <span className="badge badge-teal">{item.tipo}</span>
              {item.tamanho && <span className="badge badge-green">{item.tamanho}</span>}
              {ndConf && <span className="badge badge-gold">{ndConf.xp} XP</span>}
            </div>

            <div className="field-row" style={{ gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div style={{ textAlign: 'center', background: 'rgba(200,50,50,0.08)', border: '1px solid rgba(200,50,50,0.2)', borderRadius: 4, padding: '8px' }}>
                <div style={{ fontFamily: 'Rajdhani', fontSize: '0.68rem', color: '#e87070', textTransform: 'uppercase', letterSpacing: 1 }}>Pontos de Vida</div>
                <div style={{ fontFamily: 'Rajdhani', fontSize: '1.6rem', fontWeight: 700, color: '#e87070' }}>{item.hp}</div>
              </div>
              <div style={{ textAlign: 'center', background: 'rgba(42,143,168,0.08)', border: '1px solid rgba(42,143,168,0.2)', borderRadius: 4, padding: '8px' }}>
                <div style={{ fontFamily: 'Rajdhani', fontSize: '0.68rem', color: 'var(--highlight-bright)', textTransform: 'uppercase', letterSpacing: 1 }}>Defesa</div>
                <div style={{ fontFamily: 'Rajdhani', fontSize: '1.6rem', fontWeight: 700, color: 'var(--highlight-bright)' }}>{item.defesa}</div>
              </div>
            </div>

            <div className="attr-mini-grid" style={{ marginBottom: 14 }}>
              {ATTR_KEYS.map(k => (
                <div className="attr-mini" key={k}>
                  <label>{k}</label>
                  <div style={{ fontFamily: 'Rajdhani', fontSize: '1rem', fontWeight: 700, color: '#d8eaf2' }}>{item.attrs[k]}</div>
                  <div style={{ fontFamily: 'Rajdhani', fontSize: '0.75rem', color: 'var(--highlight-dim)' }}>{calcMod(item.attrs[k])}</div>
                </div>
              ))}
            </div>

            {item.descricao && <p style={{ fontFamily: "'Crimson Pro', serif", fontSize: '1rem', lineHeight: 1.6, marginBottom: 12 }}>{item.descricao}</p>}

            {item.passivas?.length > 0 && (
              <>
                <div className="divider" />
                <div style={{ fontFamily: 'Rajdhani', fontSize: '0.72rem', color: 'var(--highlight)', letterSpacing: 1, textTransform: 'uppercase', margin: '10px 0 8px' }}>🛡 Passivas</div>
                {item.passivas.map(h => <div className="ability-item" key={h.id}><div className="ability-name">{h.nome}</div><div className="ability-desc">{h.desc}</div></div>)}
              </>
            )}
            {item.habilidades?.length > 0 && (
              <>
                <div className="divider" />
                <div style={{ fontFamily: 'Rajdhani', fontSize: '0.72rem', color: 'var(--highlight)', letterSpacing: 1, textTransform: 'uppercase', margin: '10px 0 8px' }}>⚔️ Habilidades</div>
                {item.habilidades.map(h => <div className="ability-item" key={h.id}><div className="ability-name">{h.nome}</div><div className="ability-desc">{h.desc}</div></div>)}
              </>
            )}
            {item.lendarias?.length > 0 && (
              <>
                <div className="divider" />
                <div style={{ fontFamily: 'Rajdhani', fontSize: '0.72rem', color: 'var(--gold)', letterSpacing: 1, textTransform: 'uppercase', margin: '10px 0 8px' }}>⭐ Ações Lendárias</div>
                {item.lendarias.map(h => <div className="ability-item" style={{ borderColor: 'rgba(200,168,75,0.2)' }} key={h.id}><div className="ability-name" style={{ color: 'var(--gold)' }}>{h.nome}</div><div className="ability-desc">{h.desc}</div></div>)}
              </>
            )}
          </div>
        )
      }}
      renderForm={
        <div className="hb-form-card">
          <div className="hb-form-title">🐲 Nova Criatura</div>

          <div className="field-row field-row-2" style={{ marginBottom: 10 }}>
            <div className="field-group">
              <label>Nome</label>
              <input value={form.nome} onChange={e => f('nome', e.target.value)} placeholder="Ex: Hidra das Brumas" />
            </div>
            <div className="field-group">
              <label>Tipo</label>
              <select value={form.tipo} onChange={e => f('tipo', e.target.value)}>
                {TIPOS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* ND Selector */}
          <div style={{ marginBottom: 10 }}>
            <label style={{ display: 'block', marginBottom: 6 }}>Nível de Desafio (ND)</label>
            <div className="nd-selector">
              {ND_CONFIG.map(n => (
                <button key={n.nd} type="button"
                  className={`nd-btn ${n.cls}${form.nd === n.nd ? ' active' : ''}`}
                  onClick={() => f('nd', n.nd)}>
                  {n.label}
                </button>
              ))}
            </div>
            <div style={{ marginTop: 6, fontFamily: 'Rajdhani', fontSize: '0.75rem', color: 'var(--highlight-dim)' }}>
              HP sugerido: {ndInfo.hp[0]}–{ndInfo.hp[1]} · XP: {ndInfo.xp}
            </div>
          </div>

          <div className="field-row field-row-4" style={{ marginBottom: 10 }}>
            <div className="field-group">
              <label>HP</label>
              <input type="number" min={1} value={form.hp} onChange={e => f('hp', Number(e.target.value))} />
            </div>
            <div className="field-group">
              <label>Defesa</label>
              <input type="number" min={1} value={form.defesa} onChange={e => f('defesa', Number(e.target.value))} />
            </div>
            <div className="field-group" style={{ gridColumn: 'span 2' }}>
              <label>Tamanho</label>
              <input value={form.tamanho} onChange={e => f('tamanho', e.target.value)} placeholder="Ex: Grande (3m)" />
            </div>
          </div>

          {/* Attrs */}
          <div style={{ marginBottom: 10 }}>
            <label style={{ display: 'block', marginBottom: 6 }}>Atributos</label>
            <div className="attr-mini-grid">
              {ATTR_KEYS.map(k => (
                <div className="attr-mini" key={k}>
                  <label>{k}</label>
                  <input type="number" min={1} max={30}
                    value={form.attrs[k]}
                    onChange={e => f('attrs', { ...form.attrs, [k]: Number(e.target.value) })}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="field-group" style={{ marginBottom: 10 }}>
            <label>Descrição</label>
            <textarea value={form.descricao} onChange={e => f('descricao', e.target.value)}
              placeholder="Aparência e comportamento..." style={{ minHeight: 60 }} />
          </div>

          {/* Abilities */}
          <div style={{ marginBottom: 10 }}>
            <label style={{ display: 'block', marginBottom: 6 }}>Habilidades & Ações</label>
            <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
              {['habilidades','passivas','lendarias'].map(m => (
                <button key={m} type="button"
                  className={`btn ${habMode === m ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ fontSize: '0.65rem', padding: '4px 10px' }}
                  onClick={() => setHabMode(m)}>
                  {m === 'habilidades' ? '⚔️ Hab.' : m === 'passivas' ? '🛡 Passivas' : '⭐ Lendárias'}
                </button>
              ))}
            </div>
            {form[habMode].map((h, i) => (
              <div className="ability-entry" key={h.id}>
                <div style={{ flex: 1 }}>
                  <div className="ability-entry-name">{h.nome}</div>
                  {h.desc && <div className="ability-entry-desc">{h.desc}</div>}
                </div>
                <button className="hb-item-btn del"
                  onClick={() => f(habMode, form[habMode].filter((_, j) => j !== i))}>
                  <i className="fas fa-times" />
                </button>
              </div>
            ))}
            <div className="add-ability-row">
              <input value={habNome} onChange={e => setHabNome(e.target.value)} placeholder="Nome" style={{ flex: 1 }} />
              <input value={habDesc} onChange={e => setHabDesc(e.target.value)} placeholder="Descrição" style={{ flex: 2 }} />
              <button className="btn btn-primary" onClick={addEntry} disabled={!habNome.trim()}><i className="fas fa-plus" /></button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-save" onClick={handleSave} disabled={!form.nome.trim()}>
              <i className="fas fa-save" /> Salvar Criatura
            </button>
            <button className="btn btn-ghost" onClick={() => setForm({ ...EMPTY, attrs: { ...EMPTY.attrs }, habilidades: [], passivas: [], lendarias: [] })}>
              <i className="fas fa-undo" /> Limpar
            </button>
          </div>
        </div>
      }
    />
  )
}

import { useState } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import HBListPanel from '../../components/HBListPanel'

const TIPOS = ['Arma', 'Armadura', 'Acessório', 'Consumível', 'Ferramenta', 'Veículo', 'Tesouro', 'Outro']
const RARIDADES = [
  { id: 'comum',      label: 'Comum',      cls: 'rarity-comum' },
  { id: 'incomum',    label: 'Incomum',    cls: 'rarity-incomum' },
  { id: 'raro',       label: 'Raro',       cls: 'rarity-raro' },
  { id: 'muito-raro', label: 'Muito Raro', cls: 'rarity-muito-raro' },
  { id: 'lendario',   label: 'Lendário',   cls: 'rarity-lendario' },
  { id: 'unico',      label: 'Único',      cls: 'rarity-unico' },
]

const EMPTY = {
  nome: '', tipo: 'Arma', raridade: 'comum',
  dano: '', alcance: '', peso: '', preco: '',
  descricao: '', efeito: '', requerimentos: '',
}

export default function HBEquipamentos() {
  const [items, setItems] = useLocalStorage('ldv_hb_equip', [])
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ ...EMPTY })

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSave = () => {
    if (!form.nome.trim()) return
    const item = { id: 'eq_' + Date.now(), ...form }
    setItems(prev => [...prev, item])
    setForm({ ...EMPTY })
  }

  const handleDelete = (id) => {
    if (confirm('Excluir equipamento?')) {
      setItems(prev => prev.filter(i => i.id !== id))
      if (selected === id) setSelected(null)
    }
  }

  const rarityColor = {
    comum: '#aaa', incomum: '#3a8a3a', raro: '#7070ff',
    'muito-raro': '#c080ff', lendario: '#c8a84b', unico: '#e87070',
  }

  return (
    <HBListPanel
      items={items}
      selected={selected}
      onSelect={setSelected}
      onDelete={handleDelete}
      title="Equipamentos"
      color="#c8900a"
      renderItem={item => ({
        icon: item.tipo === 'Arma' ? '⚔️'
          : item.tipo === 'Armadura' ? '🛡️'
          : item.tipo === 'Consumível' ? '🧪'
          : item.tipo === 'Acessório' ? '💍' : '📦',
        name: item.nome,
        meta: `${item.tipo} · ${RARIDADES.find(r => r.id === item.raridade)?.label || item.raridade}`,
      })}
      renderDetail={item => (
        <div>
          <div className="section-header">
            <h2>{item.nome}</h2>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            <span className="badge badge-gold">{item.tipo}</span>
            <span style={{
              padding: '2px 10px', borderRadius: 20,
              border: `1px solid ${rarityColor[item.raridade] || '#aaa'}`,
              color: rarityColor[item.raridade] || '#aaa',
              fontFamily: 'Rajdhani, sans-serif', fontSize: '0.68rem',
              fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
              background: 'transparent',
            }}>
              {RARIDADES.find(r => r.id === item.raridade)?.label}
            </span>
          </div>

          {(item.dano || item.alcance || item.peso || item.preco) && (
            <>
              <div className="field-row field-row-4" style={{ marginBottom: 14 }}>
                {[['dano','Dano'],['alcance','Alcance'],['peso','Peso'],['preco','Preço']].map(([k, l]) =>
                  item[k] ? (
                    <div key={k}>
                      <div style={{ fontFamily: 'Rajdhani', fontSize: '0.68rem', color: 'var(--highlight)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 3 }}>{l}</div>
                      <div style={{ fontFamily: 'Rajdhani', fontSize: '1rem', color: '#d8eaf2', fontWeight: 700 }}>{item[k]}</div>
                    </div>
                  ) : null
                )}
              </div>
              <div className="divider" />
            </>
          )}

          {item.descricao && (
            <p style={{ fontFamily: "'Crimson Pro', serif", fontSize: '1rem', lineHeight: 1.6, marginBottom: 12, color: 'var(--text-color)' }}>
              {item.descricao}
            </p>
          )}
          {item.efeito && (
            <div style={{ background: 'rgba(200,168,75,0.06)', border: '1px solid rgba(200,168,75,0.2)', borderRadius: 4, padding: '10px 14px', marginBottom: 12 }}>
              <div style={{ fontFamily: 'Rajdhani', fontSize: '0.72rem', color: 'var(--gold)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>✦ Efeito Especial</div>
              <p style={{ fontFamily: "'Crimson Pro', serif", fontSize: '0.95rem', lineHeight: 1.5 }}>{item.efeito}</p>
            </div>
          )}
          {item.requerimentos && (
            <div style={{ fontFamily: 'Rajdhani', fontSize: '0.78rem', color: 'var(--highlight-dim)', letterSpacing: 0.5 }}>
              <i className="fas fa-lock" style={{ marginRight: 6 }} />
              Requer: {item.requerimentos}
            </div>
          )}
        </div>
      )}
      renderForm={
        <div className="hb-form-card">
          <div className="hb-form-title">⚔️ Novo Equipamento</div>

          <div className="field-group" style={{ marginBottom: 10 }}>
            <label>Nome</label>
            <input value={form.nome} onChange={e => f('nome', e.target.value)} placeholder="Ex: Espada das Sombras" />
          </div>

          <div className="field-row field-row-2" style={{ marginBottom: 10 }}>
            <div className="field-group">
              <label>Tipo</label>
              <select value={form.tipo} onChange={e => f('tipo', e.target.value)}>
                {TIPOS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="field-group">
              <label>Raridade</label>
              <div className="rarity-grid">
                {RARIDADES.map(r => (
                  <button
                    key={r.id}
                    type="button"
                    className={`rarity-btn ${r.cls}${form.raridade === r.id ? ' active' : ''}`}
                    onClick={() => f('raridade', r.id)}
                  >{r.label}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="field-row field-row-4" style={{ marginBottom: 10 }}>
            {[['dano','Dano','1d6 cortante'],['alcance','Alcance','5m'],['peso','Peso (kg)','1.5'],['preco','Preço','50 PO']].map(([k,l,ph]) => (
              <div className="field-group" key={k}>
                <label>{l}</label>
                <input value={form[k]} onChange={e => f(k, e.target.value)} placeholder={ph} />
              </div>
            ))}
          </div>

          <div className="field-group" style={{ marginBottom: 10 }}>
            <label>Descrição</label>
            <textarea value={form.descricao} onChange={e => f('descricao', e.target.value)}
              placeholder="Aparência e história do item..." style={{ minHeight: 70 }} />
          </div>

          <div className="field-group" style={{ marginBottom: 10 }}>
            <label>Efeito Especial</label>
            <textarea value={form.efeito} onChange={e => f('efeito', e.target.value)}
              placeholder="Habilidades mágicas ou bônus especiais..." style={{ minHeight: 60 }} />
          </div>

          <div className="field-group" style={{ marginBottom: 14 }}>
            <label>Requerimentos</label>
            <input value={form.requerimentos} onChange={e => f('requerimentos', e.target.value)}
              placeholder="Ex: Proficiência em armas marciais" />
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-save" onClick={handleSave} disabled={!form.nome.trim()}>
              <i className="fas fa-save" /> Salvar
            </button>
            <button className="btn btn-ghost" onClick={() => setForm({ ...EMPTY })}>
              <i className="fas fa-undo" /> Limpar
            </button>
          </div>
        </div>
      }
    />
  )
}

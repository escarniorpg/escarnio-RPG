import { useState } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import HBListPanel from '../../components/HBListPanel'

const REINOS = ['Ar', 'Água', 'Terra', 'Fogo', 'Sombra', 'Luz', 'Arcano', 'Primordial']
const PORTES = ['Aldeia', 'Vila', 'Cidade', 'Metrópole', 'Fortaleza', 'Ruína', 'Região', 'País']

const EMPTY = {
  nome: '', reino: '', porte: 'Cidade', populacao: '',
  descricao: '', historia: '', clima: '',
  npcs: [], pontosInteresse: [], rumores: '',
}

export default function HBCidades() {
  const [items, setItems] = useLocalStorage('ldv_hb_cidades', [])
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ ...EMPTY, npcs: [], pontosInteresse: [] })
  const [npcNome, setNpcNome] = useState('')
  const [npcDesc, setNpcDesc] = useState('')
  const [piNome, setPiNome] = useState('')
  const [piDesc, setPiDesc] = useState('')

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const addNpc = () => {
    if (!npcNome.trim()) return
    f('npcs', [...form.npcs, { id: Date.now(), nome: npcNome, desc: npcDesc }])
    setNpcNome(''); setNpcDesc('')
  }
  const addPi = () => {
    if (!piNome.trim()) return
    f('pontosInteresse', [...form.pontosInteresse, { id: Date.now(), nome: piNome, desc: piDesc }])
    setPiNome(''); setPiDesc('')
  }

  const handleSave = () => {
    if (!form.nome.trim()) return
    setItems(prev => [...prev, { id: 'cid_' + Date.now(), ...form }])
    setForm({ ...EMPTY, npcs: [], pontosInteresse: [] })
  }

  const handleDelete = (id) => {
    if (confirm('Excluir cidade?')) {
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
      title="Cidades & Regiões"
      color="#14b478"
      renderItem={item => ({
        icon: item.porte === 'Ruína' ? '🏚️' : item.porte === 'Aldeia' ? '🏘️' : item.porte === 'Fortaleza' ? '🏰' : '🏙️',
        name: item.nome,
        meta: [item.porte, item.reino ? `Reino ${item.reino}` : null, item.populacao ? `Pop. ${item.populacao}` : null].filter(Boolean).join(' · '),
      })}
      renderDetail={item => (
        <div>
          <div className="section-header"><h2>{item.nome}</h2></div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
            <span className="badge badge-green">{item.porte}</span>
            {item.reino && <span className="badge badge-teal">Reino {item.reino}</span>}
            {item.populacao && <span className="badge badge-gold"><i className="fas fa-users" /> {item.populacao}</span>}
            {item.clima && <span className="badge badge-purple"><i className="fas fa-cloud" /> {item.clima}</span>}
          </div>

          {item.descricao && <p style={{ fontFamily: "'Crimson Pro', serif", fontSize: '1rem', lineHeight: 1.6, marginBottom: 12 }}>{item.descricao}</p>}
          {item.historia && (
            <>
              <div className="divider" />
              <div style={{ fontFamily: 'Rajdhani', fontSize: '0.72rem', color: '#14b478', letterSpacing: 1, textTransform: 'uppercase', margin: '10px 0 6px' }}>📜 História</div>
              <p style={{ fontFamily: "'Crimson Pro', serif", fontSize: '0.95rem', lineHeight: 1.6, fontStyle: 'italic' }}>{item.historia}</p>
            </>
          )}

          {item.npcs?.length > 0 && (
            <>
              <div className="divider" />
              <div style={{ fontFamily: 'Rajdhani', fontSize: '0.72rem', color: '#14b478', letterSpacing: 1, textTransform: 'uppercase', margin: '10px 0 8px' }}>👤 NPCs Notáveis</div>
              {item.npcs.map(n => (
                <div className="ability-item" key={n.id} style={{ borderColor: 'rgba(20,180,120,0.2)' }}>
                  <div className="ability-name" style={{ color: '#14b478' }}>{n.nome}</div>
                  {n.desc && <div className="ability-desc">{n.desc}</div>}
                </div>
              ))}
            </>
          )}

          {item.pontosInteresse?.length > 0 && (
            <>
              <div className="divider" />
              <div style={{ fontFamily: 'Rajdhani', fontSize: '0.72rem', color: '#14b478', letterSpacing: 1, textTransform: 'uppercase', margin: '10px 0 8px' }}>📍 Pontos de Interesse</div>
              {item.pontosInteresse.map(p => (
                <div className="ability-item" key={p.id} style={{ borderColor: 'rgba(20,180,120,0.2)' }}>
                  <div className="ability-name" style={{ color: '#40e0a0' }}>{p.nome}</div>
                  {p.desc && <div className="ability-desc">{p.desc}</div>}
                </div>
              ))}
            </>
          )}

          {item.rumores && (
            <>
              <div className="divider" />
              <div style={{ fontFamily: 'Rajdhani', fontSize: '0.72rem', color: '#14b478', letterSpacing: 1, textTransform: 'uppercase', margin: '10px 0 6px' }}>🗣 Rumores</div>
              <p style={{ fontFamily: "'Crimson Pro', serif", fontSize: '0.95rem', lineHeight: 1.6 }}>{item.rumores}</p>
            </>
          )}
        </div>
      )}
      renderForm={
        <div className="hb-form-card">
          <div className="hb-form-title">🏙️ Nova Cidade / Região</div>

          <div className="field-row field-row-2" style={{ marginBottom: 10 }}>
            <div className="field-group">
              <label>Nome</label>
              <input value={form.nome} onChange={e => f('nome', e.target.value)} placeholder="Ex: Porto Veleiro" />
            </div>
            <div className="field-group">
              <label>Porte</label>
              <select value={form.porte} onChange={e => f('porte', e.target.value)}>
                {PORTES.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="field-row field-row-3" style={{ marginBottom: 10 }}>
            <div className="field-group">
              <label>Reino</label>
              <select value={form.reino} onChange={e => f('reino', e.target.value)}>
                <option value="">—</option>
                {REINOS.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="field-group">
              <label>População</label>
              <input value={form.populacao} onChange={e => f('populacao', e.target.value)} placeholder="Ex: ~12.000" />
            </div>
            <div className="field-group">
              <label>Clima</label>
              <input value={form.clima} onChange={e => f('clima', e.target.value)} placeholder="Ex: Tropical úmido" />
            </div>
          </div>

          <div className="field-group" style={{ marginBottom: 10 }}>
            <label>Descrição</label>
            <textarea value={form.descricao} onChange={e => f('descricao', e.target.value)}
              placeholder="Aparência geral, cultura, atmosfera..." style={{ minHeight: 70 }} />
          </div>

          <div className="field-group" style={{ marginBottom: 10 }}>
            <label>História</label>
            <textarea value={form.historia} onChange={e => f('historia', e.target.value)}
              placeholder="Fundação, eventos marcantes, mitos..." style={{ minHeight: 60 }} />
          </div>

          {/* NPCs */}
          <div style={{ marginBottom: 10 }}>
            <label style={{ display: 'block', marginBottom: 6 }}>👤 NPCs Notáveis</label>
            {form.npcs.map((n, i) => (
              <div className="ability-entry" key={n.id}>
                <div style={{ flex: 1 }}>
                  <div className="ability-entry-name" style={{ color: '#14b478' }}>{n.nome}</div>
                  {n.desc && <div className="ability-entry-desc">{n.desc}</div>}
                </div>
                <button className="hb-item-btn del" onClick={() => f('npcs', form.npcs.filter((_, j) => j !== i))}><i className="fas fa-times" /></button>
              </div>
            ))}
            <div className="add-ability-row">
              <input value={npcNome} onChange={e => setNpcNome(e.target.value)} placeholder="Nome do NPC" style={{ flex: 1 }} />
              <input value={npcDesc} onChange={e => setNpcDesc(e.target.value)} placeholder="Papel / descrição" style={{ flex: 2 }} />
              <button className="btn btn-primary" onClick={addNpc} disabled={!npcNome.trim()}><i className="fas fa-plus" /></button>
            </div>
          </div>

          {/* Pontos de Interesse */}
          <div style={{ marginBottom: 10 }}>
            <label style={{ display: 'block', marginBottom: 6 }}>📍 Pontos de Interesse</label>
            {form.pontosInteresse.map((p, i) => (
              <div className="ability-entry" key={p.id}>
                <div style={{ flex: 1 }}>
                  <div className="ability-entry-name" style={{ color: '#40e0a0' }}>{p.nome}</div>
                  {p.desc && <div className="ability-entry-desc">{p.desc}</div>}
                </div>
                <button className="hb-item-btn del" onClick={() => f('pontosInteresse', form.pontosInteresse.filter((_, j) => j !== i))}><i className="fas fa-times" /></button>
              </div>
            ))}
            <div className="add-ability-row">
              <input value={piNome} onChange={e => setPiNome(e.target.value)} placeholder="Local" style={{ flex: 1 }} />
              <input value={piDesc} onChange={e => setPiDesc(e.target.value)} placeholder="Descrição breve" style={{ flex: 2 }} />
              <button className="btn btn-primary" onClick={addPi} disabled={!piNome.trim()}><i className="fas fa-plus" /></button>
            </div>
          </div>

          <div className="field-group" style={{ marginBottom: 14 }}>
            <label>Rumores</label>
            <textarea value={form.rumores} onChange={e => f('rumores', e.target.value)}
              placeholder="Boatos, lendas locais, mistérios..." style={{ minHeight: 50 }} />
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-save" onClick={handleSave} disabled={!form.nome.trim()}>
              <i className="fas fa-save" /> Salvar
            </button>
            <button className="btn btn-ghost" onClick={() => setForm({ ...EMPTY, npcs: [], pontosInteresse: [] })}>
              <i className="fas fa-undo" /> Limpar
            </button>
          </div>
        </div>
      }
    />
  )
}

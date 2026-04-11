import { useState } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import HBListPanel from '../../components/HBListPanel'

const TIPOS = ['Guilda', 'Facção', 'Ordem', 'Culto', 'Organização Secreta', 'Império', 'Clã', 'Seita', 'Aliança']
const ALINHAMENTOS = ['Lei Boa', 'Neutro Bom', 'Caos Bom', 'Lei Neutro', 'Neutro', 'Caos Neutro', 'Lei Mau', 'Neutro Mau', 'Caos Mau']

const EMPTY = {
  nome: '', tipo: 'Guilda', alinhamento: 'Neutro',
  lema: '', descricao: '', objetivos: '', historia: '',
  membros: [], ranques: '', vantagens: '', segredos: '',
}

export default function HBAfiliacoes() {
  const [items, setItems] = useLocalStorage('ldv_hb_afiliacoes', [])
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ ...EMPTY, membros: [] })
  const [mNome, setMNome] = useState('')
  const [mDesc, setMDesc] = useState('')

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const addMembro = () => {
    if (!mNome.trim()) return
    f('membros', [...form.membros, { id: Date.now(), nome: mNome, desc: mDesc }])
    setMNome(''); setMDesc('')
  }

  const handleSave = () => {
    if (!form.nome.trim()) return
    setItems(prev => [...prev, { id: 'afil_' + Date.now(), ...form }])
    setForm({ ...EMPTY, membros: [] })
  }

  const handleDelete = (id) => {
    if (confirm('Excluir afiliação?')) {
      setItems(prev => prev.filter(i => i.id !== id))
      if (selected === id) setSelected(null)
    }
  }

  const tipoIcon = { Guilda: '⚒️', Facção: '⚔️', Ordem: '🏛️', Culto: '🌑', 'Organização Secreta': '👁️', Clã: '🛡️' }

  return (
    <HBListPanel
      items={items}
      selected={selected}
      onSelect={setSelected}
      onDelete={handleDelete}
      title="Afiliações"
      color="#8a20e0"
      renderItem={item => ({
        icon: tipoIcon[item.tipo] || '🏛️',
        name: item.nome,
        meta: [item.tipo, item.alinhamento].filter(Boolean).join(' · '),
      })}
      renderDetail={item => (
        <div>
          <div className="section-header"><h2>{item.nome}</h2></div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
            <span className="badge badge-purple">{item.tipo}</span>
            <span className="badge badge-teal">{item.alinhamento}</span>
          </div>

          {item.lema && (
            <div style={{
              fontFamily: "'Crimson Pro', serif", fontStyle: 'italic', fontSize: '1.05rem',
              color: '#c8b0ff', borderLeft: '3px solid #8a20e0', paddingLeft: 12,
              marginBottom: 14,
            }}>
              "{item.lema}"
            </div>
          )}

          {item.descricao && <p style={{ fontFamily: "'Crimson Pro', serif", fontSize: '1rem', lineHeight: 1.6, marginBottom: 12 }}>{item.descricao}</p>}

          {item.objetivos && (
            <>
              <div className="divider" />
              <div style={{ fontFamily: 'Rajdhani', fontSize: '0.72rem', color: '#b050ff', letterSpacing: 1, textTransform: 'uppercase', margin: '10px 0 6px' }}>🎯 Objetivos</div>
              <p style={{ fontFamily: "'Crimson Pro', serif", fontSize: '0.95rem', lineHeight: 1.6 }}>{item.objetivos}</p>
            </>
          )}

          {item.vantagens && (
            <>
              <div className="divider" />
              <div style={{ fontFamily: 'Rajdhani', fontSize: '0.72rem', color: '#b050ff', letterSpacing: 1, textTransform: 'uppercase', margin: '10px 0 6px' }}>✨ Vantagens dos Membros</div>
              <p style={{ fontFamily: "'Crimson Pro', serif", fontSize: '0.95rem', lineHeight: 1.6 }}>{item.vantagens}</p>
            </>
          )}

          {item.ranques && (
            <>
              <div className="divider" />
              <div style={{ fontFamily: 'Rajdhani', fontSize: '0.72rem', color: '#b050ff', letterSpacing: 1, textTransform: 'uppercase', margin: '10px 0 6px' }}>⬆️ Ranques</div>
              <p style={{ fontFamily: "'Crimson Pro', serif", fontSize: '0.95rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{item.ranques}</p>
            </>
          )}

          {item.membros?.length > 0 && (
            <>
              <div className="divider" />
              <div style={{ fontFamily: 'Rajdhani', fontSize: '0.72rem', color: '#b050ff', letterSpacing: 1, textTransform: 'uppercase', margin: '10px 0 8px' }}>👤 Membros Notáveis</div>
              {item.membros.map(m => (
                <div className="ability-item" key={m.id} style={{ borderColor: 'rgba(138,32,224,0.2)' }}>
                  <div className="ability-name" style={{ color: '#c8b0ff' }}>{m.nome}</div>
                  {m.desc && <div className="ability-desc">{m.desc}</div>}
                </div>
              ))}
            </>
          )}

          {item.segredos && (
            <>
              <div className="divider" />
              <div style={{ fontFamily: 'Rajdhani', fontSize: '0.72rem', color: '#e87070', letterSpacing: 1, textTransform: 'uppercase', margin: '10px 0 6px' }}>🔒 Segredos</div>
              <p style={{ fontFamily: "'Crimson Pro', serif", fontSize: '0.95rem', lineHeight: 1.6, color: 'rgba(184,212,224,0.6)' }}>{item.segredos}</p>
            </>
          )}
        </div>
      )}
      renderForm={
        <div className="hb-form-card">
          <div className="hb-form-title">🏛️ Nova Afiliação</div>

          <div className="field-row field-row-2" style={{ marginBottom: 10 }}>
            <div className="field-group">
              <label>Nome</label>
              <input value={form.nome} onChange={e => f('nome', e.target.value)} placeholder="Ex: Irmandade das Marés" />
            </div>
            <div className="field-group">
              <label>Tipo</label>
              <select value={form.tipo} onChange={e => f('tipo', e.target.value)}>
                {TIPOS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="field-row field-row-2" style={{ marginBottom: 10 }}>
            <div className="field-group">
              <label>Alinhamento</label>
              <select value={form.alinhamento} onChange={e => f('alinhamento', e.target.value)}>
                {ALINHAMENTOS.map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div className="field-group">
              <label>Lema</label>
              <input value={form.lema} onChange={e => f('lema', e.target.value)} placeholder="Ex: A maré nos une" />
            </div>
          </div>

          <div className="field-group" style={{ marginBottom: 10 }}>
            <label>Descrição</label>
            <textarea value={form.descricao} onChange={e => f('descricao', e.target.value)}
              placeholder="Identidade, cultura, aparência dos membros..." style={{ minHeight: 70 }} />
          </div>

          <div className="field-group" style={{ marginBottom: 10 }}>
            <label>Objetivos</label>
            <textarea value={form.objetivos} onChange={e => f('objetivos', e.target.value)}
              placeholder="Metas públicas e agendas ocultas..." style={{ minHeight: 55 }} />
          </div>

          <div className="field-group" style={{ marginBottom: 10 }}>
            <label>Ranques (um por linha)</label>
            <textarea value={form.ranques} onChange={e => f('ranques', e.target.value)}
              placeholder="Iniciado&#10;Aprendiz&#10;Irmão&#10;Mestre" style={{ minHeight: 80 }} />
          </div>

          <div className="field-group" style={{ marginBottom: 10 }}>
            <label>Vantagens dos Membros</label>
            <textarea value={form.vantagens} onChange={e => f('vantagens', e.target.value)}
              placeholder="Bônus, recursos, proteção..." style={{ minHeight: 55 }} />
          </div>

          {/* Membros notáveis */}
          <div style={{ marginBottom: 10 }}>
            <label style={{ display: 'block', marginBottom: 6 }}>👤 Membros Notáveis</label>
            {form.membros.map((m, i) => (
              <div className="ability-entry" key={m.id}>
                <div style={{ flex: 1 }}>
                  <div className="ability-entry-name" style={{ color: '#c8b0ff' }}>{m.nome}</div>
                  {m.desc && <div className="ability-entry-desc">{m.desc}</div>}
                </div>
                <button className="hb-item-btn del" onClick={() => f('membros', form.membros.filter((_, j) => j !== i))}><i className="fas fa-times" /></button>
              </div>
            ))}
            <div className="add-ability-row">
              <input value={mNome} onChange={e => setMNome(e.target.value)} placeholder="Nome" style={{ flex: 1 }} />
              <input value={mDesc} onChange={e => setMDesc(e.target.value)} placeholder="Papel / ranque" style={{ flex: 2 }} />
              <button className="btn btn-primary" onClick={addMembro} disabled={!mNome.trim()}><i className="fas fa-plus" /></button>
            </div>
          </div>

          <div className="field-group" style={{ marginBottom: 14 }}>
            <label>🔒 Segredos (visível só para o Mestre)</label>
            <textarea value={form.segredos} onChange={e => f('segredos', e.target.value)}
              placeholder="Verdades ocultas, conspirações, fraquezas..." style={{ minHeight: 55 }} />
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-save" onClick={handleSave} disabled={!form.nome.trim()}>
              <i className="fas fa-save" /> Salvar
            </button>
            <button className="btn btn-ghost" onClick={() => setForm({ ...EMPTY, membros: [] })}>
              <i className="fas fa-undo" /> Limpar
            </button>
          </div>
        </div>
      }
    />
  )
}

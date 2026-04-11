import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

function genCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export default function Campanhas() {
  const [camps, setCamps] = useLocalStorage('ldv_camps', [])
  const [showModal, setShowModal] = useState(false)
  const [mode, setMode] = useState('create') // 'create' | 'join'
  const [form, setForm] = useState({ name: '', isPrivate: false, code: '' })
  const [selected, setSelected] = useState(null)

  const handleCreate = () => {
    if (!form.name.trim()) return
    const camp = {
      id: 'camp_' + Date.now(),
      name: form.name.trim(),
      code: genCode(),
      isPrivate: form.isPrivate,
      isMaster: true,
      members: 1,
      createdAt: Date.now(),
    }
    setCamps(prev => [...prev, camp])
    setShowModal(false)
    setForm({ name: '', isPrivate: false, code: '' })
    setSelected(camp.id)
  }

  const handleJoin = () => {
    if (!form.code.trim()) return
    alert(`Entrando na campanha com código: ${form.code.toUpperCase()}\n(Requer Firebase para funcionar online)`)
    setShowModal(false)
  }

  const handleRemove = (e, id) => {
    e.stopPropagation()
    if (confirm('Remover esta campanha da lista?')) {
      setCamps(prev => prev.filter(c => c.id !== id))
      if (selected === id) setSelected(null)
    }
  }

  const sel = camps.find(c => c.id === selected)

  return (
    <div className="camps-wrap">
      <div className="page-title">
        <h1>CAMPANHAS</h1>
        <p>Gerencie suas campanhas de RPG</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: 20 }}>
        {/* List */}
        <div>
          {camps.length === 0
            ? <div className="empty-state">
                <i className="fas fa-dragon" />
                <p>Nenhuma campanha ainda</p>
              </div>
            : camps.map(c => (
                <div
                  key={c.id}
                  className="camp-row"
                  style={selected === c.id ? { borderColor: 'rgba(100,80,200,0.6)', background: 'rgba(59,0,114,0.08)' } : {}}
                  onClick={() => setSelected(c.id === selected ? null : c.id)}
                >
                  <div className={`camp-ico${c.isMaster ? ' is-master' : ''}`}>
                    <i className={`fas fa-${c.isMaster ? 'crown' : 'shield-alt'}`} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="camp-name">{c.name}</div>
                    <div className="camp-meta">
                      {c.isMaster
                        ? <span style={{ color: '#c8a84b' }}>👑 Mestre</span>
                        : <span style={{ color: '#9090c0' }}>⚔️ Jogador</span>}
                      {' · '}{c.members} membro(s)
                      {' · '}<span className="camp-code">{c.code}</span>
                    </div>
                  </div>
                  <button
                    className="btn btn-ghost"
                    style={{ fontSize: '0.68rem', padding: '4px 8px' }}
                    onClick={e => handleRemove(e, c.id)}
                  >
                    <i className="fas fa-times" />
                  </button>
                </div>
              ))
          }

          <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
            <button className="btn btn-primary" onClick={() => { setMode('create'); setShowModal(true) }}>
              <i className="fas fa-plus" /> Nova Campanha
            </button>
            <button className="btn btn-ghost" onClick={() => { setMode('join'); setShowModal(true) }}>
              <i className="fas fa-door-open" /> Entrar por Código
            </button>
          </div>
        </div>

        {/* Detail panel */}
        {sel && (
          <div className="container" style={{ padding: 20 }}>
            <div className="section-header">
              <i className="fas fa-dragon section-header-icon" />
              <h2>{sel.name}</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <span className="badge badge-purple">
                  <i className="fas fa-key" /> {sel.code}
                </span>
                {sel.isMaster && <span className="badge badge-gold"><i className="fas fa-crown" /> Mestre</span>}
                {sel.isPrivate && <span className="badge badge-red"><i className="fas fa-lock" /> Privada</span>}
              </div>

              <div className="divider" />

              <div className="modal-section-title">Fichas dos Jogadores</div>
              <div className="empty-state" style={{ padding: '20px 0' }}>
                <i className="fas fa-users" style={{ fontSize: '1.6rem' }} />
                <p style={{ marginTop: 8 }}>Nenhum jogador conectado</p>
              </div>

              <div className="modal-section-title">Histórico de Dados</div>
              <div className="empty-state" style={{ padding: '20px 0' }}>
                <i className="fas fa-dice-d20" style={{ fontSize: '1.6rem' }} />
                <p style={{ marginTop: 8 }}>Sem rolagens registradas</p>
              </div>

              {sel.isMaster && (
                <>
                  <div className="divider" />
                  <div className="modal-section-title" style={{ color: '#c05050' }}>Zona de Perigo</div>
                  <button className="btn btn-delete" onClick={() => {
                    if (confirm('Excluir campanha permanentemente?')) {
                      setCamps(prev => prev.filter(c => c.id !== sel.id))
                      setSelected(null)
                    }
                  }}>
                    <i className="fas fa-trash-alt" /> Excluir Campanha
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>
              <i className="fas fa-times" />
            </button>
            <div className="modal-title">
              <i className="fas fa-dragon" style={{ color: '#c8b0ff' }} />
              Sistema de Campanhas
            </div>

            {/* Tab switch */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {['create', 'join'].map(m => (
                <button
                  key={m}
                  className={`btn ${mode === m ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setMode(m)}
                >
                  {m === 'create' ? '✦ Nova Campanha' : '⚔ Entrar por Código'}
                </button>
              ))}
            </div>

            {mode === 'create' ? (
              <div className="create-char-form">
                <div className="field-group">
                  <label>Nome da Campanha</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Ex: A Maldição do Vale das Sombras" autoFocus />
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.88rem' }}>
                  <input type="checkbox" checked={form.isPrivate}
                    onChange={e => setForm(f => ({ ...f, isPrivate: e.target.checked }))}
                    style={{ width: 'auto', cursor: 'pointer' }} />
                  <span style={{ fontFamily: 'Rajdhani, sans-serif', textTransform: 'uppercase', letterSpacing: 1 }}>
                    Campanha Privada
                  </span>
                </label>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                  <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancelar</button>
                  <button className="btn btn-save" onClick={handleCreate} disabled={!form.name.trim()}>
                    <i className="fas fa-check" /> Criar
                  </button>
                </div>
              </div>
            ) : (
              <div className="create-char-form">
                <div className="modal-section-title">Entrar por Código</div>
                <div className="field-group">
                  <label>Código da Campanha</label>
                  <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                    placeholder="Ex: AB12CD" maxLength={6} style={{ fontFamily: 'monospace', letterSpacing: 4 }} />
                </div>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                  <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancelar</button>
                  <button className="btn btn-primary" onClick={handleJoin} disabled={!form.code.trim()}>
                    <i className="fas fa-door-open" /> Entrar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

import { createContext, useContext, useState, useCallback } from 'react'

// ── Context ──────────────────────────────────────────────────
const NotifCtx = createContext(null)

export function NotifProvider({ children }) {
  const [msg, setMsg] = useState('')
  const [visible, setVisible] = useState(false)
  const [timer, setTimer] = useState(null)

  const notify = useCallback((text) => {
    if (timer) clearTimeout(timer)
    setMsg(text)
    setVisible(true)
    const t = setTimeout(() => setVisible(false), 2600)
    setTimer(t)
  }, [timer])

  return (
    <NotifCtx.Provider value={notify}>
      {children}
      <div className={`notif${visible ? ' show' : ''}`}>{msg}</div>
    </NotifCtx.Provider>
  )
}

export function useNotify() {
  return useContext(NotifCtx)
}

// ── Standalone notification rendered in App ───────────────────
// (App wraps everything in NotifProvider from main.jsx)
// This default export is just a re-export of the provider for App.jsx convenience
export default function Notification() { return null }

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Notification from './components/Notification'
import Home from './pages/Home'
import Fichas from './pages/Fichas'
import FichaHeroi from './pages/FichaHeroi'
import Campanhas from './pages/Campanhas'
import Homebrew from './pages/Homebrew'
import HBEquipamentos from './pages/homebrew/HBEquipamentos'
import HBRacas from './pages/homebrew/HBRacas'
import HBCriaturas from './pages/homebrew/HBCriaturas'
import HBCidades from './pages/homebrew/HBCidades'
import HBAfiliacoes from './pages/homebrew/HBAfiliacoes'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Notification />

      <Routes>
        {/* ── Página Inicial ── */}
        <Route path="/" element={<Home />} />

        {/* ── Fichas ── */}
        <Route path="/fichas" element={<Fichas />} />
        <Route path="/fichas/:id" element={<FichaHeroi />} />

        {/* ── Campanhas ── */}
        <Route path="/campanhas" element={<Campanhas />} />

        {/* ── Homebrew hub ── */}
        <Route path="/homebrew" element={<Homebrew />} />

        {/* ── Homebrew sub-páginas ── */}
        <Route path="/homebrew/equipamentos" element={<HBEquipamentos />} />
        <Route path="/homebrew/racas" element={<HBRacas />} />
        <Route path="/homebrew/criaturas" element={<HBCriaturas />} />
        <Route path="/homebrew/cidades" element={<HBCidades />} />
        <Route path="/homebrew/afiliacoes" element={<HBAfiliacoes />} />

        {/* ── Fallback ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

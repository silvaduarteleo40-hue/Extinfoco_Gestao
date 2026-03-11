import { NavLink } from 'react-router-dom'
import icone from '../assets/icone_1.png'

export default function Navbar({ onLogout }) {
  return (
    <nav>
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src={icone} alt="EXTINFOCO logo" style={{ height: 80, width: 90 }} />
          <span className="nav-title" style={{ color: 'white', fontWeight: 700, fontSize: '1.2rem',fontFamily:'sans-serif',fontStyle:'italic' ,letterSpacing: 1 }}>
            EXTINFOCO
            <div style={{ fontSize: '0.75rem', fontWeight: 400, color: '#d1d5db', marginTop: -4 }}>
              Gerenciamento de Extintores
            </div>
          </span>
        </NavLink>

        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Dashboard
          </NavLink>
          <NavLink to="/clientes" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Clientes
          </NavLink>
          <NavLink to="/equipamentos" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Equipamentos
          </NavLink>
          <NavLink to="/os" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            OS
          </NavLink>
          <NavLink to="/certificados" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Certificados
          </NavLink>
          <NavLink to="/configuracoes" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            ⚙ Configurações
          </NavLink>
        </nav>
      </div>
      <button onClick={onLogout} style={{ backgroundColor: '#e53e3e', color: 'white', border: 'none', padding: '8px 16px', cursor: 'pointer', borderRadius: 4 }}>
        Sair
      </button>
    </header>
    </nav>
  )
}
  
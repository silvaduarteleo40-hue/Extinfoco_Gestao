import { Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react' // Adicionado
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import Login from './components/Login' // Você precisará criar este componente

import ClientesList from './components/Clientes/ClientesList'
import ClientesForm from './components/Clientes/ClientesForm'

import EquipamentosList from './components/Equipamentos/EquipamentosList'
import EquipamentosPage from './components/Equipamentos/EquipamentosPage'

import OSList from './components/OS/OSList'
import OSForm from './components/OS/OSForm'
import OSFormTecnico from './components/OS/OSFormTecnico'

import CertificadosList from './components/Certificados/CertificadosList'
import CertificadosForm from './components/Certificados/CertificadosForm'
import Configuracoes from './components/Configuracoes'

export default function App() {
  // Estado para controlar se está logado (checa o localStorage ao carregar)
  const [isAuth, setIsAuth] = useState(localStorage.getItem('auth_extinfoco') === 'true')

  const handleLogin = () => {
    localStorage.setItem('auth_extinfoco', 'true')
    setIsAuth(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('auth_extinfoco')
    setIsAuth(false)
  }

  return (
    <Routes>
      {/* Rota de Login (Pública) */}
      <Route path="/login" element={<Login onLogin={handleLogin} isAuth={isAuth} />} />

      {/* Todas as rotas internas agora são protegidas */}
      {isAuth ? (
        <Route path="/" element={<Layout onLogout={handleLogout} />}>
          <Route index element={<Dashboard />} />

          <Route path="clientes" element={<ClientesList />} />
          <Route path="clientes/novo" element={<ClientesForm />} />
          <Route path="clientes/:id" element={<ClientesForm />} />

          <Route path="equipamentos" element={<EquipamentosList />} />
          <Route path="equipamentos/novo" element={<EquipamentosPage />} />
          <Route path="equipamentos/:id" element={<EquipamentosPage />} />

          <Route path="os" element={<OSList />} />
          <Route path="os/novo" element={<OSForm />} />
          <Route path="os/:id" element={<OSForm />} />
          <Route path="os/tecnico/:id" element={<OSFormTecnico />} />

          <Route path="certificados" element={<CertificadosList />} />
          <Route path="certificados/novo" element={<CertificadosForm />} />
          <Route path="certificados/:id" element={<CertificadosForm />} />

          <Route path="configuracoes" element={<Configuracoes />} />

          {/* Se digitar rota errada, volta para a home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      ) : (
        // Se não estiver logado e tentar acessar qualquer coisa, manda para /login
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
    </Routes>
  )
}

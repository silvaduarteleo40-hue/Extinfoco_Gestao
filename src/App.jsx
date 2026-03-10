import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'

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
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
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

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

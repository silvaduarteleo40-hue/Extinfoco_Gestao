import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clientesAPI } from '../../services/airtable'

export default function ClientesList() {
  const navigate = useNavigate()

  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadClientes()
  }, [])

  async function loadClientes() {
    try {
      setLoading(true)
      setError('')
      const data = await clientesAPI.getAll()
      setClientes(data)
    } catch (err) {
      console.error(err)
      setError('Erro ao carregar os clientes.')
    } finally {
      setLoading(false)
    }
  }

  const clientesFiltrados = useMemo(() => {
    const termo = search.trim().toLowerCase()

    if (!termo) return clientes

    return clientes.filter((cliente) => {
      const f = cliente.fields || {}

      const nome = String(f['Nome'] || "sem nome").toLowerCase()
      const cnpj = String(f['CNPJ / CPF'] || '').toLowerCase()
      const cidade = String(f['Cidade'] || '').toLowerCase()
      const email = String(f['Email'] || '').toLowerCase()
      const telefone = String(f['Telefone'] || '').toLowerCase()

      return (
        nome.includes(termo) ||
        cnpj.includes(termo) ||
        cidade.includes(termo) ||
        email.includes(termo) ||
        telefone.includes(termo)
      )
    })
  }, [clientes, search])

  function handleNovoCliente() {
    navigate('/clientes/novo')
  }

  function handleOpenCliente(id) {
    navigate(`/clientes/${id}`)
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Clientes</h1>
          <p className="info-text">Selecione um cliente para conferir ou editar os dados.</p>
        </div>

        <button className="btn btn-primary" onClick={handleNovoCliente}>
          + Novo Cliente
        </button>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <input
          type="text"
          className="input"
          placeholder="Buscar por nome, CNPJ, cidade, email ou telefone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && <div className="card">Carregando clientes...</div>}

      {!loading && error && <div className="error-box">{error}</div>}

      {!loading && !error && clientesFiltrados.length === 0 && (
        <div className="card">Nenhum cliente encontrado.</div>
      )}

      {!loading && !error && clientesFiltrados.length > 0 && (
        <div className="clientes-grid">
          {clientesFiltrados.map((cliente) => {
            const f = cliente.fields || {}

            return (
              <div
                key={cliente.id}
                className="cliente-card"
                onClick={() => handleOpenCliente(cliente.id)}
              >
                <div className="cliente-card-header">
                  <h3>{f['Nome'] || 'Sem nome'}</h3>
                  <span className={`badge ${f['Status'] === 'Ativo' ? 'badge-green'
                     : f['Status'] === 'Inativo' ? 'badge-blue'
                     : f['Status'] === 'Prospect'? 'badge-yellow' 
                     : f['Status'] === "Bloqueado" ? 'badge-red': 'badge-gray' }`}>
                    {f['Status'] || 'Sem status'}
                  </span>
                </div>

                <div className="cliente-card-body">
                  <p>
                    <strong>CNPJ/CPF:</strong> {f["CNPJ/CPF"] || '-'}
                  </p>
                  <p>
                    <strong>Telefone:</strong> {f['Telefone'] || '-'}
                  </p>
                  <p>
                    <strong>Email:</strong> {f['Email'] || '-'}
                  </p>
                  <p>
                    <strong>Cidade:</strong> {f['Cidade'] || '-'}{f['Estado'] ? ` - ${f['Estado']}` : ''}
                  </p>
                </div>

                <div className="cliente-card-footer">
                  <span>Clique para editar e conferir</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clientesAPI } from '../../services/airtable'

export default function ClientesList() {
  const navigate = useNavigate()
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadRecords()
  }, [])

  async function loadRecords() {
    try {
      setLoading(true)
      setError('')
      const data = await clientesAPI.getAll()
      setRecords(data)
    } catch (err) {
      console.error(err)
      setError('Erro ao carregar clientes.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Deseja excluir este cliente?')) return
    try {
      await clientesAPI.remove(id)
      setRecords((prev) => prev.filter((r) => r.id !== id))
    } catch (err) {
      console.error(err)
      alert('Erro ao excluir cliente.')
    }
  }

  const filtered = records.filter((r) => {
    const q = search.toLowerCase()
    return (
      (r.fields['Nome'] || '').toLowerCase().includes(q) ||
      (r.fields['Email'] || '').toLowerCase().includes(q) ||
      (r.fields['Telefone'] || '').toLowerCase().includes(q)
    )
  })

  if (loading) return <div className="card">Carregando clientes...</div>

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Clientes</h1>
        <button className="btn btn-primary" onClick={() => navigate('/clientes/novo')}>
          + Novo Cliente
        </button>
      </div>

      {error && <div className="error-box">{error}</div>}

      <div className="card">
        <div style={{ marginBottom: 16 }}>
          <input
            className="form-control"
            type="text"
            placeholder="Buscar por nome, e-mail ou telefone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>CNPJ/CPF</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Cidade</th>
                <th>Estado</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7">Nenhum cliente encontrado.</td>
                </tr>
              ) : (
                filtered.map((record) => (
                  <tr key={record.id}>
                    <td>{record.fields['Nome'] || '-'}</td>
                    <td>{record.fields['CNPJ/CPF'] || '-'}</td>
                    <td>{record.fields['Email'] || '-'}</td>
                    <td>{record.fields['Telefone'] || '-'}</td>
                    <td>{record.fields['Cidade'] || '-'}</td>
                    <td>{record.fields['Estado'] || '-'}</td>
                    <td>
                      <button
                        className="btn btn-secondary"
                        style={{ marginRight: 8 }}
                        onClick={() => navigate(`/clientes/${record.id}`)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(record.id)}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

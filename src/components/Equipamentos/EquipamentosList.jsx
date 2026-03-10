import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { equipamentosAPI } from '../../services/airtable'

export default function EquipamentosList() {
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
      const data = await equipamentosAPI.getAll()
      setRecords(data)
    } catch (err) {
      console.error(err)
      setError('Erro ao carregar equipamentos.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Deseja excluir este equipamento?')) return
    try {
      await equipamentosAPI.remove(id)
      setRecords((prev) => prev.filter((r) => r.id !== id))
    } catch (err) {
      console.error(err)
      alert('Erro ao excluir equipamento.')
    }
  }

  const filtered = records.filter((r) => {
    const q = search.toLowerCase()
    return (
      (r.fields['Nome'] || '').toLowerCase().includes(q) ||
      (r.fields['Tipo'] || '').toLowerCase().includes(q) ||
      (r.fields['Localização'] || '').toLowerCase().includes(q) ||
      (r.fields['Status'] || '').toLowerCase().includes(q)
    )
  })

  if (loading) return <div className="card">Carregando equipamentos...</div>

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Equipamentos</h1>
        <button className="btn btn-primary" onClick={() => navigate('/equipamentos/novo')}>
          + Novo Equipamento
        </button>
      </div>

      {error && <div className="error-box">{error}</div>}

      <div className="card">
        <div style={{ marginBottom: 16 }}>
          <input
            className="form-control"
            type="text"
            placeholder="Buscar por nome, tipo, localização ou status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Tipo</th>
                <th>Localização</th>
                <th>Capacidade</th>
                <th>Data de Validade</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7">Nenhum equipamento encontrado.</td>
                </tr>
              ) : (
                filtered.map((record) => (
                  <tr key={record.id}>
                    <td>{record.fields['Nome'] || '-'}</td>
                    <td>{record.fields['Tipo'] || '-'}</td>
                    <td>{record.fields['Localização'] || '-'}</td>
                    <td>{record.fields['Capacidade'] || '-'}</td>
                    <td>{record.fields['Data de Validade'] || '-'}</td>
                    <td>{record.fields['Status'] || '-'}</td>
                    <td>
                      <button
                        className="btn btn-secondary"
                        style={{ marginRight: 8 }}
                        onClick={() => navigate(`/equipamentos/${record.id}`)}
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

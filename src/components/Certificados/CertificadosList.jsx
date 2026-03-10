import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { certificadosAPI, clientesAPI } from '../../services/airtable'
import { formatDate } from '../../utils/formatters'

export default function CertificadosList() {
  const navigate = useNavigate()
  const [records, setRecords] = useState([])
  const [clienteMap, setClienteMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadRecords()
  }, [])

  async function loadRecords() {
    try {
      setLoading(true)
      setError('')
      const [data, clientes] = await Promise.all([
        certificadosAPI.getAll(),
        clientesAPI.getAll()
      ])
      const map = {}
      for (const c of clientes) {
        map[c.id] = c.fields['Nome'] || c.id
      }
      setClienteMap(map)
      setRecords(data)
    } catch (err) {
      console.error(err)
      setError('Erro ao carregar certificados.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Deseja excluir este certificado?')) return
    try {
      await certificadosAPI.remove(id)
      setRecords((prev) => prev.filter((r) => r.id !== id))
    } catch (err) {
      console.error(err)
      alert('Erro ao excluir certificado.')
    }
  }

  if (loading) return <div className="card">Carregando certificados...</div>

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Certificados</h1>
        <button className="btn btn-primary" onClick={() => navigate('/certificados/novo')}>
          + Novo Certificado
        </button>
      </div>

      {error && <div className="error-box">{error}</div>}

      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Número</th>
                <th>Cliente</th>
                <th>Tipo de Serviço</th>
                <th>Data de Emissão</th>
                <th>Data de Validade</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan="6">Nenhum certificado encontrado.</td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr key={record.id}>
                    <td>{record.fields['Número do Certificado'] || '-'}</td>
                    <td>{record.fields['Cliente Nome'] || clienteMap[record.fields['Cliente']?.[0]] || record.fields['Cliente']?.[0] || '-'}</td>
                    <td>{record.fields['Tipo de Serviço'] || '-'}</td>
                    <td>{formatDate(record.fields['Data de Emissão'])}</td>
                    <td>{formatDate(record.fields['Data de Validade'])}</td>
                    <td>
                      <button
                        className="btn btn-secondary"
                        style={{ marginRight: 8 }}
                        onClick={() => navigate(`/certificados/${record.id}`)}
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

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { equipamentosAPI, osAPI, clientesAPI, certificadosAPI } from '../services/airtable'
import { formatDate, getBadgeClass } from '../utils/formatters'

export default function Dashboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({
    totalEquipamentos: 0,
    vencidos: 0,
    proximos30: 0,
    osAbertas: 0
  })
  const [urgentes, setUrgentes] = useState([])
  const [ordensAbertas, setOrdensAbertas] = useState([])
  const [certVencidos, setCertVencidos] = useState([])
  const [clienteMap, setClienteMap] = useState({})

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)
      setError('')

      const [equipamentos, urgentesData, osAbertas, clientes, certificados] = await Promise.all([
        equipamentosAPI.getAll(),
        equipamentosAPI.getUrgentes(),
        osAPI.getAbertas(),
        clientesAPI.getAll(),
        certificadosAPI.getAll()
      ])

      const map = {}
      for (const c of clientes) {
        map[c.id] = c.fields['Nome'] || c.id
      }
      setClienteMap(map)

      let vencidos = 0
      let proximos30 = 0

      for (const item of equipamentos) {
        const statusRecarga = item.fields['Status Recarga'] || ''
        const statusInspecao = item.fields['Status Inspeção'] || ''

        if (
          String(statusRecarga).includes('Vencido') ||
          String(statusInspecao).includes('Vencido')
        ) {
          vencidos++
        }

        if (
          String(statusRecarga).includes('30 dias') ||
          String(statusInspecao).includes('30 dias')
        ) {
          proximos30++
        }
      }

      setStats({
        totalEquipamentos: equipamentos.length,
        vencidos,
        proximos30,
        osAbertas: osAbertas.length
      })

      setUrgentes(urgentesData.slice(0, 5))
      setOrdensAbertas(osAbertas.slice(0, 5))

      // Filter expired certificates
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const vencidosCert = certificados.filter(cert => {
        const validade = cert.fields['Data de Validade']
        if (!validade) return false
        return new Date(validade) < today
      })
      setCertVencidos(vencidosCert.slice(0, 5))
    } catch (err) {
      console.error(err)
      setError('Erro ao carregar dados do dashboard.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="card">Carregando dashboard...</div>

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
      </div>

      {error && <div className="error-box">{error}</div>}

      <div className="grid grid-4" style={{ marginBottom: 20 }}>
        <div className="card stat-card">
          <h3>Total de Equipamentos</h3>
          <p>{stats.totalEquipamentos}</p>
        </div>

        <div className="card stat-card">
          <h3>Vencidos</h3>
          <p>{stats.vencidos}</p>
        </div>

        <div className="card stat-card">
          <h3>Vencem em 30 dias</h3>
          <p>{stats.proximos30}</p>
        </div>

        <div className="card stat-card">
          <h3>OS Abertas</h3>
          <p>{stats.osAbertas}</p>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="page-header">
            <h2 style={{ margin: 0 }}>Vencimentos Urgentes</h2>
          </div>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Tipo</th>
                  <th>Recarga</th>
                  <th>Inspeção</th>
                </tr>
              </thead>
              <tbody>
                {urgentes.length === 0 ? (
                  <tr>
                    <td colSpan="4">Nenhum equipamento urgente.</td>
                  </tr>
                ) : (
                  urgentes.map((item) => (
                    <tr
                      key={item.id}
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/equipamentos/${item.id}`)}
                    >
                      <td>{clienteMap[item.fields['Cliente']?.[0]] || item.fields['Cliente']?.[0] || '-'}</td>
                      <td>{item.fields['Tipo'] || item.fields['Tipo de Equipamento'] || '-'}</td>
                      <td>
                        <span className={getBadgeClass(item.fields['Status Recarga'])}>
                          {item.fields['Status Recarga'] || '-'}
                        </span>
                      </td>
                      <td>
                        <span className={getBadgeClass(item.fields['Status Inspeção'])}>
                          {item.fields['Status Inspeção'] || '-'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="page-header">
            <h2 style={{ margin: 0 }}>OS Abertas</h2>
          </div>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Data</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {ordensAbertas.length === 0 ? (
                  <tr>
                    <td colSpan="3">Nenhuma OS aberta.</td>
                  </tr>
                ) : (
                  ordensAbertas.map((item) => (
                    <tr
                      key={item.id}
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/os/${item.id}`)}
                    >
                      <td>{clienteMap[item.fields['Cliente']?.[0]] || item.fields['Cliente']?.[0] || '-'}</td>
                      <td>{formatDate(item.fields['Data Agendada'])}</td>
                      <td>
                        <span className={getBadgeClass(item.fields['Status'])}>
                          {item.fields['Status'] || '-'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Certificados Vencidos */}
      <div className="card" style={{ marginTop: 24 }}>
        <div className="page-header">
          <h2 style={{ margin: 0 }}>Certificados Vencidos</h2>
        </div>

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Número</th>
                <th>Cliente</th>
                <th>Tipo de Serviço</th>
                <th>Data de Validade</th>
              </tr>
            </thead>
            <tbody>
              {certVencidos.length === 0 ? (
                <tr>
                  <td colSpan="4">Nenhum certificado vencido.</td>
                </tr>
              ) : (
                certVencidos.map((cert) => (
                  <tr
                    key={cert.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/certificados/${cert.id}`)}
                  >
                    <td>{cert.fields['Número do Certificado'] || '-'}</td>
                    <td>{clienteMap[cert.fields['Cliente']?.[0]] || cert.fields['Cliente']?.[0] || '-'}</td>
                    <td>{cert.fields['Tipo de Serviço'] || '-'}</td>
                    <td style={{ color: '#e53e3e', fontWeight: 600 }}>
                      {formatDate(cert.fields['Data de Validade'])}
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

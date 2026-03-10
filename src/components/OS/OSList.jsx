import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { osAPI } from '../../services/airtable'

const PAGE_SIZE = 10

const STATUS_COLORS = {
  'Agendada': '#3b82f6',
  'Em Andamento': '#f59e0b',
  'Concluída': '#10b981',
  'Cancelada': '#ef4444'
}

function StatusBadge({ status }) {
  const color = STATUS_COLORS[status] || '#6b7280'
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: 12,
        backgroundColor: color + '22',
        color,
        fontWeight: 600,
        fontSize: '0.82rem'
      }}
    >
      {status || '-'}
    </span>
  )
}

export default function OSList() {
  const navigate = useNavigate()
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState('Número OS')
  const [sortAsc, setSortAsc] = useState(true)
  const [page, setPage] = useState(1)
  const [selectedOS, setSelectedOS] = useState(null)

  useEffect(() => {
    loadRecords()
  }, [])

  async function loadRecords() {
    try {
      setLoading(true)
      setError('')
      const data = await osAPI.getAll()
      setRecords(data)
    } catch (err) {
      console.error(err)
      setError('Erro ao carregar ordens de serviço.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Deseja excluir esta OS?')) return
    try {
      await osAPI.remove(id)
      setRecords((prev) => prev.filter((r) => r.id !== id))
      if (selectedOS?.id === id) setSelectedOS(null)
    } catch (err) {
      console.error(err)
      alert('Erro ao excluir OS.')
    }
  }

  function handleSort(field) {
    if (sortField === field) {
      setSortAsc((prev) => !prev)
    } else {
      setSortField(field)
      setSortAsc(true)
    }
    setPage(1)
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return records.filter((r) =>
      (r.fields['Número OS'] || '').toLowerCase().includes(q) ||
      (r.fields['Status'] || '').toLowerCase().includes(q) ||
      (r.fields['Tipo de Serviço'] || '').toLowerCase().includes(q) ||
      (r.fields['Técnico Responsável'] || '').toLowerCase().includes(q) ||
      (r.fields['Data Agendada'] || '').toLowerCase().includes(q) ||
      (r.fields['Data de Abertura'] || '').toLowerCase().includes(q)
    )
  }, [records, search])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = (a.fields[sortField] || '').toString().toLowerCase()
      const bv = (b.fields[sortField] || '').toString().toLowerCase()
      if (av < bv) return sortAsc ? -1 : 1
      if (av > bv) return sortAsc ? 1 : -1
      return 0
    })
  }, [filtered, sortField, sortAsc])

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function SortIcon({ field }) {
    if (sortField !== field) return <span style={{ opacity: 0.3 }}> ⇅</span>
    return <span>{sortAsc ? ' ↑' : ' ↓'}</span>
  }

  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: 40 }}>
        <div style={{ fontSize: '2rem', marginBottom: 8 }}>⏳</div>
        <p>Carregando ordens de serviço...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Ordens de Serviço</h1>
        <button className="btn btn-primary" onClick={() => navigate('/os/novo')}>
          + Nova OS
        </button>
      </div>

      {error && <div className="error-box">{error}</div>}

      <div className="card">
        {/* Search */}
        <div style={{ marginBottom: 16 }}>
          <input
            className="form-control"
            type="text"
            placeholder="Buscar por número, status, tipo de serviço, técnico ou data..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>

        {/* Summary */}
        <div style={{ marginBottom: 12, fontSize: '0.88rem', color: '#6b7280' }}>
          {filtered.length} registro(s) encontrado(s)
        </div>

        {/* Table */}
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                {[
                  ['Número OS', 'Número OS'],
                  ['Data de Abertura', 'Data de Abertura'],
                  ['Data Agendada', 'Data Agendada'],
                  ['Tipo de Serviço', 'Tipo de Serviço'],
                  ['Status', 'Status'],
                  ['Técnico', 'Técnico Responsável']
                ].map(([label, field]) => (
                  <th
                    key={field}
                    onClick={() => handleSort(field)}
                    style={{ cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}
                  >
                    {label}<SortIcon field={field} />
                  </th>
                ))}
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: 32, color: '#6b7280' }}>
                    {search ? 'Nenhuma OS encontrada para a busca.' : 'Nenhuma OS cadastrada.'}
                  </td>
                </tr>
              ) : (
                paginated.map((record) => (
                  <tr
                    key={record.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelectedOS(record)}
                  >
                    <td><strong>{record.fields['Número OS'] || '-'}</strong></td>
                    <td>{record.fields['Data de Abertura'] || '-'}</td>
                    <td>{record.fields['Data Agendada'] || '-'}</td>
                    <td>{record.fields['Tipo de Serviço'] || '-'}</td>
                    <td><StatusBadge status={record.fields['Status']} /></td>
                    <td>{record.fields['Técnico Responsável'] || '-'}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <button
                        className="btn btn-secondary"
                        style={{ marginRight: 8 }}
                        onClick={() => navigate(`/os/${record.id}`)}
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
            <button
              className="btn btn-secondary"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              ‹ Anterior
            </button>
            <span style={{ lineHeight: '36px', fontSize: '0.9rem' }}>
              Página {page} de {totalPages}
            </span>
            <button
              className="btn btn-secondary"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Próxima ›
            </button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedOS && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: 16
          }}
          onClick={() => setSelectedOS(null)}
        >
          <div
            style={{
              background: '#fff', borderRadius: 12, padding: 32,
              maxWidth: 560, width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
              maxHeight: '90vh', overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ margin: 0 }}>OS #{selectedOS.fields['Número OS'] || selectedOS.id}</h2>
              <button
                className="btn btn-secondary"
                onClick={() => setSelectedOS(null)}
                style={{ padding: '4px 12px' }}
              >
                ✕
              </button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {[
                  ['Status', <StatusBadge status={selectedOS.fields['Status']} />],
                  ['Tipo de Serviço', selectedOS.fields['Tipo de Serviço']],
                  ['Data de Abertura', selectedOS.fields['Data de Abertura']],
                  ['Data Agendada', selectedOS.fields['Data Agendada']],
                  ['Técnico Responsável', selectedOS.fields['Técnico Responsável']],
                  ['Descrição do Problema', selectedOS.fields['Descrição do Problema']],
                  ['Observações', selectedOS.fields['Observações']]
                ].map(([label, value]) => (
                  <tr key={label}>
                    <td style={{ padding: '8px 0', fontWeight: 600, width: 160, color: '#374151', verticalAlign: 'top' }}>
                      {label}
                    </td>
                    <td style={{ padding: '8px 0', color: '#4b5563' }}>
                      {value || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
              <button
                className="btn btn-primary"
                onClick={() => { navigate(`/os/${selectedOS.id}`); setSelectedOS(null) }}
              >
                Editar
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(selectedOS.id)}
              >
                Excluir
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setSelectedOS(null)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

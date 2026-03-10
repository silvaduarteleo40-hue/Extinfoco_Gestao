import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { equipamentosAPI, clientesAPI, osAPI, certificadosAPI } from '../../services/airtable'
import EquipamentosForm from './EquipamentosForm'

export default function EquipamentosPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [initialValues, setInitialValues] = useState(null)
  const [clientes, setClientes] = useState([])
  const [ordens, setOrdens] = useState([])
  const [certificados, setCertificados] = useState([])

  useEffect(() => {
    loadClientes()
    if (isEditing) loadRecord()
  }, [id])

  async function loadClientes() {
    try {
      const records = await clientesAPI.getAll()
      setClientes(records)
    } catch (err) {
      console.error('Erro ao carregar clientes:', err)
    }
  }

  async function loadRecord() {
    try {
      setLoading(true)
      const record = await equipamentosAPI.getById(id)
      const f = record.fields
      setInitialValues({
        nome: f['Nome'] || '',
        tipo: f['Tipo'] || '',
        cliente: f['Cliente'] ? f['Cliente'][0] : '',
        localizacao: f['Localização'] || '',
        capacidade: f['Capacidade'] || '',
        dataFabricacao: f['Data de Fabricação'] || '',
        dataValidade: f['Data de Validade'] || '',
        status: f['Status'] || '',
        statusRecarga: f['Status Recarga'] || '',
        statusInspecao: f['Status Inspeção'] || '',
        observacoes: f['Observações'] || ''
      })

      // Load linked OS and Certificados
      const osIds = f['Ordens de Serviço'] || []
      const certIds = f['Certificados'] || []

      const [allOS, allCert] = await Promise.all([
        osIds.length > 0 ? osAPI.getAll() : Promise.resolve([]),
        certIds.length > 0 ? certificadosAPI.getAll() : Promise.resolve([])
      ])

      setOrdens(allOS.filter(r => osIds.includes(r.id)))
      setCertificados(allCert.filter(r => certIds.includes(r.id)))
    } catch (err) {
      console.error(err)
      setError('Erro ao carregar equipamento.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(data) {
    try {
      setSaving(true)
      setError('')
      const fields = {
        'Nome': data.nome,
        'Tipo': data.tipo,
        'Localização': data.localizacao,
        'Capacidade': data.capacidade,
        'Data de Fabricação': data.dataFabricacao || null,
        'Data de Validade': data.dataValidade || null,
        'Status': data.status,
        'Status Recarga': data.statusRecarga,
        'Status Inspeção': data.statusInspecao,
        'Observações': data.observacoes
      }

      if (data.cliente) {
        fields['Cliente'] = [data.cliente]
      }

      // Remove empty optional fields to avoid Airtable errors
      if (!fields['Data de Fabricação']) delete fields['Data de Fabricação']
      if (!fields['Data de Validade']) delete fields['Data de Validade']
      if (!fields['Status Recarga']) delete fields['Status Recarga']
      if (!fields['Status Inspeção']) delete fields['Status Inspeção']

      if (isEditing) {
        await equipamentosAPI.update(id, fields)
      } else {
        await equipamentosAPI.create(fields)
      }
      navigate('/equipamentos')
    } catch (err) {
      console.error(err)
      setError('Erro ao salvar equipamento.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="card">Carregando...</div>

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{isEditing ? 'Editar Equipamento' : 'Novo Equipamento'}</h1>
        <button className="btn btn-secondary" onClick={() => navigate('/equipamentos')}>
          Voltar
        </button>
      </div>

      {error && <div className="error-box">{error}</div>}

      <div className="card">
        <EquipamentosForm
          initialValues={initialValues}
          isEditing={isEditing}
          isLoading={saving}
          clientes={clientes}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/equipamentos')}
        />
      </div>

      {isEditing && (
        <>
          {/* Ordens de Serviço vinculadas */}
          <div className="card" style={{ marginTop: 24 }}>
            <h2 style={{ fontSize: '1.1rem', marginBottom: 12 }}>Ordens de Serviço</h2>
            {ordens.length === 0 ? (
              <p style={{ color: '#888' }}>Nenhuma ordem de serviço vinculada.</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Número OS</th>
                    <th>Tipo de Serviço</th>
                    <th>Status</th>
                    <th>Data Agendamento</th>
                  </tr>
                </thead>
                <tbody>
                  {ordens.map(os => (
                    <tr key={os.id}>
                      <td>{os.fields['Número OS'] || os.id}</td>
                      <td>{os.fields['Tipo de Serviço'] || '-'}</td>
                      <td>{os.fields['Status'] || '-'}</td>
                      <td>{os.fields['Data Agendamento'] || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Certificados vinculados */}
          <div className="card" style={{ marginTop: 24 }}>
            <h2 style={{ fontSize: '1.1rem', marginBottom: 12 }}>Certificados</h2>
            {certificados.length === 0 ? (
              <p style={{ color: '#888' }}>Nenhum certificado vinculado.</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Número</th>
                    <th>Tipo</th>
                    <th>Data Emissão</th>
                    <th>Data Validade</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {certificados.map(cert => (
                    <tr key={cert.id}>
                      <td>{cert.fields['Número Certificado'] || cert.id}</td>
                      <td>{cert.fields['Tipo'] || '-'}</td>
                      <td>{cert.fields['Data Emissão'] || '-'}</td>
                      <td>{cert.fields['Data Validade'] || '-'}</td>
                      <td>{cert.fields['Status'] || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  )
}

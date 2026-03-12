import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { certificadosAPI, clientesAPI, equipamentosAPI } from '../../services/airtable'
import { gerarCertificadoPDF } from '../../utils/gerarCertificadoPDF'

export default function CertificadosForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [clientes, setClientes] = useState([])
  const [equipamentos, setEquipamentos] = useState([])

  const [fields, setFields] = useState({
    'Cliente': [],
    'Equipamento': [],
    'Tipo de Serviço': '',
    'Data de Emissão': '',
    'Data de Validade': '',
    'Número do Certificado': '',
    'Observações': ''
  })

  useEffect(() => {
    loadAuxData()
    if (isEditing) loadRecord()
  }, [id])

  async function loadAuxData() {
    try {
      const [c, e] = await Promise.all([clientesAPI.getAll(), equipamentosAPI.getAll()])
      setClientes(c)
      setEquipamentos(e)
    } catch (err) {
      console.error(err)
    }
  }

  async function loadRecord() {
    try {
      setLoading(true)
      const record = await certificadosAPI.getById(id)
      setFields({
        'Cliente': record.fields['Cliente'] || [],
        'Equipamento': record.fields['Equipamento'] || [],
        'Tipo de Serviço': record.fields['Tipo de Serviço'] || '',
        'Data de Emissão': record.fields['Data de Emissão'] || '',
        'Data de Validade': record.fields['Data de Validade'] || '',
        'Número do Certificado': record.fields['Número do Certificado'] || '',
        'Observações': record.fields['Observações'] || ''
      })
    } catch (err) {
      console.error(err)
      setError('Erro ao carregar certificado.')
    } finally {
      setLoading(false)
    }
  }

  function handleChange(e) {
    const { name, value } = e.target
    setFields((prev) => ({ ...prev, [name]: value }))
  }

  function handleLinkedChange(e) {
    const { name, value } = e.target
    setFields((prev) => ({ ...prev, [name]: value ? [value] : [] }))
  }

  function handleGerarPDF() {
    const clienteNome = clientes.find(c => c.id === fields['Cliente'][0])?.fields['Nome'] || fields['Cliente'][0] || '-'
    const equipamentoNome = equipamentos.find(e => e.id === fields['Equipamento'][0])?.fields['Nome'] || equipamentos.find(e => e.id === fields['Equipamento'][0])?.fields['Tipo'] || fields['Equipamento'][0] || '-'
   gerarCertificadoPDF({ fields, clienteNome, equipamentoNome })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      setSaving(true)
      setError('')
      if (isEditing) {
        await certificadosAPI.update(id, fields)
      } else {
        await certificadosAPI.create(fields)
      }
      navigate('/certificados')
    } catch (err) {
      console.error(err)
      setError('Erro ao salvar certificado.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="card">Carregando...</div>

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{isEditing ? 'Editar Certificado' : 'Novo Certificado'}</h1>
        <button className="btn btn-secondary" onClick={() => navigate('/certificados')}>
          Voltar
        </button>
      </div>

      {error && <div className="error-box">{error}</div>}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: 20 }}>
            <label>Número do Certificado</label>
            <input
              className="form-control"
              type="text"
              name="Número do Certificado"
              value={fields['Número do Certificado']}
              onChange={handleChange}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 20 }}>
            <label>Cliente</label>
            <select
              className="form-control"
              name="Cliente"
              value={fields['Cliente'][0] || ''}
              onChange={handleLinkedChange}
            >
              <option value="">Selecione...</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fields['Nome'] || c.id}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 20 }}>
            <label>Equipamento</label>
            <select
              className="form-control"
              name="Equipamento"
              value={fields['Equipamento'][0] || ''}
              onChange={handleLinkedChange}
            >
              <option value="">Selecione...</option>
              {equipamentos.map((eq) => (
                <option key={eq.id} value={eq.id}>
                  {eq.fields['Nome'] || eq.fields['Tipo'] || eq.id}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 20 }}>
            <label>Tipo de Serviço</label>
            <select
              className="form-control"
              name="Tipo de Serviço"
              value={fields['Tipo de Serviço']}
              onChange={handleChange}
            >
              <option value="">Selecione...</option>
              <option value="Recarga">Recarga</option>
              <option value="Inspeção">Inspeção</option>
              <option value="Manutenção">Manutenção</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label>Data de Emissão</label>
              <input
                className="form-control"
                type="date"
                name="Data de Emissão"
                value={fields['Data de Emissão']}
                onChange={handleChange}
              />
            </div>

            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label>Data de Validade</label>
              <input
                className="form-control"
                type="date"
                name="Data de Validade"
                value={fields['Data de Validade']}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 20 }}>
            <label>Observações</label>
            <textarea
              className="form-control"
              name="Observações"
              rows={3}
              value={fields['Observações']}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 24, flexWrap: 'wrap' }}>
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
            {isEditing && (
              <button
                className="btn btn-secondary"
                type="button"
                onClick={handleGerarPDF}
              >
                📄 Gerar PDF
              </button>
            )}
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => navigate('/certificados')}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

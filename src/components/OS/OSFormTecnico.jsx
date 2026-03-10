import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { osAPI, clientesAPI } from '../../services/airtable'

export default function OSFormTecnico() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [clientes, setClientes] = useState([])

  const [fields, setFields] = useState({
    'Número OS': '',
    'Data': '',
    'Cliente': [],
    'Endereço': '',
    'Tipo de Extintor': '',
    'Número de Série': '',
    'Localização do Extintor': '',
    'Status do Extintor': '',
    'Manutenção Realizada': '',
    'Observações': ''
  })

  useEffect(() => {
    loadClientes()
    if (isEditing) loadRecord()
  }, [id])

  async function loadClientes() {
    try {
      const data = await clientesAPI.getAll()
      setClientes(data)
    } catch (err) {
      console.error(err)
    }
  }

  async function loadRecord() {
    try {
      setLoading(true)
      const record = await osAPI.getById(id)
      setFields({
        'Número OS': record.fields['Número OS'] || '',
        'Data': record.fields['Data'] || '',
        'Cliente': record.fields['Cliente'] || [],
        'Endereço': record.fields['Endereço'] || '',
        'Tipo de Extintor': record.fields['Tipo de Extintor'] || '',
        'Número de Série': record.fields['Número de Série'] || '',
        'Localização do Extintor': record.fields['Localização do Extintor'] || '',
        'Status do Extintor': record.fields['Status do Extintor'] || '',
        'Manutenção Realizada': record.fields['Manutenção Realizada'] || '',
        'Observações': record.fields['Observações'] || ''
      })
    } catch (err) {
      console.error(err)
      setError('Erro ao carregar ordem de serviço.')
    } finally {
      setLoading(false)
    }
  }

  function handleChange(e) {
    const { name, value } = e.target
    setFields((prev) => ({ ...prev, [name]: value }))
  }

  function handleClienteChange(e) {
    const { value } = e.target
    setFields((prev) => ({ ...prev, 'Cliente': value ? [value] : [] }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      setSaving(true)
      setError('')
      if (isEditing) {
        await osAPI.update(id, fields)
      } else {
        await osAPI.create(fields)
      }
      navigate('/os')
    } catch (err) {
      console.error(err)
      setError('Erro ao salvar ordem de serviço.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="card">Carregando...</div>

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          {isEditing ? 'Editar OS — Técnico' : 'Nova OS — Técnico'}
        </h1>
        <button className="btn btn-secondary" onClick={() => navigate('/os')}>
          Voltar
        </button>
      </div>

      {error && <div className="error-box">{error}</div>}

      <div className="card">
        <form onSubmit={handleSubmit}>

          {/* OS Info */}
          <div style={{ display: 'flex', gap: 8 }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Número OS *</label>
              <input
                className="form-control"
                type="text"
                name="Número OS"
                value={fields['Número OS']}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label>Data *</label>
              <input
                className="form-control"
                type="date"
                name="Data"
                value={fields['Data']}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Client */}
          <div className="form-group">
            <label>Cliente</label>
            <select
              className="form-control"
              name="Cliente"
              value={fields['Cliente'][0] || ''}
              onChange={handleClienteChange}
            >
              <option value="">Selecione...</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fields['Nome'] || c.id}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Endereço</label>
            <input
              className="form-control"
              type="text"
              name="Endereço"
              value={fields['Endereço']}
              onChange={handleChange}
            />
          </div>

          {/* Extinguisher Info */}
          <h3 style={{ margin: '16px 0 8px', fontSize: '1rem', fontWeight: 600 }}>
            Informações do Extintor
          </h3>

          <div style={{ display: 'flex', gap: 8 }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Tipo de Extintor</label>
              <select
                className="form-control"
                name="Tipo de Extintor"
                value={fields['Tipo de Extintor']}
                onChange={handleChange}
              >
                <option value="">Selecione...</option>
                <option value="Água">Água</option>
                <option value="CO2">CO2</option>
                <option value="Pó ABC">Pó ABC</option>
                <option value="Pó BC">Pó BC</option>
                <option value="Espuma">Espuma</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label>Número de Série</label>
              <input
                className="form-control"
                type="text"
                name="Número de Série"
                value={fields['Número de Série']}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Localização do Extintor</label>
            <input
              className="form-control"
              type="text"
              name="Localização do Extintor"
              value={fields['Localização do Extintor']}
              onChange={handleChange}
              placeholder="Ex: Corredor, Sala 01, Térreo..."
            />
          </div>

          <div className="form-group">
            <label>Status do Extintor</label>
            <select
              className="form-control"
              name="Status do Extintor"
              value={fields['Status do Extintor']}
              onChange={handleChange}
            >
              <option value="">Selecione...</option>
              <option value="Conforme">Conforme</option>
              <option value="Não Conforme">Não Conforme</option>
              <option value="Vencido">Vencido</option>
              <option value="Em Manutenção">Em Manutenção</option>
            </select>
          </div>

          <div className="form-group">
            <label>Manutenção Realizada</label>
            <select
              className="form-control"
              name="Manutenção Realizada"
              value={fields['Manutenção Realizada']}
              onChange={handleChange}
            >
              <option value="">Selecione...</option>
              <option value="Recarga">Recarga</option>
              <option value="Inspeção">Inspeção</option>
              <option value="Teste Hidrostático">Teste Hidrostático</option>
              <option value="Substituição">Substituição</option>
              <option value="Nenhuma">Nenhuma</option>
            </select>
          </div>

          <div className="form-group">
            <label>Observações</label>
            <textarea
              className="form-control"
              name="Observações"
              rows={4}
              value={fields['Observações']}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? 'Salvando...' : isEditing ? 'Atualizar' : 'Salvar'}
            </button>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => navigate('/os')}
              disabled={saving}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

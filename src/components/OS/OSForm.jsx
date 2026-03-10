import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { osAPI, clientesAPI, equipamentosAPI } from '../../services/airtable'

export default function OSForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [clientes, setClientes] = useState([])
  const [equipamentos, setEquipamentos] = useState([])

  const [fields, setFields] = useState({
    'Número OS': '',
    'Cliente': [],
    'Equipamento': [],
    'Data de Abertura': '',
    'Data Agendada': '',
    'Tipo de Serviço': '',
    'Status': '',
    'Técnico Responsável': '',
    'Descrição do Problema': '',
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
      const record = await osAPI.getById(id)
      setFields({
        'Número OS': record.fields['Número OS'] || '',
        'Cliente': record.fields['Cliente'] || [],
        'Equipamento': record.fields['Equipamento'] || [],
        'Data de Abertura': record.fields['Data de Abertura'] || '',
        'Data Agendada': record.fields['Data Agendada'] || '',
        'Tipo de Serviço': record.fields['Tipo de Serviço'] || '',
        'Status': record.fields['Status'] || '',
        'Técnico Responsável': record.fields['Técnico Responsável'] || '',
        'Descrição do Problema': record.fields['Descrição do Problema'] || '',
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

  function handleLinkedChange(e) {
    const { name, value } = e.target
    setFields((prev) => ({ ...prev, [name]: value ? [value] : [] }))
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
        <h1 className="page-title">{isEditing ? 'Editar Ordem de Serviço' : 'Nova Ordem de Serviço'}</h1>
        <button className="btn btn-secondary" onClick={() => navigate('/os')}>
          Voltar
        </button>
      </div>

      {error && <div className="error-box">{error}</div>}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Número OS</label>
            <input
              className="form-control"
              type="text"
              name="Número OS"
              value={fields['Número OS']}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
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

          <div className="form-group">
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

          <div style={{ display: 'flex', gap: 8 }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Data de Abertura</label>
              <input
                className="form-control"
                type="date"
                name="Data de Abertura"
                value={fields['Data de Abertura']}
                onChange={handleChange}
              />
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label>Data Agendada</label>
              <input
                className="form-control"
                type="date"
                name="Data Agendada"
                value={fields['Data Agendada']}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
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
              <option value="Instalação">Instalação</option>
              <option value="Revisão">Revisão</option>
            </select>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              className="form-control"
              name="Status"
              value={fields['Status']}
              onChange={handleChange}
            >
              <option value="">Selecione...</option>
              <option value="Agendada">Agendada</option>
              <option value="Em Andamento">Em Andamento</option>
              <option value="Concluída">Concluída</option>
              <option value="Cancelada">Cancelada</option>
            </select>
          </div>

          <div className="form-group">
            <label>Técnico Responsável</label>
            <input
              className="form-control"
              type="text"
              name="Técnico Responsável"
              value={fields['Técnico Responsável']}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Descrição do Problema</label>
            <textarea
              className="form-control"
              name="Descrição do Problema"
              rows={3}
              value={fields['Descrição do Problema']}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Observações</label>
            <textarea
              className="form-control"
              name="Observações"
              rows={3}
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

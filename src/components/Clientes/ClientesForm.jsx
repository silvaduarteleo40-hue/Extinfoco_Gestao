import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { clientesAPI, equipamentosAPI, osAPI, certificadosAPI } from '../../services/airtable'

export default function ClientesForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [fields, setFields] = useState({
    'Nome': '',
    'CNPJ/CPF': '',
    'Email': '',
    'Telefone': '',
    'Endereço': '',
    'Cidade': '',
    'Estado': '',
    'CEP': '',
    'Observações': ''
  })

  const [equipamentos, setEquipamentos] = useState([])
  const [ordens, setOrdens] = useState([])
  const [certificados, setCertificados] = useState([])

  useEffect(() => {
    if (isEditing) loadRecord()
  }, [id])

  async function loadRecord() {
    try {
      setLoading(true)
      const record = await clientesAPI.getById(id)
      setFields({
        'Nome': record.fields['Nome'] || '',
        'CNPJ/CPF': record.fields['CNPJ/CPF'] || '',
        'Email': record.fields['Email'] || '',
        'Telefone': record.fields['Telefone'] || '',
        'Endereço': record.fields['Endereço'] || '',
        'Cidade': record.fields['Cidade'] || '',
        'Estado': record.fields['Estado'] || '',
        'CEP': record.fields['CEP'] || '',
        'Observações': record.fields['Observações'] || ''
      })

      // Load linked records
      const equipIds = record.fields['Equipamentos'] || []
      const osIds = record.fields['Ordens de Serviço'] || []
      const certIds = record.fields['Certificados'] || []

      const [allEquip, allOS, allCert] = await Promise.all([
        equipIds.length > 0 ? equipamentosAPI.getAll() : Promise.resolve([]),
        osIds.length > 0 ? osAPI.getAll() : Promise.resolve([]),
        certIds.length > 0 ? certificadosAPI.getAll() : Promise.resolve([])
      ])

      setEquipamentos(allEquip.filter(r => equipIds.includes(r.id)))
      setOrdens(allOS.filter(r => osIds.includes(r.id)))
      setCertificados(allCert.filter(r => certIds.includes(r.id)))
    } catch (err) {
      console.error(err)
      setError('Erro ao carregar cliente.')
    } finally {
      setLoading(false)
    }
  }

  function handleChange(e) {
    const { name, value } = e.target
    setFields((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!fields['Nome'].trim()) {
      setError('O campo Nome é obrigatório.')
      return
    }
    try {
      setSaving(true)
      setError('')
      if (isEditing) {
        await clientesAPI.update(id, fields)
      } else {
        await clientesAPI.create(fields)
      }
      navigate('/clientes')
    } catch (err) {
      console.error(err)
      setError('Erro ao salvar cliente.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="card">Carregando...</div>

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{isEditing ? 'Editar Cliente' : 'Novo Cliente'}</h1>
        <button className="btn btn-secondary" onClick={() => navigate('/clientes')}>
          Voltar
        </button>
      </div>

      {error && <div className="error-box">{error}</div>}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome *</label>
            <input
              className="form-control"
              type="text"
              name="Nome"
              value={fields['Nome']}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>CNPJ/CPF</label>
            <input
              className="form-control"
              type="text"
              name="CNPJ/CPF"
              value={fields['CNPJ/CPF']}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              className="form-control"
              type="email"
              name="Email"
              value={fields['Email']}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Telefone</label>
            <input
              className="form-control"
              type="text"
              name="Telefone"
              value={fields['Telefone']}
              onChange={handleChange}
            />
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

          <div style={{ display: 'flex', gap: 8 }}>
            <div className="form-group" style={{ flex: 2 }}>
              <label>Cidade</label>
              <input
                className="form-control"
                type="text"
                name="Cidade"
                value={fields['Cidade']}
                onChange={handleChange}
              />
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label>Estado (UF)</label>
              <select
                className="form-control"
                name="Estado"
                value={fields['Estado']}
                onChange={handleChange}
              >
                <option value="">UF</option>
                <option value="AC">AC</option>
                <option value="AL">AL</option>
                <option value="AP">AP</option>
                <option value="AM">AM</option>
                <option value="BA">BA</option>
                <option value="CE">CE</option>
                <option value="DF">DF</option>
                <option value="ES">ES</option>
                <option value="GO">GO</option>
                <option value="MA">MA</option>
                <option value="MT">MT</option>
                <option value="MS">MS</option>
                <option value="MG">MG</option>
                <option value="PA">PA</option>
                <option value="PB">PB</option>
                <option value="PR">PR</option>
                <option value="PE">PE</option>
                <option value="PI">PI</option>
                <option value="RJ">RJ</option>
                <option value="RN">RN</option>
                <option value="RS">RS</option>
                <option value="RO">RO</option>
                <option value="RR">RR</option>
                <option value="SC">SC</option>
                <option value="SP">SP</option>
                <option value="SE">SE</option>
                <option value="TO">TO</option>
              </select>
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label>CEP</label>
              <input
                className="form-control"
                type="text"
                name="CEP"
                value={fields['CEP']}
                onChange={handleChange}
              />
            </div>
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
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => navigate('/clientes')}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>

      {isEditing && (
        <>
          {/* Equipamentos vinculados */}
          <div className="card" style={{ marginTop: 24 }}>
            <h2 style={{ fontSize: '1.1rem', marginBottom: 12 }}>Equipamentos</h2>
            {equipamentos.length === 0 ? (
              <p style={{ color: '#888' }}>Nenhum equipamento vinculado.</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Tipo</th>
                    <th>Capacidade</th>
                    <th>Status Recarga</th>
                    <th>Status Inspeção</th>
                  </tr>
                </thead>
                <tbody>
                  {equipamentos.map(eq => (
                    <tr key={eq.id}>
                      <td>{eq.fields['Código'] || eq.id}</td>
                      <td>{eq.fields['Tipo'] || '-'}</td>
                      <td>{eq.fields['Capacidade'] || '-'}</td>
                      <td>{eq.fields['Status Recarga'] || '-'}</td>
                      <td>{eq.fields['Status Inspeção'] || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

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
                    <th>Tipo</th>
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

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { clientesAPI } from "../../services/airtable"

const initialState = {
  nome: "",
  cnpj: "",
  email: "",
  telefone: "",
  endereco: "",
  cidade: "",
  estado: "",
  cep: "",
  observacoes: "",
  status: "Ativo"
}

export default function ClienteForm() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [form, setForm] = useState(initialState)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const isEdit = Boolean(id)

  useEffect(() => {
    if (isEdit) loadCliente()
  }, [id])

  async function loadCliente() {
    try {
      setLoading(true)
      setError("")

      const data = await clientesAPI.getById(id)
      const f = data.fields || {}

      setForm({
        nome: f["Nome"] || "",
        cnpj: f["CNPJ/CPF"] || "",
        email: f["Email"] || "",
        telefone: f["Telefone"] || "",
        endereco: f["Endereço"] || "",
        cidade: f["Cidade"] || "",
        estado: f["Estado"] || "",
        cep: f["CEP"] || "",
        observacoes: f["Observações"] || "",
        status: f["Status"] || "Ativo"
      })
    } catch (err) {
      console.error(err)
      setError("Erro ao carregar cliente")
    } finally {
      setLoading(false)
    }
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setSaving(true)
      setError("")

      const payload = {
        Nome: form.nome,
        "CNPJ/CPF": form.cnpj,
        Email: form.email,
        Telefone: form.telefone,
        Endereço: form.endereco,
        Cidade: form.cidade,
        Estado: form.estado,
        CEP: form.cep,
        Observações: form.observacoes,
        Status: form.status
      }

      if (isEdit) {
        await clientesAPI.update(id, payload)
      } else {
        await clientesAPI.create(payload)
      }

      navigate("/clientes")
    } catch (err) {
      console.error(err)
      setError("Erro ao salvar cliente")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="card">Carregando cliente...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            {isEdit ? "Editar Cliente" : "Novo Cliente"}
          </h1>
          <p className="info-text">
            {isEdit
              ? "Altere os dados do cliente e clique em salvar para atualizar as informações."
              : "Preencha os dados do cliente e clique em salvar para criar um novo registro."}
          </p>
        </div>
      </div>

      {error && <div className="error-box">{error}</div>}

      <div className="card">
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-grid-1">
            <label className="label">Nome *</label>
            <input
              className="input"
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="label">CNPJ / CPF</label>
            <input
              className="input"
              type="text"
              name="cnpj"
              value={form.cnpj}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="label">Email</label>
            <input
              className="input"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="label">Telefone</label>
            <input
              className="input"
              type="text"
              name="telefone"
              value={form.telefone}
              onChange={handleChange}
            />
          </div>

          <div className="form-grid-1">
            <label className="label">Endereço</label>
            <input
              className="input"
              type="text"
              name="endereco"
              value={form.endereco}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="label">Cidade</label>
            <input
              className="input"
              type="text"
              name="cidade"
              value={form.cidade}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="label">Estado</label>
            <input
              className="input"
              type="text"
              name="estado"
              value={form.estado}
              onChange={handleChange}
              maxLength={2}
            />
          </div>

          <div>
            <label className="label">CEP</label>
            <input
              className="input"
              type="text"
              name="cep"
              value={form.cep}
              onChange={handleChange}
            />
          </div>

          <div>
            <label classname="label">Status</label>
            <select
             classname="select"
             name="status"
             value={form.status}
             onChange={handleChange}
            >
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
              <option value="Prospect">Prospect</option>
              <option value="Bloqueado">Bloqueado</option>
            </select>
          </div>

          <div className="form-grid-1">
            <label className="label">Observações</label>
            <textarea
              className="textarea"
              name="observacoes"
              value={form.observacoes}
              onChange={handleChange}
            />
          </div>

          <div className="form-grid-1" style={{ display: "flex", justifyContent: "flex-end" }}>
            <button className="btn btn-primary"type="submit" disabled={saving}>
              {saving ? "Salvando..." : "Salvar Cliente"}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

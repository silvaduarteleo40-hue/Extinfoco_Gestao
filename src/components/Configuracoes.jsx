import { useState, useEffect } from "react"

const STORAGE_KEY = "extinfoco_empresa"

export const defaultEmpresa = {
  nome: "",
  cnpj: "",
  endereco: "",
  cidade: "",
  estado: "",
  cep: "",
  telefone: "",
  email: "",
  site: ""
}

export function getEmpresaData() {  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return { ...defaultEmpresa }
    return {
       ...defaultEmpresa,
       ...JSON.parse(stored)
       }
     } catch (err) {
    console.error("Erro ao carregar dados da empresa:", err)
    return { ...defaultEmpresa }
  }
}

export default function Configuracoes() {

  const [empresa, setEmpresa] = useState(defaultEmpresa)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setEmpresa(getEmpresaData())
  }, [])

  function handleChange(e) {
    const { name, value } = e.target
    setEmpresa(prev => ({
      ...prev,
      [name]: value
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()

    localStorage.setItem(STORAGE_KEY, JSON.stringify(empresa))

    setSaved(true)

    setTimeout(() => {
      setSaved(false)
    }, 2500)
  }

return (
  <div>
    <div className="page-header">
      <h1 className="page-title">Configurações da Empresa</h1>
    </div>

    {saved && (
      <div className="alert-success">
        ✅ Dados salvos com sucesso!
      </div>
    )}

    <div className="card">
      <form onSubmit={handleSubmit} className="form-layout">

        <div className="form-group full">
          <label>Nome da Empresa *</label>
          <input
            className="form-control"
            type="text"
            name="nome"
            value={empresa.nome}
            onChange={handleChange}
            required
            placeholder="Ex: EXTINFOCO Serviços de Segurança"
          />
        </div>

        <div className="form-group">
          <label>CNPJ</label>
          <input
            className="form-control"
            type="text"
            name="cnpj"
            value={empresa.cnpj}
            onChange={handleChange}
            placeholder="00.000.000/0000-00"
          />
        </div>

        <div className="form-group">
          <label>Telefone</label>
          <input
            className="form-control"
            type="text"
            name="telefone"
            value={empresa.telefone}
            onChange={handleChange}
            placeholder="(00) 00000-0000"
          />
        </div>

        <div className="form-group full">
          <label>Endereço</label>
          <input
            className="form-control"
            type="text"
            name="endereco"
            value={empresa.endereco}
            onChange={handleChange}
            placeholder="Rua, número, bairro"
          />
        </div>

        <div className="form-group">
          <label>Cidade</label>
          <input
            className="form-control"
            type="text"
            name="cidade"
            value={empresa.cidade}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Estado (UF)</label>
          <input
            className="form-control"
            type="text"
            name="estado"
            value={empresa.estado}
            onChange={handleChange}
            maxLength={2}
            placeholder="CE"
          />
        </div>

        <div className="form-group">
          <label>CEP</label>
          <input
            className="form-control"
            type="text"
            name="cep"
            value={empresa.cep}
            onChange={handleChange}
            placeholder="00000-000"
          />
        </div>

        <div className="form-group">
          <label>E-mail</label>
          <input
            className="form-control"
            type="email"
            name="email"
            value={empresa.email}
            onChange={handleChange}
            placeholder="contato@empresa.com"
          />
        </div>

        <div className="form-group full">
          <label>Site</label>
          <input
            className="form-control"
            type="text"
            name="site"
            value={empresa.site}
            onChange={handleChange}
            placeholder="www.empresa.com"
          />
        </div>

        <div className="form-actions">
          <button className="btn btn-primary" type="submit">
            Salvar Configurações
          </button>
        </div>

      </form>
    </div>
  </div>
)
}
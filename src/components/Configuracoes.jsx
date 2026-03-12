import { useEffect, useState } from 'react'

const STORAGE_KEY = 'extinfoco_empresa'

export const defaultEmpresa = {
  nome: '',
  cnpj: '',
  endereco: '',
  cidade: '',
  estado: '',
  cep: '',
  telefone: '',
  email: '',
  site: ''
}

export function getEmpresaData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? { ...defaultEmpresa, ...JSON.parse(stored) } : { ...defaultEmpresa }
  } catch {
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
    setEmpresa((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(empresa))
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Configurações da Empresa</h1>
          <p className="info-text">Defina os dados institucionais usados no sistema e nos certificados.</p>
        </div>
      </div>

      {saved && (
        <div className="success-box">
          Dados salvos com sucesso.
        </div>
      )}

      <div className="card config-card">
        <form onSubmit={handleSubmit} className="config-form">
          <div className="field field-full">
            <label className="label">Nome da Empresa *</label>
            <input
              className="input"
              type="text"
              name="nome"
              value={empresa.nome}
              onChange={handleChange}
              required
              placeholder="Ex: EXTINFOCO Serviços"
            />
          </div>

          <div className="field">
            <label className="label">CNPJ</label>
            <input
              className="input"
              type="text"
              name="cnpj"
              value={empresa.cnpj}
              onChange={handleChange}
              placeholder="00.000.000/0000-00"
            />
          </div>

          <div className="field">
            <label className="label">Telefone</label>
            <input
              className="input"
              type="text"
              name="telefone"
              value={empresa.telefone}
              onChange={handleChange}
              placeholder="(00) 00000-0000"
            />
          </div>

          <div className="field field-full">
            <label className="label">Endereço</label>
            <input
              className="input"
              type="text"
              name="endereco"
              value={empresa.endereco}
              onChange={handleChange}
              placeholder="Rua, número, bairro"
            />
          </div>

          <div className="field">
            <label className="label">Cidade</label>
            <input
              className="input"
              type="text"
              name="cidade"
              value={empresa.cidade}
              onChange={handleChange}
              placeholder="Cidade"
            />
          </div>

          <div className="field">
            <label className="label">Estado (UF)</label>
            <input
              className="input"
              type="text"
              name="estado"
              value={empresa.estado}
              onChange={handleChange}
              maxLength={2}
              placeholder="SP"
            />
          </div>

          <div className="field">
            <label className="label">CEP</label>
            <input
              className="input"
              type="text"
              name="cep"
              value={empresa.cep}
              onChange={handleChange}
              placeholder="00000-000"
            />
          </div>

          <div className="field">
            <label className="label">E-mail</label>
            <input
              className="input"
              type="email"
              name="email"
              value={empresa.email}
              onChange={handleChange}
              placeholder="contato@empresa.com"
            />
          </div>

          <div className="field field-full">
            <label className="label">Site</label>
            <input
              className="input"
              type="text"
              name="site"
              value={empresa.site}
              onChange={handleChange}
              placeholder="www.empresa.com"
            />
          </div>

          <div className="config-actions">
            <button className="btn btn-primary" type="submit">
              Salvar Configurações
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

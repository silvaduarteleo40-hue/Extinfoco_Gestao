import { useState, useEffect } from 'react'

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
    setEmpresa(prev => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(empresa))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Configurações da Empresa</h1>
      </div>

      {saved && (
        <div style={{ background: '#d1fae5', color: '#065f46', padding: '10px 16px', borderRadius: 6, marginBottom: 16 }}>
          ✅ Dados salvos com sucesso!
        </div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: 20 }}>
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

          <div className="form-group" style={{ marginBottom: 20 }}>
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

          <div className="form-group" style={{ marginBottom: 20 }}>
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

          <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
            <div className="form-group" style={{ flex: 2, marginBottom: 0 }}>
              <label>Cidade</label>
              <input
                className="form-control"
                type="text"
                name="cidade"
                value={empresa.cidade}
                onChange={handleChange}
              />
            </div>
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
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
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
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
          </div>

          <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
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
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
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
          </div>

          <div className="form-group" style={{ marginBottom: 24 }}>
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

          <button className="btn btn-primary" type="submit">
            Salvar Configurações
          </button>
        </form>
      </div>
    </div>
  )
}

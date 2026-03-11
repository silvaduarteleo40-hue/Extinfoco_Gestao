import { useState } from 'react'
import { Navigate } from 'react-router-dom'

export default function Login({ onLogin, isAuth }) {
  const [senha, setSenha] = useState('')
  if (isAuth) return <Navigate to="/" /> // Se já logou, pula o login

  const handleSubmit = (e) => {
    e.preventDefault()
    // Pega a senha do seu .env (VITE_APP_PASSWORD)
    if (senha === import.meta.env.VITE_APP_PASSWORD) {
      onLogin()
    } else {
      alert('Senha incorreta!')
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
      <form onSubmit={handleSubmit} style={{ textAlign: 'center', border: '1px solid #ccc', padding: '2rem' }}>
        <h2>Acesso EXTINFOCO</h2>
        <input 
          type="password" 
          placeholder="Senha de acesso" 
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          style={{ padding: '8px', marginBottom: '10px', display: 'block' }}
        />
        <button type="submit" style={{ padding: '8px 20px', cursor: 'pointer' }}>Entrar</button>
      </form>
    </div>
  )
}

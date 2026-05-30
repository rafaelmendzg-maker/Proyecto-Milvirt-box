import React from 'react'
import { useAuth } from '../../contexts/AuthContext'

const Header = () => {
  const { user, logout } = useAuth()
  return (
    <div className="mil-header">
      <div className="logo-area">
        <h1> MILVIRT </h1>
        <p>  Hypervisor       · Superficie de Ataque Mínima</p>
      </div>
      <div className="hypervisor-stats">
        <span> TCB &lt;2500 LOC</span> &nbsp;|&nbsp; <span> Aislamiento temporal/espacial</span>
        <button onClick={logout} style={{marginLeft: '15px', background: '#3a1f1f', border: 'none', color: '#ffbb99', cursor: 'pointer', padding: '4px 12px', borderRadius: '20px'}}> Salir</button>
      </div>
    </div>
  )
}

export default Header
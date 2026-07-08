import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import AdminPanel from '../Admin/AdminPanel'; 

const Header = () => {
  const { user, logout } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      supabase
        .from('user_settings')
        .select('role')
        .eq('user_id', user.id)
        .single()
        .then(({ data }) => setIsAdmin(data?.role === 'admin'));
    }
  }, [user]);

  return (
    <div className="mil-header">
      {/* logo + TÍTULO */}
      <div className="logo-area" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <img 
          src="/logodelproyecto2.png"          
          alt="Milvirt Logo" 
          height="70"             
          style={{ objectFit: 'contain' }}
        />
        <div>
          <h1 style={{ margin: 0, fontSize: 'clamp(1.6rem, 5vw, 2rem)', letterSpacing: '4px', fontWeight: 400, textShadow: '0 0 8px #2affb6' }}>
             MILVIRT  
          </h1>
          <p style={{ margin: 0, fontSize: '0.75rem', color: '#89cfb0' }}>
            Hypervisor Bare-Metal · seL4 Kernel · Superficie de Ataque Mínima
          </p>
        </div>
      </div>

      {/* PARTE DERECHA: ESTADÍSTICAS + BOTÓN ADMIN + LOGOUT */}
      <div className="hypervisor-stats">
        <span> TCB &lt;2500 LOC</span> &nbsp;|&nbsp; <span> Aislamiento temporal/espacial</span>
        {isAdmin && <AdminPanel userId={user?.id} />}
        <button
          onClick={logout}
          style={{
            marginLeft: '15px',
            background: '#3a1f1f',
            border: 'none',
            color: '#ffbb99',
            cursor: 'pointer',
            padding: '4px 12px',
            borderRadius: '20px',
          }}
        >
           Salir
        </button>
      </div>
    </div>
  );
};

export default Header;
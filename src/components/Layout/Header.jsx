import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import AdminPanel from '../Admin/AdminPanel';
import { useTheme } from '../../contexts/ThemeContext';

const Header = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
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
      {/* Logo + Título */}
      <div className="logo-area" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <img
          src="/logodelproyecto2.png"
          alt="Milvirt Logo"
          height="70"
          style={{ objectFit: 'contain' }}
        />
        <div>
          <h1 style={{
            margin: 0,
            fontSize: 'clamp(1.6rem, 5vw, 2rem)',
            letterSpacing: '4px',
            fontWeight: 400,
            color: 'var(--color-title)',
            textShadow: isDark ? '0 0 8px #2affb6' : 'none',
          }}>
             MILVIRT 
          </h1>
          <p style={{
            margin: 0,
            fontSize: '0.75rem',
            color: 'var(--color-subtitle)',
          }}>
             Superficie de Ataque Mínima
          </p>
        </div>
      </div>

      {/* Parte derecha: estadísticas + tema + admin + logout */}
      <div className="hypervisor-stats" style={{ color: 'var(--color-stats)' }}>
        <span> TCB &lt;2500 LOC</span>
        &nbsp;|&nbsp;
        <span> l</span>

        {/* Botón de tema */}
        <button
          onClick={toggleTheme}
          style={{
            background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            border: `1px solid var(--color-border)`,
            borderRadius: '40px',
            padding: '4px 12px',
            color: 'var(--color-text)',
            cursor: 'pointer',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
          }}
        >
          {isDark ? '☀️ Claro' : '🌙 Oscuro'}
        </button>

        {isAdmin && <AdminPanel userId={user?.id} />}

        <button
          onClick={logout}
          style={{
            marginLeft: '10px',
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
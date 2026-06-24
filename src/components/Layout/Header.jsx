import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import AdminPanel from '../Admin/AdminPanel';

const Header = () => {
  const { user, logout } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) return;
    const checkAdmin = async () => {
      const { data, error } = await supabase
        .from('user_settings')
        .select('role')
        .eq('user_id', user.id)
        .single();
      if (data && !error) {
        setIsAdmin(data.role === 'admin');
      }
    };
    checkAdmin();
  }, [user]);

  return (
    <div className="mil-header">
      <div className="logo-area">
        <h1> MILVIRT</h1>
        <p>Hypervisor Bare-Metal · seL4 Kernel · Superficie de Ataque Mínima</p>
      </div>
      <div className="hypervisor-stats">
        {isAdmin && <AdminPanel userId={user?.id} />}
        <span> TCB &lt;2500 LOC</span>
        <span> Aislamiento temporal/espacial</span>
        <button onClick={logout} style={{
          marginLeft: '15px',
          background: '#3a1f1f',
          border: 'none',
          color: '#ffbb99',
          cursor: 'pointer',
          padding: '4px 12px',
          borderRadius: '20px'
        }}>
           Salir
        </button>
      </div>
    </div>
  );
};

export default Header;
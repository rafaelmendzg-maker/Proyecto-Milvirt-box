import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

const AdminPanel = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [events, setEvents] = useState([]);
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [msgs, evts, sets] = await Promise.all([
        supabase.from('messages').select('*').order('created_at', { ascending: false }),
        supabase.from('radar_events').select('*').order('created_at', { ascending: false }),
        supabase.from('user_settings').select('*')
      ]);
      if (msgs.error) throw msgs.error;
      if (evts.error) throw evts.error;
      if (sets.error) throw sets.error;
      setMessages(msgs.data || []);
      setEvents(evts.data || []);
      setSettings(sets.data || []);
    } catch (err) {
      console.error('Error cargando datos:', err);
      setError('Error al cargar los datos. Revisa la consola.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchData();
  }, [isOpen]);

  if (!isOpen) {
    return (
      <button className="admin-toggle-btn" onClick={() => setIsOpen(true)}>
         Ver registros de BD
      </button>
    );
  }

  return (
    <div className="admin-modal-overlay" onClick={() => setIsOpen(false)}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={() => setIsOpen(false)}>✖</button>
        <h2>📊 Registros de Supabase</h2>
        {error && <p className="admin-error">{error}</p>}
        {loading && <p>Cargando datos...</p>}
        {!loading && !error && (
          <>
            <h3> Mensajes ({messages.length})</h3>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead><tr><th>ID</th><th>Cipher</th><th>Remitente</th><th>Fecha</th></tr></thead>
                <tbody>
                  {messages.map(m => (
                    <tr key={m.id}>
                      <td>{m.id}</td>
                      <td>{m.cipher?.substring(0, 40)}...</td>
                      <td>{m.sender_email || '?'}</td>
                      <td>{new Date(m.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3> Eventos de radar ({events.length})</h3>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead><tr><th>ID</th><th>Tipo</th><th>Datos</th><th>Usuario</th><th>Fecha</th></tr></thead>
                <tbody>
                  {events.map(e => (
                    <tr key={e.id}>
                      <td>{e.id}</td>
                      <td>{e.event_type}</td>
                      <td><pre>{JSON.stringify(e.event_data, null, 2)}</pre></td>
                      <td>{e.user_id?.substring(0, 8)}...</td>
                      <td>{new Date(e.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3> Configuraciones de usuario ({settings.length})</h3>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead><tr><th>User ID</th><th>Sensibilidad</th><th>Alarma silenciada</th><th>Rol</th></tr></thead>
                <tbody>
                  {settings.map(s => (
                    <tr key={s.user_id}>
                      <td>{s.user_id?.substring(0, 12)}...</td>
                      <td>{s.sensitivity}%</td>
                      <td>{s.alarm_silenced ? 'Sí' : 'No'}</td>
                      <td>{s.role || 'user'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
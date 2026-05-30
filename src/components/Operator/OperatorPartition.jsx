import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { useLocalRadar } from '../../hooks/useLocalRadar'; 

const OperatorPartition = () => {
  const { user } = useAuth();
  const { addRandomTarget, simulateIncursion } = useLocalRadar(); 
  const [sensitivity, setSensitivity] = useState(80);
  const [alarmSilenced, setAlarmSilenced] = useState(false);
  const [lastAction, setLastAction] = useState('Ninguna');
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!user) return;
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('user_settings')
        .select('sensitivity, alarm_silenced')
        .eq('user_id', user.id)
        .single();
      if (data && !error) {
        setSensitivity(data.sensitivity);
        setAlarmSilenced(data.alarm_silenced);
      }
      setLoading(false);
    };
    fetchSettings();
  }, [user]);

  const saveEvent = async (eventType, eventData = {}) => {
    if (!user) return;
    await supabase.from('radar_events').insert({
      event_type: eventType,
      event_data: eventData,
      user_id: user.id
    });
  };

  
  const saveSettings = async (newSensitivity, newAlarmSilenced) => {
    if (!user) return;
    await supabase.from('user_settings').upsert({
      user_id: user.id,
      sensitivity: newSensitivity,
      alarm_silenced: newAlarmSilenced
    });
  };

  
  const handleAddFake = () => {
    addRandomTarget(); 
    saveEvent('manual_target', { source: 'operator' });
    setLastAction(' Objeto añadido manual');
  };

  const handleIncursion = () => {
    simulateIncursion(); 
    saveEvent('incursion', { type: 'aerea', intensity: 'alta' });
    setLastAction(' INCURSIÓN AÉREA simulada');
  };

  const handleToggleAlarm = () => {
    const newState = !alarmSilenced;
    setAlarmSilenced(newState);
    saveSettings(sensitivity, newState);
    saveEvent('alarm_toggle', { new_state: newState });
    setLastAction(newState ? ' Alarma silenciada' : ' Alarma activada');
  };

  const handleSensitivityChange = (e) => {
    const newSensitivity = parseInt(e.target.value);
    setSensitivity(newSensitivity);
    saveSettings(newSensitivity, alarmSilenced);
    saveEvent('sensitivity_change', { old_value: sensitivity, new_value: newSensitivity });
    setLastAction(` Sensibilidad ajustada a ${newSensitivity}%`);
  };

  if (loading) return <div className="loading">Cargando configuración...</div>;

  return (
    <div className="vm-card">
      <div className="card-header">
        <h2> PARTICIÓN 2 · OPERADOR</h2>
        <span className="criticality critical-low"> NO CRÍTICO | INTERACCIÓN</span>
      </div>
      <div className="card-content op-panel">
        <button className="mil-button" onClick={handleAddFake}> Insertar objetivo ficticio</button>
        <button className="mil-button" onClick={handleIncursion}> Simular incursión aérea</button>
        <button className="mil-button" onClick={handleToggleAlarm}>
          {alarmSilenced ? ' Activar alarma' : ' Silenciar alarma'}
        </button>
        <div className="slider-label">
          <span> Sensibilidad de detección:</span>
          <span>{sensitivity}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={sensitivity}
          onChange={handleSensitivityChange}
        />
        <div style={{ background: '#03100c', borderRadius: '14px', padding: '8px', marginTop: '5px' }}>
          <span> Última acción: </span><span>{lastAction}</span>
        </div>
        <div style={{ fontSize: '0.7rem' }}>Esta partición SIN acceso directo a radar | vía hypercall seguro</div>
      </div>
    </div>
  );
};

export default OperatorPartition;
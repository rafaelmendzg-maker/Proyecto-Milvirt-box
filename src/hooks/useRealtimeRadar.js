import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

export const useRealtimeRadar = (userId) => {
  const [targets, setTargets] = useState([]);
  const [nextId, setNextId] = useState(1);
  const channelRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    const channel = supabase.channel('radar-broadcast', {
      config: { broadcast: { self: true } }
    });

    channel.on('broadcast', { event: 'new-target' }, ({ payload }) => {
      setTargets(prev => {
        const newTarget = { ...payload.target, id: payload.target.id || Date.now() };
        const updated = [...prev, newTarget];
        if (updated.length > 30) updated.shift();
        return updated;
      });
    });

    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') console.log('Conectado a canal radar');
    });

    channelRef.current = channel;

    return () => {
      channel.unsubscribe();
    };
  }, [userId]);

  
  const broadcastTarget = useCallback((target) => {
    if (!channelRef.current) return;
    channelRef.current.send({
      type: 'broadcast',
      event: 'new-target',
      payload: { target: { ...target, id: Date.now() + Math.random() } }
    });
  }, []);

  
  const addRandomTarget = useCallback((sensitivity, fromOperator = false) => {
    if (!fromOperator && Math.random() * 100 > sensitivity) return;
    const angle = Math.random() * 360;
    const distance = 40 + Math.random() * 110;
    const speed = 0.6 + Math.random() * 2.2;
    const isThreat = (distance < 50 && !fromOperator) || distance < 38;
    const newTarget = { distance, angleDeg: angle, speed, isThreat, id: Date.now() + Math.random() };
    broadcastTarget(newTarget);
    return newTarget;
  }, [broadcastTarget]);

 
  const simulateIncursion = useCallback(() => {
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const angle = Math.random() * 360;
        const distance = 20 + Math.random() * 35;
        const newTarget = { distance, angleDeg: angle, speed: 1.9, isThreat: true, id: Date.now() + Math.random() };
        broadcastTarget(newTarget);
      }, i * 200);
    }
  }, [broadcastTarget]);

 
  const clearTargets = useCallback(() => {
    setTargets([]);
  }, []);

  return {
    targets,
    addRandomTarget,
    simulateIncursion,
    clearTargets,
    threatCount: targets.filter(t => t.isThreat).length
  };
};
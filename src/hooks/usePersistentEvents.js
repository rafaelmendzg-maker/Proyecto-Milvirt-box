import { useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

export const usePersistentEvents = (userId) => {
  const saveEvent = useCallback(async (eventType, eventData = {}) => {
    if (!userId) return;
    try {
      await supabase.from('radar_events').insert({
        event_type: eventType,
        event_data: eventData,
        user_id: userId
      });
    } catch (error) {
      console.error('Error guardando evento:', error);
    }
  }, [userId]);

  return { saveEvent };
};
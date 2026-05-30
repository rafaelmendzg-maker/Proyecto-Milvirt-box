import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export const useUserSettings = (userId) => {
  const [sensitivity, setSensitivity] = useState(80);
  const [alarmSilenced, setAlarmSilenced] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('user_settings')
        .select('sensitivity, alarm_silenced')
        .eq('user_id', userId)
        .single();
      if (data && !error) {
        setSensitivity(data.sensitivity);
        setAlarmSilenced(data.alarm_silenced);
      } else {
       
        await supabase.from('user_settings').insert({
          user_id: userId,
          sensitivity: 80,
          alarm_silenced: false
        });
      }
      setLoading(false);
    };
    fetchSettings();
  }, [userId]);

  const updateSensitivity = async (value) => {
    if (!userId) return;
    setSensitivity(value);
    await supabase.from('user_settings').upsert({
      user_id: userId,
      sensitivity: value,
      alarm_silenced: alarmSilenced
    });
  };

  const updateAlarmSilenced = async (value) => {
    if (!userId) return;
    setAlarmSilenced(value);
    await supabase.from('user_settings').upsert({
      user_id: userId,
      sensitivity: sensitivity,
      alarm_silenced: value
    });
  };

  return { sensitivity, alarmSilenced, updateSensitivity, updateAlarmSilenced, loading };
};
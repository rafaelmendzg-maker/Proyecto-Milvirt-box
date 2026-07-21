import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { encryptMessage } from './useCrypto';

export const usePersistentMessages = (userId, userEmail) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('id, cipher, created_at, sender_email')
        .order('created_at', { ascending: true });
      if (!error && data) setMessages(data);
    };
    fetchMessages();

    const channel = supabase.channel('messages-realtime');
    channel
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();

    return () => channel.unsubscribe();
  }, [userId]);

  const sendMessage = async (plainText) => {
    if (!plainText.trim() || !userId) return;

    // Si no se pasó email, lo obtenemos de la sesión
    let email = userEmail;
    if (!email) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        email = user?.email;
      } catch (error) {
        console.error('[ERROR] No se pudo obtener el email del usuario:', error);
      }
    }

    const cipher = encryptMessage(plainText);
    await supabase.from('messages').insert({
      cipher,
      user_id: userId,
      sender_email: email,
    });
  };

  return { messages, sendMessage };
};
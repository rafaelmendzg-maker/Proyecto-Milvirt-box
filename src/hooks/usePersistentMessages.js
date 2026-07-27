import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { encryptMessage } from './useCrypto';

const CRYPTO_KEY = import.meta.env.VITE_CRYPTO_KEY || 'clave-por-defecto-no-segura';

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

    let email = userEmail;
    if (!email) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        email = user?.email;
      } catch (error) {
        console.error('[ERROR] No se pudo obtener el email del usuario:', error);
      }
    }

    try {
      const cipher = await encryptMessage(plainText, CRYPTO_KEY);
      await supabase.from('messages').insert({
        cipher,
        user_id: userId,
        sender_email: email,
      });
    } catch (error) {
      console.error('[ERROR] Error al enviar mensaje:', error);
      throw error;
    }
  };

  return { messages, sendMessage };
};
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { usePersistentMessages } from '../../hooks/usePersistentMessages';
import { decryptMessage } from '../../hooks/useCrypto';

const CommsPartition = () => {
  const { user } = useAuth();
  const { messages, sendMessage } = usePersistentMessages(user?.id, user?.email);
  const [inputMsg, setInputMsg] = useState('');
  const [decryptedMap, setDecryptedMap] = useState({});
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [error, setError] = useState(null);

  const handleSend = async () => {
    if (!inputMsg.trim()) return;
    try {
      await sendMessage(inputMsg);
      setInputMsg('');
      setError(null);
    } catch (err) {
      console.error('[ERROR] Error al enviar mensaje:', err);
      setError('No se pudo enviar el mensaje.');
    }
  };

  const handleDecryptSingle = async (id, cipher) => {
    try {
      const plain = await decryptMessage(cipher);
      setDecryptedMap(prev => ({ ...prev, [id]: plain }));
      setError(null);
    } catch (err) {
      console.error(`[ERROR] Error al descifrar mensaje ${id}:`, err);
      setError(`Error al descifrar. Código: ${id}`);
    }
  };

  const handleDecryptAll = async () => {
    setIsDecrypting(true);
    setError(null);
    const newMap = {};
    try {
      for (const msg of messages) {
        try {
          newMap[msg.id] = await decryptMessage(msg.cipher);
        } catch (err) {
          console.error(`[ERROR] Error al descifrar mensaje ${msg.id}:`, err);
          newMap[msg.id] = '[error al descifrar]';
        }
      }
      setDecryptedMap(newMap);
    } catch (err) {
      console.error('[ERROR] Error en descifrado masivo:', err);
      setError('Error al descifrar todos los mensajes.');
    } finally {
      setIsDecrypting(false);
    }
  };

  return (
    <div className="vm-card">
      <div className="card-header">
        <h2> PARTICIÓN 3 · COMMS</h2>
        <span className="criticality critical-enc"> CIFRADO SIMÉTRICO (AES-GCM)</span>
      </div>
      <div className="card-content">
        {error && (
          <div style={{ color: '#ff6644', background: '#2a0a0a', padding: '8px', borderRadius: '8px', marginBottom: '8px' }}>
            ⚠️ {error}
          </div>
        )}
        <div className="chat-log">
          {messages.length === 0 ? (
            <div className="msg-entry">No hay mensajes aún. Envía uno.</div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="msg-entry">
                <strong style={{ color: '#aaddff' }}>
                  {msg.sender_email || 'Anónimo'}:
                </strong>{' '}
                <span className="ciphertext">🔒 {msg.cipher.substring(0, 50)}...</span>
                <button
                  className="decrypt-btn"
                  onClick={() => handleDecryptSingle(msg.id, msg.cipher)}
                  disabled={isDecrypting}
                >
                  {decryptedMap[msg.id] ? '✓ descifrado' : '🔓 Descifrar'}
                </button>
                {decryptedMap[msg.id] && (
                  <span className="plaintext-hidden"> → "{decryptedMap[msg.id]}"</span>
                )}
              </div>
            ))
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder="Mensaje a transmitir (cifrado)"
            style={{ flex: 1, background: '#0b1914', border: '1px solid #3b8f70', color: '#def5e8', padding: '6px', borderRadius: '40px' }}
            disabled={isDecrypting}
          />
          <button className="mil-button" onClick={handleSend} disabled={isDecrypting}>
             Enviar
          </button>
        </div>
        <button
          className="mil-button"
          style={{ background: '#1c3b30' }}
          onClick={handleDecryptAll}
          disabled={isDecrypting}
        >
          {isDecrypting ? ' Descifrando...' : ' Descifrar todos'}
        </button>
        <div style={{ fontSize: '0.7rem', marginTop: '6px' }}>
           Criptografía AES-GCM | Datos persistentes en el Backend Supabase
        </div>
      </div>
    </div>
  );
};

export default CommsPartition;
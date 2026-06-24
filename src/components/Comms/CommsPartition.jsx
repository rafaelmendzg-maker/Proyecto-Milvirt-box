import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { usePersistentMessages } from '../../hooks/usePersistentMessages';
import { decryptMessage } from '../../hooks/useCrypto';

const CommsPartition = () => {
  const { user } = useAuth();
  const { messages, sendMessage } = usePersistentMessages(user?.id);
  const [inputMsg, setInputMsg] = useState('');
  const [decryptedMap, setDecryptedMap] = useState({});

  const handleSend = async () => {
    if (!inputMsg.trim()) return;
    await sendMessage(inputMsg);
    setInputMsg('');
  };

  const handleDecryptSingle = (id, cipher) => {
    const plain = decryptMessage(cipher);
    setDecryptedMap(prev => ({ ...prev, [id]: plain }));
  };

  const handleDecryptAll = () => {
    const newMap = {};
    messages.forEach(msg => {
      newMap[msg.id] = decryptMessage(msg.cipher);
    });
    setDecryptedMap(newMap);
  };

  return (
    <div className="vm-card">
      <div className="card-header">
        <h2> PARTICIÓN 3 · COMMS</h2>
        <span className="criticality critical-enc"> CIFRADO SIMÉTRICO</span>
      </div>
      <div className="card-content">
        <div className="chat-log">
          {messages.length === 0 ? (
            <div className="msg-entry">No hay mensajes aún. Envía uno.</div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="msg-entry">
                <span className="ciphertext">🔒 {msg.cipher.substring(0, 50)}...</span>
                <button
                  className="decrypt-btn"
                  onClick={() => handleDecryptSingle(msg.id, msg.cipher)}
                >
                  {decryptedMap[msg.id] ? '✓ descifrado' : ' Descifrar'}
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
          />
          <button className="mil-button" onClick={handleSend}> Enviar</button>
        </div>
        <button className="mil-button" style={{ background: '#1c3b30' }} onClick={handleDecryptAll}>
           Descifrar todos
        </button>
        <div style={{ fontSize: '0.7rem', marginTop: '6px' }}>Criptografía | Datos persistentes en Supabase</div>
      </div>
    </div>
  );
};

export default CommsPartition;
import React, { useState } from 'react';
import { usePersistentMessages } from '../../hooks/usePersistentMessages';
import { useAuth } from '../../contexts/AuthContext';

const CommsPartition = () => {
  const { user } = useAuth();
  const { messages, sendMessage, decryptMessageById } = usePersistentMessages(user?.id);
  const [inputMsg, setInputMsg] = useState('');
  const [decryptedMap, setDecryptedMap] = useState({});

  const handleSend = () => {
    if (!inputMsg.trim()) return;
    sendMessage(inputMsg);
    setInputMsg('');
  };

  const handleDecrypt = (id, cipher) => {
    const plain = decryptMessageById(cipher);
    setDecryptedMap(prev => ({ ...prev, [id]: plain }));
    console.log('CommsPartition renderizando');
  };

  return (
    <div className="vm-card">
      <div className="card-header">
        <h2> COMMS</h2>
        <span className="criticality critical-enc">CIFRADO SIMÉTRICO</span>
      </div>
      <div className="card-content">
        <div className="chat-log">
          {messages.map(msg => (
            <div key={msg.id} className="msg-entry">
              <span className="ciphertext"> {msg.cipher.substring(0, 50)}...</span>
              <button className="decrypt-btn" onClick={() => handleDecrypt(msg.id, msg.cipher)}>
                {decryptedMap[msg.id] ? '✓ descifrado' : '🔓 Descifrar'}
              </button>
              {decryptedMap[msg.id] && <span className="plaintext-hidden"> → "{decryptedMap[msg.id]}"</span>}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input type="text" value={inputMsg} onChange={(e) => setInputMsg(e.target.value)} placeholder="Mensaje cifrado" />
          <button className="mil-button" onClick={handleSend}> Enviar</button>
        </div>
      </div>
    </div>
  );
};

export default CommsPartition;
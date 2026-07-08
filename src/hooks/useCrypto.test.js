import { describe, it, expect } from 'vitest';
import { encryptMessage, decryptMessage } from './useCrypto';

describe('Funciones de cifrado', () => {
  it('debe cifrar y descifrar correctamente un mensaje', () => {
    const original = 'Mensaje secreto';
    const encrypted = encryptMessage(original);
    const decrypted = decryptMessage(encrypted);
    expect(decrypted).toBe(original);
  });

  it('debe manejar mensajes vacíos', () => {
    const original = '';
    const encrypted = encryptMessage(original);
    const decrypted = decryptMessage(encrypted);
    expect(decrypted).toBe('');
  });

  it('debe manejar caracteres especiales', () => {
    const original = '¡Ñandú! @#$%^&*()';
    const encrypted = encryptMessage(original);
    const decrypted = decryptMessage(encrypted);
    expect(decrypted).toBe(original);
  });

  it('debe fallar elegantemente si el cipher es inválido', () => {
    const invalidCipher = 'esto-no-es-base64';
    const result = decryptMessage(invalidCipher);
    expect(result).toBe('[error]')
  });
});
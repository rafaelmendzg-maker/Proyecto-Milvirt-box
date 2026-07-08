/**
 * Clave compartida para el cifrado XOR (simulación militar)
 * @constant {string}
 */
const CRYPTO_KEY = "MIL-SPEC_2024_seL4_ARMOR";

/**
 * Función interna que aplica XOR entre un texto y una clave
 * @param {string} text - Texto a cifrar/descifrar
 * @param {string} key - Clave para el XOR
 * @returns {string} Texto transformado
 */
const xorEncryptDecrypt = (text, key) => {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const keyChar = key.charCodeAt(i % key.length);
    result += String.fromCharCode(text.charCodeAt(i) ^ keyChar);
  }
  return result;
};

/**
 * Cifra un mensaje de texto plano usando XOR + Base64
 * @param {string} plain - El texto que se quiere cifrar
 * @returns {string} El mensaje cifrado en Base64
 */
export const encryptMessage = (plain) => {
  const xorred = xorEncryptDecrypt(plain, CRYPTO_KEY);
  return btoa(xorred);
};

/**
 * Descifra un mensaje que fue cifrado con XOR + Base64
 * @param {string} cipher - El mensaje cifrado en Base64
 * @returns {string} El mensaje descifrado, o '[error]' si falla
 */
export const decryptMessage = (cipher) => {
  try {
    const xorred = atob(cipher);
    return xorEncryptDecrypt(xorred, CRYPTO_KEY);
  } catch (error) {
    console.error(`[ERROR] [${new Date().toISOString()}] - Error al descifrar: ${error.message}`);
    return '[error]';
  }
};

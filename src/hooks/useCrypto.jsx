const CRYPTO_KEY = "MIL-SPEC_2024_seL4_ARMOR"

const xorEncryptDecrypt = (text, key) => {
  let result = ''
  for (let i = 0; i < text.length; i++) {
    const keyChar = key.charCodeAt(i % key.length)
    result += String.fromCharCode(text.charCodeAt(i) ^ keyChar)
  }
  return result
}

export const encryptMessage = (plain) => {
  return btoa(xorEncryptDecrypt(plain, CRYPTO_KEY))
}

export const decryptMessage = (cipher) => {
  try {
    return xorEncryptDecrypt(atob(cipher), CRYPTO_KEY)
  } catch(e) {
    return "[error descifrado]"
  }
}
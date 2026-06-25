import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY ?? 'default-secret-key';

/**
 * Encrypts a plain-text string.
 */
export function encryptTestData(plainText: string): string {
  return CryptoJS.AES.encrypt(plainText, ENCRYPTION_KEY).toString();
}

/**
 * Decrypts an AES-encrypted string.
 */
export function decryptTestData(cipherText: string): string {
  const bytes = CryptoJS.AES.decrypt(cipherText, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}

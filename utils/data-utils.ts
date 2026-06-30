import CryptoJS from 'crypto-js';

if (!process.env.ENCRYPTION_KEY) {
  throw new Error('ENCRYPTION_KEY environment variable is not set. Check your .env file.');
}
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

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

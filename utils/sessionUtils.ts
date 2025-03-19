import * as Crypto from 'expo-crypto';

const SECRET_KEY = 'your-secret-key'; // Replace with your actual secret key

export async function generateSessionKey(): Promise<string> {
  const payload = `session-${Date.now()}`;
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    payload
  );
  const expirationTime = Date.now() + 6000000; // 1 minute expiration
  console.log('Generated session key:', digest); // Log the key
  console.log('Expiration time:', new Date(expirationTime).toLocaleString()); // Log the expiration time
  return JSON.stringify({ key: digest, expiresAt: expirationTime });
}

export function isSessionKeyExpired(sessionKey: string): boolean {
  const { expiresAt } = JSON.parse(sessionKey);
  const isExpired = Date.now() > expiresAt;
  console.log('Current time:', new Date().toLocaleString()); // Log the current time
  console.log('Session key expiration time:', new Date(expiresAt).toLocaleString()); // Log the expiration time
  console.log('Is session key expired:', isExpired); // Log if the key is expired
  return isExpired;
}

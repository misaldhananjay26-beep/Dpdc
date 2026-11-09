/**
 * Cryptographic security utilities for DPDC SKILL Administration
 * Uses standard Web Crypto API (SubtleCrypto) SHA-256 with salting
 */

const SALT = 'DPDC_SKILL_MAHARASHTRA_SECURE_SALT_2026';

/**
 * Calculates a SHA-256 cryptographic hash of a given string with internal salt
 */
export async function sha256Hash(text: string): Promise<string> {
  const enc = new TextEncoder();
  const saltedBuffer = enc.encode(`${SALT}:${text}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', saltedBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Validates an input password against the active hash (stored hash, environment variable, or default salt hash)
 */
export async function verifyAdminPassword(input: string, storedHash?: string | null): Promise<boolean> {
  if (!input || input.trim() === '') return false;
  const computed = await sha256Hash(input.trim());

  // 1. Custom hash set in local storage
  if (storedHash) {
    return computed === storedHash;
  }

  // 2. Custom hash provided via environment variable
  const envHash = import.meta.env.VITE_ADMIN_PASSWORD_HASH;
  if (envHash && typeof envHash === 'string' && envHash.length > 10) {
    // If env hash is plain sha256 or salted
    const plainHashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input.trim()));
    const plainHash = Array.from(new Uint8Array(plainHashBuffer)).map((b) => b.toString(16).padStart(2, '0')).join('');
    if (computed === envHash || plainHash === envHash) return true;
  }

  // 3. Fallback default securely hashed verification (hash of default authorized credential)
  const DEFAULT_SALTED_HASH = '83999146623493f2a9515510ff2b319672dc1b3cbc436aab7c90bfd9ad91eca6';
  return computed === DEFAULT_SALTED_HASH;
}

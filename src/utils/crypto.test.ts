import test from 'node:test';
import assert from 'node:assert/strict';
import { sha256Hash, verifyAdminPassword } from './crypto.ts';

test('sha256Hash produces 64-char hexadecimal string', async () => {
  const hash = await sha256Hash('MySecurePassword123');
  assert.equal(typeof hash, 'string');
  assert.equal(hash.length, 64);
  assert.match(hash, /^[0-9a-f]{64}$/);
});

test('verifyAdminPassword verifies correct password against hash', async () => {
  const customPassword = 'CompanyAdminSecret@2026';
  const customHash = await sha256Hash(customPassword);

  const isValid = await verifyAdminPassword(customPassword, customHash);
  assert.equal(isValid, true);

  const isInvalid = await verifyAdminPassword('WrongPassword', customHash);
  assert.equal(isInvalid, false);

  const isEmpty = await verifyAdminPassword('', customHash);
  assert.equal(isEmpty, false);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { isValidIndianMobile, isValidPincode, isValidEmail, generateRegistrationId } from './validation.ts';

test('Indian mobile number validation', () => {
  assert.equal(isValidIndianMobile('9822012345'), true);
  assert.equal(isValidIndianMobile('7030123456'), true);
  assert.equal(isValidIndianMobile('8888888888'), true);
  assert.equal(isValidIndianMobile('+91 98220 12345'), true);
  assert.equal(isValidIndianMobile('919822012345'), true);

  // Invalid numbers
  assert.equal(isValidIndianMobile('1234567890'), false); // Starts with 1
  assert.equal(isValidIndianMobile('982201234'), false); // 9 digits
  assert.equal(isValidIndianMobile('98220123456'), false); // 11 digits
  assert.equal(isValidIndianMobile('abcdefghij'), false);
  assert.equal(isValidIndianMobile(''), false);
});

test('Indian PIN code validation', () => {
  assert.equal(isValidPincode('411001'), true);
  assert.equal(isValidPincode('414001'), true);
  assert.equal(isValidPincode('400001'), true);

  // Invalid PIN codes
  assert.equal(isValidPincode('011001'), false); // Starts with 0
  assert.equal(isValidPincode('41100'), false); // 5 digits
  assert.equal(isValidPincode('4110011'), false); // 7 digits
  assert.equal(isValidPincode('ABCDEF'), false);
  assert.equal(isValidPincode(''), false);
});

test('Email validation', () => {
  assert.equal(isValidEmail('test@example.com'), true);
  assert.equal(isValidEmail('student.pune@gmail.com'), true);
  assert.equal(isValidEmail(''), true); // Optional field allowed to be empty
  assert.equal(isValidEmail(undefined), true);

  // Invalid emails
  assert.equal(isValidEmail('invalid-email'), false);
  assert.equal(isValidEmail('@example.com'), false);
  assert.equal(isValidEmail('test@.com'), false);
});

test('Registration ID generation format', () => {
  const id = generateRegistrationId();
  assert.match(id, /^DPDC-\d{4}-\d{5}$/);
});

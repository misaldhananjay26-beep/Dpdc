import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildFirestoreRegistrationPayload,
  mapDocToRegistration,
  sortRegistrationsNewestFirst,
  filterRegistrations,
} from './registrationPayload.ts';

test('buildFirestoreRegistrationPayload maps and bounds fields cleanly including caste and Instagram gate', () => {
  const longName = 'A'.repeat(200);
  const payload = buildFirestoreRegistrationPayload(
    {
      id: 'DPDC-2026-39831',
      fullName: `  ${longName}  `,
      mobile: '+91 98220 12345',
      villageCity: 'Baramati',
      taluka: 'Baramati',
      district: 'Pune',
      state: 'Maharashtra',
      pincode: '413102',
      caste: '  Maratha / Open  ',
      instagramFollowed: true,
      instagramClickedAt: '2026-11-17T08:59:30.000Z',
      courseStatus: 'completed',
      businessInterest: 'centre',
      premisesAvailable: 'yes',
      consentContact: true,
      nowIso: '2026-11-17T09:00:00.000Z',
    },
    'SERVER_TS_SENTINEL'
  );

  assert.equal(payload.id, 'DPDC-2026-39831');
  assert.equal(payload.registrationId, 'DPDC-2026-39831');
  assert.equal((payload.fullName as string).length, 120);
  assert.equal(payload.mobile, '919822012345');
  assert.equal(payload.phoneNumber, '919822012345');
  assert.equal(payload.caste, 'Maratha / Open');
  assert.equal(payload.instagramFollowed, true);
  assert.equal(payload.instagramClickedAt, '2026-11-17T08:59:30.000Z');
  assert.equal(payload.leadStatus, 'New');
  assert.equal(payload.consentContact, true);
  assert.equal(payload.timestamp, 'SERVER_TS_SENTINEL');
  assert.deepEqual(payload.notes, []);
  assert.equal((payload.history as unknown[]).length, 1);
  assert.equal('email' in payload, false);
});

test('mapDocToRegistration preserves legacy records missing caste, instagramFollowed, and timestamp', () => {
  const legacyReg = mapDocToRegistration('DPDC-2026-10001', {
    id: 'DPDC-2026-10001',
    fullName: 'Sunita Kale',
    mobile: '9822000111',
    villageCity: 'Satara',
    taluka: 'Karad',
    district: 'Satara',
    createdAt: '2026-10-05T10:00:00.000Z',
  });

  assert.equal(legacyReg.id, 'DPDC-2026-10001');
  assert.equal(legacyReg.phoneNumber, '9822000111');
  assert.equal(legacyReg.caste, undefined);
  assert.equal(legacyReg.instagramFollowed, undefined);
  assert.equal(legacyReg.createdAt, '2026-10-05T10:00:00.000Z');

  const mockTimestamp = {
    toMillis: () => Date.parse('2026-11-17T10:15:00.000Z'),
    toDate: () => new Date('2026-11-17T10:15:00.000Z'),
  };

  const newReg = mapDocToRegistration('DPDC-2026-39831', {
    registrationId: 'DPDC-2026-39831',
    fullName: 'Anita Shinde',
    phoneNumber: '9822012345',
    caste: 'OBC',
    instagramFollowed: true,
    instagramClickedAt: '2026-11-17T10:14:00.000Z',
    villageCity: 'Karad',
    taluka: 'Karad',
    district: 'Satara',
    state: 'Maharashtra',
    pincode: '415110',
    courseStatus: 'completed',
    businessInterest: 'centre',
    premisesAvailable: 'yes',
    consentContact: true,
    leadStatus: 'New',
    timestamp: mockTimestamp,
  });

  assert.equal(newReg.caste, 'OBC');
  assert.equal(newReg.instagramFollowed, true);
  assert.equal(newReg.createdAt, '2026-11-17T10:15:00.000Z');
});

test('sortRegistrationsNewestFirst preserves legacy docs without timestamp and orders descending', () => {
  const olderLegacy = mapDocToRegistration('DPDC-2026-10001', {
    fullName: 'Legacy User',
    mobile: '9822000111',
    createdAt: '2026-10-01T09:00:00.000Z',
  });
  const middle = mapDocToRegistration('DPDC-2026-20002', {
    fullName: 'Middle User',
    mobile: '9822000222',
    timestamp: { toMillis: () => Date.parse('2026-11-01T09:00:00.000Z') },
  });
  const newest = mapDocToRegistration('DPDC-2026-30003', {
    fullName: 'Newest User',
    mobile: '9822000333',
    timestamp: { toMillis: () => Date.parse('2026-11-17T09:00:00.000Z') },
  });

  const sorted = sortRegistrationsNewestFirst([olderLegacy, newest, middle]);
  assert.deepEqual(
    sorted.map((r) => r.id),
    ['DPDC-2026-30003', 'DPDC-2026-20002', 'DPDC-2026-10001']
  );
});

test('filterRegistrations filters accurately by name, registration ID, or caste', () => {
  const r1 = mapDocToRegistration('DPDC-2026-39831', {
    id: 'DPDC-2026-39831',
    registrationId: 'DPDC-2026-39831',
    fullName: 'Priya Shinde',
    mobile: '9822011111',
    caste: 'Maratha',
    villageCity: 'Baramati',
    taluka: 'Baramati',
    district: 'Pune',
    leadStatus: 'New',
  });
  const r2 = mapDocToRegistration('DPDC-2026-55102', {
    id: 'DPDC-2026-55102',
    registrationId: 'DPDC-2026-55102',
    fullName: 'Snehal Patil',
    mobile: '9421022222',
    caste: 'OBC',
    villageCity: 'Karad',
    taluka: 'Karad',
    district: 'Satara',
    leadStatus: 'Contacted',
  });

  const byId = filterRegistrations([r1, r2], {
    searchTerm: '39831',
    district: 'ALL',
    leadStatus: 'ALL',
  });
  assert.equal(byId.length, 1);
  assert.equal(byId[0].fullName, 'Priya Shinde');

  const byName = filterRegistrations([r1, r2], {
    searchTerm: 'snehal',
    district: 'ALL',
    leadStatus: 'ALL',
  });
  assert.equal(byName.length, 1);
  assert.equal(byName[0].id, 'DPDC-2026-55102');

  const byCaste = filterRegistrations([r1, r2], {
    searchTerm: 'obc',
    district: 'ALL',
    leadStatus: 'ALL',
  });
  assert.equal(byCaste.length, 1);
  assert.equal(byCaste[0].id, 'DPDC-2026-55102');
});

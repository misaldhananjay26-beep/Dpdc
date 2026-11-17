import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildFirestoreRegistrationPayload,
  mapDocToRegistration,
  filterRegistrations,
} from './registrationPayload.ts';

test('buildFirestoreRegistrationPayload maps and bounds fields cleanly', () => {
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
  assert.equal(payload.leadStatus, 'New');
  assert.equal(payload.consentContact, true);
  assert.equal(payload.timestamp, 'SERVER_TS_SENTINEL');
  assert.deepEqual(payload.notes, []);
  assert.equal((payload.history as unknown[]).length, 1);
  assert.equal('email' in payload, false);
});

test('mapDocToRegistration handles Firestore timestamp and missing optional fields', () => {
  const mockTimestamp = {
    toDate: () => new Date('2026-11-17T10:15:00.000Z'),
  };

  const reg = mapDocToRegistration('DPDC-2026-39831', {
    registrationId: 'DPDC-2026-39831',
    fullName: 'Anita Shinde',
    phoneNumber: '9822012345',
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

  assert.equal(reg.id, 'DPDC-2026-39831');
  assert.equal(reg.registrationId, 'DPDC-2026-39831');
  assert.equal(reg.mobile, '9822012345');
  assert.equal(reg.phoneNumber, '9822012345');
  assert.equal(reg.createdAt, '2026-11-17T10:15:00.000Z');
  assert.deepEqual(reg.notes, []);
});

test('filterRegistrations filters accurately by name or registration ID', () => {
  const r1 = mapDocToRegistration('DPDC-2026-39831', {
    id: 'DPDC-2026-39831',
    registrationId: 'DPDC-2026-39831',
    fullName: 'Priya Shinde',
    mobile: '9822011111',
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
});

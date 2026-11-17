# DPDC SKILL Firestore Security Specification (Phase 0)

## 1. Data Invariants
1. **PII Isolation**: Registration documents contain sensitive PII (`mobile`, `phoneNumber`, `whatsapp`, `villageCity`, `pincode`). Unauthenticated visitors and non-admin users MUST NEVER be able to `get` or `list` `/registrations`.
2. **Public Create Integrity**: Any public visitor may submit a new registration document at `/registrations/{registrationId}`, ONLY if:
   - The document ID matches `^DPDC-[0-9]{4}-[0-9]{5}$` and equals both `id` and `registrationId`.
   - `leadStatus` is strictly `'New'` on creation (prevents status spoofing).
   - `consentContact` is strictly `true`.
   - `timestamp` equals `request.time` (prevents backdating/future-dating).
   - No shadow/unexpected fields exist (`keys().hasOnly(...)`).
   - All string fields satisfy strict length bounds and regex formats (`mobile`, `phoneNumber`, `pincode`).
   - `notes` starts empty (`size() == 0`) and `history` is bounded (`size() <= 1`).
3. **Admin RBAC & Spoof Protection**: Admin operations (`read`, `update`, `delete` on `/registrations`, writes on `/settings`, reads/writes on `/auditLogs` and `/admins`) are strictly restricted to authenticated admins verified via `admins/{uid}` OR verified primary admin email (`request.auth.token.email_verified == true && request.auth.token.email == 'misaldhananjay26@gmail.com'`).
4. **Immutability**: `id`, `registrationId`, and `timestamp` are immutable once created.

## 2. The "Dirty Dozen" Attack Payloads (Must All Return PERMISSION_DENIED)
1. **Unauthenticated List PII Scrape**: `getDocs(collection(db, 'registrations'))` without auth -> DENIED.
2. **Unauthenticated Get PII**: `getDoc(doc(db, 'registrations', 'DPDC-2026-10001'))` without auth -> DENIED.
3. **Unauthenticated Delete**: `deleteDoc(doc(db, 'registrations', 'DPDC-2026-10001'))` without auth -> DENIED.
4. **Shadow Field Injection on Create**: Create registration with `{ ..., isVerified: true, adminOverride: true }` -> DENIED (`hasOnly` check).
5. **Status Escalation on Create**: Create registration with `{ ..., leadStatus: 'Converted' }` -> DENIED (`leadStatus == 'New'`).
6. **Timestamp Spoofing on Create**: Create registration with `{ ..., timestamp: new Date('2020-01-01') }` -> DENIED (`timestamp == request.time`).
7. **ID Poisoning / Oversized Doc ID**: Create registration at `/registrations/invalid_long_id_123456` -> DENIED (`^DPDC-[0-9]{4}-[0-9]{5}$`).
8. **Denial-of-Wallet String Bomb**: Create registration with `fullName` of 5,000 chars -> DENIED (`fullName.size() <= 120`).
9. **Fake Notes Injection on Create**: Create registration with pre-populated `notes: [{ text: 'approved' }]` -> DENIED (`notes.size() == 0`).
10. **Non-Admin Update**: Signed-in non-admin user tries `updateDoc` on a registration -> DENIED.
11. **Unverified Admin Email Spoof**: User with `email: 'misaldhananjay26@gmail.com'` and `email_verified: false` tries to list registrations -> DENIED.
12. **Privilege Self-Escalation**: Signed-in non-admin user writes `/admins/{theirUid}` -> DENIED.

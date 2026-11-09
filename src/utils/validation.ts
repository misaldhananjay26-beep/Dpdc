/**
 * Pure validation and utility functions for DPDC SKILL PVT. LTD. platform
 */

export function isValidIndianMobile(mobile: string): boolean {
  if (!mobile) return false;
  const cleaned = mobile.replace(/[\s\-\+]/g, '');
  // Handles 10-digit mobile number starting with 6, 7, 8, or 9
  // or 12-digit with 91 prefix
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return /^[6-9]\d{9}$/.test(cleaned.slice(2));
  }
  return /^[6-9]\d{9}$/.test(cleaned);
}

export function isValidPincode(pincode: string): boolean {
  if (!pincode) return false;
  const cleaned = pincode.trim();
  return /^[1-9][0-9]{5}$/.test(cleaned);
}

export function isValidEmail(email?: string): boolean {
  if (!email || email.trim() === '') return true; // Optional field
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function generateRegistrationId(): string {
  const currentYear = new Date().getFullYear();
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `DPDC-${currentYear}-${randomNum}`;
}

export function formatIndianPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
}

export function buildWhatsAppLink(phone: string, text: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const international = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
  return `https://wa.me/${international}?text=${encodeURIComponent(text)}`;
}

export function exportToCsv(data: Array<Record<string, unknown>>, filename: string): void {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row =>
      headers
        .map(header => {
          const val = row[header] ?? '';
          const str = String(val).replace(/"/g, '""');
          return `"${str}"`;
        })
        .join(',')
    )
  ];

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * IST-safe date helper and notice partitioner for Centre For Sports Science
 */

/**
 * Computes current year and month (YYYY-MM) in Asia/Kolkata timezone.
 * Avoids browser-local / UTC boundary shifts.
 */
export function currentYM() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
  }).formatToParts(new Date());

  const y = parts.find((p) => p.type === 'year')?.value || '';
  const m = parts.find((p) => p.type === 'month')?.value || '';
  return `${y}-${m}`;
}

/**
 * Formats a YYYY-MM-DD string into human-friendly format (e.g. "24 Oct 2026")
 * Parses directly from string components to prevent UTC date shifting.
 */
export function formatEventDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return '';
  const [year, month, day] = dateStr.split('-');
  if (!year || !month || !day) return dateStr;

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  const mIndex = parseInt(month, 10) - 1;
  const mName = monthNames[mIndex] || month;
  return `${parseInt(day, 10)} ${mName} ${year}`;
}

/**
 * Groups notices into Upcoming, This Month (current), and History.
 * Compares YYYY-MM strings directly against IST currentYM().
 */
export function groupNotices(notices = []) {
  if (!Array.isArray(notices)) {
    return { upcoming: [], current: [], history: [] };
  }

  const now = currentYM();
  const ym = (n) => (n?.event_date || '').slice(0, 7);
  const asc = (a, b) => (a?.event_date || '').localeCompare(b?.event_date || '');
  const desc = (a, b) => (b?.event_date || '').localeCompare(a?.event_date || '');

  return {
    upcoming: notices.filter((n) => ym(n) > now).sort(asc),
    current: notices.filter((n) => ym(n) === now).sort(asc),
    history: notices.filter((n) => ym(n) < now).sort(desc),
  };
}

/**
 * Normalizes phone numbers to standard 10 or 12 digit Indian numbers (91XXXXXXXXXX)
 */
export function toIndianNumber(raw) {
  let d = String(raw || '').replace(/\D/g, '');
  if (d.startsWith('0')) d = d.slice(1);
  if (d.length === 10) d = '91' + d;
  return d;
}

/**
 * Generates direct WhatsApp chat link
 */
export function waLink(raw, text = '') {
  const number = toIndianNumber(raw);
  if (!number) return '#';
  return `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}

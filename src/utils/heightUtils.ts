/**
 * Formats a height value (stored in cm) as "168 cm (5'6")"
 * Handles legacy feet.inches decimal format (e.g. "5.6") gracefully.
 */
export function formatHeight(value: string | number | null | undefined): string {
  if (!value && value !== 0) return 'N/A';

  const str = String(value).trim();
  const num = parseFloat(str);

  if (isNaN(num)) return 'N/A';

  // Legacy feet.inches decimal format (e.g. "5.6") — value is < 10
  let cm: number;
  if (num < 100) {
    const parts = str.split('.');
    const feet = parseInt(parts[0], 10);
    const inches = parseInt(parts[1] || '0', 10);
    cm = Math.round(feet * 30.48 + inches * 2.54);
  } else {
    cm = Math.round(num);
  }

  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);

  return `${cm} cm (${feet}'${inches}")`;
}

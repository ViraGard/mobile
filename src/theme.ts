export const colors = {
  primary: '#0E7C66',
  primaryDark: '#0A5C4C',
  primaryLight: '#E6F4F1',
  accent: '#F59E0B',
  bg: '#F8FAF9',
  card: '#FFFFFF',
  text: '#1A2B27',
  textMuted: '#6B7A76',
  border: '#E3E9E7',
  danger: '#DC2626',
  success: '#16A34A',
  warning: '#D97706',
};

export const radius = { sm: 8, md: 12, lg: 16, xl: 24, full: 999 };
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

/** Format a number as Persian digits with thousand separators, e.g. ۱٬۲۵۰٬۰۰۰ */
export function faNum(n: number): string {
  return n.toLocaleString('fa-IR');
}

/** Format price in Toman */
export function faPrice(n: number): string {
  return `${faNum(n)} تومان`;
}

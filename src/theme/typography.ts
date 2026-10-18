/** اندازه‌های تایپوگرافی — مقادیر از فایل طراحی */
export type TypographySize = 'xl' | 'lg' | 'md' | 'sm';

export interface TypographyScale {
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
}

export const TYPOGRAPHY_SCALE: Record<TypographySize, TypographyScale> = {
  xl: { fontSize: 20, fontWeight: 800, lineHeight: 1.5 },
  lg: { fontSize: 16, fontWeight: 800, lineHeight: 1.6 },
  md: { fontSize: 13.5, fontWeight: 700, lineHeight: 1.7 },
  sm: { fontSize: 12, fontWeight: 600, lineHeight: 1.7 },
};

/** «Sana Digits» فقط ارقام 0-9 را با شکل فارسی نمایش می‌دهد (styles/digits.css) */
export const FONT_FAMILY =
  "'Sana Digits', 'Vazirmatn Variable', 'Vazirmatn', 'IRANSansX', 'IRANSans', 'Segoe UI', Tahoma, sans-serif";

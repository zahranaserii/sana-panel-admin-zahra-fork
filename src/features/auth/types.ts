/** بدنه ورود (LoginQuery) */
export interface LoginRequest {
  username: string;
  password: string;
  /**
   * کپچا فعلاً به‌خاطر ایراد زیرساختی بک‌اند کار نمی‌کند و در بک‌اند اختیاری است؛
   * تا فعال شدن همیشه null ارسال می‌شود.
   */
  captchaToken: string | null;
  captchaValue: string | null;
}

export type LoginFormValues = Pick<LoginRequest, 'username' | 'password'>;

/** ساختار پاسخ ورود در سوئگر تعریف نشده؛ فرض: توکن داخل data برمی‌گردد */
export interface LoginResponse {
  token: string;
}

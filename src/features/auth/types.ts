/** بدنه ورود (LoginQuery) */
export interface LoginRequest {
  username: string;
  password: string;
  captchaToken: string;
  captchaValue: string;
}

export type LoginFormValues = Omit<LoginRequest, 'captchaToken'>;

export interface CaptchaResponse {
  captchaToken: string;
  image: string;
}

/** ساختار پاسخ ورود در سوئگر تعریف نشده؛ فرض: توکن داخل data برمی‌گردد */
export interface LoginResponse {
  token: string;
}

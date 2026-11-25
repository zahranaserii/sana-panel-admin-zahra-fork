import { type PanelProfileDto } from './profile';
import { ENDPOINTS } from '@/constant/endpoints';
import { defaultErrorHandlers, http, httpClient } from '@/services/http';
import { useAuthStore } from '@/store/useAuthStore';

import {
  type AuthSessionResponse,
  type CaptchaResponse,
  type ChangePasswordRequest,
  type LoginRequest,
  type LoginResponse,
  type VerifyOtpRequest,
} from './types';

export const login = (values: LoginRequest) =>
  http.post<LoginResponse, LoginRequest>(ENDPOINTS.AUTH.LOGIN, values, {
    // خطای ۴۰۱ در صفحه لاگین یعنی نام کاربری/رمز اشتباه — رفتار پیش‌فرض (خروج) اجرا نشود
    onError: { 401: () => undefined },
  });

const preLoginConfig = { onError: { 401: defaultErrorHandlers.default } };

export const getProfile = (signal?: AbortSignal) =>
  http.get<PanelProfileDto>('/identity/Panel/Profile', { signal });

export const changePassword = (values: ChangePasswordRequest) =>
  http.post(ENDPOINTS.AUTH.CHANGE_PASSWORD, values, preLoginConfig);

export const verifyOtp = async (values: VerifyOtpRequest) => {
  const data = await http.post<AuthSessionResponse | string>(
    ENDPOINTS.AUTH.VERIFY_OTP,
    values,
    preLoginConfig,
  );
  const token = typeof data === 'string' ? data : data?.token;
  if (!token?.trim()) throw new Error('توکن تأیید ورود دریافت نشد.');
  return { token };
};

export const resendOtp = (otpTracker: string) =>
  http.post<Partial<LoginResponse> | null>(
    ENDPOINTS.AUTH.RESEND_OTP,
    { otpTracker },
    preLoginConfig,
  );

/**
 * خروج؛ خطای آن نادیده گرفته می‌شود چون اطلاعات کاربر در هر حال پاک می‌شود
 * (۴۰۱ هم مودال پایان نشست را باز نمی‌کند).
 */
export const logout = () =>
  http.get<unknown>(ENDPOINTS.AUTH.LOGOUT, {
    params: { Token: useAuthStore.getState().token },
    silent: true,
    onError: { 401: () => undefined },
  });

export const getCaptcha = async (signal?: AbortSignal) => {
  const { data: body } = await httpClient.get<CaptchaResponse | { data: CaptchaResponse }>(
    ENDPOINTS.AUTH.CAPTCHA,
    {
      signal,
      silent: true,
      onError: { 401: () => undefined },
    },
  );
  const captcha = body && 'data' in body ? body.data : body;
  if (!captcha?.token?.trim() || !captcha.base64Image?.trim()) {
    throw new Error('پاسخ سرویس کپچا نامعتبر است.');
  }
  return {
    captchaToken: captcha.token,
    image: `data:image/png;base64,${captcha.base64Image.trim()}`,
  };
};

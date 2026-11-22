import { ENDPOINTS } from '@/constant/endpoints';
import { http } from '@/services/http';
import { useAuthStore } from '@/store/useAuthStore';

import { type CaptchaResponse, type LoginRequest, type LoginResponse } from './types';

export const login = (values: LoginRequest) =>
  http.post<LoginResponse, LoginRequest>(ENDPOINTS.AUTH.LOGIN, values, {
    // خطای ۴۰۱ در صفحه لاگین یعنی نام کاربری/رمز اشتباه — رفتار پیش‌فرض (خروج) اجرا نشود
    onError: { 401: () => undefined },
  });

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
  const captcha = await http.get<CaptchaResponse>(ENDPOINTS.AUTH.CAPTCHA, {
    signal,
    onError: { 401: () => undefined },
  });
  if (!captcha?.captchaToken || !captcha.image) {
    throw new Error('پاسخ سرویس کپچا نامعتبر است.');
  }
  return captcha;
};

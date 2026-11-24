import { env } from '@/config/env';
import { ENDPOINTS } from '@/constant/endpoints';
import { defaultErrorHandlers, http } from '@/services/http';
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

export const changePassword = async (values: ChangePasswordRequest) => {
  if (!env.enableMock) throw new Error('سرویس تغییر رمز عبور در دسترس نیست.');

  return http.post<boolean, ChangePasswordRequest>(ENDPOINTS.AUTH.CHANGE_PASSWORD, values, {
    onError: { 401: defaultErrorHandlers.default },
  });
};

export const verifyOtp = async (values: VerifyOtpRequest) => {
  if (!env.enableMock) throw new Error('سرویس تأیید کد یک‌بارمصرف در دسترس نیست.');

  return http.post<AuthSessionResponse, VerifyOtpRequest>(ENDPOINTS.AUTH.VERIFY_OTP, values, {
    onError: { 401: defaultErrorHandlers.default },
  });
};

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
    silent: true,
    onError: { 401: () => undefined },
  });
  if (!captcha?.captchaToken || !captcha.image) {
    throw new Error('پاسخ سرویس کپچا نامعتبر است.');
  }
  return captcha;
};

import { ENDPOINTS } from '@/constant/endpoints';
import { http } from '@/services/http';
import { useAuthStore } from '@/store/useAuthStore';

import { type LoginFormValues, type LoginRequest, type LoginResponse } from './types';

export const login = (values: LoginFormValues) =>
  http.post<LoginResponse, LoginRequest>(
    ENDPOINTS.AUTH.LOGIN,
    // کپچا فعلاً با مقدار ثابت ارسال می‌شود (سرویس کپچا هنوز استفاده نمی‌شود)
    { ...values, captchaValue: '24125', captchaToken: '43d735fd-7fac-4e87-9148-3c6ca0eab8c6' },
    {
      // خطای ۴۰۱ در صفحه لاگین یعنی نام کاربری/رمز اشتباه — رفتار پیش‌فرض (خروج) اجرا نشود
      onError: { 401: () => undefined },
    },
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

// کپچا: به‌خاطر ایراد زیرساختی بک‌اند فعلاً استفاده نمی‌شود
// export const getCaptcha = () => http.get<unknown>(ENDPOINTS.AUTH.CAPTCHA);

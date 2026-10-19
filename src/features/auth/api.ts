import { ENDPOINTS } from '@/constant/endpoints';
import { http } from '@/services/http';
import { type UserProfile } from '@/types/common';

import { type LoginFormValues, type LoginRequest, type LoginResponse } from './types';

export const login = (values: LoginFormValues) =>
  http.post<LoginResponse, LoginRequest>(
    ENDPOINTS.AUTH.LOGIN,
    // کپچا فعلاً غیرفعال است (بک‌اند اختیاری در نظر گرفته)
    { ...values, captchaToken: null, captchaValue: null },
    {
      // خطای ۴۰۱ در صفحه لاگین یعنی نام کاربری/رمز اشتباه — رفتار پیش‌فرض (خروج) اجرا نشود
      onError: { 401: () => undefined },
    },
  );

/** خروج؛ خطای آن نادیده گرفته می‌شود چون اطلاعات کاربر در هر حال پاک می‌شود */
export const logout = () => http.get<unknown>(ENDPOINTS.AUTH.LOGOUT, { silent: true });

/** بکند ندارد — سرویس پروفایل در نسخه بعدی سوئگر منتشر می‌شود (فعلاً از ماک) */
export const getProfile = () => http.get<UserProfile>(ENDPOINTS.AUTH.PROFILE);

// کپچا: به‌خاطر ایراد زیرساختی بک‌اند فعلاً استفاده نمی‌شود
// export const getCaptcha = () => http.get<unknown>(ENDPOINTS.AUTH.CAPTCHA);

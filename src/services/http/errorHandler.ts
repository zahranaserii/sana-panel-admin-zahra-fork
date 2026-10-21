import axios from 'axios';
import { toast } from 'sonner';

import { useAuthStore } from '@/store/useAuthStore';

import { type ErrorKey, type HttpError, type StatusErrorHandler } from './types';

/** پیام خطا از فیلد `message` پاسخ (همان قالب پاسخ‌های بک‌اند) خوانده می‌شود */
export const getErrorMessage = (error: HttpError, fallback: string) => {
  const data = error.response?.data;
  if (data?.message) return data.message;
  const firstFieldError = data?.errors ? Object.values(data.errors)[0]?.[0] : undefined;
  return firstFieldError ?? fallback;
};

/** همه‌ی خطاها یک شناسه دارند تا هر خطای جدید جای قبلی را بگیرد و فقط آخرین خطا دیده شود */
export const ERROR_TOAST_ID = 'http-error';

const showErrorToast = (message: string) => toast.error(message, { id: ERROR_TOAST_ID });

const showError =
  (fallback: string): StatusErrorHandler =>
  (error) => {
    showErrorToast(getErrorMessage(error, fallback));
  };

/** رفتار پیش‌فرض هر کد وضعیت؛ اگر درخواست هندلر اختصاصی داشته باشد این‌ها اجرا نمی‌شوند */
export const defaultErrorHandlers: Record<ErrorKey, StatusErrorHandler> = {
  400: showError('درخواست نامعتبر است.'),
  // مودال «پایان نشست» باز می‌شود؛ خروج (resetSession) بعد از تأیید کاربر در مودال انجام می‌شود
  401: () => useAuthStore.getState().expireSession(),
  403: showError('شما به این بخش دسترسی ندارید.'),
  404: showError('اطلاعات مورد نظر یافت نشد.'),
  408: showError('مهلت پاسخ‌گویی سرور به پایان رسید؛ دوباره تلاش کنید.'),
  409: showError('این اطلاعات با داده‌های موجود تداخل دارد.'),
  422: showError('اطلاعات وارد شده معتبر نیست.'),
  429: showError('تعداد درخواست‌ها زیاد است؛ کمی بعد تلاش کنید.'),
  500: showError('خطای داخلی سرور رخ داده است.'),
  502: showError('سرور در دسترس نیست.'),
  503: showError('سرویس موقتاً در دسترس نیست.'),
  504: showError('سرور در زمان مقرر پاسخ نداد؛ دوباره تلاش کنید.'),
  timeout: () => {
    showErrorToast('زمان انتظار برای پاسخ سرور به پایان رسید؛ دوباره تلاش کنید.');
  },
  network: () => {
    showErrorToast('ارتباط با سرور برقرار نشد؛ اتصال اینترنت را بررسی کنید.');
  },
  default: showError('خطای ناشناخته‌ای رخ داد.'),
};

/** axios برای تمام شدن `timeout` کد ECONNABORTED (یا ETIMEDOUT) برمی‌گرداند و پاسخی ندارد */
const isTimeout = (error: HttpError) =>
  error.code === axios.AxiosError.ECONNABORTED || error.code === axios.AxiosError.ETIMEDOUT;

const getErrorKey = (error: HttpError): ErrorKey => {
  if (error.response) return error.response.status;
  return isTimeout(error) ? 'timeout' : 'network';
};

export const handleHttpError = (error: HttpError) => {
  if (axios.isCancel(error)) return;

  const key = getErrorKey(error);
  const custom = error.config?.onError;
  const customHandler = custom?.[key] ?? custom?.default;

  if (customHandler) {
    customHandler(error);
    return;
  }
  // silent فقط پیام را حذف می‌کند؛ ۴۰۱ (پایان نشست) همیشه مودال پایان نشست را باز می‌کند
  if (error.config?.silent && key !== 401) return;

  const fallback = defaultErrorHandlers[key] ?? defaultErrorHandlers.default;
  fallback(error);
};

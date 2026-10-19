import axios from 'axios';
import { toast } from 'sonner';

import { resetSession } from '@/store/session';

import { type HttpError, type StatusErrorHandler } from './types';

/** پیام خطا از فیلد `message` پاسخ (همان قالب پاسخ‌های بک‌اند) خوانده می‌شود */
export const getErrorMessage = (error: HttpError, fallback: string) => {
  const data = error.response?.data;
  if (data?.message) return data.message;
  const firstFieldError = data?.errors ? Object.values(data.errors)[0]?.[0] : undefined;
  return firstFieldError ?? fallback;
};

const showError =
  (fallback: string): StatusErrorHandler =>
  (error) => {
    toast.error(getErrorMessage(error, fallback));
  };

/** رفتار پیش‌فرض هر کد وضعیت؛ اگر درخواست هندلر اختصاصی داشته باشد این‌ها اجرا نمی‌شوند */
export const defaultErrorHandlers: Record<number | 'network' | 'default', StatusErrorHandler> = {
  400: showError('درخواست نامعتبر است.'),
  401: () => {
    resetSession();
    toast.error('نشست شما منقضی شده است؛ لطفاً دوباره وارد شوید.');
  },
  403: showError('شما به این بخش دسترسی ندارید.'),
  404: showError('اطلاعات مورد نظر یافت نشد.'),
  409: showError('این اطلاعات با داده‌های موجود تداخل دارد.'),
  422: showError('اطلاعات وارد شده معتبر نیست.'),
  429: showError('تعداد درخواست‌ها زیاد است؛ کمی بعد تلاش کنید.'),
  500: showError('خطای داخلی سرور رخ داده است.'),
  502: showError('سرور در دسترس نیست.'),
  503: showError('سرویس موقتاً در دسترس نیست.'),
  network: () => {
    toast.error('ارتباط با سرور برقرار نشد؛ اتصال اینترنت را بررسی کنید.');
  },
  default: showError('خطای ناشناخته‌ای رخ داد.'),
};

export const handleHttpError = (error: HttpError) => {
  if (axios.isCancel(error)) return;

  const key = error.response ? error.response.status : 'network';
  const custom = error.config?.onError;
  const customHandler = custom?.[key] ?? custom?.default;

  if (customHandler) {
    customHandler(error);
    return;
  }
  if (error.config?.silent) return;

  const fallback = defaultErrorHandlers[key] ?? defaultErrorHandlers.default;
  fallback(error);
};

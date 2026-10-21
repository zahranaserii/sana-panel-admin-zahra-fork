import { type AxiosError } from 'axios';

import { type ApiErrorBody } from '@/types/common';

export type HttpError = AxiosError<ApiErrorBody>;

export type StatusErrorHandler = (error: HttpError) => void;

/**
 * هندلرهای اختصاصی خطا برای هر درخواست.
 * کلید: کد وضعیت (مثل 404)، `timeout` برای تمام شدن مهلت درخواست، `network` برای قطعی شبکه،
 * `default` برای بقیه کدها.
 */
export type ErrorKey = number | 'timeout' | 'network' | 'default';

export type ErrorHandlerMap = Partial<Record<ErrorKey, StatusErrorHandler>>;

declare module 'axios' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  interface AxiosRequestConfig<D = any> {
    /**
     * اگر برای کد وضعیتِ خطا هندلر داده شود، فقط همان اجرا می‌شود؛
     * در غیر این صورت رفتار پیش‌فرض همان کد وضعیت اجرا خواهد شد.
     */
    onError?: ErrorHandlerMap;
    /** پیام خطا (توست) نمایش داده نشود؛ ۴۰۱ همچنان مودال پایان نشست را باز می‌کند */
    silent?: boolean;
  }
}

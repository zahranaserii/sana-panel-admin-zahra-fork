import { HttpResponse } from 'msw';

import { env } from '@/config/env';

export const api = (path: string) => `${env.apiBaseUrl}${path}`;

/**
 * پاسخ ماک در همان قالب بک‌اند: `{ data, statusCode, message, isSuccess }`.
 * وضعیت ۴۰۰ به بالا = خطا (پیام از `message` بدنه)؛ بقیه = موفق و بدنه داخل `data`.
 */
export const json = (body: unknown, init?: ResponseInit) => {
  const status = init?.status ?? 200;
  if (status >= 400) {
    const { message, ...rest } = (body ?? {}) as { message?: string };
    return HttpResponse.json(
      { data: null, statusCode: status, message: message ?? null, isSuccess: false, ...rest },
      init,
    );
  }
  return HttpResponse.json(
    { data: body, statusCode: 1, message: 'با موفقیت انجام شد', isSuccess: true },
    init,
  );
};

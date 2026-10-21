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

/** پاسخ دانلود فایل (محتوای نمونه با همان نام فایل ذخیره‌شده) */
export const fileResponse = (fileName = 'file') =>
  new HttpResponse(new Blob([`فایل نمونه: ${fileName}`]), {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`,
    },
  });

/** مقادیر عددی یک فیلد تکراری multipart (مثل PlanIds) */
export const formNumbers = (form: FormData, key: string) => form.getAll(key).map(Number);

/** آرایه شیء multipart با قرارداد ASP.NET (Months[0].month, Months[1].month, …) تا اولین اندیس خالی */
export const formList = <T>(key: string, read: (prefix: string) => T | null): T[] => {
  const items: T[] = [];
  for (let item = read(`${key}[0]`); item; item = read(`${key}[${items.length}]`)) items.push(item);
  return items;
};

/** مقدار متنی یک فیلد multipart */
export const formText = (form: FormData, key: string) => {
  const value = form.get(key);
  return typeof value === 'string' ? value.trim() : '';
};

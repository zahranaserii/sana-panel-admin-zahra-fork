import { type AxiosProgressEvent, type AxiosRequestConfig } from 'axios';
import { saveAs } from 'file-saver';

import { type ApiResponse } from '@/types/common';

import { httpClient } from './client';

export type RequestConfig = AxiosRequestConfig;

/** نام فایل از هدر Content-Disposition (اول filename* با UTF-8، بعد filename) */
export const fileNameFromDisposition = (header?: string | null) => {
  if (!header) return undefined;
  const encoded = /filename\*\s*=\s*(?:UTF-8'')?([^;]+)/i.exec(header)?.[1];
  if (encoded) {
    try {
      return decodeURIComponent(encoded.trim().replace(/^"|"$/g, ''));
    } catch {
      // نام کدگذاری‌شده نامعتبر؛ سراغ filename ساده می‌رویم
    }
  }
  return /filename\s*=\s*"?([^";]+)"?/i.exec(header)?.[1]?.trim();
};

const toFormData = (payload: FormData | Record<string, unknown>) => {
  if (payload instanceof FormData) return payload;
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (Array.isArray(value)) value.forEach((item) => formData.append(key, item as Blob | string));
    else formData.append(key, value instanceof Blob ? value : String(value as string | number));
  });
  return formData;
};

/** پاسخ بک‌اند همیشه `{ data, statusCode, message, isSuccess }` است؛ خروجی توابع فقط `data` است */
const unwrap = <T>(res: { data: ApiResponse<T> | '' }) =>
  (res.data ? res.data.data : undefined) as T;

/** توابع پایه درخواست؛ خروجی مستقیماً `data` داخل پاسخ است */
export const http = {
  get: <T>(url: string, config?: RequestConfig) =>
    httpClient.get<ApiResponse<T>>(url, config).then(unwrap<T>),

  post: <T, B = unknown>(url: string, body?: B, config?: RequestConfig) =>
    httpClient.post<ApiResponse<T>>(url, body, config).then(unwrap<T>),

  put: <T, B = unknown>(url: string, body?: B, config?: RequestConfig) =>
    httpClient.put<ApiResponse<T>>(url, body, config).then(unwrap<T>),

  patch: <T, B = unknown>(url: string, body?: B, config?: RequestConfig) =>
    httpClient.patch<ApiResponse<T>>(url, body, config).then(unwrap<T>),

  delete: <T>(url: string, config?: RequestConfig) =>
    httpClient.delete<ApiResponse<T>>(url, config).then(unwrap<T>),

  /** ارسال فایل به‌صورت multipart */
  upload: <T>(
    url: string,
    payload: FormData | Record<string, unknown>,
    config?: RequestConfig & { onProgress?: (percent: number) => void },
  ) => {
    const { onProgress, ...rest } = config ?? {};
    return httpClient
      .post<ApiResponse<T>>(url, toFormData(payload), {
        ...rest,
        headers: { ...rest.headers, 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (event: AxiosProgressEvent) => {
          if (onProgress && event.total) onProgress(Math.round((event.loaded * 100) / event.total));
        },
      })
      .then(unwrap<T>);
  },

  /**
   * دانلود: بک‌اند خود فایل را برمی‌گرداند (نه لینک و نه JSON).
   * نام فایل از Content-Disposition؛ اگر نبود، نامی که فرانت می‌دهد.
   * پاسخ خطای JSON در client به شیء تبدیل می‌شود تا پیامش مثل بقیه خطاها نمایش داده شود.
   */
  download: async (url: string, fileName?: string, config?: RequestConfig) => {
    const res = await httpClient.get<Blob>(url, { ...config, responseType: 'blob' });
    const header = res.headers['content-disposition'] as string | undefined;
    saveAs(res.data, fileNameFromDisposition(header) ?? fileName ?? 'file');
  },
};

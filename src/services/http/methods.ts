import { type AxiosProgressEvent, type AxiosRequestConfig } from 'axios';
import { saveAs } from 'file-saver';

import { type ApiResponse } from '@/types/common';

import { httpClient } from './client';

export type RequestConfig = AxiosRequestConfig;

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

const fileNameFromHeader = (header?: string) => {
  const match = header ? /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(header) : null;
  return match?.[1] ? decodeURIComponent(match[1]) : undefined;
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

  /** دریافت فایل و ذخیره آن */
  download: async (url: string, fileName?: string, config?: RequestConfig) => {
    const res = await httpClient.get<Blob>(url, { ...config, responseType: 'blob' });
    const name =
      fileName ?? fileNameFromHeader(res.headers['content-disposition'] as string) ?? 'file';
    saveAs(res.data, name);
  },
};

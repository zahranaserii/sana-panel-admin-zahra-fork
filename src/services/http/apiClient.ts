import { type AxiosRequestConfig } from 'axios';

import { type ApiErrorBody, type ApiResponse } from '@/types/common';

import { httpClient } from './client';
import { type HttpError } from './types';

/**
 * mutator سرویس‌های تولیدشده (Orval): همان httpClient پروژه با هدرها، توکن، `onError` و `silent`.
 * پاسخ بک‌اند `{ data, ... }` است و خروجی فقط `data` است.
 */
export const apiClient = <T>(config: AxiosRequestConfig, options?: AxiosRequestConfig) =>
  httpClient
    .request<ApiResponse<T> | ''>({ ...config, ...options })
    .then((res) => (res.data ? res.data.data : undefined) as T);

/** تایپ خطای هوک‌های تولیدشده */
export type ErrorType<_T = ApiErrorBody> = HttpError;

/** تایپ بدنه درخواست در سرویس‌های تولیدشده */
export type BodyType<T> = T;

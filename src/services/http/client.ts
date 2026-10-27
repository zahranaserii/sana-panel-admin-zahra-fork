import axios from 'axios';
import { toast } from 'sonner';

import { env } from '@/config/env';
import { useAuthStore } from '@/store/useAuthStore';
import { type ApiResponse } from '@/types/common';

import { handleHttpError } from './errorHandler';
import { getClientHeaders } from './headers';
import { type HttpError } from './types';

export const httpClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: env.apiTimeout,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/** توکن فقط از استور خوانده می‌شود و همراه هدرهای ثابت به همه درخواست‌ها اضافه می‌شود */
httpClient.interceptors.request.use((config) => {
  config.headers.set(getClientHeaders());
  const { token } = useAuthStore.getState();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

httpClient.interceptors.response.use(
  (response) => {
    const message = (response.data as Partial<ApiResponse<unknown>> | null)?.message;
    if (response.config.successToast && message) toast.success(message);
    return response;
  },
  (error: HttpError) => {
    handleHttpError(error);
    return Promise.reject(error);
  },
);

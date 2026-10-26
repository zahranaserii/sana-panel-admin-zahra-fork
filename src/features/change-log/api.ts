import { ENDPOINTS } from '@/constant/endpoints';
import { http } from '@/services/http';

import { type ChangeLogsSearchParams } from './types';

/*
 * لیست و بازگردانی از سرویس‌های تولیدشده استفاده می‌کنند:
 * useChangeLogsSearch و useChangeLogsRestore در @/api/generated/facility
 * عنوان دسته‌ها از Lookups/Enums (useEnums) می‌آید
 */

/**
 * خروجی اکسل: بک‌اند لینک موقت فایل (FileLinkDto) می‌دهد و http.download فایل را از آن ذخیره می‌کند.
 */
export const exportChangeLogs = (params: Omit<ChangeLogsSearchParams, 'Page' | 'PageSize'>) =>
  http.download(ENDPOINTS.CHANGE_LOGS.EXPORT, 'گزارش-تغییرات.xlsx', { params });

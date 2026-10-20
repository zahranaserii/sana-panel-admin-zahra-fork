import { ENDPOINTS } from '@/constant/endpoints';
import { http } from '@/services/http';

import { type ChangeLogCategoryOption, type ChangeLogsSearchParams } from './types';

/*
 * لیست و بازگردانی از سرویس‌های تولیدشده استفاده می‌کنند:
 * useChangeLogsSearch و useChangeLogsRestore در @/api/generated/facility
 */

/** بکند ندارد — عنوان دسته‌های گزارش (Category عددی بدون عنوان است) */
export const getChangeLogCategories = () =>
  http.get<ChangeLogCategoryOption[]>(ENDPOINTS.LOOKUPS.AUDIT_LOG_TYPES);

/**
 * خروجی اکسل: سرویس تولیدشده (changeLogsExport) نوع فایل پاسخ را نمی‌شناسد،
 * پس دانلود با http.download انجام می‌شود.
 */
export const exportChangeLogs = (params: Omit<ChangeLogsSearchParams, 'Page' | 'PageSize'>) =>
  http.download(ENDPOINTS.CHANGE_LOGS.EXPORT, 'گزارش-تغییرات.xlsx', { params });

import * as adminMocks from '@/api/generated/admin/index.msw';
import * as facilityMocks from '@/api/generated/facility/index.msw';

import { auditLogHandlers } from './auditLogs';
import { authHandlers } from './auth';
import { baseInfoHandlers } from './baseInfo';
import { companyHandlers } from './companies';
import { creditHandlers } from './credit';
import { dashboardHandlers } from './dashboard';
import { failOnceHandler } from './failOnce';
import { lookupHandlers } from './lookups';
import { managerApprovalHandlers } from './managerApprovals';
import { staffHandlers } from './staff';
import { userHandlers } from './users';

/**
 * ماک تولیدشده (Orval) برای همه سرویس‌های سوئگر، با داده تصادفی در قالب پاسخ بک‌اند.
 * هر سرویسی که ماک دستی داشته باشد، ماک دستی‌اش اجرا می‌شود (handlerهای دستی جلوتر ثبت شده‌اند).
 */
const generatedHandlers = [...Object.values(facilityMocks), ...Object.values(adminMocks)].flatMap(
  (getMocks) => getMocks(),
);

/** ماک‌های دستی: رفتار واقعی (دیتابیس در حافظه، CRUD، خطاهای ۴۰۹/۴۲۲، گزارش تغییرات) */
const manualHandlers = [
  failOnceHandler,
  ...authHandlers,
  ...baseInfoHandlers,
  ...lookupHandlers,
  ...companyHandlers,
  ...staffHandlers,
  ...creditHandlers,
  ...managerApprovalHandlers,
  ...dashboardHandlers,
  ...userHandlers,
  ...auditLogHandlers,
];

export const handlers = [...manualHandlers, ...generatedHandlers];

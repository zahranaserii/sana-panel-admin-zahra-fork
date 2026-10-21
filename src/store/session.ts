import { queryClient } from '@/app/providers/queryClient';

import { resetStores } from './resettable';
// استورها با import ریست خودشان را ثبت می‌کنند
import './useAuthStore';
import './useProfileStore';

/**
 * خروج کامل (لاگ‌اوت و ۴۰۱): همه استورهای دیتای کاربر (توکن و کوکی، پروفایل، وضعیت مودال پایان نشست)
 * و همه داده‌های کش‌شده (از جمله منو) پاک می‌شوند. تم ریست نمی‌شود.
 */
export const resetSession = () => {
  resetStores();
  queryClient.clear();
};

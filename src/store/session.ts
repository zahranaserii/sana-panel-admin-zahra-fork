import { queryClient } from '@/app/providers/queryClient';

import { useAuthStore } from './useAuthStore';
import { useProfileStore } from './useProfileStore';

/** خروج کامل: توکن (کوکی و استور)، پروفایل و همه داده‌های کش‌شده (از جمله منو) پاک می‌شوند */
export const resetSession = () => {
  useAuthStore.getState().logout();
  useProfileStore.getState().clearProfile();
  queryClient.clear();
};

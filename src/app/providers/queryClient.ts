import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      // هر سرویس فقط یک بار صدا زده می‌شود؛ در صورت خطا تلاش مجدد خودکار انجام نمی‌شود
      retry: false,
    },
    mutations: { retry: false },
  },
});

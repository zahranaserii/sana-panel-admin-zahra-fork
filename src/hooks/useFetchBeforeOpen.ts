import { type QueryClient, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

/**
 * فرم ویرایش در مودال: سرویس جزئیات روی کلیک دکمه صدا زده می‌شود و فقط در صورت موفقیت مودال باز می‌شود.
 * خطا با toast نمایش داده می‌شود و مودال باز نمی‌شود. `loadingKey` برای لودینگ همان دکمه است.
 */
export const useFetchBeforeOpen = <K>() => {
  const queryClient = useQueryClient();
  const [loadingKey, setLoadingKey] = useState<K | null>(null);

  const open = async (
    key: K,
    fetch: (client: QueryClient) => Promise<unknown>,
    onOpen: () => void,
  ) => {
    setLoadingKey(key);
    try {
      await fetch(queryClient);
      onOpen();
    } catch {
      // پیام خطا با toast نمایش داده شده؛ مودال باز نمی‌شود
    } finally {
      setLoadingKey(null);
    }
  };

  return { open, loadingKey };
};

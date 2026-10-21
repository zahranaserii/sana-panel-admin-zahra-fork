import { useCallback } from 'react';

import { useLookupsEnums } from '@/api/generated/facility';
import { type CommonEnumCatalogDto } from '@/api/generated/facility/facilityPanelAPI.schemas';

export type EnumKey = keyof CommonEnumCatalogDto;

/**
 * عنوان همه enumهای بک‌اند (Lookups/Enums): یک بار خوانده می‌شود و تا خروج در کش می‌ماند.
 * فرانت عنوان وضعیت‌ها را در کد خودش تکرار نمی‌کند.
 */
export const useEnums = () => {
  const { data, isPending, isFetching, refetch } = useLookupsEnums({
    query: { staleTime: Infinity },
  });

  /** عنوان یک مقدار؛ اگر هنوز نیامده یا ناشناخته باشد «—» */
  const title = useCallback(
    (key: EnumKey, value?: number | null) =>
      data?.[key]?.find((item) => item.value === value)?.title ?? '—',
    [data],
  );

  /** گزینه‌های سلکت برای یک enum */
  const options = useCallback(
    (key: EnumKey) =>
      (data?.[key] ?? []).map((item) => ({ value: item.value ?? 0, label: item.title ?? '' })),
    [data],
  );

  /** آیا انتخاب این مقدار دلیل لازم دارد؟ (مثل مرحله «عدم اعطای غیرحضوری») */
  const requiresReason = useCallback(
    (key: EnumKey, value?: number | null) =>
      Boolean(data?.[key]?.find((item) => item.value === value)?.requiresReason),
    [data],
  );

  /** پراپ‌های سلکت‌های enum: لودینگ و فراخوانی دوباره با باز کردن سلکت خالی */
  const selectProps = { loading: isFetching, onRetry: () => void refetch() };

  return { catalog: data, isPending, title, options, requiresReason, selectProps };
};

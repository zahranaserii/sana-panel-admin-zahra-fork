import { useBasicInfoReasons, useBasicInfoSchemeReasons } from '@/api/generated/facility';
import { type ReasonType } from '@/api/generated/facility/facilityPanelAPI.schemas';

/** نوع دلیل بک‌اند (Lookups/Enums → reasonType) */
export const REASON_TYPE = {
  CONTRACT_CANCEL: 1,
  LOAN_REJECT: 2,
  REMOTE_GRANT_DENIED: 3,
  LOAN_CANCEL: 4,
  PERSONNEL_REJECT: 5,
  DOCUMENT_TYPE: 6,
} as const satisfies Record<string, ReasonType>;

/**
 * گزینه‌های کشویی دلایل (لغو، رد، انواع مستند و …) از اطلاعات پایه.
 * با schemeId دلایل همان طرح کلان، بدون آن دلایل عمومی خوانده می‌شود.
 */
export const useReasonOptions = (type: ReasonType, schemeId?: number, enabled = true) => {
  const params = { type };
  const bySchemeQuery = useBasicInfoSchemeReasons(schemeId ?? 0, params, {
    query: { enabled: enabled && Boolean(schemeId) },
  });
  const generalQuery = useBasicInfoReasons(params, {
    query: { enabled: enabled && !schemeId },
  });
  const { data, isPending, isFetching, refetch } = schemeId ? bySchemeQuery : generalQuery;
  return {
    options: (data ?? []).map((reason) => ({ value: reason.id ?? 0, label: reason.title ?? '' })),
    isPending: enabled && isPending,
    /** پراپ‌های سلکت: لودینگ و فراخوانی دوباره با باز کردن سلکت خالی */
    selectProps: {
      loading: enabled && isFetching,
      onRetry: () => void refetch(),
    },
  };
};

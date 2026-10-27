import { useBasicInfoSchemeReasons } from '@/api/generated/facility';
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
 * دلایل به طرح کلان تعلق دارند و فقط از Schemes/{schemeId}/Reasons خوانده می‌شوند؛
 * تا schemeId معلوم نباشد درخواستی فرستاده نمی‌شود.
 */
export const useReasonOptions = (
  type: ReasonType,
  schemeId: number | undefined,
  enabled = true,
) => {
  const isEnabled = enabled && Boolean(schemeId);
  const { data, isPending, isFetching, refetch } = useBasicInfoSchemeReasons(
    schemeId ?? 0,
    { type },
    { query: { enabled: isEnabled } },
  );
  return {
    options: (data ?? []).map((reason) => ({ value: reason.id ?? 0, label: reason.title ?? '' })),
    isPending: isEnabled && isPending,
    /** پراپ‌های سلکت: لودینگ و فراخوانی دوباره با باز کردن سلکت خالی */
    selectProps: {
      loading: isEnabled && isFetching,
      onRetry: () => void refetch(),
    },
  };
};

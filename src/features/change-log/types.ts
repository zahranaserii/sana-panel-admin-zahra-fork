export type {
  ChangeLogCategory,
  ChangeLogsSearchParams,
  CommandResponsesChangeLogItemDto as ChangeLogItem,
} from '@/api/generated/facility/facilityPanelAPI.schemas';

/** عنوان دسته‌های گزارش تغییرات (بکند ندارد) */
export interface ChangeLogCategoryOption {
  id: number;
  title: string;
}

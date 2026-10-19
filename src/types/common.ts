export type Nullable<T> = T | null;

/** قالب همه پاسخ‌های بک‌اند (موفق و خطا) */
export interface ApiResponse<T> {
  data: T;
  statusCode: number;
  message: string | null;
  isSuccess: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

/** بدنه پاسخ خطا: همان قالب پاسخ‌ها؛ پیام خطا از `message` خوانده می‌شود */
export interface ApiErrorBody extends Partial<ApiResponse<unknown>> {
  errors?: Record<string, string[]>;
}

export interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  branch?: string;
  roles: string[];
}

/** آیتم ساده برای لیست‌های کشویی */
export interface LookupItem {
  id: string;
  title: string;
}

/** فایل آپلودشده در سرور */
export interface UploadedFile {
  id: string;
  name: string;
}

export interface PageParams {
  page: number;
  pageSize: number;
}

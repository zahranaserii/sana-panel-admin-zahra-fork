export interface Staff {
  id: string;
  fullName: string;
  nationalId: string;
  mobile: string;
  personnelCode: string;
  /** تاریخ استخدام (میلادی YYYY-MM-DD) */
  hireDate: string;
  /** اولویت تخصیص (عدد کوچک‌تر = اولویت بالاتر) */
  priority: number;
}

/** اولویت تخصیص اختیاری است؛ خالی = آخرین اولویت (سمت سرور) */
export type StaffPayload = Omit<Staff, 'id' | 'priority'> & { priority?: number | null };

export interface DeleteStaffPayload {
  description: string;
  fileId: string;
}

/** فیلترهای جستجوی پرسنل (از کوئری آدرس) */
export interface StaffFilters {
  q?: string;
  hireFrom?: string;
  hireTo?: string;
}

export interface StaffImportResult {
  added: number;
}

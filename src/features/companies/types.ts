import { type UploadedFile } from '@/types/common';

export type {
  CommonStoredFileDto as StoredFile,
  ReadModelsBalanceDocumentDto as BalanceDocument,
  ReadModelsCompanyDetailsDto as CompanyDetail,
  ReadModelsCompanyListItemDto as CompanyListItem,
  ReadModelsMonthlyBalanceDto as MonthlyBalance,
} from '@/api/generated/facility/facilityPanelAPI.schemas';

/**
 * مقادیر فرم ثبت/ویرایش شرکت (نام فیلدها مثل بدنه بک‌اند).
 * فایل تفاهم‌نامه فقط وقتی فایل جدید انتخاب شود ارسال می‌شود.
 */
export interface CompanyFormValues {
  schemeId?: number;
  name: string;
  nationalId: string;
  agreementNumber: string;
  accountNumber: string;
  contractDate: string;
  accountOpeningDate: string;
  salaryFromSepah: boolean;
  planIds: number[];
  agreementFile: File | UploadedFile | null;
}

/** لغو قرارداد: تاریخ، دلیل، توضیح و فایل نامه همه الزامی */
export interface CancelContractFormValues {
  cancelDate: string;
  reasonId: number;
  description: string;
  file: File | null;
}

/** مستند تغییر میانگین‌ها (نوع مستند و فایل اجباری) */
export interface BalanceDocFormValues {
  documentTypeId: number;
  file: File | null;
  description?: string;
}

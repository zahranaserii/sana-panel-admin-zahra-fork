import { type UploadedFile } from '@/types/common';

export type ContractStatus = 'active' | 'cancelled';

/** ردیف جدول فهرست شرکت‌ها */
export interface CompanyListItem {
  id: string;
  name: string;
  nationalId: string;
  agreementNo: string;
  contractDate: string;
  planCount: number;
  registeredBy: string;
  status: ContractStatus;
  cancelDate?: string;
  cancelReason?: string;
}

/** اطلاعات کامل شرکت (برای ویرایش) */
export interface CompanyDetail {
  id: string;
  /** طرح کلان (نگین میثاق، …) — الزامی در ثبت و در ویرایش قابل تغییر نیست */
  schemeId: string;
  name: string;
  nationalId: string;
  agreementNo: string;
  accountNo: string;
  /** تاریخ انعقاد قرارداد (میلادی YYYY-MM-DD) */
  contractDate: string;
  /** روز افتتاح حساب سپرده (میلادی YYYY-MM-DD) */
  accountOpenDate: string;
  /** دریافت حقوق پرسنل از بانک سپه */
  sepahSalary: boolean;
  agreementFile: UploadedFile | null;
  planIds: string[];
}

/** مقادیر فرم ثبت/ویرایش شرکت */
export interface CompanyFormValues extends Omit<CompanyDetail, 'id' | 'agreementFile'> {
  agreementFile: File | UploadedFile | null;
}

/** بدنه درخواست ثبت/ویرایش شرکت */
export interface CompanyPayload extends Omit<CompanyDetail, 'id' | 'agreementFile'> {
  agreementFileId: string | null;
}

/** حذف شرکت: توضیح الزامی */
export interface DeleteCompanyPayload {
  description: string;
}

/** لغو قرارداد: تاریخ، دلیل، توضیح و فایل نامه همه الزامی */
export interface CancelContractPayload {
  cancelDate: string;
  reasonId: string;
  note: string;
  fileId: string;
}

export interface CancelContractFormValues {
  cancelDate: string;
  reasonId: string;
  note: string;
  file: File | null;
}

/** میانگین موجودی یک ماه از سال جاری قرارداد */
export interface MonthlyAverage {
  month: number;
  /** میانگین موجودی (ریال)؛ null یعنی هنوز ثبت نشده */
  average: number | null;
  /** مانده اعتبار تا این ماه (محاسبه سمت سرور) */
  remainingCredit: number | null;
}

export interface SaveAveragesPayload {
  items: { month: number; average: number | null }[];
  docTypeId: string;
  fileId: string;
  note?: string;
}

export interface AverageDocFormValues {
  docTypeId: string;
  file: File | null;
  note?: string;
}

/** مستند ثبت‌شده برای تغییر میانگین‌ها */
export interface AverageDoc {
  id: string;
  createdAt: string;
  months: number[];
  docType: string;
  file: { id: string; name: string };
  note?: string;
  createdBy: string;
}

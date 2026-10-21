import {
  type CommonStoredFileDto,
  type LoanRequestStatus,
  type PostApprovalStage,
} from '@/api/generated/facility/facilityPanelAPI.schemas';

/** درخواست وام در دیتابیس ماک — فیلدها همان مدل بک‌اند (LoanRequests) */
export interface MockLoanRequest {
  id: number;
  batchId: number;
  companyId: number;
  personnelId: number;
  personnelName: string;
  personnelCode: string;
  planId: number;
  planTitle: string;
  amount: number;
  paymentOrder: number;
  /** تاریخ مبنای ثبت (میلادی YYYY-MM-DD) */
  baseDate: string;
  createdAt: string;
  decidedAt: string | null;
  status: LoanRequestStatus;
  description: string | null;
  documents: CommonStoredFileDto[];
  rejectReason?: string;
  /** مرحله پس از تأیید (فقط برای درخواست‌های تأییدشده) */
  postStage?: PostApprovalStage;
  postStageReason?: string;
}

/** وضعیت درخواست وام بک‌اند (Lookups/Enums → loanRequestStatus) */
export const LOAN_REQUEST_STATUS = {
  PENDING_MANAGER: 1,
  REJECTED_MANAGER: 2,
  PENDING_CREDIT: 3,
  REJECTED: 4,
  PENDING_DIGITAL: 5,
  REJECTED_DIGITAL: 6,
  APPROVED: 7,
  CANCELLED: 8,
} as const;

export const MOCK_LOAN_REQUESTS: MockLoanRequest[] = [
  {
    id: 1,
    batchId: 1,
    companyId: 1,
    personnelId: 1,
    personnelName: 'علی محمدی',
    personnelCode: '101',
    planId: 101,
    planTitle: 'قرض‌الحسنه - ۴٪ - ۱۲ ماه',
    amount: 50_000_000,
    paymentOrder: 1,
    baseDate: '2025-08-03',
    createdAt: '2025-08-03T10:00:00',
    decidedAt: '2025-08-10T09:00:00',
    status: LOAN_REQUEST_STATUS.APPROVED,
    description: null,
    documents: [],
    postStage: 1,
  },
  {
    id: 2,
    batchId: 1,
    companyId: 1,
    personnelId: 2,
    personnelName: 'زهرا احمدی',
    personnelCode: '102',
    planId: 109,
    planTitle: 'مرابحه - ۱۰٪ - ۲۴ ماه',
    amount: 80_000_000,
    paymentOrder: 2,
    baseDate: '2025-08-03',
    createdAt: '2025-08-03T10:00:00',
    decidedAt: null,
    status: LOAN_REQUEST_STATUS.PENDING_MANAGER,
    description: null,
    documents: [],
  },
  {
    id: 3,
    batchId: 1,
    companyId: 1,
    personnelId: 3,
    personnelName: 'محمد رضایی',
    personnelCode: '103',
    planId: 101,
    planTitle: 'قرض‌الحسنه - ۴٪ - ۱۲ ماه',
    amount: 30_000_000,
    paymentOrder: 3,
    baseDate: '2025-08-03',
    createdAt: '2025-08-03T10:00:00',
    decidedAt: null,
    status: LOAN_REQUEST_STATUS.PENDING_MANAGER,
    description: null,
    documents: [],
  },
  {
    id: 4,
    batchId: 2,
    companyId: 2,
    personnelId: 4,
    personnelName: 'مریم کریمی',
    personnelCode: '201',
    planId: 107,
    planTitle: 'قرض‌الحسنه - ۴٪ - ۲۴ ماه',
    amount: 40_000_000,
    paymentOrder: 1,
    baseDate: '2025-08-21',
    createdAt: '2025-08-21T10:00:00',
    decidedAt: '2025-08-23T11:00:00',
    status: LOAN_REQUEST_STATUS.PENDING_CREDIT,
    description: 'تأیید مدیر شرکت',
    documents: [
      {
        id: 3,
        fileName: 'تأیید-مدیر.pdf',
        size: 50_000,
        uploadedAt: '2025-08-23T11:00:00',
        uploadedBy: 'admin',
      },
    ],
  },
];

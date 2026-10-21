import {
  type CommonRegistrarDto,
  type CommonStoredFileDto,
  type CompanyStatus,
  type ReadModelsBalanceDocumentDto,
  type ReadModelsCancellationInfoDto,
} from '@/api/generated/facility/facilityPanelAPI.schemas';

import { ADMIN_REGISTRAR, BRANCH_REGISTRAR } from './auditLogs';

/** شرکت در دیتابیس ماک — فیلدها همان مدل بک‌اند (Companies/{id}) */
export interface MockCompany {
  id: number;
  schemeId: number;
  name: string;
  nationalId: string;
  agreementNumber: string;
  accountNumber: string;
  /** تاریخ انعقاد قرارداد (میلادی YYYY-MM-DD) */
  contractDate: string;
  /** روز افتتاح حساب سپرده (میلادی YYYY-MM-DD) */
  accountOpeningDate: string;
  salaryFromSepah: boolean;
  planIds: number[];
  branchCode: string;
  registrar: CommonRegistrarDto;
  createdAt: string;
  status: CompanyStatus;
  agreementFile: CommonStoredFileDto | null;
  cancellation: ReadModelsCancellationInfoDto | null;
  deleteDescription?: string;
  deletedAt?: string;
  rowVersion: string;
  /** میانگین موجودی ۱۲ ماه سال جاری قرارداد (ریال؛ null = ثبت‌نشده) */
  balances: (number | null)[];
  balancesRowVersion: string;
  balanceDocuments: ReadModelsBalanceDocumentDto[];
}

const emptyMonths = (filled: number[]) =>
  Array.from({ length: 12 }, (_, index) => filled[index] ?? null);

/** وضعیت شرکت بک‌اند (Lookups/Enums → companyStatus) */
export const COMPANY_STATUS = { ACTIVE: 1, CANCELLED: 2, EXPIRED: 3, DELETED: 4 } as const;

export const MOCK_COMPANIES: MockCompany[] = [
  {
    id: 1,
    schemeId: 1,
    name: 'شرکت فناوران پارس',
    nationalId: '10101234567',
    agreementNumber: 'TF-1404-001',
    accountNumber: '0101234567001',
    contractDate: '2025-05-31',
    accountOpeningDate: '2025-06-02',
    salaryFromSepah: true,
    agreementFile: {
      id: 1,
      fileName: 'تفاهم‌نامه-فناوران.pdf',
      size: 120_000,
      uploadedAt: '2025-05-31T10:00:00',
      uploadedBy: 'admin',
    },
    planIds: [101, 109],
    branchCode: '150000',
    registrar: ADMIN_REGISTRAR,
    createdAt: '2025-05-31T10:00:00',
    status: COMPANY_STATUS.ACTIVE,
    cancellation: null,
    rowVersion: 'c1-v1',
    balances: emptyMonths([1_500_000_000, 1_750_000_000, 1_620_000_000]),
    balancesRowVersion: 'c1-b1',
    balanceDocuments: [
      {
        id: 1,
        month: '1404/03',
        documentType: 'نامه',
        description: 'ثبت اولیه',
        file: {
          id: 2,
          fileName: 'نامه-میانگین.pdf',
          size: 80_000,
          uploadedAt: '2025-08-20T09:00:00',
          uploadedBy: 'admin',
        },
      },
    ],
  },
  {
    id: 2,
    schemeId: 1,
    name: 'شرکت صنایع غذایی آوا',
    nationalId: '10107654321',
    agreementNumber: 'TF-1404-002',
    accountNumber: '0107654321001',
    contractDate: '2025-07-12',
    accountOpeningDate: '2025-07-15',
    salaryFromSepah: false,
    agreementFile: null,
    planIds: [107, 102, 116],
    branchCode: '150002',
    registrar: BRANCH_REGISTRAR,
    createdAt: '2025-07-12T11:30:00',
    status: COMPANY_STATUS.ACTIVE,
    cancellation: null,
    rowVersion: 'c2-v1',
    balances: emptyMonths([820_000_000]),
    balancesRowVersion: 'c2-b1',
    balanceDocuments: [],
  },
  {
    id: 3,
    schemeId: 1,
    name: 'شرکت حمل‌ونقل راه‌آهن نوین',
    nationalId: '10109988776',
    agreementNumber: 'TF-1403-017',
    accountNumber: '0109988776001',
    contractDate: '2024-11-03',
    accountOpeningDate: '2024-11-05',
    salaryFromSepah: true,
    agreementFile: null,
    planIds: [129],
    branchCode: '150000',
    registrar: ADMIN_REGISTRAR,
    createdAt: '2024-11-03T09:15:00',
    status: COMPANY_STATUS.CANCELLED,
    cancellation: {
      cancelDate: '2025-09-01',
      reason: 'عدم تمدید به درخواست شرکت',
      description: 'درخواست کتبی شرکت',
      cancelledBy: ADMIN_REGISTRAR,
      cancelledAt: '2025-09-01T10:00:00',
    },
    rowVersion: 'c3-v1',
    balances: emptyMonths([]),
    balancesRowVersion: 'c3-b1',
    balanceDocuments: [],
  },
];

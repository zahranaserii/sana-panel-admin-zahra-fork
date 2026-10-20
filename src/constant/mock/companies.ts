import {
  type AverageDoc,
  type CompanyDetail,
  type ContractStatus,
} from '@/features/companies/types';

export interface MockCompany extends CompanyDetail {
  registeredBy: string;
  status: ContractStatus;
  deleted: boolean;
  deletedAt?: string;
  cancelDate?: string;
  cancelReason?: string;
  /** میانگین ۱۲ ماه سال جاری قرارداد (ریال) */
  averages: (number | null)[];
  averageDocs: AverageDoc[];
}

const emptyMonths = (filled: number[]) =>
  Array.from({ length: 12 }, (_, index) => filled[index] ?? null);

export const MOCK_COMPANIES: MockCompany[] = [
  {
    id: 'c-1',
    schemeId: 'scheme-1',
    name: 'شرکت فناوران پارس',
    nationalId: '10101234567',
    agreementNo: 'TF-1404-001',
    accountNo: '0101234567001',
    contractDate: '2025-05-31',
    accountOpenDate: '2025-06-02',
    sepahSalary: true,
    agreementFile: { id: 'f-1', name: 'تفاهم‌نامه-فناوران.pdf' },
    planIds: ['qarz-0', 'mur-1-1'],
    registeredBy: 'شعبه مرکزی کد ۱۰۰ — مدیر سامانه (کد ۱)',
    status: 'active',
    deleted: false,
    averages: emptyMonths([1_500_000_000, 1_750_000_000, 1_620_000_000]),
    averageDocs: [
      {
        id: 'd-1',
        createdAt: '2025-08-20',
        months: [1, 2, 3],
        docType: 'نامه',
        file: { id: 'f-2', name: 'نامه-میانگین.pdf' },
        note: 'ثبت اولیه',
        createdBy: 'مدیر سامانه',
      },
    ],
  },
  {
    id: 'c-2',
    schemeId: 'scheme-1',
    name: 'شرکت صنایع غذایی آوا',
    nationalId: '10107654321',
    agreementNo: 'TF-1404-002',
    accountNo: '0107654321001',
    contractDate: '2025-07-12',
    accountOpenDate: '2025-07-15',
    sepahSalary: false,
    agreementFile: null,
    planIds: ['qarz-1', 'mur-0-0', 'mur-2-2'],
    registeredBy: 'شعبه ونک کد ۲۰۰ — کاربر شعبه (کد ۲)',
    status: 'active',
    deleted: false,
    averages: emptyMonths([820_000_000]),
    averageDocs: [],
  },
  {
    id: 'c-3',
    schemeId: 'scheme-1',
    name: 'شرکت حمل‌ونقل راه‌آهن نوین',
    nationalId: '10109988776',
    agreementNo: 'TF-1403-017',
    accountNo: '0109988776001',
    contractDate: '2024-11-03',
    accountOpenDate: '2024-11-05',
    sepahSalary: true,
    agreementFile: null,
    planIds: ['mur-3-4'],
    registeredBy: 'شعبه مرکزی کد ۱۰۰ — مدیر سامانه (کد ۱)',
    status: 'cancelled',
    cancelDate: '2025-09-01',
    cancelReason: 'عدم تمدید به درخواست شرکت',
    deleted: false,
    averages: emptyMonths([]),
    averageDocs: [],
  },
];

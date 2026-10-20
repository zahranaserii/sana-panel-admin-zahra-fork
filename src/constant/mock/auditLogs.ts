import { type CommonRegistrarDto } from '@/api/generated/facility/facilityPanelAPI.schemas';

/** نوع داخلی لاگ در ماک؛ در پاسخ به دسته (Category) بک‌اند تبدیل می‌شود */
export type MockLogType = 'company' | 'staff' | 'loan' | 'user' | 'base';

export type SnapshotEntity = 'company' | 'staff' | 'user' | 'scheme';

export interface MockAuditLog {
  id: number;
  createdAt: string;
  user: CommonRegistrarDto;
  type: MockLogType;
  details: string;
  /** وضعیت قبل از ویرایش برای بازگردانی */
  snapshot?: { entity: SnapshotEntity; id: string; before: object };
  rolledBack: boolean;
  restoredAt?: string;
}

export const AUDIT_LOG_TYPES: { id: MockLogType; title: string }[] = [
  { id: 'company', title: 'مربوط به شرکت‌ها' },
  { id: 'staff', title: 'مربوط به پرسنل' },
  { id: 'loan', title: 'مربوط به تخصیص وام' },
  { id: 'user', title: 'مربوط به کاربران' },
  { id: 'base', title: 'مربوط به اطلاعات پایه' },
];

const ADMIN_REGISTRAR: CommonRegistrarDto = {
  panelUserId: 1,
  userName: 'admin',
  userCode: '001',
  branchName: 'ستاد مرکزی',
  branchCode: '150000',
};

const BRANCH_REGISTRAR: CommonRegistrarDto = {
  panelUserId: 2,
  userName: 'branch',
  userCode: '399',
  branchName: 'شعبه ونک',
  branchCode: '150002',
};

export const MOCK_AUDIT_LOGS: MockAuditLog[] = [
  {
    id: 3,
    createdAt: '2025-08-21T10:12:00',
    user: ADMIN_REGISTRAR,
    type: 'loan',
    details:
      'تأیید توسط مدیر شرکت درخواست وام مریم کریمی — ۴۰,۰۰۰,۰۰۰ ریال — شرکت: شرکت صنایع غذایی آوا',
    rolledBack: false,
  },
  {
    id: 2,
    createdAt: '2025-08-03T09:40:00',
    user: BRANCH_REGISTRAR,
    type: 'loan',
    details: 'ثبت درخواست وام برای ۳ نفر — شرکت: شرکت فناوران پارس',
    rolledBack: false,
  },
  {
    id: 1,
    createdAt: '2025-05-31T11:05:00',
    user: ADMIN_REGISTRAR,
    type: 'company',
    details: 'ثبت شرکت جدید: شرکت فناوران پارس',
    rolledBack: false,
  },
];

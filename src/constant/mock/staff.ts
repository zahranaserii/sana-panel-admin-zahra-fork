import {
  type CommonRegistrarDto,
  type PersonnelStatus,
} from '@/api/generated/facility/facilityPanelAPI.schemas';

import { ADMIN_REGISTRAR } from './auditLogs';

/** پرسنل در دیتابیس ماک — فیلدها همان مدل بک‌اند (Personnel/{id}) */
export interface MockStaff {
  id: number;
  companyId: number;
  priority: number;
  fullName: string;
  nationalCode: string;
  mobile: string;
  personnelCode: string;
  /** تاریخ استخدام (میلادی YYYY-MM-DD) */
  hireDate: string;
  status: PersonnelStatus;
  rejectReason: string | null;
  createdAt: string;
  decidedAt: string | null;
  registrar: CommonRegistrarDto;
  rowVersion: string;
}

/** وضعیت پرسنل بک‌اند (Lookups/Enums → personnelStatus) */
export const PERSONNEL_STATUS = { PENDING: 1, APPROVED: 2, REJECTED: 3, DELETED: 4 } as const;

type StaffSeed = Pick<
  MockStaff,
  | 'id'
  | 'companyId'
  | 'priority'
  | 'fullName'
  | 'nationalCode'
  | 'mobile'
  | 'personnelCode'
  | 'hireDate'
>;

const staff = (seed: StaffSeed): MockStaff => ({
  ...seed,
  status: PERSONNEL_STATUS.APPROVED,
  rejectReason: null,
  createdAt: '2025-06-01T10:00:00',
  decidedAt: '2025-06-01T12:00:00',
  registrar: ADMIN_REGISTRAR,
  rowVersion: `s${seed.id}-v1`,
});

export const MOCK_STAFF: MockStaff[] = [
  staff({
    id: 1,
    companyId: 1,
    priority: 1,
    fullName: 'علی محمدی',
    nationalCode: '0012345678',
    mobile: '09121234567',
    personnelCode: '101',
    hireDate: '2024-05-04',
  }),
  staff({
    id: 2,
    companyId: 1,
    priority: 2,
    fullName: 'زهرا احمدی',
    nationalCode: '0023456789',
    mobile: '09122345678',
    personnelCode: '102',
    hireDate: '2023-09-23',
  }),
  staff({
    id: 3,
    companyId: 1,
    priority: 3,
    fullName: 'محمد رضایی',
    nationalCode: '0034567890',
    mobile: '09123456789',
    personnelCode: '103',
    hireDate: '2025-01-15',
  }),
  staff({
    id: 4,
    companyId: 2,
    priority: 1,
    fullName: 'مریم کریمی',
    nationalCode: '0045678901',
    mobile: '09124567890',
    personnelCode: '201',
    hireDate: '2022-11-01',
  }),
  staff({
    id: 5,
    companyId: 1,
    priority: 4,
    fullName: 'سارا نوری',
    nationalCode: '0056789012',
    mobile: '09125678901',
    personnelCode: '104',
    hireDate: '2024-09-10',
  }),
];

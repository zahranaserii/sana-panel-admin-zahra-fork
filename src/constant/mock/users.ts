import { type User } from '@/features/users/types';

/** کاربر پنل در قالب پاسخ بک‌اند به‌همراه رمز (رمز در پاسخ برنمی‌گردد) */
export interface MockManagedUser extends User {
  password: string;
}

/** کاربران قابل مدیریت در صفحه «مدیریت کاربران» */
export const MOCK_MANAGED_USERS: MockManagedUser[] = [
  {
    id: 1,
    userName: 'admin',
    password: 'admin',
    email: null,
    personId: null,
    isActive: true,
    creationTime: '2026-01-01T10:00:00',
    fullName: 'مدیر سامانه',
    userCode: '001',
    branchCode: '150000',
    branchName: 'ستاد مرکزی',
    companyId: null,
    roles: [{ roleId: 1, persianTitle: 'مدیر سامانه', allowedScopeType: 0 }],
  },
  {
    id: 2,
    userName: 'branch',
    password: 'branch',
    email: null,
    personId: null,
    isActive: true,
    creationTime: '2026-01-01T10:00:00',
    fullName: 'کاربر شعبه',
    userCode: '399',
    branchCode: '150002',
    branchName: 'شعبه ونک',
    companyId: null,
    roles: [{ roleId: 2, persianTitle: 'کاربر شعبه', allowedScopeType: 1 }],
  },
];

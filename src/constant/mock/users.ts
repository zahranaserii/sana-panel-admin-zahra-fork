export interface MockManagedUser {
  id: number;
  username: string;
  password: string;
  fullName: string;
  userCode: string;
  branchName: string;
  branchCode: string;
  roleId: number | null;
  isActive: boolean;
}

/** کاربران قابل مدیریت در صفحه «مدیریت کاربران» */
export const MOCK_MANAGED_USERS: MockManagedUser[] = [
  {
    id: 1,
    username: 'admin',
    password: 'admin',
    fullName: 'مدیر سامانه',
    userCode: '001',
    branchName: 'ستاد مرکزی',
    branchCode: '150000',
    roleId: 1,
    isActive: true,
  },
  {
    id: 2,
    username: 'branch',
    password: 'branch',
    fullName: 'کاربر شعبه',
    userCode: '399',
    branchName: 'شعبه ونک',
    branchCode: '150002',
    roleId: 2,
    isActive: true,
  },
];

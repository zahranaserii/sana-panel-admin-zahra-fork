import { type PanelProfileDto } from '@/features/auth/profile';

export interface MockUser {
  username: string;
  password: string;
  token: string;
  /** پاسخ Panel/Profile */
  profile: PanelProfileDto;
  /** فقط برای ماک: کاربر شعبه بخشی از منو را می‌بیند */
  isBranch?: boolean;
  mustChangePassword?: boolean;
}

export const MOCK_USERS: MockUser[] = [
  {
    username: 'admin',
    password: 'admin',
    mustChangePassword: true,
    token: 'mock-token-admin',
    profile: {
      panelUserId: 1,
      userName: 'admin',
      fullName: 'مدیر سامانه',
      userCode: null,
      branchCode: null,
      branchName: null,
      scopeType: 0,
      scopeId: null,
      keys: ['GetAll', 'Read', 'UploadExel'],
    },
  },
  {
    username: 'branch',
    password: 'branch',
    token: 'mock-token-branch',
    isBranch: true,
    mustChangePassword: true,
    profile: {
      panelUserId: 2,
      userName: 'branch',
      fullName: 'کاربر شعبه',
      userCode: '399',
      branchCode: '150002',
      branchName: 'شعبه ونک',
      scopeType: 0,
      scopeId: null,
      keys: ['Read'],
    },
  },
];

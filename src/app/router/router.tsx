import { Suspense } from 'react';
import { createBrowserRouter } from 'react-router';

import { MainLayout } from '@/component/layout';
import { FullPageLoading } from '@/component/loading';
import { ROUTES } from '@/constant/routes';

import { GuestRoute } from './GuestRoute';
import { lazyPage } from './lazyPage';
import { ProtectedRoute } from './ProtectedRoute';

// همه صفحات به‌صورت lazy لود می‌شوند؛ Suspense در لی‌اوت‌ها اسکلتون نمایش می‌دهد
const LoginFlow = lazyPage(() => import('@/features/auth/LoginFlow'), 'LoginFlow');
const HomePage = lazyPage(() => import('@/features/home/pages/HomePage'), 'HomePage');
const BaseInfoPage = lazyPage(
  () => import('@/features/base-info/pages/BaseInfoPage'),
  'BaseInfoPage',
);
const SchemeFormPage = lazyPage(
  () => import('@/features/base-info/pages/SchemeFormPage'),
  'SchemeFormPage',
);
const CompaniesPage = lazyPage(
  () => import('@/features/companies/pages/CompaniesPage'),
  'CompaniesPage',
);
const StaffPage = lazyPage(() => import('@/features/staff/pages/StaffPage'), 'StaffPage');
const CreditPage = lazyPage(() => import('@/features/credit/pages/CreditPage'), 'CreditPage');
const ManagerApprovalPage = lazyPage(
  () => import('@/features/manager-approval/pages/ManagerApprovalPage'),
  'ManagerApprovalPage',
);
const CreditApprovalPage = lazyPage(
  () => import('@/features/credit-approval/pages/CreditApprovalPage'),
  'CreditApprovalPage',
);
const DashboardPage = lazyPage(
  () => import('@/features/dashboard/pages/DashboardPage'),
  'DashboardPage',
);
const UsersPage = lazyPage(() => import('@/features/users/pages/UsersPage'), 'UsersPage');
const ChangeLogPage = lazyPage(
  () => import('@/features/change-log/pages/ChangeLogPage'),
  'ChangeLogPage',
);

export const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: (
      <GuestRoute>
        <Suspense fallback={<FullPageLoading />}>
          <LoginFlow />
        </Suspense>
      </GuestRoute>
    ),
  },
  {
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: ROUTES.BASE_INFO, element: <BaseInfoPage /> },
      { path: ROUTES.BASE_INFO_NEW, element: <SchemeFormPage /> },
      { path: ROUTES.BASE_INFO_EDIT, element: <SchemeFormPage /> },
      { path: ROUTES.COMPANIES, element: <CompaniesPage /> },
      { path: ROUTES.STAFF, element: <StaffPage /> },
      { path: ROUTES.CREDIT, element: <CreditPage /> },
      { path: ROUTES.MANAGER_APPROVE, element: <ManagerApprovalPage /> },
      { path: ROUTES.CREDIT_APPROVE, element: <CreditApprovalPage /> },
      { path: ROUTES.DASHBOARD, element: <DashboardPage /> },
      { path: ROUTES.USERS, element: <UsersPage /> },
      { path: ROUTES.CHANGE_LOG, element: <ChangeLogPage /> },
      // صفحات هر بخش بعداً در features ساخته و اینجا اضافه می‌شوند
      { path: '*', element: <HomePage /> },
    ],
  },
]);

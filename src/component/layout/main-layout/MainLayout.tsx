import { Suspense } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router';

import { env } from '@/config/env';
import { findMenuItemByPath } from '@/constant/menu';
import { ROUTES } from '@/constant/routes';
import { logout } from '@/features/auth/api';
import { useMainMenu } from '@/services/menu';
import { resetSession } from '@/store/session';

import { Skeleton } from '../../loading';

import { Footer } from './Footer';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

const DEFAULT_TITLE = 'خانه';

/** لی‌اوت اصلی (صفحات بعد از لاگین): سایدبار + هدر + محتوا + فوتر */
export const MainLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { groups, isPending } = useMainMenu();
  const current = findMenuItemByPath(groups, pathname);
  const pageTitle = current?.label ?? DEFAULT_TITLE;

  // صفحه‌ای که در منوی کاربر نیست با آدرس مستقیم هم باز نمی‌شود (خانه همیشه مجاز است)
  const isBlocked = !isPending && !current && pathname !== ROUTES.HOME;

  /** خروج: سرویس خروج صدا زده می‌شود و در هر حال همه اطلاعات کاربر پاک می‌شود */
  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      resetSession();
      void navigate(ROUTES.LOGIN, { replace: true });
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-[276px_minmax(0,1fr)] max-[960px]:grid-cols-1">
      <Sidebar title={env.appTitle} groups={groups} loading={isPending} />
      <div className="flex min-h-screen min-w-0 flex-col">
        <Header title={pageTitle} onLogout={() => void handleLogout()} />
        <main className="flex-1 px-7 pt-6 pb-2 max-[960px]:p-4">
          {/* اسکلتون تا زمان دانلود کد صفحه (lazy) */}
          <Suspense fallback={<Skeleton variant="panel" count={2} rows={4} />}>
            {isBlocked ? <Navigate to={ROUTES.HOME} replace /> : <Outlet />}
          </Suspense>
        </main>
        <Footer />
      </div>
    </div>
  );
};

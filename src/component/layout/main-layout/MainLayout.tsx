import { Suspense, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';

import { env } from '@/config/env';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { findMenuItemByPath } from '@/constant/menu';
import { ROUTES } from '@/constant/routes';
import { logout } from '@/features/auth/api';
import { useMainMenu } from '@/services/menu';
import { resetSession } from '@/store/session';
import { useAuthStore } from '@/store/useAuthStore';

import { Skeleton } from '../../loading';
import { Retry } from '../../retry';

import { Footer } from './Footer';
import { Header } from './Header';
import { LayoutDrawer, MOBILE_QUERY } from './LayoutDrawer';
import { Sidebar, SIDEBAR_BACKGROUND, SidebarContent } from './Sidebar';

const DEFAULT_TITLE = 'خانه';

/** لی‌اوت اصلی (صفحات بعد از لاگین): سایدبار + هدر + محتوا + فوتر */
export const MainLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { groups, isPending, isError, isFetching, refetch } = useMainMenu();
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useMediaQuery(MOBILE_QUERY);

  const sessionExpired = useAuthStore((state) => state.sessionExpired);
  // با بزرگ شدن صفحه (خروج از حالت موبایل) دراور منو بسته است و سایدبار ثابت نمایش داده می‌شود؛
  // با باز شدن مودال پایان نشست (۴۰۱) هم دراور بسته می‌شود
  const drawerOpen = menuOpen && isMobile && !sessionExpired;
  const current = findMenuItemByPath(groups, pathname);
  const pageTitle = current?.label ?? DEFAULT_TITLE;

  /** خروج: سرویس خروج صدا زده می‌شود و در هر حال همه اطلاعات کاربر پاک می‌شود */
  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      resetSession();
      void navigate(ROUTES.LOGIN, { replace: true });
    }
  };

  // بدون منو هیچ لی‌اوتی نمایش داده نمی‌شود؛ فقط تلاش مجدد وسط صفحه
  if (isError) return <Retry fullPage loading={isFetching} onRetry={() => void refetch()} />;

  return (
    <div className="grid min-h-screen grid-cols-[276px_minmax(0,1fr)] max-[960px]:grid-cols-1">
      <Sidebar title={env.appTitle} groups={groups} loading={isPending} />
      {/* موبایل: منو در دراور سمت راست؛ با کلیک روی هر آیتم بسته می‌شود */}
      <LayoutDrawer
        placement="right"
        label="منو"
        open={drawerOpen}
        onClose={() => setMenuOpen(false)}
        className={SIDEBAR_BACKGROUND}
        closeClassName="!text-white hover:!bg-white/10"
      >
        <div className="flex min-h-full flex-col px-4 pt-[22px] pb-4">
          <SidebarContent
            title={env.appTitle}
            groups={groups}
            loading={isPending}
            onNavigate={() => setMenuOpen(false)}
          />
        </div>
      </LayoutDrawer>
      <div className="flex min-h-screen min-w-0 flex-col">
        <Header
          title={pageTitle}
          menuOpen={drawerOpen}
          onOpenMenu={() => setMenuOpen(true)}
          onLogout={() => void handleLogout()}
        />
        <main className="flex-1 px-7 pt-6 pb-2 max-[960px]:p-4">
          {/* اسکلتون تا زمان دانلود کد صفحه (lazy) */}
          <Suspense fallback={<Skeleton variant="panel" count={2} rows={4} />}>
            <Outlet />
          </Suspense>
        </main>
        <Footer />
      </div>
    </div>
  );
};

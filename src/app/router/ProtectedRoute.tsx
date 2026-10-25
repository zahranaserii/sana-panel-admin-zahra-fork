import { useEffect, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';

import { usePanelProfileGet } from '@/api/generated/admin';

import { FullPageLoading } from '@/component/loading';
import { ROUTES } from '@/constant/routes';
import { selectIsAuthenticated, useAuthStore } from '@/store/useAuthStore';
import { useProfileStore } from '@/store/useProfileStore';

/** فقط کاربر لاگین‌شده؛ پروفایل در صورت نبود از سرور گرفته می‌شود */
export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const profile = useProfileStore((state) => state.profile);
  const setProfile = useProfileStore((state) => state.setProfile);
  const location = useLocation();

  const { data, isPending } = usePanelProfileGet({
    query: { enabled: isAuthenticated && !profile },
  });

  useEffect(() => {
    if (data) setProfile(data);
  }, [data, setProfile]);

  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  if (!profile && isPending) return <FullPageLoading />;
  return children;
};

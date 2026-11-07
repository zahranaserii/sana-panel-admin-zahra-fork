import { Suspense } from 'react';
import { Outlet } from 'react-router';

import logo from '@/assets/images/logo-sana.png';
import { env } from '@/config/env';

import { Spinner } from '../../loading';

/** لی‌اوت فرعی (صفحات قبل از لاگین) */
export const AuthLayout = () => (
  <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(900px_500px_at_85%_-10%,rgba(201,154,46,.22),transparent_60%),radial-gradient(800px_500px_at_0%_110%,rgba(23,64,106,.7),transparent_60%),linear-gradient(135deg,var(--sana-sidebar-from),var(--sana-sidebar-via))] p-6">
    <div className="w-full max-w-[410px] rounded-[22px] bg-panel px-[34px] pt-9 pb-[30px] text-center shadow-[0_30px_70px_rgba(0,0,0,.4)]">
      <img src={logo} alt="سانا" className="mx-auto mb-3.5 h-24 w-auto" />
      <div className="mb-6 text-[13px] text-ink-soft">{env.appTitle}</div>
      <div className="text-right">
        <Suspense fallback={<Spinner className="block py-10 text-center" />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  </div>
);

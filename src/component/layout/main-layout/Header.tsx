import {
  LogoutOutlined,
  MenuOutlined,
  MoonOutlined,
  MoreOutlined,
  SunOutlined,
} from '@ant-design/icons';
import { App, Tooltip } from 'antd';
import { useState } from 'react';

import logoOmid from '@/assets/images/logo-omid.png';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfileStore } from '@/store/useProfileStore';
import { useThemeStore } from '@/store/useThemeStore';
import { dayjs, toPersianDigits } from '@/utils/date';

import { Button } from '../../button';

import { LayoutDrawer, MOBILE_QUERY } from './LayoutDrawer';

export interface HeaderProps {
  title: string;
  onLogout: () => void;
  /** باز کردن دراور منو (فقط موبایل) */
  onOpenMenu: () => void;
  /** وضعیت دراور منو برای aria-expanded دکمه همبرگری */
  menuOpen: boolean;
}

interface HeaderActionsProps {
  /** چیدمان عمودی داخل دراور موبایل */
  vertical?: boolean;
  /** قبل از نمایش مودال خروج صدا زده می‌شود (در دراور: بستن دراور) */
  onBeforeLogout?: () => void;
  onLogout: () => void;
}

/** تاریخ امروز، تغییر تم، خروج و لوگو؛ در دسکتاپ داخل هدر و در موبایل داخل دراور سمت چپ */
const HeaderActions = ({ vertical, onBeforeLogout, onLogout }: HeaderActionsProps) => {
  const { modal } = App.useApp();
  const fullName = useProfileStore((state) => state.profile?.fullName);
  const mode = useThemeStore((state) => state.mode);
  const toggle = useThemeStore((state) => state.toggle);
  const today = `امروز: ${toPersianDigits(dayjs().formatJalali('dddd D MMMM YYYY'))}`;

  const confirmLogout = () => {
    onBeforeLogout?.();
    modal.confirm({
      title: 'خروج از حساب',
      content: [fullName, 'آیا از خروج از سامانه اطمینان دارید؟'].filter(Boolean).join('، '),
      okText: 'خروج',
      okButtonProps: { danger: true },
      cancelText: 'انصراف',
      onOk: onLogout,
    });
  };

  return (
    <div
      className={
        vertical ? 'flex flex-col items-start gap-4 px-5 pt-16 pb-6' : 'flex items-center gap-4'
      }
    >
      <span className="rounded-full border border-gold-soft-border bg-gold-soft px-3 py-[5px] text-xs font-semibold whitespace-nowrap text-heading">
        {today}
      </span>
      {/* تغییر تم دراور را نمی‌بندد */}
      <Tooltip title={mode === 'dark' ? 'تم روشن' : 'تم تیره'}>
        <Button
          variant="text"
          shape={vertical ? undefined : 'circle'}
          aria-label="تغییر تم"
          icon={mode === 'dark' ? <SunOutlined /> : <MoonOutlined />}
          onClick={toggle}
        >
          {vertical && (mode === 'dark' ? 'تم روشن' : 'تم تیره')}
        </Button>
      </Tooltip>
      <Button variant="secondary" size="small" icon={<LogoutOutlined />} onClick={confirmLogout}>
        خروج
      </Button>
      <img src={logoOmid} alt="امید بوم" className="block h-10 w-auto" />
    </div>
  );
};

export const Header = ({ title, onLogout, onOpenMenu, menuOpen }: HeaderProps) => {
  const [actionsOpen, setActionsOpen] = useState(false);
  const isMobile = useMediaQuery(MOBILE_QUERY);

  const sessionExpired = useAuthStore((state) => state.sessionExpired);
  // با بزرگ شدن صفحه (خروج از حالت موبایل) یا باز شدن مودال پایان نشست (۴۰۱) دراور اکشن‌ها بسته است
  const drawerOpen = actionsOpen && isMobile && !sessionExpired;

  return (
    <header className="sana-no-print sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-line bg-[var(--sana-topbar-bg)] px-7 py-3.5 backdrop-blur-md max-[960px]:px-4 max-[960px]:py-3">
      <div className="flex min-w-0 items-center gap-2">
        <Button
          variant="text"
          shape="circle"
          aria-label="منو"
          aria-expanded={menuOpen}
          icon={<MenuOutlined />}
          className="min-[961px]:!hidden"
          onClick={onOpenMenu}
        />
        <h1 className="m-0 truncate text-[19px] font-extrabold text-heading">{title}</h1>
      </div>

      <div className="max-[960px]:hidden">
        <HeaderActions onLogout={onLogout} />
      </div>
      <Button
        variant="text"
        shape="circle"
        aria-label="سایر گزینه‌ها"
        aria-expanded={drawerOpen}
        icon={<MoreOutlined />}
        className="min-[961px]:!hidden"
        onClick={() => setActionsOpen(true)}
      />

      <LayoutDrawer
        placement="left"
        label="سایر گزینه‌ها"
        open={drawerOpen}
        onClose={() => setActionsOpen(false)}
      >
        {/* خروج: اول دراور بسته می‌شود، بعد مودال خروج نمایش داده می‌شود */}
        <HeaderActions vertical onBeforeLogout={() => setActionsOpen(false)} onLogout={onLogout} />
      </LayoutDrawer>
    </header>
  );
};

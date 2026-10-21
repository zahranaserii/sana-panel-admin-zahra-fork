import { createElement } from 'react';
import { NavLink } from 'react-router';

import logo from '@/assets/images/logo-sana.png';
import { type MenuGroup } from '@/services/menu';
import { toPersianDigits } from '@/utils/date';

import { Skeleton } from '../../loading';

export interface SidebarProps {
  title: string;
  subtitle?: string;
  /** منوی کاربر (از سرویس منوی بک‌اند) */
  groups: MenuGroup[];
  loading?: boolean;
  /** عدد کنار آیتم منو (کلید = مسیر صفحه)، مثل تعداد درخواست‌های در انتظار */
  badges?: Partial<Record<string, number | null>>;
}

/** پس‌زمینه گرادینت سایدبار (دسکتاپ و دراور موبایل) */
export const SIDEBAR_BACKGROUND =
  'bg-[linear-gradient(180deg,var(--sana-sidebar-from)_0%,var(--sana-sidebar-via)_55%,var(--sana-sidebar-to)_100%)] text-white';

// متن هر آیتم همیشه یک‌خطی است
const ITEM_BASE =
  'relative flex w-full items-center gap-[11px] rounded-[11px] px-3.5 py-[11px] text-[13.5px] whitespace-nowrap transition-colors';

interface SidebarContentProps extends SidebarProps {
  /** با کلیک روی هر آیتم (در دراور موبایل: بستن دراور) */
  onNavigate?: () => void;
}

/** لوگو، عنوان و منوی سایدبار؛ مشترک بین سایدبار دسکتاپ و دراور موبایل */
export const SidebarContent = ({
  title,
  subtitle,
  groups,
  loading,
  badges,
  onNavigate,
}: SidebarContentProps) => (
  <>
    <div className="mb-3.5 flex flex-col items-center gap-3 border-b border-white/10 px-1.5 pt-1.5 pb-5 text-center">
      <span className="inline-flex size-[76px] items-center justify-center rounded-2xl bg-white p-2 shadow-[0_6px_18px_rgba(0,0,0,.28)]">
        <img src={logo} alt="سانا" className="h-full w-auto max-w-full object-contain" />
      </span>
      <div>
        <div className="text-[15px] leading-normal font-bold">{title}</div>
        {subtitle && <div className="mt-0.5 text-[11.5px] text-sidebar-muted">{subtitle}</div>}
      </div>
    </div>

    {loading && <Skeleton variant="form" rows={6} />}
    <nav className="flex flex-1 flex-col gap-[3px]">
      {groups.map((group) => (
        <div key={group.key} className="contents">
          {group.title && (
            <div className="mx-2.5 mt-4 mb-1.5 text-[10.5px] font-bold text-sidebar-group">
              {group.title}
            </div>
          )}
          {group.items.map((item) => (
            <NavLink
              key={item.key}
              to={item.path}
              // «خانه» (/) فقط روی همان مسیر فعال شود، نه روی همه صفحات
              end={item.path === '/'}
              onClick={onNavigate}
              className={({ isActive }) =>
                isActive
                  ? `${ITEM_BASE} sana-sidebar-item-active bg-accent/16 font-bold text-white [&_.anticon]:text-accent-light`
                  : `${ITEM_BASE} font-medium text-sidebar-text hover:bg-white/7 hover:text-white`
              }
            >
              <span className="text-lg leading-none opacity-85">{createElement(item.icon)}</span>
              <span className="truncate">{item.label}</span>
              {Boolean(badges?.[item.path]) && (
                <span className="ms-auto rounded-full bg-accent px-2 py-px text-[11px] leading-5 font-bold text-white">
                  {toPersianDigits(badges?.[item.path] ?? 0)}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      ))}
    </nav>
  </>
);

/** سایدبار ثابت دسکتاپ؛ زیر ۹۶۰ پیکسل مخفی است و منو در دراور باز می‌شود */
export const Sidebar = (props: SidebarProps) => (
  <aside
    className={`sana-no-print sticky top-0 flex h-screen flex-col overflow-y-auto px-4 pt-[22px] pb-4 max-[960px]:hidden ${SIDEBAR_BACKGROUND}`}
  >
    <SidebarContent {...props} />
  </aside>
);

import { createElement } from 'react';
import { NavLink } from 'react-router';

import logo from '@/assets/images/logo-sana.png';
import { type MenuGroup } from '@/services/menu';

import { Skeleton } from '../../loading';

export interface SidebarProps {
  title: string;
  subtitle?: string;
  /** منوی کاربر (از سرویس منوی بک‌اند) */
  groups: MenuGroup[];
  loading?: boolean;
}

const ITEM_BASE =
  'relative flex w-full items-center gap-[11px] rounded-[11px] px-3.5 py-[11px] text-[13.5px] transition-colors max-[960px]:w-auto max-[960px]:px-3 max-[960px]:py-[9px] max-[960px]:text-[12.5px]';

export const Sidebar = ({ title, subtitle, groups, loading }: SidebarProps) => {
  return (
    <aside className="sana-no-print sticky top-0 flex h-screen flex-col overflow-y-auto bg-[linear-gradient(180deg,var(--sana-sidebar-from)_0%,var(--sana-sidebar-via)_55%,var(--sana-sidebar-to)_100%)] px-4 pt-[22px] pb-4 text-white max-[960px]:static max-[960px]:h-auto max-[960px]:p-3.5">
      <div className="mb-3.5 flex flex-col items-center gap-3 border-b border-white/10 px-1.5 pt-1.5 pb-5 text-center max-[960px]:flex-row max-[960px]:pb-3 max-[960px]:text-right">
        <span className="inline-flex size-[76px] items-center justify-center rounded-2xl bg-white p-2 shadow-[0_6px_18px_rgba(0,0,0,.28)] max-[960px]:size-14">
          <img src={logo} alt="سانا" className="h-full w-auto max-w-full object-contain" />
        </span>
        <div>
          <div className="text-[15px] leading-normal font-bold">{title}</div>
          {subtitle && <div className="mt-0.5 text-[11.5px] text-sidebar-muted">{subtitle}</div>}
        </div>
      </div>

      {loading && <Skeleton variant="form" rows={6} />}
      <nav className="flex flex-1 flex-col gap-[3px] max-[960px]:flex-row max-[960px]:flex-wrap">
        {groups.map((group) => (
          <div key={group.key} className="contents">
            {group.title && (
              <div className="mx-2.5 mt-4 mb-1.5 text-[10.5px] font-bold text-sidebar-group max-[960px]:hidden">
                {group.title}
              </div>
            )}
            {group.items.map((item) => (
              <NavLink
                key={item.key}
                to={item.path}
                // «خانه» (/) فقط روی همان مسیر فعال شود، نه روی همه صفحات
                end={item.path === '/'}
                className={({ isActive }) =>
                  isActive
                    ? `${ITEM_BASE} sana-sidebar-item-active bg-accent/16 font-bold text-white max-[960px]:before:hidden [&_.anticon]:text-accent-light`
                    : `${ITEM_BASE} font-medium text-sidebar-text hover:bg-white/7 hover:text-white`
                }
              >
                <span className="text-lg leading-none opacity-85">{createElement(item.icon)}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
};

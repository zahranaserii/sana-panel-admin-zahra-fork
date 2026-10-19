import {
  AuditOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  ControlOutlined,
  CreditCardOutlined,
  HistoryOutlined,
  HomeOutlined,
  SafetyOutlined,
  ShopOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { type ComponentType } from 'react';

import { type MenuGroup, type MenuItem, type MenuItemDto } from '@/services/menu/types';

import { ROUTES } from './routes';

interface PageConfig {
  path: string;
  icon: ComponentType;
}

/**
 * صفحه‌های فرانت به ازای `url` آیتم‌های منوی بک‌اند.
 * مسیر و آیکون همیشه از همین‌جا (router خود ما) خوانده می‌شود؛ آیتمی که اینجا نباشد نمایش داده نمی‌شود.
 */
const PAGES: Record<string, PageConfig> = {
  [ROUTES.HOME]: { path: ROUTES.HOME, icon: HomeOutlined },
  [ROUTES.BASE_INFO]: { path: ROUTES.BASE_INFO, icon: ControlOutlined },
  [ROUTES.COMPANIES]: { path: ROUTES.COMPANIES, icon: ShopOutlined },
  [ROUTES.STAFF]: { path: ROUTES.STAFF, icon: TeamOutlined },
  [ROUTES.CREDIT]: { path: ROUTES.CREDIT, icon: CreditCardOutlined },
  [ROUTES.MANAGER_APPROVE]: { path: ROUTES.MANAGER_APPROVE, icon: AuditOutlined },
  [ROUTES.CREDIT_APPROVE]: { path: ROUTES.CREDIT_APPROVE, icon: CheckCircleOutlined },
  [ROUTES.DASHBOARD]: { path: ROUTES.DASHBOARD, icon: BarChartOutlined },
  [ROUTES.USERS]: { path: ROUTES.USERS, icon: SafetyOutlined },
  [ROUTES.CHANGE_LOG]: { path: ROUTES.CHANGE_LOG, icon: HistoryOutlined },
};

const isRoot = (item: MenuItemDto) => item.parentId === null || item.parentId === item.id;

/** آیتم فعال با url شناخته‌شده → آیتم سایدبار؛ بقیه نمایش داده نمی‌شوند */
const toMenuItem = (item: MenuItemDto): MenuItem | null => {
  const page = item.isActive && item.url ? PAGES[item.url] : undefined;
  return page ? { key: String(item.id), label: item.title, ...page } : null;
};

/**
 * ساخت گروه‌های سایدبار از لیست تخت بک‌اند:
 * ریشه با url = آیتم بدون گروه (مثل خانه)، ریشه بدون url = گروه با زیرآیتم‌هایش.
 * فقط آیتم‌های `isActive` نمایش داده می‌شوند و گروه بدون زیرآیتم حذف می‌شود.
 */
export const buildMenu = (items: MenuItemDto[]): MenuGroup[] => {
  const groups: MenuGroup[] = [];
  items.filter(isRoot).forEach((root) => {
    if (root.url) {
      const single = toMenuItem(root);
      if (!single) return;
      const last = groups.at(-1);
      if (last && !last.title) last.items.push(single);
      else groups.push({ key: `single-${root.id}`, title: '', items: [single] });
      return;
    }
    if (!root.isActive) return;
    const children = items
      .filter((item) => item.parentId === root.id && item.id !== root.id)
      .map(toMenuItem)
      .filter((item): item is MenuItem => item !== null);
    if (children.length) groups.push({ key: String(root.id), title: root.title, items: children });
  });
  return groups;
};

const matches = (item: MenuItem, pathname: string) =>
  item.path === ROUTES.HOME
    ? pathname === ROUTES.HOME
    : pathname === item.path || pathname.startsWith(`${item.path}/`);

/** آیتم منوی صفحه فعلی (دقیق یا زیرمسیر آن؛ /credit-approve با /credit اشتباه گرفته نمی‌شود) */
export const findMenuItemByPath = (groups: MenuGroup[], pathname: string) =>
  groups.flatMap((group) => group.items).find((item) => matches(item, pathname));

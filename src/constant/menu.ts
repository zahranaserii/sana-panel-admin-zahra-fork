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
 * کلید = `url` آیتم منوی بک‌اند؛ مقدار = مسیر و آیکون صفحه در router خود ما.
 * اگر بک‌اند url را عوض کند فقط کلید اینجا عوض می‌شود و مسیرهای فرانت ثابت می‌مانند.
 * آیتمی که کلیدش اینجا نباشد نمایش داده نمی‌شود.
 */
const PAGES: Record<string, PageConfig> = {
  '/home': { path: ROUTES.HOME, icon: HomeOutlined },
  '/facility/basic-info': { path: ROUTES.BASE_INFO, icon: ControlOutlined },
  '/facility/management-companies': { path: ROUTES.COMPANIES, icon: ShopOutlined },
  '/facility/personnel': { path: ROUTES.STAFF, icon: TeamOutlined },
  '/facility/manager-approval': { path: ROUTES.MANAGER_APPROVE, icon: AuditOutlined },
  '/facility/loan-allocation': { path: ROUTES.CREDIT, icon: CreditCardOutlined },
  '/facility/credit-approval': { path: ROUTES.CREDIT_APPROVE, icon: CheckCircleOutlined },
  '/facility/dashboard': { path: ROUTES.DASHBOARD, icon: BarChartOutlined },
  '/facility/user-management': { path: ROUTES.USERS, icon: SafetyOutlined },
  '/facility/change-log': { path: ROUTES.CHANGE_LOG, icon: HistoryOutlined },
};

const isRoot = (item: MenuItemDto) => item.parentId === null || item.parentId === item.id;

/** آیتم فعال با url شناخته‌شده → آیتم سایدبار؛ بقیه نمایش داده نمی‌شوند */
const toMenuItem = (item: MenuItemDto): MenuItem | null => {
  const page = item.isActive && item.url ? PAGES[item.url] : undefined;
  return page ? { key: String(item.id), label: item.title, ...page } : null;
};

/**
 * ساخت گروه‌های سایدبار از لیست تخت بک‌اند (به ترتیب همان لیست):
 * ریشه با زیرآیتم = گروه؛ ریشه بدون زیرآیتم = آیتم بدون گروه (مثل خانه).
 * آیتمی که والدش در پاسخ نیست هم بدون گروه نمایش داده می‌شود.
 * فقط آیتم‌های `isActive` نمایش داده می‌شوند و گروه بدون زیرآیتم حذف می‌شود.
 */
export const buildMenu = (items: MenuItemDto[]): MenuGroup[] => {
  const ids = new Set(items.map((item) => item.id));
  const groups: MenuGroup[] = [];

  const addSingle = (item: MenuItemDto) => {
    const single = toMenuItem(item);
    if (!single) return;
    const last = groups.at(-1);
    if (last && !last.title) last.items.push(single);
    else groups.push({ key: `single-${item.id}`, title: '', items: [single] });
  };

  items.forEach((item) => {
    if (!isRoot(item)) {
      if (item.parentId !== null && !ids.has(item.parentId)) addSingle(item);
      return;
    }
    const children = items.filter((child) => child.parentId === item.id && child.id !== item.id);
    if (!children.length) {
      addSingle(item);
      return;
    }
    if (!item.isActive) return;
    const menuItems = children.map(toMenuItem).filter((child): child is MenuItem => child !== null);
    if (menuItems.length)
      groups.push({ key: String(item.id), title: item.title, items: menuItems });
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

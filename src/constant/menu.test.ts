import { type MenuItemDto } from '@/services/menu/types';

import { MOCK_MAIN_MENU } from './mock/menu';
import { buildMenu, findMenuItemByPath } from './menu';
import { ROUTES } from './routes';

const groups = buildMenu(MOCK_MAIN_MENU);
const paths = (menu: typeof groups) =>
  menu.flatMap((group) => group.items.map((item) => item.path));

describe('buildMenu', () => {
  it('maps backend urls to our routes and groups roots that have children', () => {
    expect(groups.map((group) => group.title)).toEqual([
      '',
      'تنظیمات',
      'مدیریت',
      'عملیات اعتباری',
      'گزارش و کنترل',
    ]);
    expect(groups.map((group) => group.items.map((item) => item.path))).toEqual([
      [ROUTES.HOME],
      [ROUTES.BASE_INFO],
      [ROUTES.COMPANIES, ROUTES.STAFF, ROUTES.MANAGER_APPROVE],
      [ROUTES.CREDIT, ROUTES.CREDIT_APPROVE],
      [ROUTES.DASHBOARD, ROUTES.USERS, ROUTES.CHANGE_LOG],
    ]);
  });

  it('shows items whose parent is missing without a group', () => {
    const menu = buildMenu(MOCK_MAIN_MENU.filter((item) => item.title !== 'مدیریت'));
    expect(menu.map((group) => group.title)).toEqual([
      '',
      'تنظیمات',
      'عملیات اعتباری',
      '',
      'گزارش و کنترل',
      '',
    ]);
    expect(menu[3]?.items.map((item) => item.path)).toEqual([ROUTES.COMPANIES, ROUTES.STAFF]);
    expect(menu[5]?.items.map((item) => item.path)).toEqual([ROUTES.MANAGER_APPROVE]);
  });

  it('ignores permission items (children of pages or of a missing parent)', () => {
    const labels = groups.flatMap((group) => group.items.map((item) => item.label));
    expect(labels).not.toContain('ثبت شرکت جدید');
    expect(labels).not.toContain('رد اعتبارات');
    expect(labels).not.toContain('پرسنل شرکت');
  });

  it('hides inactive items, unknown urls and empty groups', () => {
    const changed: Record<string, Partial<MenuItemDto>> = {
      '/facility/basic-info': { isActive: false },
      '/facility/loan-allocation': { url: '/unknown' },
      '/facility/credit-approval': { isActive: false },
    };
    const menu = buildMenu(
      MOCK_MAIN_MENU.map((item) => ({ ...item, ...(item.url ? changed[item.url] : undefined) })),
    );
    expect(menu.some((group) => group.title === 'تنظیمات')).toBe(false);
    expect(menu.some((group) => group.title === 'عملیات اعتباری')).toBe(false);
    expect(paths(menu)).not.toContain(ROUTES.BASE_INFO);
    expect(paths(menu)).not.toContain(ROUTES.CREDIT);
    expect(paths(menu)).toContain(ROUTES.STAFF);
  });
});

describe('findMenuItemByPath', () => {
  it('finds the exact page without confusing similar paths', () => {
    expect(findMenuItemByPath(groups, ROUTES.CREDIT)?.label).toBe('تخصیص وام');
    expect(findMenuItemByPath(groups, ROUTES.CREDIT_APPROVE)?.label).toBe('تأیید اعتبارات');
  });

  it('matches home only on the root path', () => {
    expect(findMenuItemByPath(groups, ROUTES.HOME)?.label).toBe('خانه');
    expect(findMenuItemByPath(groups, ROUTES.USERS)?.label).toBe('مدیریت کاربران');
  });

  it('matches nested paths and ignores unknown ones', () => {
    expect(findMenuItemByPath(groups, `${ROUTES.COMPANIES}/c-1`)?.label).toBe('مدیریت‌ شرکت‌ها');
    expect(findMenuItemByPath(groups, '/unknown')).toBeUndefined();
  });
});

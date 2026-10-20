import { type MenuItemDto } from '@/services/menu/types';

import { MOCK_MAIN_MENU } from './mock/menu';
import { buildMenu, findMenuItemByPath } from './menu';
import { ROUTES } from './routes';

const groups = buildMenu(MOCK_MAIN_MENU);
const paths = (menu: typeof groups) =>
  menu.flatMap((group) => group.items.map((item) => item.path));

describe('buildMenu', () => {
  it('maps backend urls to our routes and groups roots that have children', () => {
    expect(groups.map((group) => group.title)).toEqual(['', 'عملیات اعتباری', '']);
    expect(groups[0]?.items.map((item) => item.path)).toEqual([ROUTES.HOME]);
    expect(groups[1]?.items.map((item) => item.path)).toEqual([
      ROUTES.BASE_INFO,
      ROUTES.CREDIT,
      ROUTES.CREDIT_APPROVE,
    ]);
  });

  it('shows items whose parent is missing without a group', () => {
    expect(groups[2]?.items.map((item) => item.path)).toEqual([
      ROUTES.COMPANIES,
      ROUTES.STAFF,
      ROUTES.DASHBOARD,
      ROUTES.USERS,
      ROUTES.CHANGE_LOG,
    ]);
  });

  it('hides inactive items, unknown urls and empty groups', () => {
    const changed: Record<string, Partial<MenuItemDto>> = {
      '/base-info': { isActive: false },
      '/facility/loan-allocation': { url: '/unknown' },
      '/facility/credit-approval': { isActive: false },
    };
    const menu = buildMenu(
      MOCK_MAIN_MENU.map((item) => ({ ...item, ...(item.url ? changed[item.url] : undefined) })),
    );
    expect(menu.some((group) => group.title === 'عملیات اعتباری')).toBe(false);
    expect(paths(menu)).not.toContain(ROUTES.BASE_INFO);
    expect(paths(menu)).not.toContain(ROUTES.CREDIT);
    expect(paths(menu)).toContain(ROUTES.STAFF);
  });
});

describe('findMenuItemByPath', () => {
  it('finds the exact page without confusing similar paths', () => {
    expect(findMenuItemByPath(groups, ROUTES.CREDIT)?.label).toBe('نخصیص وام');
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

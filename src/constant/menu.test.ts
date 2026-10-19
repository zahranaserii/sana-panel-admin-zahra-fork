import { type MenuItemDto } from '@/services/menu/types';

import { MOCK_MAIN_MENU } from './mock/menu';
import { buildMenu, findMenuItemByPath } from './menu';
import { ROUTES } from './routes';

const groups = buildMenu(MOCK_MAIN_MENU);

describe('buildMenu', () => {
  it('builds the sidebar groups from the flat backend list', () => {
    expect(groups.map((group) => group.title)).toEqual([
      '',
      'تنظیمات',
      'مدیریت',
      'عملیات اعتباری',
      'گزارش و کنترل',
    ]);
    expect(groups[0]?.items[0]?.path).toBe(ROUTES.HOME);
  });

  it('hides inactive items, items without a known url and empty groups', () => {
    const changed: Record<string, Partial<MenuItemDto>> = {
      [ROUTES.BASE_INFO]: { isActive: false },
      [ROUTES.COMPANIES]: { url: '/unknown' },
    };
    const menu = buildMenu(
      MOCK_MAIN_MENU.map((item) => ({ ...item, ...(item.url ? changed[item.url] : undefined) })),
    );
    expect(menu.some((group) => group.title === 'تنظیمات')).toBe(false);
    expect(findMenuItemByPath(menu, ROUTES.COMPANIES)).toBeUndefined();
    expect(findMenuItemByPath(menu, ROUTES.STAFF)?.label).toBe('پرسنل شرکت');
  });
});

describe('findMenuItemByPath', () => {
  it('matches exact paths without confusing shared prefixes', () => {
    expect(findMenuItemByPath(groups, ROUTES.CREDIT)?.label).toBe('تخصیص وام');
    expect(findMenuItemByPath(groups, ROUTES.CREDIT_APPROVE)?.label).toBe('تأیید اعتبارات');
  });

  it('matches home only on its own path', () => {
    expect(findMenuItemByPath(groups, ROUTES.HOME)?.label).toBe('خانه');
    expect(findMenuItemByPath(groups, ROUTES.USERS)?.label).toBe('مدیریت کاربران');
  });

  it('matches nested pages of a menu item', () => {
    expect(findMenuItemByPath(groups, `${ROUTES.COMPANIES}/c-1`)?.label).toBe('مدیریت شرکت‌ها');
    expect(findMenuItemByPath(groups, '/unknown')).toBeUndefined();
  });
});

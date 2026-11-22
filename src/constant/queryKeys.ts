export const QUERY_KEYS = {
  USERS: {
    ALL: ['users'],
    LIST: (page: number, pageSize: number) => ['users', 'list', page, pageSize],
    DETAIL: (id: number) => ['users', 'detail', id],
    ROLES: ['users', 'roles'],
  },
  CAPTCHA: ['auth', 'captcha'],
  MAIN_MENU: ['main-menu'],
} as const;

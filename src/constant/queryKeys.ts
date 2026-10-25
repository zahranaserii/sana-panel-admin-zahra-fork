export const QUERY_KEYS = {
  USERS: {
    ALL: ['users'],
    LIST: (page: number) => ['users', 'list', page],
    DETAIL: (id: number) => ['users', 'detail', id],
    ROLES: ['users', 'roles'],
  },
  MAIN_MENU: ['main-menu'],
} as const;

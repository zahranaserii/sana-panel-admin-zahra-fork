import { delay, http } from 'msw';

import { ENDPOINTS } from '@/constant/endpoints';
import { BRANCH_MENU_URLS, MOCK_MAIN_MENU, MOCK_USERS } from '@/constant/mock';
import { ROLES } from '@/constant/roles';
import { type LoginRequest } from '@/features/auth/types';

import { findUserByToken } from '../db';
import { api, json } from '../utils';

const unauthorized = () => json({ message: 'ابتدا وارد سامانه شوید.' }, { status: 401 });

export const authHandlers = [
  http.post(api(ENDPOINTS.AUTH.LOGIN), async ({ request }) => {
    await delay(400);
    const body = (await request.json()) as LoginRequest;
    const user = MOCK_USERS.find(
      (item) => item.username === body.username && item.password === body.password,
    );
    if (!user) return json({ message: 'نام کاربری یا رمز عبور اشتباه است.' }, { status: 401 });
    return json({ token: user.token });
  }),

  http.get(api(ENDPOINTS.AUTH.LOGOUT), async () => {
    await delay(150);
    return json(true);
  }),

  http.get(api(ENDPOINTS.AUTH.MAIN_MENU), async ({ request }) => {
    await delay(200);
    const user = findUserByToken(request.headers.get('Authorization'));
    if (!user) return unauthorized();
    const isBranch = user.profile.roles.includes(ROLES.BRANCH);
    return json(
      isBranch
        ? MOCK_MAIN_MENU.filter((item) => !item.url || BRANCH_MENU_URLS.includes(item.url))
        : MOCK_MAIN_MENU,
    );
  }),

  http.get(api(ENDPOINTS.AUTH.PROFILE), async ({ request }) => {
    await delay(200);
    const user = findUserByToken(request.headers.get('Authorization'));
    return user ? json(user.profile) : unauthorized();
  }),
];

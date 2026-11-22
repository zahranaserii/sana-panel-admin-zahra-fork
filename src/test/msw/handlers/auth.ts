import { delay, http } from 'msw';

import { ENDPOINTS } from '@/constant/endpoints';
import { BRANCH_MENU_URLS, MOCK_MAIN_MENU, MOCK_USERS } from '@/constant/mock';
import { type CaptchaResponse, type LoginRequest } from '@/features/auth/types';

import { findUserByToken } from '../db';
import { api, json } from '../utils';

const unauthorized = () => json({ message: 'ابتدا وارد سامانه شوید.' }, { status: 401 });

const CAPTCHA_VALUE = '24125';
const CAPTCHA_TOKEN = '43d735fd-7fac-4e87-9148-3c6ca0eab8c6';
const captchaSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="32" viewBox="0 0 96 32">
  <rect width="96" height="32" rx="4" fill="#FBF3DF"/>
  <path d="M0 22L96 7M0 9L96 27" stroke="#E8C56A"/>
  <text x="48" y="23" text-anchor="middle" fill="#0E2B47" font-family="monospace" font-size="20" letter-spacing="3">${CAPTCHA_VALUE}</text>
</svg>`;

export const authHandlers = [
  http.get(api(ENDPOINTS.AUTH.CAPTCHA), async () => {
    await delay(300);
    return json({
      captchaToken: CAPTCHA_TOKEN,
      image: `data:image/svg+xml,${encodeURIComponent(captchaSvg)}`,
    } satisfies CaptchaResponse);
  }),

  http.post(api(ENDPOINTS.AUTH.LOGIN), async ({ request }) => {
    await delay(400);
    const body = (await request.json()) as LoginRequest;
    if (body.captchaToken !== CAPTCHA_TOKEN || body.captchaValue !== CAPTCHA_VALUE) {
      return json({ message: 'کد امنیتی اشتباه است.' }, { status: 400 });
    }
    const user = MOCK_USERS.find(
      (item) => item.username === body.username && item.password === body.password,
    );
    if (!user) return json({ message: 'نام کاربری یا رمز عبور اشتباه است.' }, { status: 401 });
    return json({ token: user.token });
  }),

  http.get(api(ENDPOINTS.AUTH.LOGOUT), async ({ request }) => {
    await delay(150);
    const token = new URL(request.url).searchParams.get('Token');
    return findUserByToken(`Bearer ${token}`) ? json(true) : unauthorized();
  }),

  http.get(api(ENDPOINTS.AUTH.MAIN_MENU), async ({ request }) => {
    await delay(200);
    const user = findUserByToken(request.headers.get('Authorization'));
    if (!user) return unauthorized();
    return json(
      user.isBranch
        ? MOCK_MAIN_MENU.filter((item) => !item.url || BRANCH_MENU_URLS.includes(item.url))
        : MOCK_MAIN_MENU,
    );
  }),

  http.get(api('/identity/Panel/Profile'), async ({ request }) => {
    await delay(200);
    const user = findUserByToken(request.headers.get('Authorization'));
    return user ? json(user.profile) : unauthorized();
  }),
];

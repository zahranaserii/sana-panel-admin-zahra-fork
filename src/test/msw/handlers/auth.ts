import { delay, http } from 'msw';

import { ENDPOINTS } from '@/constant/endpoints';
import { BRANCH_MENU_URLS, MOCK_MAIN_MENU } from '@/constant/mock';
import {
  type AuthSessionResponse,
  type CaptchaResponse,
  type ChangePasswordRequest,
  type LoginRequest,
  type LoginResponse,
  type VerifyOtpRequest,
} from '@/features/auth/types';

import { db, findUserByToken } from '../db';
import { api, json } from '../utils';

const unauthorized = () => json({ message: 'ابتدا وارد سامانه شوید.' }, { status: 401 });

const CAPTCHA_VALUE = '24125';
const CAPTCHA_TOKEN = '43d735fd-7fac-4e87-9148-3c6ca0eab8c6';
const OTP_CODE = '123456';
const pendingOtpChallenges = new Map<string, { otpTracker: string; expiresAt: number }>();
const passwordChangeTrackers = new Map<string, string>();
const newTracker = () => globalThis.crypto.getRandomValues(new Uint32Array(4)).join('-');

const issueOtp = (username: string) => {
  const otpTracker = newTracker();
  const expiresAt = Date.now() + 120_000;
  pendingOtpChallenges.set(username, { otpTracker, expiresAt });
  return { otpTracker, otpExpireTime: new Date(expiresAt).toISOString() };
};

// PNG fixture showing the mock captcha value 24125.
const captchaPng =
  'iVBORw0KGgoAAAANSUhEUgAAAGAAAAAgEAAAAACYO/7LAAABFElEQVRYw+1YWw7DIAyj0y7ChfjYUbkQJ5m0j2oqjyQ4wISqxV+opU7skAj1eL/crfHYnYAJ2J2ACdidwN8LeCKbfPyuUpB25G/5b7g313M5VgmgAjmxj3UYKjT1BGfTAarA5QUaMAUfU6D3S2yY6zmACvBHQBLFpdJj+4EAOS0fR3yTRWoAHaEyXTqVESf53sGlDYzRetZwZ13P1jeqhaoCcktqwbewj86dQ6APdQXoWT+KnO1anyuMXSGgbteZ9u19jfPCR4gOWLqES5oTnwOswLqAq9mUd6EcbTescx/vLvguJIfE/cRTwzhVPcBTS9c5yoCWbXSidSswPyoxtlJgCmhND/utYgJMwL1hAnbDBOzGB32Ba4NyqExoAAAAAElFTkSuQmCC';

export const authHandlers = [
  http.get(api(ENDPOINTS.AUTH.CAPTCHA), async () => {
    await delay(300);
    return json({
      token: CAPTCHA_TOKEN,
      base64Image: captchaPng,
    } satisfies CaptchaResponse);
  }),

  http.post(api(ENDPOINTS.AUTH.LOGIN), async ({ request }) => {
    await delay(400);
    const body = (await request.json()) as LoginRequest;
    if (body.captchaToken !== CAPTCHA_TOKEN || body.captchaValue !== CAPTCHA_VALUE) {
      return json({ message: 'کد امنیتی اشتباه است.' }, { status: 400 });
    }
    const user = db.authUsers.find(
      (item) => item.username === body.username && item.password === body.password,
    );
    if (!user) return json({ message: 'نام کاربری یا رمز عبور اشتباه است.' }, { status: 401 });
    if (user.mustChangePassword) {
      const otpTracker = newTracker();
      passwordChangeTrackers.set(user.username, otpTracker);
      return json({
        mustChangePassword: true,
        otpTracker,
        token: null,
        otpExpireTime: null,
        maskedMobile: null,
      } satisfies LoginResponse);
    }
    const mobile = db.users.find((item) => item.userName === user.username)?.mobileNumber;
    return json({
      ...issueOtp(user.username),
      token: null,
      maskedMobile: mobile ? mobile.slice(0, 4) + '****' + mobile.slice(-3) : null,
      mustChangePassword: false,
    } satisfies LoginResponse);
  }),

  http.post(api(ENDPOINTS.AUTH.CHANGE_PASSWORD), async ({ request }) => {
    await delay(300);
    const { otpTracker, newPassword } = (await request.json()) as ChangePasswordRequest;
    const user = db.authUsers.find(
      (item) =>
        item.mustChangePassword &&
        otpTracker &&
        passwordChangeTrackers.get(item.username) === otpTracker,
    );
    if (!user) return json({ message: 'درخواست تغییر رمز نامعتبر است.' }, { status: 400 });
    if (!newPassword) {
      return json({ message: 'رمز جدید الزامی است.' }, { status: 422 });
    }
    user.password = newPassword;
    user.mustChangePassword = false;
    passwordChangeTrackers.delete(user.username);
    return json(true);
  }),

  http.post(api(ENDPOINTS.AUTH.VERIFY_OTP), async ({ request }) => {
    await delay(300);
    const { otpTracker, code } = (await request.json()) as VerifyOtpRequest;
    if (!otpTracker || code !== OTP_CODE) {
      return json({ message: 'کد یک‌بارمصرف اشتباه است.' }, { status: 400 });
    }
    const user = db.authUsers.find((item) => {
      const challenge = pendingOtpChallenges.get(item.username);
      return challenge?.otpTracker === otpTracker && challenge.expiresAt > Date.now();
    });
    if (!user) {
      return json({ message: 'درخواست تأیید نامعتبر است. دوباره وارد شوید.' }, { status: 400 });
    }

    pendingOtpChallenges.delete(user.username);
    return json({ token: user.token } satisfies AuthSessionResponse);
  }),

  http.post(api(ENDPOINTS.AUTH.RESEND_OTP), async ({ request }) => {
    const { otpTracker } = (await request.json()) as { otpTracker: string };
    const entry = [...pendingOtpChallenges].find(
      ([, challenge]) => challenge.otpTracker === otpTracker,
    );
    if (!entry) return json({ message: 'درخواست نامعتبر است.' }, { status: 400 });
    return json(issueOtp(entry[0]));
  }),

  http.post(api('/identity/Authentication/MyPassword'), async ({ request }) => {
    const user = findUserByToken(request.headers.get('Authorization'));
    if (!user) return unauthorized();
    const { currentPassword, newPassword } = (await request.json()) as {
      currentPassword: string;
      newPassword: string;
    };
    if (!newPassword || currentPassword !== user.password)
      return json({ message: 'رمز عبور نامعتبر است.' }, { status: 400 });
    user.password = newPassword;
    return json(true);
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

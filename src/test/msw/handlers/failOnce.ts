import { http } from 'msw';

import { json } from '../utils';

/** کلید localStorage: فهرست بخش‌هایی از آدرس که درخواست بعدی‌شان یک بار خطا بدهد (با «,» جدا) */
export const MOCK_FAIL_KEY = 'mock-fail-once';

const readList = () => {
  try {
    return (localStorage.getItem(MOCK_FAIL_KEY) ?? '').split(',').filter(Boolean);
  } catch {
    return [];
  }
};

/**
 * شبیه‌سازی خطای سرور برای تست (فقط ماک توسعه):
 * localStorage.setItem('mock-fail-once', 'Dashboard,401:ChangeLogs/Users')
 * اولین درخواست هر مورد خطا می‌گیرد (پیش‌فرض ۵۰۰؛ با پیشوند «کد:» همان کد) و درخواست بعدی عادی است.
 */
export const failOnceHandler = http.all('*', ({ request }) => {
  const list = readList();
  const { pathname } = new URL(request.url);
  const match = list.find((part) => pathname.endsWith(part.replace(/^\d{3}:/, '')));
  // بدون مقدار بازگشتی، درخواست به handler بعدی می‌رسد
  if (!match) return;
  localStorage.setItem(MOCK_FAIL_KEY, list.filter((part) => part !== match).join(','));
  const status = Number(/^(\d{3}):/.exec(match)?.[1] ?? 500);
  return json({ message: 'خطای شبیه‌سازی‌شده سرور' }, { status });
});

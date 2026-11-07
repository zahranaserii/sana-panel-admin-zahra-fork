import { expect, test, type Page } from '@playwright/test';

const login = async (page: Page) => {
  await page.goto('/login');
  await page.getByLabel('نام کاربری').fill('admin');
  await page.getByLabel('رمز عبور').fill('admin');
  await page.getByRole('button', { name: /ورود/ }).click();
  await expect(page.getByRole('navigation')).toBeVisible();
};

test('downloads save the file itself, named from Content-Disposition', async ({ page }) => {
  // Chromium بدون رابط نام فارسی را «download» گزارش می‌کند؛ نام از ویژگی download لینک خوانده می‌شود
  await page.addInitScript(`(() => {
    window.__downloads = [];
    const dispatch = EventTarget.prototype.dispatchEvent;
    EventTarget.prototype.dispatchEvent = function (event) {
      if (this instanceof HTMLAnchorElement && this.download && event.type === 'click') {
        window.__downloads.push({ name: this.download, blob: this.href.startsWith('blob:') });
      }
      return dispatch.call(this, event);
    };
  })()`);
  await login(page);
  await page.goto('/change-log');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: /خروجی اکسل گزارش/ }).click();
  await download;
  expect(await page.evaluate('window.__downloads')).toEqual([
    { name: 'گزارش-تغییرات.xlsx', blob: true },
  ]);
});

test('a JSON error on a download shows the backend message', async ({ page }) => {
  await login(page);
  await page.goto('/change-log');
  await page.evaluate(() => localStorage.setItem('mock-fail-once', '404:ChangeLogs/Export'));
  await page.getByRole('button', { name: /خروجی اکسل گزارش/ }).click();
  await expect(page.getByText('خطای شبیه‌سازی‌شده سرور')).toBeVisible();
});

import { expect, test } from '@playwright/test';

/** بدنه درخواست‌های پیش‌نمایش (ماک داخل صفحه با Request ساخته می‌شود و به شبکه نمی‌رسد) */
const recordPreviews = `(() => {
  window.__previews = [];
  const NativeRequest = window.Request;
  window.Request = class extends NativeRequest {
    constructor(input, init) {
      super(input, init);
      if (String(input).includes('/LoanRequests/Preview') && typeof init?.body === 'string') {
        window.__previews.push(JSON.parse(init.body));
      }
    }
  };
})()`;

test('loan preview is called only after a plan is selected (never with planId 0)', async ({
  page,
}) => {
  await page.addInitScript(recordPreviews);
  await page.goto('/login');
  await page.getByLabel('نام کاربری').fill('admin');
  await page.getByLabel('رمز عبور').fill('admin');
  await page.getByRole('button', { name: /ورود/ }).click();
  await expect(page.getByRole('navigation')).toBeVisible();

  // ۱۴۰۵/۰۸/۱۲: روز مجاز انتقال اعتبار شرکت ۱ در ماک
  await page.goto('/credit?companyId=1&date=2026-11-03');
  const planIds = () =>
    page.evaluate<number[]>('window.__previews.map((body) => body.planId ?? 0)');
  await expect.poll(async () => (await planIds()).length, { timeout: 20_000 }).toBeGreaterThan(0);
  expect(await planIds()).not.toContain(0);
});

test('variable amounts: preview is called only by the submit button', async ({ page }) => {
  await page.addInitScript(recordPreviews);
  await page.goto('/login');
  await page.getByLabel('نام کاربری').fill('admin');
  await page.getByLabel('رمز عبور').fill('admin');
  await page.getByRole('button', { name: /ورود/ }).click();
  await expect(page.getByRole('navigation')).toBeVisible();
  await page.goto('/credit?companyId=1&date=2026-11-03');

  const modes = () => page.evaluate<number[]>('window.__previews.map((body) => body.mode)');
  await page.getByText('مبلغ متفاوت برای هرکس').click();
  const row = page.getByRole('row', { name: /علی محمدی/ });
  await row.getByRole('checkbox').check();
  await row.locator('input:not([type=checkbox])').last().fill('10000000');
  // تا قبل از دکمه ثبت هیچ پیش‌نمایشی با مبلغ متفاوت فرستاده نمی‌شود
  // بیش از زمان debounce (۴۰۰ میلی‌ثانیه) صبر می‌شود تا نبودن درخواست خودکار دیده شود
  // eslint-disable-next-line sonarjs/no-fixed-wait-in-tests
  await page.waitForTimeout(1500);
  expect(await modes()).not.toContain(2);

  await page.getByRole('button', { name: /ثبت درخواست برای پرسنل/ }).click();
  await expect.poll(modes).toContain(2);
  expect((await modes()).filter((mode) => mode === 2)).toHaveLength(1);
});

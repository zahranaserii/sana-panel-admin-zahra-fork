import { expect, test, type Page } from '@playwright/test';

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

const CHECK = /بررسی اعتبار برای پرسنل/;
const SUBMIT = /ثبت درخواست برای پرسنل/;

const openCredit = async (page: Page) => {
  await page.addInitScript(recordPreviews);
  await page.goto('/login');
  await page.getByLabel('نام کاربری').fill('admin');
  await page.getByLabel('رمز عبور').fill('admin');
  await page.getByRole('button', { name: /ورود/ }).click();
  await expect(page.getByRole('navigation')).toBeVisible();
  // ۱۴۰۵/۰۸/۱۲: روز مجاز انتقال اعتبار شرکت ۱ در ماک
  await page.goto('/credit?companyId=1&date=2026-11-03');
};

const previews = (page: Page) =>
  page.evaluate<{ planId?: number; mode?: number }[]>('window.__previews');

test('fixed amount: preview only from the check button; submit enabled after an allowed check', async ({
  page,
}) => {
  await openCredit(page);
  const row = page.getByRole('row', { name: /علی محمدی/ });
  await row.getByRole('checkbox').check();
  await page.getByLabel('مبلغ وام برای هر نفر').fill('10000000');
  await expect(page.getByRole('button', { name: SUBMIT })).toBeDisabled();
  // بیش از زمان debounce قبلی صبر می‌شود تا نبودن درخواست خودکار دیده شود
  // eslint-disable-next-line sonarjs/no-fixed-wait-in-tests
  await page.waitForTimeout(1500);
  expect(await previews(page)).toHaveLength(0);

  await page.getByRole('button', { name: CHECK }).click();
  await expect.poll(async () => (await previews(page)).length).toBe(1);
  expect((await previews(page))[0]?.planId).toBeGreaterThan(0);
  await expect(page.getByRole('button', { name: SUBMIT })).toBeEnabled();

  // با تغییر فرم، نتیجه بررسی باطل و ثبت دوباره غیرفعال می‌شود
  await page.getByLabel('مبلغ وام برای هر نفر').fill('20000000');
  await expect(page.getByRole('button', { name: SUBMIT })).toBeDisabled();
});

test('variable amounts: a row can be selected only after its amount; select-all stays disabled', async ({
  page,
}) => {
  await openCredit(page);
  await page.getByText('مبلغ متفاوت برای هرکس').click();
  const table = page.locator('.ant-table').filter({ has: page.getByText('مبلغ وام این نفر') });
  await expect(table.locator('thead').getByRole('checkbox')).toBeDisabled();

  const row = page.getByRole('row', { name: /علی محمدی/ });
  const amount = row.locator('input:not([type=checkbox])').last();
  await expect(row.getByRole('checkbox')).toBeDisabled();
  await amount.fill('10000000');
  await expect(row.getByRole('checkbox')).toBeEnabled();
  await row.getByRole('checkbox').check();

  await page.getByRole('button', { name: CHECK }).click();
  await expect.poll(async () => (await previews(page)).map((body) => body.mode)).toEqual([2]);
  await expect(page.getByRole('button', { name: SUBMIT })).toBeEnabled();

  // مبلغ پاک شود → ردیف از انتخاب خارج و چک‌باکسش غیرفعال می‌شود
  await amount.fill('');
  await expect(row.getByRole('checkbox')).not.toBeChecked();
  await expect(row.getByRole('checkbox')).toBeDisabled();
  await expect(page.getByRole('button', { name: CHECK })).toBeDisabled();
});

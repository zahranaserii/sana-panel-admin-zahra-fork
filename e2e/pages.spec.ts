import { expect, test, type Page } from '@playwright/test';

const login = async (page: Page, errors: string[]) => {
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`console: ${m.text()}`);
  });
  page.on('response', (r) => {
    if (r.status() >= 400) errors.push(`HTTP ${r.status()} ${r.url()}`);
  });
  await page.goto('/login');
  await page.getByLabel('نام کاربری').fill('admin');
  await page.getByLabel('رمز عبور').fill('admin');
  await page.getByRole('button', { name: /ورود/ }).click();
  await expect(page.getByRole('navigation')).toBeVisible();
};

const go = (page: Page, href: string) => page.locator(`nav a[href="${href}"]`).click();

test('main pages work on the backend models (mock) without errors', async ({ page }) => {
  test.setTimeout(120_000);
  const errors: string[] = [];
  await login(page, errors);

  // companies
  await go(page, '/companies');
  await expect(page.getByRole('cell', { name: 'شرکت فناوران پارس' })).toBeVisible();
  await expect(page.getByText(/لغوشده در/)).toBeVisible();
  await page
    .getByRole('row', { name: /فناوران پارس/ })
    .getByRole('button', { name: /ویرایش/ })
    .click();
  await expect(page.getByLabel('نام شرکت')).toHaveValue('شرکت فناوران پارس');
  await page.getByRole('button', { name: 'ذخیره تغییرات' }).click();
  await expect(page.getByText(/به‌روزرسانی شد/)).toBeVisible();
  await expect(page.getByText('مستندات ثبت‌شده میانگین موجودی')).toBeVisible();
  await expect(page.getByRole('cell', { name: 'نامه-میانگین.pdf' })).toBeVisible();

  // staff
  await go(page, '/staff');
  await expect(page.getByRole('cell', { name: 'علی محمدی' })).toBeVisible();
  // فردی که در وام استفاده شده قفل است
  await expect(
    page.getByRole('row', { name: /علی محمدی/ }).getByRole('button', { name: /ویرایش/ }),
  ).toBeDisabled();
  await page
    .getByRole('row', { name: /سارا نوری/ })
    .getByRole('button', { name: /ویرایش/ })
    .click();
  await expect(page.getByRole('dialog').getByLabel('کد ملی')).toHaveValue('0056789012');
  await page.getByRole('button', { name: 'ذخیره تغییرات' }).click();
  await expect(page.getByText(/ویرایش شد/)).toBeVisible();

  // credit
  await go(page, '/credit');
  await expect(page.getByText('مانده اعتبار ماه').first()).toBeVisible({ timeout: 20_000 });
  await expect(page.getByText('درخواست‌های وام این شرکت')).toBeVisible();

  // credit approvals
  await go(page, '/credit-approve');
  await expect(page.getByRole('cell', { name: 'مریم کریمی' })).toBeVisible({ timeout: 20_000 });
  await page
    .getByRole('row', { name: /مریم کریمی/ })
    .getByRole('button', { name: /^check تأیید$/ })
    .click();
  await page.getByRole('dialog').getByLabel('مرحله پس از تأیید').click();
  await page
    .locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option')
    .first()
    .click();
  await page.getByRole('button', { name: 'ثبت تصمیم' }).click();
  await expect(page.getByText(/درخواست تأیید شد/)).toBeVisible();
  await expect(
    page.getByRole('row', { name: /مریم کریمی/ }).getByRole('button', { name: /تغییر مرحله/ }),
  ).toBeVisible();

  // dashboard
  await go(page, '/dashboard');
  await expect(page.getByText('رتبه‌بندی شرکت‌ها')).toBeVisible({ timeout: 20_000 });
  await expect(page.getByRole('button', { name: /خروجی شرکت‌ها$/ })).toBeVisible();

  // base info
  await go(page, '/base-info');
  await expect(page.getByRole('cell', { name: 'نگین میثاق' })).toBeVisible({ timeout: 20_000 });

  expect(errors).toEqual([]);
});

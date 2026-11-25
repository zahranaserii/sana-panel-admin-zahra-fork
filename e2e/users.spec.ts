import { expect, test } from '@playwright/test';

import { changeInitialAdminPassword, completeMockOtp } from './helpers/auth';

test('edit user: role comes from roles, success shows the backend message', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('نام کاربری').fill('admin');
  await page.getByLabel('رمز عبور').fill('admin');
  await page.getByLabel('کد امنیتی').fill('24125');
  await page.getByRole('button', { name: /ورود/ }).click();
  await changeInitialAdminPassword(page);
  await completeMockOtp(page);
  await expect(page.getByRole('navigation')).toBeVisible();

  await page.goto('/users');
  await expect(page.getByRole('cell', { name: 'branch', exact: true })).toBeVisible();
  await page
    .getByRole('row', { name: /کاربر شعبه/ })
    .getByRole('button', { name: /ویرایش/ })
    .click();

  const dialog = page.getByRole('dialog', { name: 'ویرایش کاربر' });
  await expect(dialog.getByLabel('نام کاربری')).toHaveValue('branch');
  await expect(dialog.getByLabel('شماره موبایل')).toHaveValue('09120000002');
  await expect(dialog.getByLabel('کد ملی')).toHaveValue('0012345611');
  await expect(dialog.getByText('کاربر شعبه', { exact: true })).toBeVisible();

  await dialog.getByRole('button', { name: 'ذخیره تغییرات' }).click();
  await expect(page.getByText('با موفقیت انجام شد')).toBeVisible();
});

test('mobile number and national code are required and appear in the new user row', async ({
  page,
  context,
  baseURL,
}) => {
  await context.addCookies([
    { name: 'sana_token', value: 'mock-token-admin', url: new URL('/users', baseURL).origin },
  ]);
  await page.goto('/users');
  await page.getByRole('button', { name: 'افزودن کاربر' }).click();
  const dialog = page.getByRole('dialog', { name: 'افزودن کاربر' });
  const submit = dialog.getByRole('button', { name: 'ثبت کاربر' });
  await dialog.getByLabel('نام کاربری').fill('new-user');
  await dialog.getByLabel('رمز عبور').fill('test-password');
  await dialog.getByLabel('نام و نام خانوادگی کاربر').fill('کاربر آزمایشی');
  await dialog.getByLabel('کد کاربر').fill('400');
  await dialog.getByLabel('نام شعبه').fill('شعبه تست');
  await dialog.getByLabel('کد شعبه').fill('150003');
  await dialog.getByLabel('نقش کاربر').click();
  await page.locator('.ant-select-item-option').filter({ hasText: 'کاربر شعبه' }).click();
  await submit.click();
  await expect(dialog.getByText('شماره موبایل الزامی است.')).toBeVisible();
  await expect(dialog.getByText('کد ملی الزامی است.')).toBeVisible();

  await dialog.getByLabel('شماره موبایل').fill('۰۹۱۲۱۲۳۴۵۶۷');
  const nationalCode = dialog.getByLabel('کد ملی');
  await nationalCode.fill('۱۲۳');
  await expect(dialog.getByText('کد ملی باید ۱۰ رقم باشد', { exact: true })).toBeVisible();
  await nationalCode.fill('12a');
  await expect(dialog.getByText('کد ملی باید فقط شامل اعداد باشد', { exact: true })).toBeVisible();
  await nationalCode.fill('0000000000');
  await submit.click();
  await expect(dialog.getByText('کد ملی معتبر نیست')).toBeVisible();
  await nationalCode.fill('0012345678');
  await submit.click();
  await expect(dialog.getByText('کد ملی معتبر نیست')).toBeVisible();

  await nationalCode.fill('٠٠١٢٣٤٥٦٧٩');
  await submit.click();
  const row = page.getByRole('row', { name: /new-user/ });
  await expect(row.getByRole('cell', { name: '۰۹۱۲۱۲۳۴۵۶۷' })).toBeVisible();
  await expect(row.getByRole('cell', { name: '۰۰۱۲۳۴۵۶۷۹' })).toBeVisible();
  await row.getByRole('button', { name: 'ویرایش' }).click();
  const edit = page.getByRole('dialog', { name: 'ویرایش کاربر' });
  await expect(edit.getByLabel('شماره موبایل')).toHaveValue('09121234567');
  await expect(edit.getByLabel('کد ملی')).toHaveValue('0012345679');
});

import { expect, test } from '@playwright/test';

test('edit user: role comes from roles, success shows the backend message', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('نام کاربری').fill('admin');
  await page.getByLabel('رمز عبور').fill('admin');
  await page.getByRole('button', { name: /ورود/ }).click();
  await expect(page.getByRole('navigation')).toBeVisible();

  await page.goto('/users');
  await expect(page.getByRole('cell', { name: 'branch', exact: true })).toBeVisible();
  await page
    .getByRole('row', { name: /کاربر شعبه/ })
    .getByRole('button', { name: /ویرایش/ })
    .click();

  const dialog = page.getByRole('dialog', { name: 'ویرایش کاربر' });
  await expect(dialog.getByLabel('نام کاربری')).toHaveValue('branch');
  await expect(dialog.getByText('کاربر شعبه', { exact: true })).toBeVisible();

  await dialog.getByRole('button', { name: 'ذخیره تغییرات' }).click();
  await expect(page.getByText('با موفقیت انجام شد')).toBeVisible();
});

import { expect, test } from '@playwright/test';

test('admin can log in and sees the main layout', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/login$/);

  await page.getByLabel('نام کاربری').fill('admin');
  await page.getByLabel('رمز عبور').fill('admin');
  await page.getByRole('button', { name: /ورود/ }).click();

  await expect(page.getByRole('navigation')).toBeVisible();
  // عنوان از بک‌اند می‌آید؛ وجود لینک صفحه با مسیر خود ما بررسی می‌شود
  await expect(page.locator('nav a[href="/companies"]')).toBeVisible();
});

test('wrong credentials show an error', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('نام کاربری').fill('admin');
  await page.getByLabel('رمز عبور').fill('wrong');
  await page.getByRole('button', { name: /ورود/ }).click();
  await expect(page.getByText('نام کاربری یا رمز عبور اشتباه است.').first()).toBeVisible();
});

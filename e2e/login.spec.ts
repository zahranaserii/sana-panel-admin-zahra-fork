import { expect, test } from '@playwright/test';

test('admin can log in and sees the main layout', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/login$/);

  await page.getByLabel('نام کاربری').fill('admin');
  await page.getByLabel('رمز عبور').fill('admin');
  await expect(page.getByRole('img', { name: 'تصویر کپچا' })).toBeVisible();
  await expect(page.getByRole('button', { name: /ورود/ })).toBeDisabled();
  await page.getByLabel('کد امنیتی').fill('   ');
  await expect(page.getByRole('button', { name: /ورود/ })).toBeDisabled();
  await page.getByLabel('کد امنیتی').fill('24125');
  await page.getByRole('button', { name: /ورود/ }).click();

  await expect(page.getByRole('navigation')).toBeVisible();
  // عنوان از بک‌اند می‌آید؛ وجود لینک صفحه با مسیر خود ما بررسی می‌شود
  await expect(page.locator('nav a[href="/companies"]')).toBeVisible();
});

test('wrong credentials show an error', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('نام کاربری').fill('admin');
  await page.getByLabel('رمز عبور').fill('wrong');
  await page.getByLabel('کد امنیتی').fill('24125');
  await page.getByRole('button', { name: /ورود/ }).click();
  await expect(page.getByText('نام کاربری یا رمز عبور اشتباه است.').first()).toBeVisible();
});

test('login stays disabled when the captcha request fails and until a code is entered', async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.setItem('mock-fail-once', 'Authentication/Generate'));
  await page.goto('/login');

  const submit = page.getByRole('button', { name: /ورود/ });
  await expect(page.getByText('دریافت تصویر کپچا ناموفق بود.')).toBeVisible();
  await expect(submit).toBeDisabled();

  await page.getByRole('button', { name: /تلاش مجدد/ }).click();
  await expect(page.getByRole('img', { name: 'تصویر کپچا' })).toBeVisible();
  await expect(submit).toBeDisabled();

  await page.getByLabel('کد امنیتی').fill('24125');
  await expect(submit).toBeEnabled();
});

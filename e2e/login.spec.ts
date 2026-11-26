import { expect, test } from '@playwright/test';

import { changeInitialAdminPassword, completeMockOtp, otpInputs } from './helpers/auth';

test('OTP replaces the form inside the login frame before entering the panel', async ({ page }) => {
  await page.clock.install();
  await page.goto('/');
  await expect(page).toHaveURL(/\/login$/);

  const loginFrame = page.getByRole('main', { name: 'ورود به سامانه' });
  const otpStep = loginFrame.getByRole('region', { name: 'تأیید ورود' });
  const logo = loginFrame.getByRole('img', { name: 'سانا', exact: true });
  await expect(logo).toBeVisible();
  await expect(otpStep).toHaveCount(0);
  await page.getByLabel('نام کاربری').fill('admin');
  await page.getByLabel('رمز عبور').fill('admin');
  await expect(page.getByRole('img', { name: 'تصویر کپچا' })).toBeVisible();
  await expect
    .poll(() =>
      page
        .getByRole('img', { name: 'تصویر کپچا' })
        .evaluate((image) => (image as { naturalWidth: number }).naturalWidth),
    )
    .toBe(96);
  await expect(page.getByRole('button', { name: /ورود/ })).toBeDisabled();
  await page.getByLabel('کد امنیتی').fill('   ');
  await expect(page.getByRole('button', { name: /ورود/ })).toBeDisabled();
  await page.getByLabel('کد امنیتی').fill('24125');
  await page.getByRole('button', { name: /ورود/ }).click();
  await changeInitialAdminPassword(page);
  await expect(otpStep.getByRole('heading', { name: 'تأیید ورود' })).toBeVisible();
  await expect(logo).toBeVisible();
  await expect(loginFrame.getByRole('heading', { name: 'ورود به سامانه' })).toHaveCount(0);
  await expect(page.getByLabel('رمز عبور')).toHaveCount(0);
  await expect(otpInputs(page)).toHaveCount(6);
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('button', { name: 'تأیید و ورود' })).toBeDisabled();
  expect((await page.context().cookies()).map((cookie) => cookie.name)).not.toContain('sana_token');
  await expect(otpStep.getByText('0912****001', { exact: true })).toBeVisible();
  await page.clock.fastForward(121_000);
  await page.getByRole('button', { name: 'ارسال مجدد' }).click();
  await expect(page.getByRole('timer')).toBeVisible();
  await completeMockOtp(page, '۱۲۳۴۵۶');

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

  const message = 'دریافت تصویر کپچا ناموفق بود.';
  const submit = page.getByRole('button', { name: /ورود/ });
  const retry = page.getByRole('button', { name: 'تلاش مجدد برای دریافت کپچا' });
  const image = page.getByRole('img', { name: 'تصویر کپچا' });
  const toasts = page.locator('[data-sonner-toast]');
  await expect(toasts).toHaveCount(1);
  await expect(toasts.getByText(message)).toBeVisible();
  await expect(page.getByText(message, { exact: true })).toHaveCount(1);
  await expect(image).toHaveCount(0);
  await expect(submit).toBeDisabled();

  await retry.click();
  await expect(image).toBeVisible();
  await expect(retry).toHaveCount(0);
  await expect(submit).toBeDisabled();

  await page.getByLabel('کد امنیتی').fill('24125');
  await expect(submit).toBeEnabled();
  await page.getByRole('button', { name: 'دریافت کپچای جدید' }).click();
  await expect(image).toBeVisible();
  await expect(page.getByLabel('کد امنیتی')).toHaveValue('');
  await expect(submit).toBeDisabled();
});

test('a wrong OTP keeps the user on login and back returns to the credentials form', async ({
  page,
}) => {
  await page.goto('/login');
  await page.getByLabel('نام کاربری').fill('admin');
  await page.getByLabel('رمز عبور').fill('admin');
  await page.getByLabel('کد امنیتی').fill('24125');
  await page.getByRole('button', { name: /ورود/ }).click();
  await changeInitialAdminPassword(page);
  await completeMockOtp(page, '123455');

  await expect(page.getByText('کد یک‌بارمصرف اشتباه است.')).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);
  expect((await page.context().cookies()).map((cookie) => cookie.name)).not.toContain('sana_token');
  await page.getByRole('button', { name: 'بازگشت به ورود' }).click();

  await expect(page.getByRole('main', { name: 'ورود به سامانه' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'تأیید ورود' })).toHaveCount(0);
  await expect(page.getByLabel('نام کاربری')).toHaveValue('admin');
  await expect(page.getByLabel('رمز عبور')).toHaveValue('');
  await expect(page.getByLabel('کد امنیتی')).toHaveValue('');
  await expect(page.getByRole('img', { name: 'تصویر کپچا' })).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);
});

test('mandatory password change requires signing in again with the new password', async ({
  page,
}) => {
  await page.goto('/login');
  await page.getByLabel('نام کاربری').fill('branch');
  await page.getByLabel('رمز عبور').fill('branch');
  await page.getByLabel('کد امنیتی').fill('24125');
  const loginButton = page.getByRole('main').getByRole('button', { name: /ورود/ });
  await loginButton.click();

  const dialog = page.getByRole('dialog', { name: 'تغییر رمز عبور' });
  await dialog.getByRole('button', { name: 'بازگشت به ورود' }).click();
  await expect(dialog).toHaveCount(0);
  await page.getByLabel('رمز عبور').fill('branch');
  await page.getByLabel('کد امنیتی').fill('24125');
  await loginButton.click();
  const submit = dialog.getByRole('button', { name: 'ثبت رمز جدید' });
  await submit.click();
  await expect(dialog.getByText('رمز عبور جدید الزامی است.', { exact: true })).toBeVisible();
  await dialog.getByLabel('رمز عبور جدید', { exact: true }).fill('new-branch-password1');
  await dialog.getByLabel('تکرار رمز عبور جدید', { exact: true }).fill('different-password');
  await submit.click();
  await expect(dialog.getByText('تکرار رمز عبور با رمز جدید یکسان نیست.')).toBeVisible();
  await dialog.getByLabel('تکرار رمز عبور جدید', { exact: true }).fill('new-branch-password1');
  await page.evaluate(() =>
    localStorage.setItem('mock-fail-once', 'Authentication/LoginChangePassword'),
  );
  await submit.click();
  await expect(page.locator('[data-sonner-toast]')).toBeVisible();
  await expect(dialog).toBeVisible();
  await expect(otpInputs(page)).toHaveCount(0);
  await submit.click();

  await expect(dialog).toHaveCount(0);
  await expect(page.getByLabel('رمز عبور')).toHaveValue('');
  await expect(otpInputs(page)).toHaveCount(0);
  expect((await page.context().cookies()).map((cookie) => cookie.name)).not.toContain('sana_token');
  await page.getByLabel('رمز عبور').fill('branch');
  await page.getByLabel('کد امنیتی').fill('24125');
  await loginButton.click();
  await expect(page.getByText('نام کاربری یا رمز عبور اشتباه است.').first()).toBeVisible();
  await page.getByLabel('رمز عبور').fill('new-branch-password1');
  await loginButton.click();
  await expect(otpInputs(page)).toHaveCount(6);
  expect((await page.context().cookies()).map((cookie) => cookie.name)).not.toContain('sana_token');
  await completeMockOtp(page);
  await expect(page.getByRole('navigation')).toBeVisible();
});

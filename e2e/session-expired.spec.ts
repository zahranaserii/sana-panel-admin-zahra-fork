import { expect, test, type Page } from '@playwright/test';

const login = async (page: Page) => {
  await page.goto('/login');
  await page.getByLabel('نام کاربری').fill('admin');
  await page.getByLabel('رمز عبور').fill('admin');
  await page.getByRole('button', { name: /ورود/ }).click();
  await expect(page.getByRole('navigation')).toBeVisible();
};

/** درخواست بعدی این آدرس در ماک یک بار ۴۰۱ می‌گیرد (handlers/failOnce) */
const expireOn = (page: Page, path: string) =>
  page.evaluate((value) => localStorage.setItem('mock-fail-once', `401:${value}`), path);

const dialog = (page: Page) => page.getByRole('dialog', { name: 'پایان نشست' });

test('401 shows the session-expired modal; Esc logs out', async ({ page }) => {
  await login(page);
  await expireOn(page, 'facility-management/Dashboard');
  await page.locator('nav a[href="/dashboard"]').click();

  await expect(dialog(page)).toBeVisible({ timeout: 20_000 });
  await expect(
    dialog(page).getByText('زمان فعالیت شما به پایان رسید، لطفاً مجدداً وارد سامانه شوید.'),
  ).toBeVisible();
  // کلیک بیرون مودال آن را نمی‌بندد
  await page.mouse.click(5, 5);
  await expect(dialog(page)).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(page).toHaveURL(/\/login$/);
  await expect(dialog(page)).toHaveCount(0);
});

test('the confirm button logs out as well', async ({ page }) => {
  await login(page);
  await expireOn(page, 'facility-management/Companies');
  await page.locator('nav a[href="/companies"]').click();

  await dialog(page).getByRole('button', { name: 'متوجه شدم' }).click({ timeout: 20_000 });
  await expect(page).toHaveURL(/\/login$/);
});

import { expect, test, type Page } from '@playwright/test';

/** درخواست بعدی این آدرس‌ها در ماک یک بار ۵۰۰ می‌گیرد (handlers/failOnce) */
const failOnce = (page: Page, ...paths: string[]) =>
  page.evaluate((list) => localStorage.setItem('mock-fail-once', list.join(',')), paths);

const login = async (page: Page) => {
  await page.goto('/login');
  await page.getByLabel('نام کاربری').fill('admin');
  await page.getByLabel('رمز عبور').fill('admin');
  await page.getByRole('button', { name: /ورود/ }).click();
  await expect(page.getByRole('navigation')).toBeVisible();
};

const retryButton = (page: Page) => page.getByRole('button', { name: /تلاش مجدد/ });

test('menu error shows only a retry button, then the layout', async ({ page }) => {
  await page.goto('/login');
  await failOnce(page, 'Authentication/MainMenu');
  await page.getByLabel('نام کاربری').fill('admin');
  await page.getByLabel('رمز عبور').fill('admin');
  await page.getByRole('button', { name: /ورود/ }).click();

  await expect(retryButton(page)).toBeVisible();
  await expect(page.getByRole('navigation')).toHaveCount(0);
  await retryButton(page).click();
  await expect(page.getByRole('navigation')).toBeVisible();
});

test('tables, charts and selects retry the failed service', async ({ page }) => {
  test.setTimeout(90_000);
  await login(page);

  // جدول
  await failOnce(page, 'facility-management/Companies');
  await page.locator('nav a[href="/companies"]').click();
  await expect(retryButton(page).first()).toBeVisible({ timeout: 20_000 });
  await retryButton(page).first().click();
  await expect(page.getByRole('cell', { name: 'شرکت فناوران پارس' })).toBeVisible();

  // مودال ویرایش با خطای جزئیات باز نمی‌شود
  // شرکت ۲: جزئیات شرکت ۱ را بخش میانگین‌ها از قبل گرفته و در کش است
  await failOnce(page, 'Companies/2');
  const edit = page
    .getByRole('row', { name: /صنایع غذایی آوا/ })
    .getByRole('button', { name: /ویرایش/ });
  await edit.click();
  // بعد از پایان دریافت (دکمه از حالت لودینگ خارج شود) مودال نباید باز شده باشد
  await expect(edit).not.toHaveClass(/ant-btn-loading/);
  await expect(page.getByRole('dialog')).toHaveCount(0);

  // نمودارها و کارت‌ها
  await failOnce(page, 'facility-management/Dashboard');
  await page.locator('nav a[href="/dashboard"]').click();
  await expect(retryButton(page).first()).toBeVisible({ timeout: 20_000 });
  await retryButton(page).first().click();
  await expect(page.getByText('تعداد شرکت‌های فعال')).toBeVisible();
  await expect(retryButton(page)).toHaveCount(0);

  // سلکت: با باز کردن سلکتی که سرویسش خطا داده، دوباره صدا زده می‌شود
  await failOnce(page, 'ChangeLogs/Users');
  await page.locator('nav a[href="/change-log"]').click();
  await page.getByLabel('کاربر').click({ timeout: 20_000 });
  await expect(
    page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option'),
  ).toHaveCount(3);
});

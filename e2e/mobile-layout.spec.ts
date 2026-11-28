import { expect, test, type Page } from '@playwright/test';

import { changeInitialAdminPassword, completeMockOtp } from './helpers/auth';

test.use({ viewport: { width: 390, height: 844 } });

const login = async (page: Page) => {
  await page.goto('/login');
  await page.getByLabel('نام کاربری').fill('admin');
  await page.getByLabel('رمز عبور').fill('admin');
  await page.getByLabel('کد امنیتی').fill('24125');
  await page.getByRole('button', { name: /ورود/ }).click();
  await changeInitialAdminPassword(page);
  await completeMockOtp(page);
  await expect(page.getByRole('button', { name: 'منو' })).toBeVisible();
};

const menuDrawer = (page: Page) => page.getByRole('dialog', { name: 'منو' });
const actionsDrawer = (page: Page) => page.getByRole('dialog', { name: 'سایر گزینه‌ها' });

test('menu drawer opens from the right and closes on item click, close button and Esc', async ({
  page,
}) => {
  await login(page);
  // سایدبار ثابت در موبایل نمایش داده نمی‌شود
  await expect(page.locator('aside')).toBeHidden();

  await page.getByRole('button', { name: 'منو' }).click();
  await expect(menuDrawer(page)).toBeVisible();
  const box = await menuDrawer(page).boundingBox();
  expect((box?.x ?? 0) + (box?.width ?? 0)).toBeGreaterThan(385);
  await page.screenshot({ path: 'test-results/mobile-menu.png' });

  await menuDrawer(page).locator('a[href="/companies"]').click();
  await expect(page).toHaveURL(/\/companies$/);
  await expect(menuDrawer(page)).toBeHidden();

  await page.getByRole('button', { name: 'منو' }).click();
  await menuDrawer(page).getByRole('button', { name: 'بستن منو' }).click();
  await expect(menuDrawer(page)).toBeHidden();

  await page.getByRole('button', { name: 'منو' }).click();
  await page.keyboard.press('Escape');
  await expect(menuDrawer(page)).toBeHidden();
});

test('actions drawer: theme keeps it open, logout closes it and asks for confirmation', async ({
  page,
}) => {
  await login(page);
  await page.getByRole('button', { name: 'سایر گزینه‌ها' }).click();
  await expect(actionsDrawer(page)).toBeVisible();
  const box = await actionsDrawer(page).boundingBox();
  expect(box?.x ?? 99).toBeLessThan(5);
  await page.screenshot({ path: 'test-results/mobile-actions.png' });

  await actionsDrawer(page).getByRole('button', { name: 'تغییر تم' }).click();
  await expect(actionsDrawer(page)).toBeVisible();

  await actionsDrawer(page).getByRole('button', { name: /خروج/ }).click();
  await expect(actionsDrawer(page)).toBeHidden();
  await expect(
    page.getByText('آیا از خروج از سامانه اطمینان دارید؟', { exact: false }),
  ).toBeVisible();
});

test('session-expired modal (401) closes open drawers and stays on top', async ({ page }) => {
  await login(page);
  await page.getByRole('button', { name: 'منو' }).click();
  await expect(menuDrawer(page)).toBeVisible();

  // با دراور باز، صفحه شرکت‌ها (بدون کلیک روی منو) باز می‌شود و سرویس آن ۴۰۱ می‌گیرد
  await page.evaluate(() =>
    localStorage.setItem('mock-fail-once', '401:facility-management/Companies'),
  );
  await page.evaluate(
    "history.pushState({}, '', '/companies'); dispatchEvent(new PopStateEvent('popstate'))",
  );

  const modal = page.getByRole('dialog', { name: 'پایان نشست' });
  await expect(modal).toBeVisible();
  await expect(menuDrawer(page)).toBeHidden();
  await modal.getByRole('button', { name: 'متوجه شدم' }).click();
  await expect(page).toHaveURL(/\/login$/);
});

test('signed-in user changes their own password from the actions drawer', async ({ page }) => {
  await login(page);
  await page.getByRole('button', { name: 'سایر گزینه‌ها' }).click();
  await actionsDrawer(page)
    .getByRole('button', { name: /تغییر رمز عبور/ })
    .click();
  const dialog = page.getByRole('dialog', { name: 'تغییر رمز عبور' });
  await dialog.getByLabel('رمز عبور فعلی').fill('updated-admin-password1');
  await dialog.getByLabel('رمز عبور جدید', { exact: true }).fill('updated-admin-password1');
  await expect(dialog.getByText('رمز عبور جدید باید با رمز فعلی متفاوت باشد.')).toBeVisible();
  await dialog.getByLabel('رمز عبور فعلی').fill('wrong');
  await dialog.getByLabel('رمز عبور جدید', { exact: true }).fill('second-admin-password1');
  await dialog.getByLabel('تکرار رمز عبور جدید').fill('second-admin-password1');
  await dialog.getByRole('button', { name: 'ثبت رمز جدید' }).click();
  await expect(page.getByText('رمز عبور نامعتبر است.')).toBeVisible();
  await dialog.getByLabel('رمز عبور فعلی').fill('updated-admin-password1');
  await dialog.getByRole('button', { name: 'ثبت رمز جدید' }).click();
  await expect(dialog).toBeHidden();
  await expect(page).toHaveURL(/\/login$/);
  expect((await page.context().cookies()).some(({ name }) => name === 'sana_token')).toBe(false);
  await page.goto('/users');
  await expect(page).toHaveURL(/\/login$/);
});

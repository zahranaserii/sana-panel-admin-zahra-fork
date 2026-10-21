import { expect, test, type Page } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 } });

const login = async (page: Page) => {
  await page.goto('/login');
  await page.getByLabel('نام کاربری').fill('admin');
  await page.getByLabel('رمز عبور').fill('admin');
  await page.getByRole('button', { name: /ورود/ }).click();
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
  await page.clock.install();
  await login(page);
  await page.getByRole('button', { name: 'منو' }).click();
  await expect(menuDrawer(page)).toBeVisible();

  // درخواست بعدی تعداد در انتظار (هر ۶۰ ثانیه) ۴۰۱ می‌گیرد
  await page.evaluate(() => localStorage.setItem('mock-fail-once', '401:Approvals/PendingCounts'));
  await page.clock.fastForward(61_000);

  const modal = page.getByRole('dialog', { name: 'پایان نشست' });
  await expect(modal).toBeVisible();
  await expect(menuDrawer(page)).toBeHidden();
  await modal.getByRole('button', { name: 'متوجه شدم' }).click();
  await expect(page).toHaveURL(/\/login$/);
});

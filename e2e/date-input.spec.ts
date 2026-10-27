import { expect, test } from '@playwright/test';

test('hire-date pickers in loan allocation keep the month the user navigated to', async ({
  page,
}) => {
  await page.goto('/login');
  await page.getByLabel('نام کاربری').fill('admin');
  await page.getByLabel('رمز عبور').fill('admin');
  await page.getByRole('button', { name: /ورود/ }).click();
  await expect(page.getByRole('navigation')).toBeVisible();
  await page.goto('/credit?companyId=1&date=2026-11-03');
  await expect(page.getByLabel('از تاریخ استخدام')).toBeVisible();

  for (const label of ['از تاریخ استخدام', 'تا تاریخ استخدام']) {
    await page.getByLabel(label).click();
    const calendar = page.locator('.rmdp-wrapper:visible');
    const header = calendar.locator('.rmdp-header-values');
    const before = await header.innerText();
    await calendar.locator('.rmdp-arrow-container.rmdp-left').click();
    await expect(header).not.toHaveText(before);
    const navigated = await header.innerText();
    // قبلاً با هر رندر صفحه (هر ۴۰۰ میلی‌ثانیه) تقویم به ماه جاری برمی‌گشت؛ باید زمان بگذرد تا ثابت ماندن دیده شود
    // eslint-disable-next-line sonarjs/no-fixed-wait-in-tests
    await page.waitForTimeout(1500);
    await expect(header).toHaveText(navigated);
    await page.keyboard.press('Escape');
    await page.locator('body').click({ position: { x: 5, y: 5 } });
  }
});

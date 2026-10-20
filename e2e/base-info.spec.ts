import { expect, test } from '@playwright/test';

test('base info: list, edit keeps the usable table, open create form', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('نام کاربری').fill('admin');
  await page.getByLabel('رمز عبور').fill('admin');
  await page.getByRole('button', { name: /ورود/ }).click();
  await expect(page.getByRole('navigation')).toBeVisible();
  await page.locator('nav a[href="/base-info"]').click();
  await expect(page.getByRole('cell', { name: 'نگین میثاق' })).toBeVisible();
  await expect(page.getByText('NM-01')).toBeVisible();
  await page
    .getByRole('button', { name: /ویرایش/ })
    .first()
    .click();
  await expect(page.getByLabel('نام طرح')).toHaveValue('نگین میثاق');
  await expect(page.getByLabel('۱۲ ماه - قرض‌الحسنه (۴٪)')).toHaveValue(/[8۸]/);
  await page.getByLabel('نام طرح').fill('نگین میثاق ۲');
  await page.getByRole('button', { name: 'ذخیره تغییرات' }).click();
  await expect(page.getByText('طرح «نگین میثاق ۲» ویرایش شد.')).toBeVisible();
  await expect(page.getByRole('cell', { name: 'نگین میثاق ۲' })).toBeVisible();
  // بعد از ذخیره، جدول درصد قابل استفاده دست نخورده می‌ماند
  await page
    .getByRole('button', { name: /ویرایش/ })
    .first()
    .click();
  await expect(page.getByLabel('۲۴ ماه - مرابحه ۱۰٪')).toHaveValue(/10|۱۰/);
  await page.getByRole('button', { name: /بازگشت/ }).click();
  await page.getByRole('button', { name: /افزودن طرح/ }).click();
  await expect(page.getByText('افزودن طرح').first()).toBeVisible();
});

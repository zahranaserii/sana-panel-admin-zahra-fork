import { expect, test } from '@playwright/test';

test('tables: row numbers, total on the right, page size on the left, 10-row body height', async ({
  page,
}) => {
  await page.goto('/login');
  await page.getByLabel('نام کاربری').fill('admin');
  await page.getByLabel('رمز عبور').fill('admin');
  await page.getByRole('button', { name: /ورود/ }).click();
  await expect(page.getByRole('navigation')).toBeVisible();
  await page.goto('/companies');

  const table = page.locator('.sana-table').first();
  await expect(table.getByRole('columnheader', { name: 'ردیف' })).toBeVisible();
  await expect(table.locator('.ant-table-tbody tr.ant-table-row').first()).toContainText('۱');
  const body = table.locator('.ant-table-body');
  await expect(body).toHaveCSS('max-height', '570px');

  const total = page.getByText(/تعداد کل:/);
  const sizer = page.getByText('۱۰ در صفحه');
  await expect(total).toBeVisible();
  await expect(sizer).toBeVisible();
  // راست‌چین: تعداد کل سمت راست و انتخاب تعداد سمت چپ
  const [totalBox, sizerBox] = [await total.boundingBox(), await sizer.boundingBox()];
  expect(totalBox!.x).toBeGreaterThan(sizerBox!.x);

  await sizer.click();
  await page.getByTitle('۲۰ در صفحه').click();
  // مقدار انتخاب‌شده (گزینه‌های بسته‌شده لیست دیده نمی‌شوند)
  await expect(page.getByText('۱۰ در صفحه').filter({ visible: true })).toHaveCount(0);
  await expect(page.getByText('۲۰ در صفحه').filter({ visible: true })).toHaveCount(1);
});

test('company select: with more than one company nothing is preselected', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('نام کاربری').fill('admin');
  await page.getByLabel('رمز عبور').fill('admin');
  await page.getByRole('button', { name: /ورود/ }).click();
  await expect(page.getByRole('navigation')).toBeVisible();
  await page.goto('/staff');
  // ماک دو شرکت فعال دارد
  await expect(page.getByText('انتخاب شرکت').filter({ visible: true }).last()).toBeVisible();
  await expect(page).not.toHaveURL(/companyId=/);
  await expect(page.getByText('پرسنل شرکت', { exact: true })).toHaveCount(0);
});

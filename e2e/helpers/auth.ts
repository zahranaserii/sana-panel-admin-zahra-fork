import { type Page } from '@playwright/test';

export const otpInputs = (page: Page) =>
  page.getByRole('group', { name: 'کد یک‌بارمصرف' }).getByRole('textbox');

export const completeMockOtp = async (page: Page, code = '123456') => {
  await otpInputs(page).first().fill(code);
  await page.getByRole('button', { name: 'تأیید و ورود' }).click();
};

export const changeInitialAdminPassword = async (page: Page) => {
  const dialog = page.getByRole('dialog', { name: 'تغییر رمز عبور' });
  await dialog.getByLabel('رمز عبور جدید', { exact: true }).fill('updated-admin-password1');
  await dialog.getByLabel('تکرار رمز عبور جدید').fill('updated-admin-password1');
  await dialog.getByRole('button', { name: 'ثبت رمز جدید' }).click();
  await dialog.waitFor({ state: 'hidden' });
  await page.getByLabel('رمز عبور').fill('updated-admin-password1');
  await page.getByLabel('کد امنیتی').fill('24125');
  await page.getByRole('main').getByRole('button', { name: /ورود/ }).click();
};

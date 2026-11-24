import { type Page } from '@playwright/test';

export const otpInputs = (page: Page) =>
  page.getByRole('group', { name: 'کد یک‌بارمصرف' }).getByRole('textbox');

export const completeMockOtp = async (page: Page, code = '123456') => {
  await otpInputs(page).first().fill(code);
  await page.getByRole('button', { name: 'تأیید و ورود' }).click();
};

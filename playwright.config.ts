import { defineConfig, devices } from '@playwright/test';

// سرور توسعه با HTTPS=true در .env.development روی https و گواهی self-signed اجرا می‌شود
const BASE_URL = 'https://localhost:3005';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: BASE_URL,
    ignoreHTTPSErrors: true,
    locale: 'fa-IR',
    trace: 'on-first-retry',
    // در صورت نیاز مسیر کروم سیستم: PW_CHROMIUM_PATH=/path/to/chrome npm run test:e2e
    launchOptions: {
      executablePath: process.env.PW_CHROMIUM_PATH,
      // برای ثبت Service Worker (MSW) روی گواهی self-signed محیط تست (همراه با HTTPS فعال شود)
      // args: ['--ignore-certificate-errors'],
    },
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev',
    url: BASE_URL,
    ignoreHTTPSErrors: true,
    reuseExistingServer: !process.env.CI,
  },
});

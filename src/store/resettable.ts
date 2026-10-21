/**
 * ریست استورها در خروج و ۴۰۱: هر استوری که دیتای کاربر نگه می‌دارد ریست خودش را اینجا ثبت می‌کند
 * و `resetSession` همه را اجرا می‌کند. (تم تنظیم دستگاه است و ثبت نمی‌شود.)
 */
const resetters = new Set<() => void>();

export const registerReset = (reset: () => void) => {
  resetters.add(reset);
};

export const resetStores = () => resetters.forEach((reset) => reset());

const DEVICE_ID_KEY = 'sana_device_id';

/** شناسه دستگاه: یک بار ساخته و در مرورگر نگه داشته می‌شود */
const getDeviceId = () => {
  try {
    const saved = localStorage.getItem(DEVICE_ID_KEY);
    if (saved) return saved;
    const id = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, id);
    return id;
  } catch {
    return 'unknown';
  }
};

/** هدرهای ثابتی که بک‌اند در همه سرویس‌ها می‌خواهد */
export const getClientHeaders = () => ({
  'x-api-version': '2',
  /** Android: 1 · PWA: 2 (مقداری برای پنل وب تعریف نشده) */
  AppId: '2',
  DeviceTypeId: '1',
  DeviceId: getDeviceId(),
  DeviceInfo: navigator.userAgent,
  AppLanguage: 'fa',
  DeviceVersion: __APP_VERSION__,
});

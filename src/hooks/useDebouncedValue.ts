import { useEffect, useState } from 'react';

/**
 * مقدار با تأخیر (برای فراخوانی سرویس بعد از توقف تایپ کاربر).
 * تغییر با محتوا سنجیده می‌شود نه ارجاع؛ وگرنه شیئی که هر رندر از نو ساخته می‌شود
 * (مثل بدنه درخواست) هر ۴۰۰ میلی‌ثانیه یک رندر جدید می‌سازد و این چرخه تمام نمی‌شود.
 */
export const useDebouncedValue = <T>(value: T, delay = 400) => {
  const [debounced, setDebounced] = useState(value);
  const key = JSON.stringify(value) as string | undefined;

  useEffect(() => {
    const timer = setTimeout(
      () => setDebounced(key === undefined ? (undefined as T) : (JSON.parse(key) as T)),
      delay,
    );
    return () => clearTimeout(timer);
  }, [key, delay]);

  return debounced;
};

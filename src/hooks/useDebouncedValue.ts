import { useEffect, useState } from 'react';

/** مقدار با تأخیر (برای فراخوانی سرویس بعد از توقف تایپ کاربر) */
export const useDebouncedValue = <T>(value: T, delay = 400) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};

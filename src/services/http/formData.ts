const appendValue = (formData: FormData, key: string, value: unknown) => {
  if (value === undefined || value === null) return;
  if (value instanceof Blob) {
    formData.append(key, value);
  } else if (Array.isArray(value)) {
    // آرایه ساده (عدد، متن، فایل) با کلید تکراری؛ آرایه شیء با اندیس: Months[0].month
    value.forEach((item, index) =>
      item !== null && typeof item === 'object' && !(item instanceof Blob)
        ? appendValue(formData, `${key}[${index}]`, item)
        : appendValue(formData, key, item),
    );
  } else if (typeof value === 'object') {
    Object.entries(value).forEach(([field, item]) =>
      appendValue(formData, `${key}.${field}`, item),
    );
  } else {
    formData.append(key, String(value as string | number | boolean));
  }
};

/**
 * mutator بدنه multipart سرویس‌های تولیدشده، با قرارداد Model Binding فرم در ASP.NET.
 * Orval آیتم‌های شیء داخل آرایه را JSON می‌فرستد که بک‌اند ([FromForm]) آن را نمی‌خواند.
 * مقدار null/undefined ارسال نمی‌شود (در بک‌اند null می‌شود).
 */
export const toAspNetFormData = (body?: object): FormData => {
  const formData = new FormData();
  Object.entries(body ?? {}).forEach(([key, value]) => appendValue(formData, key, value));
  return formData;
};

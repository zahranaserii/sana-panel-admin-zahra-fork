/** مقدار خالی: undefined، null، رشته خالی یا آرایه خالی */
export const isEmptyValue = (value: unknown) =>
  value === undefined ||
  value === null ||
  value === '' ||
  (Array.isArray(value) && value.length === 0);

/** حذف کلیدهایی که مقدارشان خالی است */
export const removeEmpty = <T>(values: T) =>
  Object.fromEntries(
    Object.entries(values as Record<string, unknown>).filter(([, value]) => !isEmptyValue(value)),
  ) as Partial<T>;

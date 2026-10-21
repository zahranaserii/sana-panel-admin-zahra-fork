import { Select, type SelectProps } from 'antd';

export interface SelectInputProps<V = unknown> extends SelectProps<V> {
  /**
   * فراخوانی دوباره سرویس گزینه‌ها؛ اگر گزینه‌ای نباشد (خطا یا لیست خالی)
   * با باز کردن سلکت سرویس دوباره صدا زده می‌شود.
   */
  onRetry?: () => void;
  /** خطای سرویس گزینه‌ها؛ برای سلکت‌هایی که گزینه ثابت (مثل «همه») دارند */
  error?: boolean;
}

export const SelectInput = <V = unknown,>({
  placeholder = 'انتخاب کنید',
  allowClear = true,
  showSearch = { optionFilterProp: 'label' },
  notFoundContent = 'موردی یافت نشد',
  onRetry,
  error = false,
  onOpenChange,
  ...rest
}: SelectInputProps<V>) => (
  <Select<V>
    placeholder={placeholder}
    allowClear={allowClear}
    showSearch={showSearch}
    notFoundContent={notFoundContent}
    onOpenChange={(open) => {
      if (open && !rest.loading && (error || !rest.options?.length)) onRetry?.();
      onOpenChange?.(open);
    }}
    {...rest}
  />
);

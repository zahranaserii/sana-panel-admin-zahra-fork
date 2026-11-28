import { useState } from 'react';
import { normalizeText, selectSearchPattern } from '@/utils/inputRules';
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
}: SelectInputProps<V>) => {
  const [search, setSearch] = useState('');
  const options = typeof showSearch === 'object' ? showSearch : {};
  return (
    <Select<V>
      placeholder={placeholder}
      allowClear={allowClear}
      showSearch={
        showSearch && {
          ...options,
          searchValue: options.searchValue ?? search,
          onSearch: (input) => {
            const value = normalizeText(input);
            if (selectSearchPattern.test(value)) {
              setSearch(value);
              options.onSearch?.(value);
            }
          },
        }
      }
      notFoundContent={notFoundContent}
      onOpenChange={(open) => {
        if (!open) setSearch('');
        if (open && !rest.loading && (error || !rest.options?.length)) onRetry?.();
        onOpenChange?.(open);
      }}
      {...rest}
    />
  );
};

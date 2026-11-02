import { useState } from 'react';

import { DEFAULT_PAGE_SIZE } from './useTablePagination';

/**
 * صفحه و تعداد در صفحه برای جدول‌های با صفحه‌بندی سمت سرور.
 * فقط state همان صفحه است و ذخیره نمی‌شود؛ با تغییر تعداد در صفحه، جدول به صفحه اول برمی‌گردد.
 */
export const usePaging = (initialPageSize = DEFAULT_PAGE_SIZE) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const onPageChange = (nextPage: number, nextSize: number) => {
    setPage(nextSize === pageSize ? nextPage : 1);
    setPageSize(nextSize);
  };

  return { page, pageSize, setPage, onPageChange };
};

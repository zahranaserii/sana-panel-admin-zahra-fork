import { Table as AntTable, type TableProps as AntTableProps } from 'antd';
import { type ColumnsType } from 'antd/es/table';
import { useMemo } from 'react';

import { toPersianDigits } from '@/utils/date';

import { Retry } from '../retry';

import { TablePagination } from './TablePagination';
import { type TablePaginationConfig, useTablePagination } from './useTablePagination';

export interface TableProps<T> extends Omit<AntTableProps<T>, 'pagination'> {
  /** پیش‌فرض غیرفعال؛ با `true` یا آبجکت تنظیمات فعال می‌شود */
  pagination?: boolean | TablePaginationConfig;
  /** حداکثر ارتفاع؛ با عبور از آن اسکرول عمودی با هدر چسبان فعال می‌شود */
  maxHeight?: number;
  /** ستون «ردیف» در ابتدای جدول */
  showRowNumber?: boolean;
  /** خطای سرویس دیتای جدول؛ به‌جای جدول خالی، تلاش مجدد نمایش داده می‌شود */
  error?: boolean;
  /** فراخوانی دوباره سرویس (همراه با error) */
  onRetry?: () => void;
}

const EMPTY: never[] = [];

/**
 * جدول پایه — پشتیبانی از اسکرول افقی/عمودی، expandable، rowSelection، هدر چندسطحی (children در columns)
 * و پجینیشن اختصاصی زیر جدول.
 */
export const Table = <T extends object>({
  pagination = false,
  maxHeight,
  showRowNumber = false,
  dataSource = EMPTY,
  columns = EMPTY,
  scroll,
  size = 'middle',
  className,
  rowKey = 'id',
  error = false,
  onRetry,
  ...rest
}: TableProps<T>) => {
  const page = useTablePagination(pagination, dataSource);

  const mergedColumns = useMemo<ColumnsType<T>>(() => {
    if (!showRowNumber) return columns;
    const rowNumberColumn: ColumnsType<T>[number] = {
      title: 'ردیف',
      key: '__row_number',
      width: 64,
      align: 'center',
      fixed: 'start',
      render: (_value, _record, index) => toPersianDigits(page.offset + index + 1),
    };
    return [rowNumberColumn, ...columns];
  }, [showRowNumber, columns, page.offset]);

  if (error && onRetry) return <Retry loading={Boolean(rest.loading)} onRetry={onRetry} />;

  return (
    <div className="w-full">
      <AntTable<T>
        className={['sana-table', className].filter(Boolean).join(' ')}
        rowKey={rowKey}
        size={size}
        columns={mergedColumns}
        dataSource={page.pageData}
        pagination={false}
        scroll={{ x: 'max-content', y: maxHeight, ...scroll }}
        {...rest}
      />
      {page.config && (
        <TablePagination
          current={page.current}
          pageSize={page.pageSize}
          total={page.total}
          showTotal={page.config.showTotal}
          showSizeChanger={page.config.showSizeChanger}
          pageSizeOptions={page.config.pageSizeOptions}
          disabled={page.config.disabled ?? Boolean(rest.loading)}
          onChange={page.onChange}
        />
      )}
    </div>
  );
};

import { ReloadOutlined } from '@ant-design/icons';
import { type ReactNode } from 'react';

import { Button } from '../button';

export interface RetryProps {
  onRetry: () => void;
  /** در حال فراخوانی دوباره */
  loading?: boolean;
  /** وسط صفحه (به‌جای کل صفحه) */
  fullPage?: boolean;
}

/**
 * جایگزین بخشی که دیتای سرویسش نیامده: متن کوتاه ثابت + تلاش مجدد.
 * پیام خطای بک‌اند با toast نمایش داده می‌شود.
 */
export const Retry = ({ onRetry, loading, fullPage }: RetryProps) => (
  <div
    className={[
      'flex flex-col items-center justify-center gap-3 text-center',
      fullPage ? 'min-h-screen' : 'py-10',
    ].join(' ')}
  >
    <p className="m-0 text-[13px] text-ink-soft">اطلاعات دریافت نشد.</p>
    <Button variant="outline" icon={<ReloadOutlined />} loading={loading} onClick={onRetry}>
      تلاش مجدد
    </Button>
  </div>
);

interface QueryStateProps {
  /** وضعیت سرویس (خروجی useQuery) */
  query: { isError: boolean; isFetching: boolean; refetch: () => unknown };
  children: ReactNode;
}

/** با خطای سرویس به‌جای محتوا (نمودار، کارت‌ها، …) تلاش مجدد نمایش داده می‌شود */
export const QueryState = ({ query, children }: QueryStateProps) =>
  query.isError ? (
    <Retry loading={query.isFetching} onRetry={() => void query.refetch()} />
  ) : (
    children
  );

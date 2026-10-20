import { NoticeCard } from '@/component/card';

import { type LoanPreview } from '../types';
import { noticeOf, repeatList } from '../utils';

/** پیام‌های سرویس پیش‌نمایش (مجاز بودن، مجموع مبلغ) و هشدار تخصیص تکراری */
export const PreviewNotices = ({ preview }: { preview?: LoanPreview }) => {
  const repeats = preview?.repeatAllocations ?? [];
  return (
    <>
      {preview?.messages?.map((hint) => (
        <NoticeCard key={hint.text} type={noticeOf(hint)} className="mt-3">
          {hint.text}
        </NoticeCard>
      ))}
      {repeats.length > 0 && (
        <NoticeCard type="warning" className="mt-3">
          برای برخی از پرسنل انتخاب‌شده در همین ماه وام تخصیص داده شده است:
          {repeatList(repeats)}
        </NoticeCard>
      )}
    </>
  );
};

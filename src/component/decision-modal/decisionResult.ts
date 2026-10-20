import { type HookAPI } from 'antd/es/modal/useModal';
import { createElement } from 'react';
import { toast } from 'sonner';

import { toPersianDigits } from '@/utils/date';

import { type DecisionRequestInfo } from './DecisionModal';

/** نتیجه تصمیم گروهی: اجرای ناقص مجاز است و ردیف‌های انجام‌نشده با دلیل برمی‌گردند */
export interface DecisionResult {
  processed: number;
  skipped: { requestId: string; reason: string }[];
}

/**
 * پیام نتیجه تصمیم: تعداد انجام‌شده با توست و ردیف‌های انجام‌نشده (اگر باشد) در یک مودال با دلیل هرکدام.
 */
export const showDecisionResult = (
  modal: HookAPI,
  result: DecisionResult,
  requests: DecisionRequestInfo[],
  doneText: string,
) => {
  if (result.processed) toast.success(`${toPersianDigits(result.processed)} درخواست ${doneText}.`);
  if (!result.skipped.length) return;
  const nameOf = (id: string) => requests.find((item) => item.id === id)?.staffName ?? id;
  modal.warning({
    title: `${toPersianDigits(result.skipped.length)} درخواست انجام نشد`,
    width: 520,
    okText: 'متوجه شدم',
    content: createElement(
      'ul',
      { className: 'm-0 ps-5 text-[13px] leading-8' },
      result.skipped.map((item) =>
        createElement('li', { key: item.requestId }, `${nameOf(item.requestId)}: ${item.reason}`),
      ),
    ),
  });
};

import {
  type CreateLoanRequestsCommand,
  type ReadModelsLoanRequestItemInput,
} from '@/api/generated/facility/facilityPanelAPI.schemas';
import { createElement } from 'react';

import { type NoticeType } from '@/component/card';
import { toPersianDigits } from '@/utils/date';
import { formatRial } from '@/utils/number';

import { type Hint, type LoanRequestFormValues, type RepeatAllocation } from './types';

/** حالت تخصیص بک‌اند (allocationMode) */
export const ALLOCATION_MODE = { FIXED: 1, VARIABLE: 2 } as const;

const toAmount = (value?: string) => Number(value ?? 0) || 0;

/** آیتم‌های درخواست (ترتیب پرداخت هر ردیف؛ مبلغ فقط در حالت مبلغ متفاوت) */
export const buildRequestItems = (
  values: LoanRequestFormValues,
  personnelIds: number[],
): ReadModelsLoanRequestItemInput[] =>
  personnelIds.map((personnelId, index) => ({
    personnelId,
    amount:
      values.mode === ALLOCATION_MODE.VARIABLE
        ? toAmount(values.rows?.[personnelId]?.amount)
        : null,
    paymentOrder: values.rows?.[personnelId]?.paymentOrder ?? index + 1,
  }));

/** بدنه پیش‌نمایش و ثبت درخواست */
export const buildLoanBody = (
  values: LoanRequestFormValues,
  personnelIds: number[],
  baseDate: string,
): CreateLoanRequestsCommand => ({
  planId: values.planId ?? 0,
  baseDate,
  mode: values.mode,
  amount: values.mode === ALLOCATION_MODE.FIXED ? toAmount(values.fixedAmount) : null,
  items: buildRequestItems(values, personnelIds),
});

/** سطح پیام بک‌اند (hintLevel: ۱ اطلاع، ۲ موفق، ۳ هشدار، ۴ خطا) → نوع کارت پیام */
const NOTICE: Record<number, NoticeType> = {
  1: 'suggestion',
  2: 'success',
  3: 'warning',
  4: 'error',
};

export const noticeOf = (hint: Hint): NoticeType => NOTICE[hint.level ?? 1] ?? 'suggestion';

/** فهرست پرسنلی که در همین ماه قبلاً وام گرفته‌اند */
export const repeatList = (items: RepeatAllocation[]) =>
  createElement(
    'ul',
    { className: 'm-0 ps-5 text-[13px] leading-8' },
    items.map((item) =>
      createElement(
        'li',
        { key: item.personnelId },
        `${item.personnelName}: قبلاً ${formatRial(item.previousAmount ?? 0)} وام در ماه ${toPersianDigits(item.month ?? '')} تخصیص داده‌اید`,
      ),
    ),
  );

import { type QueryClient } from '@tanstack/react-query';

import { type ReadModelsUsablePercentDto } from '@/api/generated/facility/facilityPanelAPI.schemas';
import { FACILITY } from '@/constant/endpoints';
import { removeEmpty } from '@/utils/object';

import {
  type SaveSchemeCommand,
  type SchemeDetail,
  type SchemeFormValues,
  type SchemeTextList,
} from './types';

/**
 * بعد از تغییر طرح‌ها همه سرویس‌های اطلاعات پایه (لیست، کشویی طرح‌ها، طرح‌ها و دلایل) دوباره خوانده می‌شوند.
 */
export const invalidateBasicInfo = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({
    predicate: (query) => String(query.queryKey[0]).startsWith(`${FACILITY}/BasicInfo`),
  });

/** نوع قرارداد بک‌اند (Lookups/Enums → contractType) */
const QARD_HASAN = 1;
const MURABAHA = 2;

export const TEXT_LISTS: SchemeTextList[] = [
  'contractCancelReasons',
  'loanRejectReasons',
  'remoteGrantDeniedReasons',
  'documentTypes',
  'loanCancelReasons',
  'personnelRejectReasons',
];

/** فرم خالی طرح جدید: هر لیست یک ردیف خالی دارد */
export const EMPTY_VALUES: SchemeFormValues = {
  title: '',
  isActive: true,
  digitalApprovalEnabled: false,
  murabahaRates: [null as never],
  repaymentTermsMonths: [null as never],
  usable: [],
  ...Object.fromEntries(TEXT_LISTS.map((key) => [key, ['']])),
};

/** لیست خالی در فرم هم یک ردیف خالی نمایش می‌دهد */
const withRow = (list: string[]) => (list.length ? list : ['']);

const titles = (reasons: { title?: string }[] = []) =>
  withRow(reasons.map((reason) => reason.title ?? ''));

const findUsable = (
  table: ReadModelsUsablePercentDto[],
  termMonths: number,
  contractType: number,
  rate?: number,
) =>
  table.find(
    (cell) =>
      cell.termMonths === termMonths &&
      cell.contractType === contractType &&
      (rate === undefined || cell.rate === rate),
  )?.usablePercent ?? null;

/** پاسخ BasicInfo/Schemes/{id} → مقادیر فرم */
export const toFormValues = ({
  title,
  code,
  isActive,
  settings = {},
  reasons = {},
}: SchemeDetail) => {
  const terms = settings.repaymentTermsMonths ?? [];
  const rates = settings.murabahaRates ?? [];
  const table = settings.usableTable ?? [];
  const values: SchemeFormValues = {
    title: title ?? '',
    code,
    isActive,
    qardHasanRate: settings.qardHasanRate,
    murabahaRates: rates.length ? rates : [null as never],
    repaymentTermsMonths: terms.length ? terms : [null as never],
    salaryFromSepahMultiplierYes: settings.salaryFromSepahMultiplierYes,
    salaryFromSepahMultiplierNo: settings.salaryFromSepahMultiplierNo,
    contractDurationMonths: settings.contractDurationMonths,
    graceMonthsAfterExpiry: settings.graceMonthsAfterExpiry,
    maxPlansPerCompany: settings.maxPlansPerCompany,
    personnelIntroductionDelayMonths: settings.personnelIntroductionDelayMonths,
    waitingPeriodDays: settings.waitingPeriodDays,
    digitalApprovalEnabled: settings.digitalApprovalEnabled,
    rowVersion: settings.rowVersion,
    usable: terms.map((term) => [
      findUsable(table, term, QARD_HASAN),
      ...rates.map((rate) => findUsable(table, term, MURABAHA, rate)),
    ]),
    contractCancelReasons: titles(reasons.contractCancel),
    loanRejectReasons: titles(reasons.loanReject),
    remoteGrantDeniedReasons: titles(reasons.remoteGrantDenied),
    documentTypes: titles(reasons.documentType),
    loanCancelReasons: titles(reasons.loanCancel),
    personnelRejectReasons: titles(reasons.personnelReject),
  };
  return values;
};

/**
 * مقادیر فرم → SaveSchemeCommand:
 * ماتریس به usableTable تبدیل می‌شود، نوع قراردادها از نرخ‌های واردشده ساخته می‌شود
 * و ردیف‌های خالی لیست‌های متنی حذف می‌شوند.
 */
export const toPayload = ({ usable = [], ...values }: SchemeFormValues): SaveSchemeCommand => {
  const terms = values.repaymentTermsMonths ?? [];
  const rates = values.murabahaRates ?? [];
  const qardHasanRate = values.qardHasanRate ?? null;
  const usableTable = terms.flatMap((termMonths, row) => [
    ...(qardHasanRate === null
      ? []
      : [
          {
            termMonths,
            contractType: QARD_HASAN,
            rate: qardHasanRate,
            usablePercent: usable[row]?.[0] ?? 0,
          },
        ]),
    ...rates.map((rate, column) => ({
      termMonths,
      contractType: MURABAHA,
      rate,
      usablePercent: usable[row]?.[column + 1] ?? 0,
    })),
  ]) as ReadModelsUsablePercentDto[];
  const contractTypes = [
    ...(qardHasanRate === null ? [] : [QARD_HASAN]),
    ...(rates.length ? [MURABAHA] : []),
  ] as SaveSchemeCommand['contractTypes'];

  return {
    ...removeEmpty(values),
    title: values.title.trim(),
    contractTypes,
    usableTable,
    ...Object.fromEntries(
      TEXT_LISTS.map((key) => [
        key,
        (values[key] ?? []).map((item) => item.trim()).filter(Boolean),
      ]),
    ),
  } as SaveSchemeCommand;
};

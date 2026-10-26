import {
  type ReadModelsBasicInfoDto,
  type ReadModelsReasonDto,
  type ReadModelsSchemeFormDto,
  type ReadModelsSchemeReasonsDto,
  type ReadModelsUsablePercentDto,
  type ReasonType,
} from '@/api/generated/facility/facilityPanelAPI.schemas';

/** طرح در دیتابیس ماک — همان مدل بک‌اند (BasicInfo/Schemes/{id}) */
export type MockScheme = Required<
  Pick<ReadModelsSchemeFormDto, 'id' | 'code' | 'title' | 'isActive'>
> & {
  settings: Required<ReadModelsBasicInfoDto>;
  reasons: Required<ReadModelsSchemeReasonsDto>;
};

export type MockReasonKind = keyof ReadModelsSchemeReasonsDto;

/** نوع دلیل بک‌اند به ازای هر لیست */
export const REASON_TYPES: Record<MockReasonKind, ReasonType> = {
  contractCancel: 1,
  loanReject: 2,
  remoteGrantDenied: 3,
  loanCancel: 4,
  personnelReject: 5,
  documentType: 6,
};

let reasonSequence = 0;

export const toReasons = (kind: MockReasonKind, titles: string[]): ReadModelsReasonDto[] =>
  titles.map((title, index) => {
    reasonSequence += 1;
    return {
      id: reasonSequence,
      type: REASON_TYPES[kind],
      title,
      isActive: true,
      sortOrder: index + 1,
    };
  });

/** جدول درصد قابل استفاده از روی ماتریس (ردیف = مدت، ستون اول قرض‌الحسنه، بقیه مرابحه) */
const toUsableTable = (
  terms: number[],
  qardHasanRate: number,
  murabahaRates: number[],
  matrix: number[][],
): ReadModelsUsablePercentDto[] =>
  terms.flatMap((termMonths, row) => [
    { termMonths, contractType: 1, rate: qardHasanRate, usablePercent: matrix[row]?.[0] ?? 0 },
    ...murabahaRates.map((rate, column) => ({
      termMonths,
      contractType: 2 as const,
      rate,
      usablePercent: matrix[row]?.[column + 1] ?? 0,
    })),
  ]);

const TERMS = [12, 24, 36, 48, 60];
const MURABAHA_RATES = [5, 10, 15, 20, 23];

/** طرح‌ها — مقادیر طرح اول از فایل طراحی (docs/design) برداشته شده است */
export const MOCK_SCHEMES: MockScheme[] = [
  {
    id: 1,
    code: 'NM-01',
    title: 'نگین میثاق',
    isActive: true,
    settings: {
      schemeId: 1,
      contractTypes: [1, 2],
      qardHasanRate: 4,
      murabahaRates: MURABAHA_RATES,
      repaymentTermsMonths: TERMS,
      salaryFromSepahMultiplierYes: 1.1,
      salaryFromSepahMultiplierNo: 1,
      contractDurationMonths: 12,
      graceMonthsAfterExpiry: 4,
      maxPlansPerCompany: 5,
      personnelIntroductionDelayMonths: 1,
      waitingPeriodDays: 0,
      usableTable: toUsableTable(TERMS, 4, MURABAHA_RATES, [
        [8, 10, 15, 25, 35, 45],
        [6, 8, 10, 15, 20, 25],
        [5, 6, 8, 10, 15, 20],
        [4, 4, 6, 8, 10, 15],
        [3, 3, 5, 6, 8, 10],
      ]),
      rowVersion: 'AAAAAAAAB9E=',
    },
    reasons: {
      contractCancel: toReasons('contractCancel', [
        'عدم تمدید به درخواست شرکت',
        'لغو قرارداد توسط مدیریت شعب منطقه',
      ]),
      loanReject: toReasons('loanReject', ['عدم کنترل سقف فردی', 'پایین بودن رتبه اعتباری']),
      remoteGrantDenied: toReasons('remoteGrantDenied', [
        'رتبه اعتباری غیرمجاز',
        'عدم کفایت سقف تسهیلات بر اساس اعتبارسنجی',
      ]),
      documentType: toReasons('documentType', ['نامه', 'تصویر بنکو']),
      loanCancel: toReasons('loanCancel', ['انصراف متقاضی']),
      personnelReject: toReasons('personnelReject', ['عدم تطابق اطلاعات پرسنل']),
    },
  },
];

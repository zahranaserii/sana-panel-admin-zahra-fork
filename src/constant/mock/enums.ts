import { type CommonEnumCatalogDto } from '@/api/generated/facility/facilityPanelAPI.schemas';

/**
 * عنوان enumها (Lookups/Enums) برای ماک.
 * ترتیب و عنوان‌ها از توضیحات سوئگر برداشته شده؛ در سرور واقعی همه از بک‌اند می‌آیند.
 */
const values = (titles: string[], requiresReason: number[] = []) =>
  titles.map((title, index) => ({
    value: index + 1,
    name: `Value${index + 1}`,
    title,
    requiresReason: requiresReason.includes(index + 1),
  }));

export const MOCK_ENUMS: Required<CommonEnumCatalogDto> = {
  companyStatus: values(['فعال', 'لغوشده', 'حذف‌شده', 'منقضی‌شده']),
  personnelStatus: values(['در انتظار تأیید مدیر شرکت', 'تأییدشده', 'ردشده', 'حذف‌شده']),
  loanRequestStatus: values([
    'در انتظار تأیید مدیر شرکت',
    'ردشده توسط مدیر شرکت',
    'در انتظار تأیید اعتبارات',
    'تأییدشده',
    'ردشده',
    'در انتظار تأیید شعبهٔ دیجیتال',
    'ردشده توسط شعبهٔ دیجیتال',
    'لغوشده',
  ]),
  postApprovalStage: values(
    [
      'تشکیل پرونده در شعبه',
      'دریافت تسهیلات از امید بانک',
      'دریافت تسهیلات در شعبه',
      'عدم اعطای تسهیلات غیرحضوری',
    ],
    [4],
  ),
  allocationMode: values(['مبلغ یکسان برای همه', 'مبلغ متفاوت برای هر نفر']),
  eligibilityStatus: values([
    'مجاز به ثبت وام',
    'مهلت معرفی پرسنل نرسیده',
    'امروز روز مجاز انتقال اعتبار نیست',
    'قرارداد فعال نیست',
  ]),
  approvalStage: values(['تأیید مدیر شرکت', 'تأیید اعتبارات', 'تأیید شعبهٔ دیجیتال']),
  decisionType: values(['تأیید', 'رد']),
  contractType: values(['قرض‌الحسنه', 'مرابحه']),
  reasonType: values([
    'دلایل لغو قرارداد',
    'دلایل رد درخواست وام',
    'دلایل عدم اعطای تسهیلات غیرحضوری',
    'دلایل لغو درخواست',
    'دلایل رد پرسنل',
    'انواع مستند میانگین موجودی',
  ]),
  changeLogCategory: values([
    'مربوط به شرکت‌ها',
    'مربوط به پرسنل',
    'مربوط به تخصیص وام',
    'مربوط به کاربران و اطلاعات پایه',
  ]),
  companyRankingSort: values(['میانگین موجودی', 'مبلغ وام', 'تعداد درخواست', 'تعداد پرسنل']),
  dashboardExport: values([
    'خروجی شرکت‌ها',
    'خروجی پرسنل همه شرکت‌ها',
    'خروجی همه درخواست‌های وام',
    'خروجی میانگین‌های ماهانه',
    'خروجی شرکت‌های حذف‌شده',
  ]),
  hintLevel: values(['اطلاع', 'موفق', 'هشدار', 'خطا']),
};

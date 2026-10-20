/** پیشوند سرویس‌های تسهیلات در gateway */
export const FACILITY = '/gateway/facility-management';

/** همه آدرس‌های API — سمت بک‌اند فعلاً با ماک (MSW) پاسخ داده می‌شوند */
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/gateway/identity/Authentication/Login',
    LOGOUT: '/gateway/identity/Authentication/Logout',
    /** ساخت کپچا — فعلاً به‌خاطر ایراد زیرساختی بک‌اند استفاده نمی‌شود */
    CAPTCHA: '/gateway/identity/Authentication/Generate',
    /** منوی سایدبار کاربر */
    MAIN_MENU: '/gateway/identity/Authentication/MainMenu',
    /** بکند ندارد — سرویس پروفایل در نسخه بعدی سوئگر منتشر می‌شود */
    PROFILE: '/auth/profile',
  },
  BASE_INFO: {
    /** طرح‌ها (لیست / ایجاد) */
    SCHEMES: '/base-info/schemes',
    SCHEME: (id: string) => `/base-info/schemes/${id}`,
  },
  FILES: {
    UPLOAD: '/files',
  },
  LOOKUPS: {
    CANCEL_REASONS: '/lookups/cancel-reasons',
    REJECT_REASONS: '/lookups/reject-reasons',
    NO_GRANT_REASONS: '/lookups/no-grant-reasons',
    AVG_DOC_TYPES: '/lookups/avg-doc-types',
    /** طرح‌های قابل انتخاب یک طرح کلان (schemeId) */
    PLANS: '/lookups/plans',
    /** کشویی طرح‌های کلان */
    SCHEMES: '/lookups/schemes',
    COMPANIES: '/lookups/companies',
    /** مراحل پس از تأیید اعتبارات */
    POST_APPROVAL_STAGES: '/lookups/post-approval-stages',
    /** بکند ندارد — عنوان دسته‌های گزارش تغییرات */
    AUDIT_LOG_TYPES: '/lookups/audit-log-types',
  },
  COMPANIES: {
    LIST: '/companies',
    DETAIL: (id: string) => `/companies/${id}`,
    CANCEL: (id: string) => `/companies/${id}/cancel`,
    AVERAGES: (id: string) => `/companies/${id}/averages`,
    AVERAGE_DOCS: (id: string) => `/companies/${id}/average-docs`,
  },
  CREDIT: {
    /** وضعیت مجاز بودن شرکت برای تخصیص وام در تاریخ مبنا */
    ELIGIBILITY: (companyId: string) => `/companies/${companyId}/credit/eligibility`,
    /** مانده اعتبار ماه: میانگین‌ها و اعتبار هر طرح */
    SUMMARY: (companyId: string) => `/companies/${companyId}/credit/summary`,
    /** درخواست‌های وام شرکت (لیست / ثبت) */
    LOAN_REQUESTS: (companyId: string) => `/companies/${companyId}/loan-requests`,
  },
  MANAGER_APPROVALS: {
    /** درخواست‌های در انتظار تأیید مدیر شرکت */
    LIST: (companyId: string) => `/companies/${companyId}/manager-approvals`,
    APPROVE: (companyId: string) => `/companies/${companyId}/manager-approvals/approve`,
    REJECT: (companyId: string) => `/companies/${companyId}/manager-approvals/reject`,
  },
  CREDIT_APPROVALS: {
    /** درخواست‌های مرحله تأیید اعتبارات (همه شرکت‌ها یا یک شرکت) */
    LIST: '/credit-approvals',
    APPROVE: '/credit-approvals/approve',
    REJECT: '/credit-approvals/reject',
  },
  DASHBOARD: {
    SUMMARY: '/dashboard/summary',
    REQUEST_STATUS: '/dashboard/request-status',
    PLAN_SHARE: '/dashboard/plan-share',
    COMPANY_CREDIT: '/dashboard/company-credit',
    /** ماه‌هایی که درخواست ثبت شده (برای فیلتر رتبه‌بندی) */
    MONTHS: '/dashboard/months',
    RANKING: '/dashboard/ranking',
    CONTRACTS_BY_MONTH: '/dashboard/contracts-by-month',
    MONTHLY_PERFORMANCE: '/dashboard/monthly-performance',
    REMOVED_COMPANIES: '/dashboard/removed-companies',
  },
  /** خروجی‌های اکسل (فایل از سرور دریافت می‌شود) */
  REPORTS: {
    COMPANIES: '/reports/companies',
    STAFF: '/reports/staff',
    LOAN_REQUESTS: '/reports/loan-requests',
    AVERAGES: '/reports/averages',
    REMOVED_COMPANIES: '/reports/removed-companies',
  },
  CHANGE_LOGS: {
    /** خروجی (لیست و بازگردانی از سرویس‌های تولیدشده) */
    EXPORT: `${FACILITY}/ChangeLogs/Export`,
  },
  USER_MANAGEMENT: {
    /** کاربران پنل: لیست و جزئیات در بک‌اند هست؛ ایجاد/ویرایش/حذف را بکند ندارد */
    USERS: '/gateway/identity/UserManagement/PanelUsers',
    USER: (id: number | string) => `/gateway/identity/UserManagement/PanelUsers/${id}`,
    USER_ACTIVE: (id: number | string) =>
      `/gateway/identity/UserManagement/PanelUsers/${id}/Active`,
    ROLES: '/gateway/identity/UserManagement/Roles',
    ROLE: (id: number | string) => `/gateway/identity/UserManagement/Roles/${id}`,
    ACCESSES: '/gateway/identity/UserManagement/Accesses',
    ACCESS: (id: number | string) => `/gateway/identity/UserManagement/Accesses/${id}`,
    GROUPS: '/gateway/identity/UserManagement/Groups',
    GROUP: (id: number | string) => `/gateway/identity/UserManagement/Groups/${id}`,
    ACCESS_MATRIX: '/gateway/identity/UserManagement/AccessMatrix',
  },
  STAFF: {
    LIST: (companyId: string) => `/companies/${companyId}/staff`,
    DETAIL: (companyId: string, id: string) => `/companies/${companyId}/staff/${id}`,
    /** بارگذاری گروهی پرسنل از فایل اکسل */
    IMPORT: (companyId: string) => `/companies/${companyId}/staff/import`,
    /** فایل نمونه اکسل پرسنل */
    SAMPLE_FILE: '/staff/sample-file',
  },
} as const;

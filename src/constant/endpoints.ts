/** پیشوند سرویس‌های تسهیلات در gateway */
export const FACILITY = '/gateway/facility-management';

/** آدرس‌هایی که سرویس دست‌نویس دارند (بقیه از سرویس‌های تولیدشده @/api/generated) */
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
} as const;

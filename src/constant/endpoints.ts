/** پیشوند سرویس‌های تسهیلات (پیشوند gateway در VITE_API_BASE_URL است) */
export const FACILITY = '/facility-management';

/** آدرس‌هایی که سرویس دست‌نویس دارند (بقیه از سرویس‌های تولیدشده @/api/generated) */
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/identity/Authentication/Login',
    LOGOUT: '/identity/Authentication/Logout',
    /** ساخت کپچا — فعلاً به‌خاطر ایراد زیرساختی بک‌اند استفاده نمی‌شود */
    CAPTCHA: '/identity/Authentication/Generate',
    /** منوی سایدبار کاربر */
    MAIN_MENU: '/identity/Authentication/MainMenu',
  },
  CHANGE_LOGS: {
    /** خروجی (لیست و بازگردانی از سرویس‌های تولیدشده) */
    EXPORT: `${FACILITY}/ChangeLogs/Export`,
  },
  USER_MANAGEMENT: {
    /** کاربران پنل: لیست و جزئیات در بک‌اند هست؛ ایجاد/ویرایش/حذف را بکند ندارد */
    USERS: '/identity/UserManagement/PanelUsers',
    USER: (id: number | string) => `/identity/UserManagement/PanelUsers/${id}`,
    USER_ACTIVE: (id: number | string) => `/identity/UserManagement/PanelUsers/${id}/Active`,
    ROLES: '/identity/UserManagement/Roles',
    ROLE: (id: number | string) => `/identity/UserManagement/Roles/${id}`,
    ACCESSES: '/identity/UserManagement/Accesses',
    ACCESS: (id: number | string) => `/identity/UserManagement/Accesses/${id}`,
    GROUPS: '/identity/UserManagement/Groups',
    GROUP: (id: number | string) => `/identity/UserManagement/Groups/${id}`,
    ACCESS_MATRIX: '/identity/UserManagement/AccessMatrix',
  },
} as const;

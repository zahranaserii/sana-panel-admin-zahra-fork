import { type ComponentType } from 'react';

/** آیتم منو در پاسخ Authentication/MainMenu */
export interface MenuItemDto {
  id: number;
  parentId: number | null;
  title: string;
  enTitle: string | null;
  /** کلید اتصال به صفحه فرانت (مسیر واقعی از router خود ما می‌آید) */
  url: string | null;
  /** در UI استفاده نشده — آیکون از تنظیمات فرانت (constant/menu) می‌آید */
  iconName: string | null;
  actionName: string | null;
  controllerName: string | null;
  isRootMenu: boolean;
  isInternalMenu: boolean;
  creationTime: string;
  isActive: boolean;
}

/** آیتم قابل نمایش در سایدبار */
export interface MenuItem {
  key: string;
  label: string;
  path: string;
  icon: ComponentType;
}

/** گروه سایدبار؛ عنوان خالی = آیتم‌های بدون گروه (مثل خانه) */
export interface MenuGroup {
  key: string;
  title: string;
  items: MenuItem[];
}

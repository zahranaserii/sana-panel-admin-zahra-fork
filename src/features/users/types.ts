import { type PageParams } from '@/types/common';

/**
 * کاربر پنل.
 * ساختار پاسخ PanelUsers در سوئگر تعریف نشده؛ فیلدها از فرانت و Registrar بک‌اند برداشته شده‌اند.
 * رمز عبور هیچ‌وقت از سرور برگردانده نمی‌شود.
 */
export interface User {
  id: number;
  username: string;
  fullName: string;
  userCode: string;
  branchName: string;
  branchCode: string;
  /** نقش کاربر (فعلاً هر کاربر فقط یک نقش دارد) */
  roleId: number | null;
  /** در بک‌اند هست (فعال/غیرفعال کردن کاربر) — در UI استفاده نشده */
  isActive: boolean;
}

/** بدنه ثبت/ویرایش؛ در ویرایش، رمز خالی یعنی رمز قبلی تغییر نکند */
export interface UserPayload extends Omit<User, 'id' | 'isActive'> {
  password?: string;
}

export interface UserListParams extends PageParams {
  term?: string;
}

/** نقش (CreateRoleCommand / UpdateRoleCommand) */
export interface Role {
  id: number;
  kind: number;
  persianTitle: string | null;
  title: string | null;
  description: string | null;
  isActive: boolean;
  accessIds: number[] | null;
  userNames: string[] | null;
}

/** در فرانت استفاده نشده */
export interface RolePayload extends Omit<Role, 'id'> {
  token?: string | null;
}

/** در فرانت استفاده نشده — دسترسی/آیتم منو (CreateAccessCommand / UpdateAccessCommand) */
export interface Access {
  id: number;
  title: string | null;
  enTitle: string | null;
  url: string | null;
  iconName: string | null;
  parentId: number | null;
  description: string | null;
  isActive: boolean;
}

/** در فرانت استفاده نشده */
export type AccessPayload = Omit<Access, 'id'>;

/** در فرانت استفاده نشده — بدنه گروه در سوئگر همان بدنه نقش است */
export type Group = Role;
export type GroupPayload = RolePayload;

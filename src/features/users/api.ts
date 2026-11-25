import { ENDPOINTS } from '@/constant/endpoints';
import { http, type RequestConfig } from '@/services/http';
import { type PageParams, type PaginatedResponse } from '@/types/common';

import {
  type Access,
  type AccessPayload,
  type Group,
  type GroupPayload,
  type Role,
  type RolePayload,
  type User,
  type UserListParams,
  type UserPayload,
} from './types';

const { USER_MANAGEMENT } = ENDPOINTS;

// ---------------- کاربران ----------------

export const getUsers = (params: UserListParams) =>
  http.get<PaginatedResponse<User>>(USER_MANAGEMENT.USERS, { params });

export const getUser = (id: number) => http.get<User>(USER_MANAGEMENT.USER(id));

export const createUser = ({ roleId, ...body }: UserPayload, config?: RequestConfig) =>
  http.post(USER_MANAGEMENT.USERS, { ...body, roleIds: roleId === null ? [] : [roleId] }, config);

export const updateUser = async (
  user: User,
  { roleId, password, ...body }: UserPayload,
  config?: RequestConfig,
) => {
  const id = user.id;
  const url = USER_MANAGEMENT.USER(id);
  const silentSuccess = { ...config, successToast: false };
  const roleChanged = roleId !== (user.roles[0]?.roleId ?? null);
  await http.put(
    url,
    { ...body, id, email: user.email },
    roleChanged || password ? silentSuccess : config,
  );
  if (roleChanged)
    await http.put(
      url + '/Roles',
      { id, roleId, roleIds: roleId === null ? [] : [roleId], companyId: user.companyId },
      password ? silentSuccess : config,
    );
  if (password) await http.post(url + '/ResetPassword', { id, newPassword: password }, config);
};

export const deleteUser = (id: number) => http.delete<void>(USER_MANAGEMENT.USER(id));

/** در فرانت استفاده نشده */
export const setUserActive = (id: number, isActive: boolean) =>
  http.put<void>(USER_MANAGEMENT.USER_ACTIVE(id), undefined, { params: { isActive } });

// ---------------- نقش‌ها ----------------

/** برای سلکت نقش در فرم کاربر */
export const getRoles = (params: PageParams & { term?: string }) =>
  http.get<PaginatedResponse<Role>>(USER_MANAGEMENT.ROLES, { params });

/** در فرانت استفاده نشده */
export const getRole = (id: number) => http.get<Role>(USER_MANAGEMENT.ROLE(id));

/** در فرانت استفاده نشده */
export const createRole = (body: RolePayload) =>
  http.post<Role, RolePayload>(USER_MANAGEMENT.ROLES, body);

/** در فرانت استفاده نشده */
export const updateRole = (id: number, body: RolePayload) =>
  http.put<Role, RolePayload & { id: number }>(USER_MANAGEMENT.ROLE(id), { ...body, id });

// ---------------- دسترسی‌ها ----------------

/** در فرانت استفاده نشده */
export const getAccesses = (params: PageParams & { term?: string }) =>
  http.get<PaginatedResponse<Access>>(USER_MANAGEMENT.ACCESSES, { params });

/** در فرانت استفاده نشده */
export const getAccess = (id: number) => http.get<Access>(USER_MANAGEMENT.ACCESS(id));

/** در فرانت استفاده نشده */
export const createAccess = (body: AccessPayload) =>
  http.post<Access, AccessPayload>(USER_MANAGEMENT.ACCESSES, body);

/** در فرانت استفاده نشده */
export const updateAccess = (id: number, body: AccessPayload) =>
  http.put<Access, AccessPayload & { id: number }>(USER_MANAGEMENT.ACCESS(id), { ...body, id });

// ---------------- گروه‌ها ----------------

/** در فرانت استفاده نشده */
export const getGroups = (params: PageParams & { term?: string }) =>
  http.get<PaginatedResponse<Group>>(USER_MANAGEMENT.GROUPS, { params });

/** در فرانت استفاده نشده */
export const getGroup = (id: number) => http.get<Group>(USER_MANAGEMENT.GROUP(id));

/** در فرانت استفاده نشده */
export const createGroup = (body: GroupPayload) =>
  http.post<Group, GroupPayload>(USER_MANAGEMENT.GROUPS, body);

/** در فرانت استفاده نشده */
export const updateGroup = (id: number, body: GroupPayload) =>
  http.put<Group, GroupPayload & { id: number }>(USER_MANAGEMENT.GROUP(id), { ...body, id });

// ---------------- ماتریس دسترسی ----------------

/** در فرانت استفاده نشده — ساختار پاسخ در سوئگر تعریف نشده */
export const getAccessMatrix = () => http.get<unknown>(USER_MANAGEMENT.ACCESS_MATRIX);

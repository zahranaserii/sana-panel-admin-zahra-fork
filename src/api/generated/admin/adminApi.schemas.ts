/**
 * تولید خودکار با Orval از روی OpenAPI — دستی ویرایش نشود (npm run api:generate)
 */
export interface ChangeOwnPasswordRequest {
  /** @nullable */
  currentPassword?: string | null;
  /** @nullable */
  newPassword?: string | null;
}

export interface CreateAccessCommand {
  /** @nullable */
  title?: string | null;
  /** @nullable */
  enTitle?: string | null;
  /** @nullable */
  url?: string | null;
  /** @nullable */
  iconName?: string | null;
  /** @nullable */
  parentId?: number | null;
  /** @nullable */
  description?: string | null;
  isActive?: boolean;
}

export interface CreatePanelUserCommand {
  /** @nullable */
  userName?: string | null;
  /** @nullable */
  password?: string | null;
  /** @nullable */
  fullName?: string | null;
  /** @nullable */
  userCode?: string | null;
  /** @nullable */
  branchCode?: string | null;
  /** @nullable */
  branchName?: string | null;
  /** @nullable */
  companyId?: string | null;
  /** @nullable */
  mobileNumber?: string | null;
  /** @nullable */
  nationalCode?: string | null;
  /** @nullable */
  email?: string | null;
  /** @nullable */
  roleIds?: number[] | null;
}

export interface CreateRoleCommand {
  kind?: number;
  /** @nullable */
  persianTitle?: string | null;
  /** @nullable */
  title?: string | null;
  /** @nullable */
  description?: string | null;
  isActive?: boolean;
  /** @nullable */
  accessIds?: number[] | null;
  /** @nullable */
  userNames?: string[] | null;
  /** @nullable */
  token?: string | null;
}

export interface LoginChangePasswordCommand {
  /** @nullable */
  otpTracker?: string | null;
  /** @nullable */
  newPassword?: string | null;
}

export interface LoginOtpQuery {
  /** @nullable */
  otpTracker?: string | null;
  /** @nullable */
  code?: string | null;
}

export interface LoginQuery {
  /** @nullable */
  username?: string | null;
  /** @nullable */
  password?: string | null;
  captchaToken?: string;
  /** @nullable */
  captchaValue?: string | null;
}

export interface ResendLoginOtpCommand {
  /** @nullable */
  otpTracker?: string | null;
}

export interface ResetPanelUserPasswordCommand {
  id?: number;
  /** @nullable */
  newPassword?: string | null;
}

export interface ResolveRequest {
  /** @nullable */
  token?: string | null;
}

export interface UpdateAccessCommand {
  id?: number;
  /** @nullable */
  title?: string | null;
  /** @nullable */
  enTitle?: string | null;
  /** @nullable */
  url?: string | null;
  /** @nullable */
  iconName?: string | null;
  /** @nullable */
  parentId?: number | null;
  /** @nullable */
  description?: string | null;
  isActive?: boolean;
}

export interface UpdatePanelUserCommand {
  id?: number;
  /** @nullable */
  fullName?: string | null;
  /** @nullable */
  userCode?: string | null;
  /** @nullable */
  branchCode?: string | null;
  /** @nullable */
  branchName?: string | null;
  /** @nullable */
  email?: string | null;
  /** @nullable */
  userName?: string | null;
  /** @nullable */
  nationalCode?: string | null;
  /** @nullable */
  mobileNumber?: string | null;
}

export interface UpdatePanelUserRolesCommand {
  id?: number;
  /** @nullable */
  roleIds?: number[] | null;
  /** @nullable */
  companyId?: string | null;
  /** @nullable */
  roleId?: number | null;
}

export interface UpdateRoleCommand {
  id?: number;
  kind?: number;
  /** @nullable */
  persianTitle?: string | null;
  /** @nullable */
  title?: string | null;
  /** @nullable */
  description?: string | null;
  isActive?: boolean;
  /** @nullable */
  accessIds?: number[] | null;
  /** @nullable */
  userNames?: string[] | null;
}

export type AuthenticationLogoutGetParams = {
Token?: string;
};

export type UserManagementAccessesGetParams = {
term?: string;
page?: number;
pageSize?: number;
};

export type UserManagementRolesGetParams = {
term?: string;
page?: number;
pageSize?: number;
};

export type UserManagementGroupsGetParams = {
term?: string;
page?: number;
pageSize?: number;
};

export type UserManagementPanelUsersGetParams = {
term?: string;
page?: number;
pageSize?: number;
};

export type UserManagementPanelUsersByIdActivePutParams = {
isActive?: boolean;
};


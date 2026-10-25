/**
 * تولید خودکار با Orval از روی OpenAPI — دستی ویرایش نشود (npm run api:generate)
 */
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

export interface LoginQuery {
  /** @nullable */
  username?: string | null;
  /** @nullable */
  password?: string | null;
  captchaToken?: string;
  /** @nullable */
  captchaValue?: string | null;
}

export interface PanelProfileDto {
  panelUserId?: number;
  /** @nullable */
  userName?: string | null;
  /** @nullable */
  fullName?: string | null;
  /** @nullable */
  userCode?: string | null;
  /** @nullable */
  branchCode?: string | null;
  /** @nullable */
  branchName?: string | null;
  scopeType?: number;
  /** @nullable */
  scopeId?: number | null;
  /** @nullable */
  keys?: string[] | null;
}

export interface PanelProfileDtoApiResponse {
  isSuccess?: boolean;
  statusCode?: number;
  /** @nullable */
  message?: string | null;
  data?: PanelProfileDto;
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


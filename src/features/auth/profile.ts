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

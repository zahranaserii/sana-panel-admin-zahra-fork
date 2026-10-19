import { type MockAuditLog, type SnapshotEntity } from '@/constant/mock';
import { type AuditLogType } from '@/features/change-log/types';

import { db, findUserByToken, nextId } from './db';

/**
 * ثبت لاگ عملیات (شبیه‌ساز بک‌اند): هر ثبت، ویرایش، لغو یا حذف
 * همراه با نام کاربر و زمان ذخیره می‌شود.
 */
export const logAction = (
  request: Request,
  type: AuditLogType,
  details: string,
  snapshot?: { entity: SnapshotEntity; id: string; before: object },
) => {
  const user = findUserByToken(request.headers.get('Authorization'));
  const entry: MockAuditLog = {
    id: nextId('log'),
    createdAt: new Date().toISOString(),
    user: user ? `${user.profile.fullName} (${user.username})` : 'نامشخص',
    type,
    details,
    snapshot: snapshot && { ...snapshot, before: structuredClone(snapshot.before) },
    rolledBack: false,
  };
  db.auditLogs.unshift(entry);
};

/** بازگرداندن موجودیت به وضعیت قبل از ویرایش */
export const restoreSnapshot = ({ entity, id, before }: NonNullable<MockAuditLog['snapshot']>) => {
  const collections = {
    company: db.companies,
    staff: db.staff,
    user: db.users,
    scheme: db.schemes,
  } as const;
  const target = (collections[entity] as { id: string | number }[]).find(
    (item) => String(item.id) === id,
  );
  if (!target) return false;
  Object.assign(target, structuredClone(before));
  return true;
};

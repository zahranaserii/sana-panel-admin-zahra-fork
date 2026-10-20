import { type MockAuditLog, type MockLogType, type SnapshotEntity } from '@/constant/mock';

import { db, registrarOf } from './db';

/**
 * ثبت لاگ عملیات (شبیه‌ساز بک‌اند): هر ثبت، ویرایش، لغو یا حذف
 * همراه با نام کاربر و زمان ذخیره می‌شود.
 */
export const logAction = (
  request: Request,
  type: MockLogType,
  details: string,
  snapshot?: { entity: SnapshotEntity; id: string; before: object },
) => {
  const entry: MockAuditLog = {
    id: Math.max(0, ...db.auditLogs.map((log) => log.id)) + 1,
    createdAt: new Date().toISOString(),
    user: registrarOf(request),
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

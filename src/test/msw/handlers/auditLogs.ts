import ExcelJS from 'exceljs';
import { delay, http, HttpResponse } from 'msw';

import { ENDPOINTS } from '@/constant/endpoints';
import { AUDIT_LOG_TYPES, type MockAuditLog } from '@/constant/mock';
import { dayjs } from '@/utils/date';

import { logAction, restoreSnapshot } from '../audit';
import { db } from '../db';
import { api, json } from '../utils';

const typeTitle = (type: MockAuditLog['type']) =>
  AUDIT_LOG_TYPES.find((item) => item.id === type)?.title.replace('مربوط به ', '') ?? type;

const toItem = (log: MockAuditLog) => ({
  id: log.id,
  createdAt: log.createdAt,
  user: log.user,
  type: log.type,
  typeTitle: typeTitle(log.type),
  details: log.details,
  canRollback: Boolean(log.snapshot) && !log.rolledBack,
  rolledBack: log.rolledBack,
});

const jalaliDateTime = (iso: string) => dayjs(iso).formatJalali('YYYY/MM/DD HH:mm');

export const auditLogHandlers = [
  http.get(api(ENDPOINTS.LOOKUPS.AUDIT_LOG_TYPES), async () => {
    await delay(150);
    return json(AUDIT_LOG_TYPES);
  }),

  http.get(api(ENDPOINTS.AUDIT_LOGS.LIST), async ({ request }) => {
    await delay(250);
    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    const page = Number(url.searchParams.get('page') ?? 1);
    const pageSize = Number(url.searchParams.get('pageSize') ?? 20);
    const list = db.auditLogs.filter((log) => !type || log.type === type);
    const start = (page - 1) * pageSize;
    return json({
      items: list.slice(start, start + pageSize).map(toItem),
      totalCount: list.length,
      page,
      pageSize,
    });
  }),

  http.post(api(ENDPOINTS.AUDIT_LOGS.ROLLBACK(':id')), async ({ params, request }) => {
    await delay(350);
    const log = db.auditLogs.find((item) => item.id === params.id);
    if (!log?.snapshot || log.rolledBack) {
      return json({ message: 'این عملیات اطلاعات کافی برای بازگردانی ندارد.' }, { status: 422 });
    }
    if (!restoreSnapshot(log.snapshot)) {
      return json({ message: 'بازگردانی ناموفق بود؛ این رکورد دیگر وجود ندارد.' }, { status: 409 });
    }
    log.rolledBack = true;
    logAction(request, log.type, `بازگردانی به حالت قبل: ${log.details}`);
    return json(toItem(log));
  }),

  http.get(api(ENDPOINTS.REPORTS.AUDIT_LOGS), async () => {
    await delay(300);
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('گزارش تغییرات', { views: [{ rightToLeft: true }] });
    sheet.addRow(['تاریخ و ساعت', 'کاربر', 'نوع عملیات', 'جزئیات']).font = { bold: true };
    db.auditLogs.forEach((log) =>
      sheet.addRow([jalaliDateTime(log.createdAt), log.user, typeTitle(log.type), log.details]),
    );
    sheet.columns.forEach((column, index) => {
      column.width = index === 3 ? 80 : 24;
    });
    return new HttpResponse(await workbook.xlsx.writeBuffer(), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent('گزارش-تغییرات.xlsx')}`,
      },
    });
  }),
];

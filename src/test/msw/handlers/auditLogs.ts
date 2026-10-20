import ExcelJS from 'exceljs';
import { delay, http, HttpResponse } from 'msw';

import {
  type ChangeLogCategory,
  type CommandResponsesChangeLogItemDto,
  type CommonFacilityPagedResponseOfChangeLogItemDto,
} from '@/api/generated/facility/facilityPanelAPI.schemas';
import { ENDPOINTS, FACILITY } from '@/constant/endpoints';
import { AUDIT_LOG_TYPES, type MockAuditLog, type MockLogType } from '@/constant/mock';
import { dayjs } from '@/utils/date';

import { logAction, restoreSnapshot } from '../audit';
import { db } from '../db';
import { api, json } from '../utils';

const typeTitle = (type: MockAuditLog['type']) =>
  AUDIT_LOG_TYPES.find((item) => item.id === type)?.title.replace('مربوط به ', '') ?? type;

/** دسته بک‌اند: ۱ شرکت، ۲ پرسنل، ۳ وام؛ معنی دسته ۴ در بک‌اند مشخص نیست (کاربران و اطلاعات پایه) */
const CATEGORY: Record<MockLogType, ChangeLogCategory> = {
  company: 1,
  staff: 2,
  loan: 3,
  user: 4,
  base: 4,
};

const toItem = (log: MockAuditLog): CommandResponsesChangeLogItemDto => ({
  id: log.id,
  at: log.createdAt,
  user: log.user,
  category: CATEGORY[log.type],
  action: typeTitle(log.type),
  details: log.details,
  before: log.snapshot ? JSON.stringify(log.snapshot.before) : null,
  after: null,
  companyId: null,
  canRestore: Boolean(log.snapshot) && !log.rolledBack,
  restoredAt: log.restoredAt ?? null,
});

const filterLogs = (url: URL) => {
  const category = Number(url.searchParams.get('Category')) || undefined;
  const panelUserId = Number(url.searchParams.get('PanelUserId')) || undefined;
  return db.auditLogs.filter(
    (log) =>
      (!category || CATEGORY[log.type] === category) &&
      (!panelUserId || log.user.panelUserId === panelUserId),
  );
};

const jalaliDateTime = (iso: string) => dayjs(iso).formatJalali('YYYY/MM/DD HH:mm');

export const auditLogHandlers = [
  http.get(api(`${FACILITY}/ChangeLogs`), async ({ request }) => {
    await delay(250);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('Page') ?? 1);
    const pageSize = Number(url.searchParams.get('PageSize') ?? 20);
    const list = filterLogs(url);
    const start = (page - 1) * pageSize;
    const response: CommonFacilityPagedResponseOfChangeLogItemDto = {
      items: list.slice(start, start + pageSize).map(toItem),
      totalCount: list.length,
      page,
      pageSize,
    };
    return json(response);
  }),

  http.get(api(`${FACILITY}/ChangeLogs/Users`), async () => {
    await delay(150);
    const users = new Map(db.auditLogs.map((log) => [log.user.panelUserId, log.user]));
    return json([...users.values()]);
  }),

  http.post(api(`${FACILITY}/ChangeLogs/:id/Restore`), async ({ params, request }) => {
    await delay(350);
    const { description } = (await request.json()) as { description?: string };
    if (!description?.trim()) {
      return json({ message: 'توضیح بازگردانی الزامی است.' }, { status: 400 });
    }
    const log = db.auditLogs.find((item) => item.id === Number(params.id));
    if (!log?.snapshot || log.rolledBack) {
      return json({ message: 'این عملیات اطلاعات کافی برای بازگردانی ندارد.' }, { status: 422 });
    }
    if (!restoreSnapshot(log.snapshot)) {
      return json({ message: 'بازگردانی ناموفق بود؛ این رکورد دیگر وجود ندارد.' }, { status: 409 });
    }
    log.rolledBack = true;
    log.restoredAt = new Date().toISOString();
    logAction(request, log.type, `بازگردانی به حالت قبل: ${log.details} — ${description.trim()}`);
    return json(toItem(log));
  }),

  http.get(api(ENDPOINTS.CHANGE_LOGS.EXPORT), async ({ request }) => {
    await delay(300);
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('گزارش تغییرات', { views: [{ rightToLeft: true }] });
    sheet.addRow(['تاریخ و ساعت', 'کاربر', 'نوع عملیات', 'جزئیات']).font = { bold: true };
    filterLogs(new URL(request.url)).forEach((log) =>
      sheet.addRow([
        jalaliDateTime(log.createdAt),
        log.user.userName ?? '',
        typeTitle(log.type),
        log.details,
      ]),
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

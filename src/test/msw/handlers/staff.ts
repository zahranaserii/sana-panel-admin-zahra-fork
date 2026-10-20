import ExcelJS from 'exceljs';
import { delay, http, HttpResponse } from 'msw';

import { ENDPOINTS } from '@/constant/endpoints';
import { type MockStaff } from '@/constant/mock';
import { type DeleteStaffPayload, type StaffPayload } from '@/features/staff/types';
import { ISO_DATE_FORMAT, parseJalali, toEnglishDigits } from '@/utils/date';

import { db, nextId } from '../db';
import { api, json } from '../utils';
import { logAction } from '../audit';

const SAMPLE_HEADERS = [
  'نام و نام خانوادگی',
  'کد ملی',
  'موبایل',
  'کد پرسنلی',
  'تاریخ استخدام',
  'اولویت تخصیص',
];
const SAMPLE_ROW = ['علی محمدی', '0012345678', '09121234567', '101', '1403/02/15', 1];

const companyName = (id: string) => db.companies.find((item) => item.id === id)?.name ?? '—';

const notFound = () => json({ message: 'پرسنل یافت نشد.' }, { status: 404 });

const findStaff = (companyId: unknown, id: unknown) =>
  db.staff.find((item) => item.companyId === companyId && item.id === id);

const matchesSearch = (staff: MockStaff, query: string) => {
  if (!query) return true;
  const haystack = [staff.fullName, staff.nationalId, staff.mobile, staff.personnelCode].join(' ');
  return haystack.includes(toEnglishDigits(query));
};

const inHireRange = (staff: MockStaff, from: string | null, to: string | null) =>
  (!from || staff.hireDate >= from) && (!to || staff.hireDate <= to);

const cellText = (value: ExcelJS.CellValue) =>
  toEnglishDigits(String(value instanceof Date ? value.toISOString() : (value ?? ''))).trim();

/** تبدیل یک ردیف اکسل (به ترتیب ستون‌های فایل نمونه) به پرسنل */
const rowToStaff = (row: ExcelJS.Row, companyId: string): MockStaff | null => {
  const [name, nationalId, mobile, code, hire, priority] = [1, 2, 3, 4, 5, 6].map((col) =>
    cellText(row.getCell(col).value),
  );
  if (!name) return null;
  return {
    id: nextId('s'),
    companyId,
    fullName: name,
    nationalId,
    mobile,
    personnelCode: code,
    hireDate: parseJalali(hire)?.format(ISO_DATE_FORMAT) ?? hire.slice(0, 10),
    priority: Number(priority) || 999,
  };
};

const lastPriority = (companyId: string) =>
  Math.max(
    0,
    ...db.staff.filter((item) => item.companyId === companyId).map((item) => item.priority),
  );

export const staffHandlers = [
  http.get(api(ENDPOINTS.STAFF.LIST(':companyId')), async ({ params, request }) => {
    await delay(300);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10);
    const query = url.searchParams.get('q') ?? '';
    const from = url.searchParams.get('hireFrom');
    const to = url.searchParams.get('hireTo');

    const list = db.staff
      .filter((item) => item.companyId === params.companyId)
      .filter((item) => matchesSearch(item, query) && inHireRange(item, from, to))
      .sort((a, b) => a.priority - b.priority);
    const start = (page - 1) * pageSize;
    return json({
      items: list.slice(start, start + pageSize),
      totalCount: list.length,
      page,
      pageSize,
    });
  }),

  http.post(api(ENDPOINTS.STAFF.LIST(':companyId')), async ({ params, request }) => {
    await delay(300);
    const body = (await request.json()) as StaffPayload;
    const companyId = String(params.companyId);
    const staff = {
      ...body,
      id: nextId('s'),
      companyId,
      // اولویت اختیاری است؛ خالی = آخرین اولویت شرکت
      priority: body.priority ?? lastPriority(companyId) + 1,
    };
    db.staff.push(staff);
    logAction(
      request,
      'staff',
      `ثبت پرسنل جدید: ${staff.fullName} (${companyName(staff.companyId)})`,
    );
    return json(staff, { status: 201 });
  }),

  http.get(api(ENDPOINTS.STAFF.DETAIL(':companyId', ':id')), async ({ params }) => {
    await delay(200);
    const staff = findStaff(params.companyId, params.id);
    return staff ? json(staff) : notFound();
  }),

  http.put(api(ENDPOINTS.STAFF.DETAIL(':companyId', ':id')), async ({ params, request }) => {
    await delay(300);
    const staff = findStaff(params.companyId, params.id);
    if (!staff) return notFound();
    const before = structuredClone(staff);
    const body = (await request.json()) as StaffPayload;
    Object.assign(staff, { ...body, priority: body.priority ?? staff.priority });
    logAction(
      request,
      'staff',
      `ویرایش پرسنل: ${staff.fullName} (${companyName(staff.companyId)})`,
      {
        entity: 'staff',
        id: staff.id,
        before,
      },
    );
    return json(staff);
  }),

  http.delete(api(ENDPOINTS.STAFF.DETAIL(':companyId', ':id')), async ({ params, request }) => {
    await delay(250);
    const { description, fileId } = ((await request.json()) ?? {}) as Partial<DeleteStaffPayload>;
    if (!description?.trim() || !fileId) {
      return json({ message: 'توضیحات و فایل مستند حذف الزامی است.' }, { status: 400 });
    }
    const removed = findStaff(params.companyId, params.id);
    db.staff = db.staff.filter(
      (item) => !(item.companyId === params.companyId && item.id === params.id),
    );
    if (removed) {
      logAction(
        request,
        'staff',
        `حذف پرسنل: ${removed.fullName} (${companyName(removed.companyId)}) — ${description.trim()}`,
      );
    }
    return json(null);
  }),

  http.post(api(ENDPOINTS.STAFF.IMPORT(':companyId')), async ({ params, request }) => {
    await delay(500);
    const file = (await request.formData()).get('file');
    if (!(file instanceof File)) {
      return json({ message: 'فایل ارسال نشده است.' }, { status: 400 });
    }
    const workbook = new ExcelJS.Workbook();
    try {
      await workbook.xlsx.load(await file.arrayBuffer());
    } catch {
      return json(
        { message: 'فایل قابل خواندن نیست؛ از فایل نمونه استفاده کنید.' },
        { status: 422 },
      );
    }
    let added = 0;
    workbook.worksheets[0]?.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // ردیف اول عنوان ستون‌هاست
      const staff = rowToStaff(row, String(params.companyId));
      if (!staff) return;
      db.staff.push(staff);
      added += 1;
    });
    logAction(
      request,
      'staff',
      `بارگذاری گروهی ${added} پرسنل از فایل اکسل (${companyName(String(params.companyId))})`,
    );
    return json({ added });
  }),

  http.get(api(ENDPOINTS.STAFF.SAMPLE_FILE), async () => {
    await delay(200);
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('پرسنل', { views: [{ rightToLeft: true }] });
    sheet.addRow(SAMPLE_HEADERS).font = { bold: true };
    sheet.addRow(SAMPLE_ROW);
    sheet.columns.forEach((column) => {
      column.width = 22;
    });
    const buffer = await workbook.xlsx.writeBuffer();
    return new HttpResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent('نمونه-فایل-پرسنل.xlsx')}`,
      },
    });
  }),
];

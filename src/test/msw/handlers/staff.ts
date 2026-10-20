import ExcelJS from 'exceljs';
import { delay, http, HttpResponse } from 'msw';

import {
  type CommonFacilityPagedResponseOfPersonnelListItemDto,
  type CreatePersonnelCommand,
  type DecidePersonnelCommand,
  type ReadModelsPersonnelDetailsDto,
  type ReadModelsPersonnelImportErrorDto,
  type ReadModelsPersonnelImportResultDto,
  type ReadModelsPersonnelListItemDto,
  type UpdatePersonnelCommand,
} from '@/api/generated/facility/facilityPanelAPI.schemas';
import { FACILITY } from '@/constant/endpoints';
import { LOAN_REQUEST_STATUS, PERSONNEL_STATUS, type MockStaff } from '@/constant/mock';
import { ISO_DATE_FORMAT, parseJalali, toEnglishDigits } from '@/utils/date';

import { logAction } from '../audit';
import { activeLoans, db, nextId, reasonTitle, registrarOf } from '../db';
import { api, formText, json } from '../utils';

const SAMPLE_HEADERS = [
  'نام و نام خانوادگی',
  'کد ملی',
  'موبایل',
  'کد پرسنلی',
  'تاریخ استخدام',
  'اولویت تخصیص',
];
const SAMPLE_ROW = ['علی محمدی', '0012345678', '09121234567', '101', '1403/02/15', 1];

/** نتیجه بارگذاری‌های گروهی بر اساس شناسه دسته */
const imports = new Map<number, ReadModelsPersonnelImportResultDto>();

const companyName = (id: number) => db.companies.find((item) => item.id === id)?.name ?? '—';

const notFound = () => json({ message: 'پرسنل یافت نشد.' }, { status: 404 });

const findStaff = (id: unknown) =>
  db.staff.find((item) => String(item.id) === id && item.status !== PERSONNEL_STATUS.DELETED);

/** فردی که در وام استفاده شده قفل است (ویرایش و حذف نمی‌شود) */
const isLocked = (staff: MockStaff) =>
  db.loanRequests.some(
    (item) => item.personnelId === staff.id && activeLoans(staff.companyId).includes(item),
  );

const toListItem = (staff: MockStaff): ReadModelsPersonnelListItemDto => ({
  id: staff.id,
  priority: staff.priority,
  fullName: staff.fullName,
  nationalCode: staff.nationalCode,
  mobile: staff.mobile,
  personnelCode: staff.personnelCode,
  hireDate: staff.hireDate,
  status: staff.status,
  rejectReason: staff.rejectReason,
  createdAt: staff.createdAt,
  decidedAt: staff.decidedAt,
  registrar: staff.registrar,
  isLocked: isLocked(staff),
});

const toDetail = (staff: MockStaff): ReadModelsPersonnelDetailsDto => ({
  id: staff.id,
  companyId: staff.companyId,
  priority: staff.priority,
  fullName: staff.fullName,
  nationalCode: staff.nationalCode,
  mobile: staff.mobile,
  personnelCode: staff.personnelCode,
  hireDate: staff.hireDate,
  status: staff.status,
  isLocked: isLocked(staff),
  history: [],
  rowVersion: staff.rowVersion,
});

const matchesSearch = (staff: MockStaff, term: string) => {
  if (!term) return true;
  const haystack = [staff.fullName, staff.nationalCode, staff.mobile, staff.personnelCode].join(
    ' ',
  );
  return haystack.includes(toEnglishDigits(term));
};

/** پرسنلی که درخواست وام باز دارد برای وام جدید در دسترس نیست */
const hasOpenLoan = (staff: MockStaff) =>
  db.loanRequests.some(
    (item) =>
      item.personnelId === staff.id &&
      [
        LOAN_REQUEST_STATUS.PENDING_MANAGER,
        LOAN_REQUEST_STATUS.PENDING_CREDIT,
        LOAN_REQUEST_STATUS.PENDING_DIGITAL,
      ].includes(item.status as 1 | 3 | 6),
  );

const searchStaff = (companyId: number, url: URL) => {
  const status = Number(url.searchParams.get('Status')) || undefined;
  const term = url.searchParams.get('Term')?.trim() ?? '';
  const from = url.searchParams.get('HireDateFrom');
  const to = url.searchParams.get('HireDateTo');
  const onlyAvailable = url.searchParams.get('OnlyAvailableForLoan') === 'true';
  return db.staff
    .filter(
      (item) =>
        item.companyId === companyId &&
        item.status !== PERSONNEL_STATUS.DELETED &&
        (!status || item.status === status) &&
        matchesSearch(item, term) &&
        (!from || item.hireDate >= from) &&
        (!to || item.hireDate <= to) &&
        (!onlyAvailable || (item.status === PERSONNEL_STATUS.APPROVED && !hasOpenLoan(item))),
    )
    .sort((a, b) => a.priority - b.priority);
};

const lastPriority = (companyId: number) =>
  Math.max(
    0,
    ...db.staff.filter((item) => item.companyId === companyId).map((item) => item.priority),
  );

const invalidStaff = (body: CreatePersonnelCommand, companyId: number, id?: number) => {
  if (!/^\d{10}$/.test(body.nationalCode)) return 'کد ملی باید ۱۰ رقم باشد.';
  if (!/^09\d{9}$/.test(body.mobile)) return 'شماره موبایل معتبر نیست.';
  const duplicate = db.staff.some(
    (item) =>
      item.companyId === companyId &&
      item.id !== id &&
      item.status !== PERSONNEL_STATUS.DELETED &&
      item.nationalCode === body.nationalCode,
  );
  return duplicate ? 'پرسنلی با این کد ملی در این شرکت ثبت شده است.' : null;
};

const newStaff = (
  companyId: number,
  body: CreatePersonnelCommand,
  request: Request,
): MockStaff => ({
  id: nextId(),
  companyId,
  fullName: body.fullName.trim(),
  nationalCode: body.nationalCode,
  mobile: body.mobile,
  personnelCode: body.personnelCode,
  hireDate: body.hireDate,
  // اولویت اختیاری است؛ خالی = آخرین اولویت شرکت
  priority: body.priority ?? lastPriority(companyId) + 1,
  // پرسنل جدید با وضعیت «در انتظار تأیید مدیر شرکت» ثبت می‌شود
  status: PERSONNEL_STATUS.PENDING,
  rejectReason: null,
  createdAt: new Date().toISOString(),
  decidedAt: null,
  registrar: registrarOf(request),
  rowVersion: crypto.randomUUID(),
});

const cellText = (value: ExcelJS.CellValue) =>
  toEnglishDigits(String(value instanceof Date ? value.toISOString() : (value ?? ''))).trim();

/** تبدیل یک ردیف اکسل (به ترتیب ستون‌های فایل نمونه) به بدنه ثبت پرسنل */
const rowToCommand = (row: ExcelJS.Row): CreatePersonnelCommand | null => {
  const [fullName, nationalCode, mobile, personnelCode, hire, priority] = [1, 2, 3, 4, 5, 6].map(
    (col) => cellText(row.getCell(col).value),
  );
  if (!fullName) return null;
  return {
    fullName,
    nationalCode,
    mobile,
    personnelCode,
    hireDate: parseJalali(hire)?.format(ISO_DATE_FORMAT) ?? hire.slice(0, 10),
    priority: Number(priority) || undefined,
  };
};

const importRows = (workbook: ExcelJS.Workbook, companyId: number, request: Request) => {
  const errors: ReadModelsPersonnelImportErrorDto[] = [];
  let totalRows = 0;
  workbook.worksheets[0]?.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // ردیف اول عنوان ستون‌هاست
    const command = rowToCommand(row);
    if (!command) return;
    totalRows += 1;
    const error = invalidStaff(command, companyId);
    if (error) {
      errors.push({ row: rowNumber, message: error });
      return;
    }
    db.staff.push(newStaff(companyId, command, request));
  });
  return { totalRows, errors };
};

export const staffHandlers = [
  http.get(api(`${FACILITY}/Companies/:companyId/Personnel`), async ({ params, request }) => {
    await delay(300);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('Page') ?? 1);
    const pageSize = Number(url.searchParams.get('PageSize') ?? 10);
    const list = searchStaff(Number(params.companyId), url);
    const start = (page - 1) * pageSize;
    const response: CommonFacilityPagedResponseOfPersonnelListItemDto = {
      items: list.slice(start, start + pageSize).map(toListItem),
      totalCount: list.length,
      page,
      pageSize,
    };
    return json(response);
  }),

  http.post(api(`${FACILITY}/Companies/:companyId/Personnel`), async ({ params, request }) => {
    await delay(300);
    const companyId = Number(params.companyId);
    const body = (await request.json()) as CreatePersonnelCommand;
    const error = invalidStaff(body, companyId);
    if (error) return json({ message: error }, { status: 400 });
    const staff = newStaff(companyId, body, request);
    db.staff.push(staff);
    logAction(request, 'staff', `ثبت پرسنل جدید: ${staff.fullName} (${companyName(companyId)})`);
    return json(toDetail(staff));
  }),

  http.get(api(`${FACILITY}/Personnel/Import/Template`), async () => {
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

  http.get(api(`${FACILITY}/Personnel/Import/:batchId`), async ({ params }) => {
    await delay(200);
    const result = imports.get(Number(params.batchId));
    return result ? json(result) : json({ message: 'نتیجه یافت نشد.' }, { status: 404 });
  }),

  http.get(api(`${FACILITY}/Personnel/:id`), async ({ params }) => {
    await delay(200);
    const staff = findStaff(params.id);
    return staff ? json(toDetail(staff)) : notFound();
  }),

  http.put(api(`${FACILITY}/Personnel/:id`), async ({ params, request }) => {
    await delay(300);
    const staff = findStaff(params.id);
    if (!staff) return notFound();
    const body = (await request.json()) as UpdatePersonnelCommand;
    if (body.rowVersion !== staff.rowVersion) {
      return json(
        { message: 'اطلاعات این پرسنل هم‌زمان توسط کاربر دیگری تغییر کرده است.' },
        { status: 409 },
      );
    }
    if (isLocked(staff)) {
      return json({ message: 'این پرسنل در وام استفاده شده و قابل ویرایش نیست.' }, { status: 400 });
    }
    const error = invalidStaff(body, staff.companyId, staff.id);
    if (error) return json({ message: error }, { status: 400 });
    const before = structuredClone(staff);
    // اصلاح فرد ردشده = ارسال دوباره برای تأیید مدیر
    if (staff.status === PERSONNEL_STATUS.REJECTED) {
      staff.status = PERSONNEL_STATUS.PENDING;
      staff.rejectReason = null;
    }
    Object.assign(staff, {
      fullName: body.fullName.trim(),
      nationalCode: body.nationalCode,
      mobile: body.mobile,
      personnelCode: body.personnelCode,
      hireDate: body.hireDate,
      priority: body.priority ?? staff.priority,
      rowVersion: crypto.randomUUID(),
    });
    logAction(
      request,
      'staff',
      `ویرایش پرسنل: ${staff.fullName} (${companyName(staff.companyId)})`,
      { entity: 'staff', id: String(staff.id), before },
    );
    return json(toDetail(staff));
  }),

  http.post(api(`${FACILITY}/Personnel/:id/Delete`), async ({ params, request }) => {
    await delay(250);
    const staff = findStaff(params.id);
    if (!staff) return notFound();
    const form = await request.formData();
    const description = formText(form, 'Description');
    if (description.length < 5 || !(form.get('file') instanceof File)) {
      return json(
        { message: 'توضیحات (حداقل ۵ نویسه) و فایل مستند حذف الزامی است.' },
        { status: 400 },
      );
    }
    if (isLocked(staff)) {
      return json({ message: 'این پرسنل در وام استفاده شده و قابل حذف نیست.' }, { status: 400 });
    }
    staff.status = PERSONNEL_STATUS.DELETED;
    logAction(
      request,
      'staff',
      `حذف پرسنل: ${staff.fullName} (${companyName(staff.companyId)}) — ${description}`,
    );
    return json(true);
  }),

  http.post(
    api(`${FACILITY}/Companies/:companyId/Personnel/Import`),
    async ({ params, request }) => {
      await delay(500);
      const companyId = Number(params.companyId);
      const file = (await request.formData()).get('file');
      if (!(file instanceof File))
        return json({ message: 'فایل ارسال نشده است.' }, { status: 400 });
      const workbook = new ExcelJS.Workbook();
      try {
        await workbook.xlsx.load(await file.arrayBuffer());
      } catch {
        return json(
          { message: 'فایل قابل خواندن نیست؛ از فایل نمونه استفاده کنید.' },
          { status: 422 },
        );
      }
      const { totalRows, errors } = importRows(workbook, companyId, request);
      const result: ReadModelsPersonnelImportResultDto = {
        batchId: nextId(),
        totalRows,
        accepted: totalRows - errors.length,
        rejected: errors.length,
        errors,
      };
      imports.set(result.batchId ?? 0, result);
      logAction(
        request,
        'staff',
        `بارگذاری گروهی ${result.accepted} پرسنل از فایل اکسل (${companyName(companyId)})`,
      );
      return json(result);
    },
  ),

  /** تأیید/رد پرسنل در انتظار (تعداد انجام‌شده برمی‌گردد) */
  http.post(api(`${FACILITY}/Personnel/Decisions`), async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as DecidePersonnelCommand;
    const approve = body.decision === 1;
    const rejectReason = approve ? null : (reasonTitle('personnelReject', body.reasonId) ?? null);
    if (!approve && !rejectReason) {
      return json({ message: 'انتخاب دلیل رد اجباری است.' }, { status: 400 });
    }
    const pending = db.staff.filter(
      (item) => body.personnelIds.includes(item.id) && item.status === PERSONNEL_STATUS.PENDING,
    );
    pending.forEach((item) => {
      item.status = approve ? PERSONNEL_STATUS.APPROVED : PERSONNEL_STATUS.REJECTED;
      item.rejectReason = rejectReason;
      item.decidedAt = new Date().toISOString();
    });
    return json(pending.length);
  }),
];

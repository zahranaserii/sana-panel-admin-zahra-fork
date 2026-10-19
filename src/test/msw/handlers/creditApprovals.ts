import { delay, http } from 'msw';

import { ENDPOINTS } from '@/constant/endpoints';
import { type LoanStatus } from '@/constant/loanStatus';
import { type MockLoanRequest } from '@/constant/mock';
import { type DecisionPayload } from '@/features/manager-approval/types';
import { formatRial } from '@/utils/number';

import { db, fileOf, lookupTitle, today } from '../db';
import { api, json } from '../utils';
import { logAction } from '../audit';

/** درخواست‌هایی که هنوز در مرحله مدیر شرکت هستند یا توسط او رد شده‌اند اینجا نمایش داده نمی‌شوند */
const HIDDEN: LoanStatus[] = ['pending_manager', 'rejected_manager'];

const companyName = (id: string) => db.companies.find((item) => item.id === id)?.name ?? '—';

const toItem = (item: MockLoanRequest) => ({
  id: item.id,
  companyName: companyName(item.companyId),
  staffName: item.staffName,
  planTitle: item.planTitle,
  amount: item.amount,
  createdAt: item.createdAt,
  decidedAt: item.decidedAt,
  note: item.note,
  file: item.file,
  status: item.status,
  postStageTitle: db.postApprovalStages.find((stage) => stage.id === item.postStageId)?.title,
});

/** اعتبارسنجی مرحله پس از تأیید؛ در صورت خطا متن خطا برمی‌گردد */
const validateStage = (body: DecisionPayload) => {
  const stage = db.postApprovalStages.find((entry) => entry.id === body.stageId);
  if (!stage) return 'انتخاب مرحله پس از تأیید اجباری است.';
  if (stage.requiresReason && !lookupTitle('noGrantReasons', body.noGrantReasonId ?? '')) {
    return 'علت عدم اعطای تسهیلات غیرحضوری را انتخاب کنید.';
  }
  return null;
};

const decide = (path: string, nextStatus: LoanStatus) =>
  http.post(api(path), async ({ request }) => {
    await delay(350);
    const body = (await request.json()) as DecisionPayload;
    if (nextStatus === 'rejected' && !body.reasonId) {
      return json({ message: 'انتخاب دلیل رد اجباری است.' }, { status: 422 });
    }
    const stageError = nextStatus === 'approved' ? validateStage(body) : null;
    if (stageError) return json({ message: stageError }, { status: 422 });
    const targets = db.loanRequests.filter(
      (item) => body.requestIds.includes(item.id) && item.status === 'pending_credit',
    );
    if (!targets.length) {
      return json({ message: 'درخواستی در انتظار یافت نشد.' }, { status: 404 });
    }
    targets.forEach((item) => {
      item.status = nextStatus;
      item.decidedAt = today();
      item.note = body.note;
      if (body.fileId) item.file = fileOf(body.fileId);
      if (body.reasonId) item.rejectReason = lookupTitle('rejectReasons', body.reasonId);
      if (nextStatus === 'approved') {
        item.postStageId = body.stageId;
        // مثل فایل طراحی: علت عدم اعطا در توضیحات ثبت می‌شود
        const noGrant = body.noGrantReasonId && lookupTitle('noGrantReasons', body.noGrantReasonId);
        if (noGrant) item.note = body.note ? `${noGrant} — ${body.note}` : noGrant;
      }
      const reason = item.rejectReason ? ` — دلیل: ${item.rejectReason}` : '';
      logAction(
        request,
        'loan',
        `${nextStatus === 'approved' ? 'تأیید' : 'رد'} درخواست وام ${item.staffName} — ${formatRial(item.amount)} — شرکت: ${companyName(item.companyId)}${reason}`,
      );
    });
    return json({ updated: targets.length });
  });

export const creditApprovalHandlers = [
  http.get(api(ENDPOINTS.CREDIT_APPROVALS.LIST), async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const companyId = url.searchParams.get('companyId');
    const page = Number(url.searchParams.get('page') ?? 1);
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10);
    const list = db.loanRequests.filter(
      (item) => !HIDDEN.includes(item.status) && (!companyId || item.companyId === companyId),
    );
    const start = (page - 1) * pageSize;
    return json({
      items: list.slice(start, start + pageSize).map(toItem),
      totalCount: list.length,
      page,
      pageSize,
    });
  }),

  decide(ENDPOINTS.CREDIT_APPROVALS.APPROVE, 'approved'),
  decide(ENDPOINTS.CREDIT_APPROVALS.REJECT, 'rejected'),
];

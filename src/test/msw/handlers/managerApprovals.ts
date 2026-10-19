import { delay, http } from 'msw';

import { ENDPOINTS } from '@/constant/endpoints';
import { type LoanStatus } from '@/constant/loanStatus';
import { type DecisionPayload } from '@/features/manager-approval/types';
import { formatRial } from '@/utils/number';

import { db, fileOf, today } from '../db';
import { api, json } from '../utils';
import { logAction } from '../audit';

const companyName = (id: string) => db.companies.find((item) => item.id === id)?.name ?? '—';

const isPending = (companyId: unknown) => (item: (typeof db.loanRequests)[number]) =>
  item.companyId === companyId && item.status === 'pending_manager';

/** تأیید مدیر → به مرحله «تأیید اعتبارات» می‌رود؛ رد مدیر → پایان */
const decide = (nextStatus: LoanStatus) =>
  http.post(
    api(
      nextStatus === 'pending_credit'
        ? ENDPOINTS.MANAGER_APPROVALS.APPROVE(':companyId')
        : ENDPOINTS.MANAGER_APPROVALS.REJECT(':companyId'),
    ),
    async ({ params, request }) => {
      await delay(350);
      const body = (await request.json()) as DecisionPayload;
      const targets = db.loanRequests
        .filter(isPending(params.companyId))
        .filter((item) => body.requestIds.includes(item.id));
      if (!targets.length) {
        return json({ message: 'درخواستی برای این تصمیم یافت نشد.' }, { status: 404 });
      }
      targets.forEach((item) => {
        item.status = nextStatus;
        item.decidedAt = today();
        item.note = body.note;
        if (body.fileId) item.file = fileOf(body.fileId);
        const action = nextStatus === 'pending_credit' ? 'تأیید' : 'رد';
        logAction(
          request,
          'loan',
          `${action} توسط مدیر شرکت درخواست وام ${item.staffName} — ${formatRial(item.amount)} — شرکت: ${companyName(item.companyId)}${body.note ? ' — توضیحات: ' + body.note : ''}`,
        );
      });
      return json({ updated: targets.length });
    },
  );

export const managerApprovalHandlers = [
  http.get(api(ENDPOINTS.MANAGER_APPROVALS.LIST(':companyId')), async ({ params, request }) => {
    await delay(250);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10);
    const list = db.loanRequests.filter(isPending(params.companyId));
    const start = (page - 1) * pageSize;
    return json({
      items: list.slice(start, start + pageSize).map((item) => ({
        id: item.id,
        staffName: item.staffName,
        planTitle: item.planTitle,
        amount: item.amount,
        createdAt: item.createdAt,
        note: item.note,
        status: item.status,
      })),
      totalCount: list.length,
      page,
      pageSize,
    });
  }),
  decide('pending_credit'),
  decide('rejected_manager'),
];

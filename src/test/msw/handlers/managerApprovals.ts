import { delay, http } from 'msw';

import {
  type CommandResponsesDecisionResultDto,
  type DecideLoanRequestsCommand,
  type LoanRequestStatus,
  type PostApprovalStage,
  type ReadModelsPendingCountsDto,
  type SetPostApprovalStageCommand,
} from '@/api/generated/facility/facilityPanelAPI.schemas';
import { FACILITY } from '@/constant/endpoints';
import { LOAN_REQUEST_STATUS, type MockLoanRequest, PERSONNEL_STATUS } from '@/constant/mock';
import { MOCK_ENUMS } from '@/constant/mock/enums';
import { formatRial } from '@/utils/number';

import { logAction } from '../audit';
import { db, paginate, reasonTitle, storeFile, toLoanItem } from '../db';
import { api, formNumbers, formText, json } from '../utils';

/** نوع تصمیم بک‌اند (decisionType): ۱ تأیید، ۲ رد */
const APPROVE = 1;

const companyName = (id: number) => db.companies.find((item) => item.id === id)?.name ?? '—';

const stageOf = (value?: number | null) => {
  const stage = MOCK_ENUMS.postApprovalStage.find((item) => item.value === value);
  return stage && { ...stage, value: stage.value as PostApprovalStage };
};

/** صف تأیید: فیلتر شرکت و وضعیت (پیش‌فرض: وضعیت‌های همان مرحله) */
const queue = (url: URL, statuses: number[]) => {
  const companyId = Number(url.searchParams.get('CompanyId')) || undefined;
  const status = Number(url.searchParams.get('Status')) || undefined;
  const term = url.searchParams.get('Term')?.trim() ?? '';
  const list = db.loanRequests.filter(
    (item) =>
      (!companyId || item.companyId === companyId) &&
      (status ? item.status === status : statuses.includes(item.status)) &&
      (!term || item.personnelName.includes(term)),
  );
  const page = paginate(list.slice().reverse(), url);
  return { ...page, items: page.items.map(toLoanItem) };
};

interface Decision {
  requestIds: number[];
  approve: boolean;
  /** وضعیتی که درخواست باید داشته باشد */
  from: LoanRequestStatus;
  to: LoanRequestStatus;
  description: string;
  stage: string;
  apply?: (item: MockLoanRequest) => void;
}

/** اجرای ناقص مجاز است: درخواستی که در این مرحله نیست با دلیل در skipped برمی‌گردد */
const decide = (request: Request, decision: Decision): CommandResponsesDecisionResultDto => {
  const targets = db.loanRequests.filter(
    (item) => decision.requestIds.includes(item.id) && item.status === decision.from,
  );
  targets.forEach((item) => {
    item.status = decision.to;
    item.decidedAt = new Date().toISOString();
    item.description = decision.description || item.description;
    decision.apply?.(item);
    logAction(
      request,
      'loan',
      `${decision.approve ? 'تأیید' : 'رد'} توسط ${decision.stage} درخواست وام ${item.personnelName} — ${formatRial(item.amount)} — شرکت: ${companyName(item.companyId)}${decision.description ? ' — توضیحات: ' + decision.description : ''}`,
    );
  });
  return {
    processed: targets.length,
    skipped: decision.requestIds
      .filter((id) => !targets.some((item) => item.id === id))
      .map((requestId) => ({
        requestId,
        reason: `این درخواست دیگر در انتظار ${decision.stage} نیست.`,
      })),
  };
};

const pendingCount = (status: number) =>
  db.loanRequests.filter((item) => item.status === status).length;

export const managerApprovalHandlers = [
  http.get(api(`${FACILITY}/ManagerApprovals`), async ({ request }) => {
    await delay(250);
    return json(queue(new URL(request.url), [LOAN_REQUEST_STATUS.PENDING_MANAGER]));
  }),

  /** تأیید مدیر → مرحله «تأیید اعتبارات»؛ رد مدیر → پایان */
  http.post(api(`${FACILITY}/ManagerApprovals/Decisions`), async ({ request }) => {
    await delay(350);
    const body = (await request.json()) as DecideLoanRequestsCommand;
    const approve = body.decision === APPROVE;
    const description = body.description?.trim() ?? '';
    if (!approve && (!reasonTitle('loanReject', body.reasonId) || description.length < 5)) {
      return json({ message: 'دلیل رد و توضیحات (حداقل ۵ نویسه) الزامی است.' }, { status: 400 });
    }
    return json(
      decide(request, {
        requestIds: body.requestIds,
        approve,
        from: LOAN_REQUEST_STATUS.PENDING_MANAGER,
        to: approve ? LOAN_REQUEST_STATUS.PENDING_CREDIT : LOAN_REQUEST_STATUS.REJECTED_MANAGER,
        description,
        stage: 'مدیر شرکت',
        apply: (item) => {
          if (!approve) item.rejectReason = reasonTitle('loanReject', body.reasonId);
        },
      }),
    );
  }),

  http.get(api(`${FACILITY}/CreditApprovals`), async ({ request }) => {
    await delay(250);
    return json(
      queue(new URL(request.url), [
        LOAN_REQUEST_STATUS.PENDING_CREDIT,
        LOAN_REQUEST_STATUS.APPROVED,
        LOAN_REQUEST_STATUS.REJECTED,
      ]),
    );
  }),

  /** تأیید همراه با مرحله پس از تأیید (اجباری)؛ رد با دلیل و توضیحات (multipart) */
  http.post(api(`${FACILITY}/CreditApprovals/Decisions`), async ({ request }) => {
    await delay(350);
    const form = await request.formData();
    const approve = Number(form.get('Decision')) === APPROVE;
    const description = formText(form, 'Description');
    const stage = stageOf(Number(form.get('PostStage')));
    const stageReason = reasonTitle('remoteGrantDenied', form.get('PostStageReasonId'));
    const rejectReason = reasonTitle('loanReject', form.get('ReasonId'));
    if (approve && !stage) {
      return json({ message: 'انتخاب مرحله پس از تأیید اجباری است.' }, { status: 400 });
    }
    if (approve && stage?.requiresReason && !stageReason) {
      return json(
        { message: 'برای این مرحله انتخاب علت عدم اعطای تسهیلات اجباری است.' },
        { status: 400 },
      );
    }
    if (!approve && (!rejectReason || description.length < 5)) {
      return json({ message: 'دلیل رد و توضیحات (حداقل ۵ نویسه) الزامی است.' }, { status: 400 });
    }
    const attachment = storeFile(form.get('attachment'), request);
    return json(
      decide(request, {
        requestIds: formNumbers(form, 'RequestIds'),
        approve,
        from: LOAN_REQUEST_STATUS.PENDING_CREDIT,
        to: approve ? LOAN_REQUEST_STATUS.APPROVED : LOAN_REQUEST_STATUS.REJECTED,
        description,
        stage: 'تأیید اعتبارات',
        apply: (item) => {
          if (attachment) item.documents.push(attachment);
          if (approve) {
            item.postStage = stage?.value;
            item.postStageReason = stageReason;
          } else {
            item.rejectReason = rejectReason;
          }
        },
      }),
    );
  }),

  /** تغییر مرحله پس از تأیید برای درخواست تأییدشده */
  http.put(
    api(`${FACILITY}/CreditApprovals/:requestId/PostApprovalStage`),
    async ({ params, request }) => {
      await delay(300);
      const loan = db.loanRequests.find((item) => String(item.id) === params.requestId);
      if (loan?.status !== LOAN_REQUEST_STATUS.APPROVED) {
        return json({ message: 'فقط درخواست تأییدشده مرحله پس از تأیید دارد.' }, { status: 422 });
      }
      const body = (await request.json()) as SetPostApprovalStageCommand;
      const stage = stageOf(body.stage);
      const reason = reasonTitle('remoteGrantDenied', body.reasonId);
      if (!stage || (stage.requiresReason && !reason)) {
        return json({ message: 'مرحله یا علت انتخاب‌شده معتبر نیست.' }, { status: 400 });
      }
      loan.postStage = stage.value;
      loan.postStageReason = reason;
      logAction(
        request,
        'loan',
        `تغییر مرحله پس از تأیید درخواست ${loan.personnelName} به «${stage.title}»`,
      );
      return json(toLoanItem(loan));
    },
  ),

  http.get(api(`${FACILITY}/Approvals/PendingCounts`), async () => {
    await delay(150);
    const counts: ReadModelsPendingCountsDto = {
      personnelApproval: db.staff.filter((item) => item.status === PERSONNEL_STATUS.PENDING).length,
      managerApproval: pendingCount(LOAN_REQUEST_STATUS.PENDING_MANAGER),
      creditApproval: pendingCount(LOAN_REQUEST_STATUS.PENDING_CREDIT),
      digitalApproval: pendingCount(LOAN_REQUEST_STATUS.PENDING_DIGITAL),
    };
    return json(counts);
  }),
];

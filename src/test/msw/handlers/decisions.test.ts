import { getResponse } from 'msw';

import { FACILITY } from '@/constant/endpoints';
import { LOAN_REQUEST_STATUS } from '@/constant/mock';

import { db } from '../db';
import { api } from '../utils';

import { handlers } from './index';

const post = (path: string, body: unknown) =>
  getResponse(
    handlers,
    new Request(new URL(api(path), location.origin), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
  );

describe('manager decisions', () => {
  it('processes pending requests and returns the rest in skipped with a reason', async () => {
    const pending = db.loanRequests.find(
      (item) => item.status === LOAN_REQUEST_STATUS.PENDING_MANAGER,
    );
    const decided = db.loanRequests.find(
      (item) =>
        item.companyId === pending?.companyId &&
        item.status !== LOAN_REQUEST_STATUS.PENDING_MANAGER,
    );
    expect(pending && decided).toBeTruthy();

    const response = await post(`${FACILITY}/ManagerApprovals/Decisions`, {
      requestIds: [pending?.id, decided?.id],
      decision: 1,
    });
    const body = (await response?.json()) as {
      data: { processed: number; skipped: { requestId: number; reason: string }[] };
    };
    expect(body.data.processed).toBe(1);
    expect(body.data.skipped).toEqual([{ requestId: decided?.id, reason: expect.any(String) }]);
  });
});

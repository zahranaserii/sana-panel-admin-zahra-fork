import { getResponse } from 'msw';

import { ENDPOINTS } from '@/constant/endpoints';

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
    const pending = db.loanRequests.find((item) => item.status === 'pending_manager');
    const decided = db.loanRequests.find(
      (item) => item.companyId === pending?.companyId && item.status !== 'pending_manager',
    );
    expect(pending && decided).toBeTruthy();

    const response = await post(ENDPOINTS.MANAGER_APPROVALS.APPROVE(pending?.companyId ?? ''), {
      requestIds: [pending?.id, decided?.id],
    });
    const body = (await response?.json()) as {
      data: { processed: number; skipped: { requestId: string; reason: string }[] };
    };
    expect(body.data.processed).toBe(1);
    expect(body.data.skipped).toEqual([{ requestId: decided?.id, reason: expect.any(String) }]);
  });
});

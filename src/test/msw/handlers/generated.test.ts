import { getResponse } from 'msw';

import { api } from '../utils';

import { handlers } from './index';

describe('mock handlers', () => {
  it('falls back to the generated mock, wrapped in the backend envelope', async () => {
    const response = await getResponse(
      handlers,
      new Request(new URL(api('/gateway/facility-management/Dashboard'), location.origin)),
    );
    const body = (await response?.json()) as { isSuccess: boolean; data: { kpis?: unknown } };
    expect(body.isSuccess).toBe(true);
    expect(body.data.kpis).toBeDefined();
  });

  it('prefers the manual mock when one exists', async () => {
    const response = await getResponse(
      handlers,
      new Request(
        new URL(api('/gateway/facility-management/ChangeLogs?Page=1&PageSize=5'), location.origin),
      ),
    );
    const body = (await response?.json()) as { data: { items: { details: string }[] } };
    expect(body.data.items[0]?.details).toMatch(/[؀-ۿ]/);
  });
});

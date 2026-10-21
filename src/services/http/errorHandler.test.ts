import { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';

import { useAuthStore } from '@/store/useAuthStore';

import { ERROR_TOAST_ID, handleHttpError } from './errorHandler';
import { type ErrorHandlerMap, type HttpError } from './types';

vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

const makeError = (
  status: number | null,
  config: Partial<InternalAxiosRequestConfig> = {},
  code = 'ERR',
) => {
  const requestConfig = { headers: new AxiosHeaders(), ...config } as InternalAxiosRequestConfig;
  const response = status
    ? { status, statusText: '', data: {}, headers: {}, config: requestConfig }
    : undefined;
  return new AxiosError('failed', code, requestConfig, null, response) as HttpError;
};

describe('handleHttpError', () => {
  beforeEach(() => vi.clearAllMocks());

  it('runs the custom handler for the matching status instead of the default', () => {
    const on404 = vi.fn();
    handleHttpError(makeError(404, { onError: { 404: on404 } satisfies ErrorHandlerMap }));
    expect(on404).toHaveBeenCalledOnce();
    expect(toast.error).not.toHaveBeenCalled();
  });

  it('falls back to the default behaviour when no custom handler exists for the status', () => {
    const on404 = vi.fn();
    handleHttpError(makeError(500, { onError: { 404: on404 } }));
    expect(on404).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith('خطای داخلی سرور رخ داده است.', {
      id: ERROR_TOAST_ID,
    });
  });

  it('opens the session-expired modal on 401 and logs out only after the user confirms', () => {
    useAuthStore.setState({ token: 'abc', sessionExpired: false });
    handleHttpError(makeError(401));
    expect(useAuthStore.getState().sessionExpired).toBe(true);
    expect(useAuthStore.getState().token).toBe('abc');
  });

  it('uses the network handler when there is no response', () => {
    const onNetwork = vi.fn();
    handleHttpError(makeError(null, { onError: { network: onNetwork } }));
    expect(onNetwork).toHaveBeenCalledOnce();
  });

  it('shows the timeout message when the request times out', () => {
    handleHttpError(makeError(null, {}, AxiosError.ECONNABORTED));
    expect(toast.error).toHaveBeenCalledWith(
      'زمان انتظار برای پاسخ سرور به پایان رسید؛ دوباره تلاش کنید.',
      { id: ERROR_TOAST_ID },
    );
  });

  it('runs the custom timeout handler instead of the network handler', () => {
    const onTimeout = vi.fn();
    const onNetwork = vi.fn();
    handleHttpError(
      makeError(
        null,
        { onError: { timeout: onTimeout, network: onNetwork } },
        AxiosError.ETIMEDOUT,
      ),
    );
    expect(onTimeout).toHaveBeenCalledOnce();
    expect(onNetwork).not.toHaveBeenCalled();
  });

  it('reuses one toast id so a new error replaces the previous one', () => {
    handleHttpError(makeError(500));
    handleHttpError(makeError(404));
    const ids = vi.mocked(toast.error).mock.calls.map(([, options]) => options?.id);
    expect(ids).toEqual([ERROR_TOAST_ID, ERROR_TOAST_ID]);
  });

  it('does nothing by default when silent is set', () => {
    handleHttpError(makeError(500, { silent: true }));
    expect(toast.error).not.toHaveBeenCalled();
  });

  it('still opens the session-expired modal on 401 for silent requests', () => {
    useAuthStore.setState({ token: 'abc', sessionExpired: false });
    handleHttpError(makeError(401, { silent: true }));
    expect(useAuthStore.getState().sessionExpired).toBe(true);
  });
});

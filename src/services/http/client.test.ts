import { type InternalAxiosRequestConfig } from 'axios';

import { useAuthStore } from '@/store/useAuthStore';

import { httpClient } from './client';
import { http } from './methods';

describe('httpClient', () => {
  it('sends the token and the fixed backend headers and unwraps `data`', async () => {
    let sent: InternalAxiosRequestConfig | undefined;
    useAuthStore.setState({ token: 'abc' });
    const result = await http.get<{ ok: boolean }>('/ping', {
      adapter: (config) => {
        sent = config;
        return Promise.resolve({
          data: { data: { ok: true }, statusCode: 1, message: 'ok', isSuccess: true },
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        });
      },
    });
    expect(result).toEqual({ ok: true });
    const headers = sent?.headers;
    expect(headers?.Authorization).toBe('Bearer abc');
    expect(headers?.['x-api-version']).toBe('2');
    expect(headers?.AppId).toBe('2');
    expect(headers?.AppLanguage).toBe('fa');
    expect(headers?.DeviceId).toBeTruthy();
    expect(httpClient.defaults.baseURL).toBeDefined();
  });
});

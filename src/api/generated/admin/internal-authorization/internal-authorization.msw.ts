/**
 * تولید خودکار با Orval از روی OpenAPI — دستی ویرایش نشود (npm run api:generate)
 */
import {
  HttpResponse,
  delay,
  http
} from 'msw';
import type {
  RequestHandlerOptions
} from 'msw';



export const getInternalAuthorizationResolvePostMockHandler = (overrideResponse?: void | ((info: Parameters<Parameters<typeof http.post>[1]>[0]) => Promise<void> | void), options?: RequestHandlerOptions) => {
  return http.post('*/identity/Internal/Authorization/Resolve', async (info: Parameters<Parameters<typeof http.post>[1]>[0]) => {await delay(250);
  if (typeof overrideResponse === 'function') {await overrideResponse(info); }

    return new HttpResponse(null,
      { status: 200
      })
  }, options)
}
export const getInternalAuthorizationMock = () => [
  getInternalAuthorizationResolvePostMockHandler()
]

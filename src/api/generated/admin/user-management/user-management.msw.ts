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



export const getUserManagementAccessesGetMockHandler = (overrideResponse?: void | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<void> | void), options?: RequestHandlerOptions) => {
  return http.get('*/gateway/identity/UserManagement/Accesses', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {await delay(250);
  if (typeof overrideResponse === 'function') {await overrideResponse(info); }

    return new HttpResponse(null,
      { status: 200
      })
  }, options)
}

export const getUserManagementAccessesPostMockHandler = (overrideResponse?: void | ((info: Parameters<Parameters<typeof http.post>[1]>[0]) => Promise<void> | void), options?: RequestHandlerOptions) => {
  return http.post('*/gateway/identity/UserManagement/Accesses', async (info: Parameters<Parameters<typeof http.post>[1]>[0]) => {await delay(250);
  if (typeof overrideResponse === 'function') {await overrideResponse(info); }

    return new HttpResponse(null,
      { status: 200
      })
  }, options)
}

export const getUserManagementAccessesByIdGetMockHandler = (overrideResponse?: void | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<void> | void), options?: RequestHandlerOptions) => {
  return http.get('*/gateway/identity/UserManagement/Accesses/:id', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {await delay(250);
  if (typeof overrideResponse === 'function') {await overrideResponse(info); }

    return new HttpResponse(null,
      { status: 200
      })
  }, options)
}

export const getUserManagementAccessesByIdPutMockHandler = (overrideResponse?: void | ((info: Parameters<Parameters<typeof http.put>[1]>[0]) => Promise<void> | void), options?: RequestHandlerOptions) => {
  return http.put('*/gateway/identity/UserManagement/Accesses/:id', async (info: Parameters<Parameters<typeof http.put>[1]>[0]) => {await delay(250);
  if (typeof overrideResponse === 'function') {await overrideResponse(info); }

    return new HttpResponse(null,
      { status: 200
      })
  }, options)
}

export const getUserManagementRolesGetMockHandler = (overrideResponse?: void | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<void> | void), options?: RequestHandlerOptions) => {
  return http.get('*/gateway/identity/UserManagement/Roles', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {await delay(250);
  if (typeof overrideResponse === 'function') {await overrideResponse(info); }

    return new HttpResponse(null,
      { status: 200
      })
  }, options)
}

export const getUserManagementRolesPostMockHandler = (overrideResponse?: void | ((info: Parameters<Parameters<typeof http.post>[1]>[0]) => Promise<void> | void), options?: RequestHandlerOptions) => {
  return http.post('*/gateway/identity/UserManagement/Roles', async (info: Parameters<Parameters<typeof http.post>[1]>[0]) => {await delay(250);
  if (typeof overrideResponse === 'function') {await overrideResponse(info); }

    return new HttpResponse(null,
      { status: 200
      })
  }, options)
}

export const getUserManagementRolesByIdGetMockHandler = (overrideResponse?: void | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<void> | void), options?: RequestHandlerOptions) => {
  return http.get('*/gateway/identity/UserManagement/Roles/:id', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {await delay(250);
  if (typeof overrideResponse === 'function') {await overrideResponse(info); }

    return new HttpResponse(null,
      { status: 200
      })
  }, options)
}

export const getUserManagementRolesByIdPutMockHandler = (overrideResponse?: void | ((info: Parameters<Parameters<typeof http.put>[1]>[0]) => Promise<void> | void), options?: RequestHandlerOptions) => {
  return http.put('*/gateway/identity/UserManagement/Roles/:id', async (info: Parameters<Parameters<typeof http.put>[1]>[0]) => {await delay(250);
  if (typeof overrideResponse === 'function') {await overrideResponse(info); }

    return new HttpResponse(null,
      { status: 200
      })
  }, options)
}

export const getUserManagementGroupsGetMockHandler = (overrideResponse?: void | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<void> | void), options?: RequestHandlerOptions) => {
  return http.get('*/gateway/identity/UserManagement/Groups', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {await delay(250);
  if (typeof overrideResponse === 'function') {await overrideResponse(info); }

    return new HttpResponse(null,
      { status: 200
      })
  }, options)
}

export const getUserManagementGroupsPostMockHandler = (overrideResponse?: void | ((info: Parameters<Parameters<typeof http.post>[1]>[0]) => Promise<void> | void), options?: RequestHandlerOptions) => {
  return http.post('*/gateway/identity/UserManagement/Groups', async (info: Parameters<Parameters<typeof http.post>[1]>[0]) => {await delay(250);
  if (typeof overrideResponse === 'function') {await overrideResponse(info); }

    return new HttpResponse(null,
      { status: 200
      })
  }, options)
}

export const getUserManagementGroupsByIdGetMockHandler = (overrideResponse?: void | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<void> | void), options?: RequestHandlerOptions) => {
  return http.get('*/gateway/identity/UserManagement/Groups/:id', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {await delay(250);
  if (typeof overrideResponse === 'function') {await overrideResponse(info); }

    return new HttpResponse(null,
      { status: 200
      })
  }, options)
}

export const getUserManagementGroupsByIdPutMockHandler = (overrideResponse?: void | ((info: Parameters<Parameters<typeof http.put>[1]>[0]) => Promise<void> | void), options?: RequestHandlerOptions) => {
  return http.put('*/gateway/identity/UserManagement/Groups/:id', async (info: Parameters<Parameters<typeof http.put>[1]>[0]) => {await delay(250);
  if (typeof overrideResponse === 'function') {await overrideResponse(info); }

    return new HttpResponse(null,
      { status: 200
      })
  }, options)
}

export const getUserManagementPanelUsersGetMockHandler = (overrideResponse?: void | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<void> | void), options?: RequestHandlerOptions) => {
  return http.get('*/gateway/identity/UserManagement/PanelUsers', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {await delay(250);
  if (typeof overrideResponse === 'function') {await overrideResponse(info); }

    return new HttpResponse(null,
      { status: 200
      })
  }, options)
}

export const getUserManagementPanelUsersByIdGetMockHandler = (overrideResponse?: void | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<void> | void), options?: RequestHandlerOptions) => {
  return http.get('*/gateway/identity/UserManagement/PanelUsers/:id', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {await delay(250);
  if (typeof overrideResponse === 'function') {await overrideResponse(info); }

    return new HttpResponse(null,
      { status: 200
      })
  }, options)
}

export const getUserManagementPanelUsersByIdActivePutMockHandler = (overrideResponse?: void | ((info: Parameters<Parameters<typeof http.put>[1]>[0]) => Promise<void> | void), options?: RequestHandlerOptions) => {
  return http.put('*/gateway/identity/UserManagement/PanelUsers/:id/Active', async (info: Parameters<Parameters<typeof http.put>[1]>[0]) => {await delay(250);
  if (typeof overrideResponse === 'function') {await overrideResponse(info); }

    return new HttpResponse(null,
      { status: 200
      })
  }, options)
}

export const getUserManagementAccessMatrixGetMockHandler = (overrideResponse?: void | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<void> | void), options?: RequestHandlerOptions) => {
  return http.get('*/gateway/identity/UserManagement/AccessMatrix', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {await delay(250);
  if (typeof overrideResponse === 'function') {await overrideResponse(info); }

    return new HttpResponse(null,
      { status: 200
      })
  }, options)
}
export const getUserManagementMock = () => [
  getUserManagementAccessesGetMockHandler(),
  getUserManagementAccessesPostMockHandler(),
  getUserManagementAccessesByIdGetMockHandler(),
  getUserManagementAccessesByIdPutMockHandler(),
  getUserManagementRolesGetMockHandler(),
  getUserManagementRolesPostMockHandler(),
  getUserManagementRolesByIdGetMockHandler(),
  getUserManagementRolesByIdPutMockHandler(),
  getUserManagementGroupsGetMockHandler(),
  getUserManagementGroupsPostMockHandler(),
  getUserManagementGroupsByIdGetMockHandler(),
  getUserManagementGroupsByIdPutMockHandler(),
  getUserManagementPanelUsersGetMockHandler(),
  getUserManagementPanelUsersByIdGetMockHandler(),
  getUserManagementPanelUsersByIdActivePutMockHandler(),
  getUserManagementAccessMatrixGetMockHandler()
]

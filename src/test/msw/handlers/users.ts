import { delay, http } from 'msw';

import { ENDPOINTS } from '@/constant/endpoints';
import { MOCK_ROLES, type MockManagedUser } from '@/constant/mock';
import { type UserPayload } from '@/features/users/types';
import { toEnglishDigits } from '@/utils/date';

import { db } from '../db';
import { api, json } from '../utils';
import { logAction } from '../audit';

const withoutPassword = ({ password: _password, ...user }: MockManagedUser) => user;

const notFound = () => json({ message: 'کاربر یافت نشد.' }, { status: 404 });

const duplicate = () =>
  json(
    {
      message: 'این نام کاربری قبلاً ثبت شده است.',
      errors: { userName: ['این نام کاربری قبلاً ثبت شده است.'] },
    },
    { status: 409 },
  );

const isTaken = (userName: string, exceptId?: number) =>
  db.users.some((user) => user.userName === userName && user.id !== exceptId);

/** نقش انتخاب‌شده (roleId) → roles پاسخ بک‌اند */
const toRoles = (roleId: number | null) =>
  MOCK_ROLES.filter((role) => role.id === roleId).map((role) => ({
    roleId: role.id,
    persianTitle: role.persianTitle,
    allowedScopeType: 0,
  }));

/** کدها با ارقام انگلیسی ذخیره می‌شوند */
const normalize = ({ roleId, ...body }: UserPayload) => ({
  ...body,
  userName: body.userName.trim(),
  userCode: toEnglishDigits(body.userCode),
  branchCode: toEnglishDigits(body.branchCode),
  roles: toRoles(roleId),
});

const paginate = <T>(list: T[], request: Request) => {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page') ?? 1);
  const pageSize = Number(url.searchParams.get('pageSize') ?? 10);
  const start = (page - 1) * pageSize;
  return { items: list.slice(start, start + pageSize), totalCount: list.length, page, pageSize };
};

export const userHandlers = [
  http.get(api(ENDPOINTS.USER_MANAGEMENT.ROLES), async ({ request }) => {
    await delay(200);
    return json(paginate(MOCK_ROLES, request));
  }),

  http.put(api(ENDPOINTS.USER_MANAGEMENT.USER_ACTIVE(':id')), async ({ params, request }) => {
    await delay(200);
    const user = db.users.find((item) => item.id === Number(params.id));
    if (!user) return notFound();
    user.isActive = new URL(request.url).searchParams.get('isActive') === 'true';
    return json(true);
  }),

  http.get(api(ENDPOINTS.USER_MANAGEMENT.USERS), async ({ request }) => {
    await delay(250);
    return json(paginate(db.users.map(withoutPassword), request));
  }),

  http.get(api(ENDPOINTS.USER_MANAGEMENT.USER(':id')), async ({ params }) => {
    await delay(200);
    const user = db.users.find((item) => item.id === Number(params.id));
    return user ? json(withoutPassword(user)) : notFound();
  }),

  http.post(api(ENDPOINTS.USER_MANAGEMENT.USERS), async ({ request }) => {
    await delay(300);
    const body = normalize((await request.json()) as UserPayload);
    if (!body.password) {
      return json({ message: 'رمز عبور الزامی است.' }, { status: 422 });
    }
    if (isTaken(body.userName)) return duplicate();
    const user = {
      ...body,
      id: Math.max(0, ...db.users.map((item) => item.id)) + 1,
      password: body.password,
      email: null,
      personId: null,
      isActive: true,
      creationTime: new Date().toISOString(),
      companyId: null,
    };
    db.users.push(user);
    logAction(request, 'user', `ثبت کاربر جدید: ${user.fullName} (${user.userName})`);
    return json(withoutPassword(user), { status: 201 });
  }),

  http.put(api(ENDPOINTS.USER_MANAGEMENT.USER(':id')), async ({ params, request }) => {
    await delay(300);
    const user = db.users.find((item) => item.id === Number(params.id));
    if (!user) return notFound();
    const { password, ...body } = normalize((await request.json()) as UserPayload);
    if (isTaken(body.userName, user.id)) return duplicate();
    const before = structuredClone(user);
    Object.assign(user, body, password ? { password } : {});
    logAction(request, 'user', `ویرایش کاربر: ${user.fullName} (${user.userName})`, {
      entity: 'user',
      id: String(user.id),
      before,
    });
    return json(withoutPassword(user));
  }),

  http.delete(api(ENDPOINTS.USER_MANAGEMENT.USER(':id')), async ({ params, request }) => {
    await delay(250);
    if (db.users.length <= 1) {
      return json({ message: 'حداقل یک کاربر باید در سامانه باقی بماند.' }, { status: 422 });
    }
    const removed = db.users.find((item) => item.id === Number(params.id));
    db.users = db.users.filter((item) => item.id !== Number(params.id));
    if (removed) logAction(request, 'user', `حذف کاربر: ${removed.userName}`);
    return json(null);
  }),
];

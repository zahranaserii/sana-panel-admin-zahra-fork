import { delay, http } from 'msw';

import { ENDPOINTS } from '@/constant/endpoints';
import { type Scheme, type SchemePayload } from '@/features/base-info/types';

import { db, nextId, resizeUsable } from '../db';
import { api, json } from '../utils';
import { logAction } from '../audit';

const toListItem = ({
  id,
  name,
  qarzRate,
  murabahaRates,
  terms,
  contractYears,
  maxPlans,
}: Scheme) => ({
  id,
  name,
  qarzRate,
  murabahaRates,
  terms,
  contractYears,
  maxPlans,
});

const notFound = () => json({ message: 'طرح یافت نشد.' }, { status: 404 });

const cleanTexts = (list: string[] = []) => list.map((item) => item.trim()).filter(Boolean);

/** ردیف‌های خالی لیست‌ها حذف و جدول درصد قابل استفاده هم‌اندازه می‌شود */
const normalize = (body: SchemePayload): SchemePayload =>
  resizeUsable({
    ...body,
    name: body.name.trim(),
    cancelReasons: cleanTexts(body.cancelReasons),
    rejectReasons: cleanTexts(body.rejectReasons),
    noGrantReasons: cleanTexts(body.noGrantReasons),
    avgDocTypes: cleanTexts(body.avgDocTypes),
  });

export const baseInfoHandlers = [
  http.get(api(ENDPOINTS.BASE_INFO.SCHEMES), async ({ request }) => {
    await delay(250);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10);
    const start = (page - 1) * pageSize;
    return json({
      items: db.schemes.slice(start, start + pageSize).map(toListItem),
      totalCount: db.schemes.length,
      page,
      pageSize,
    });
  }),

  http.get(api(ENDPOINTS.BASE_INFO.SCHEME(':id')), async ({ params }) => {
    await delay(250);
    const scheme = db.schemes.find((item) => item.id === params.id);
    return scheme ? json(scheme) : notFound();
  }),

  http.post(api(ENDPOINTS.BASE_INFO.SCHEMES), async ({ request }) => {
    await delay(300);
    const scheme = { id: nextId('scheme'), ...normalize((await request.json()) as SchemePayload) };
    db.schemes.push(scheme);
    logAction(request, 'base', `ثبت طرح جدید: ${scheme.name}`);
    return json(scheme, { status: 201 });
  }),

  http.put(api(ENDPOINTS.BASE_INFO.SCHEME(':id')), async ({ params, request }) => {
    await delay(300);
    const index = db.schemes.findIndex((item) => item.id === params.id);
    if (index < 0) return notFound();
    const scheme = {
      id: params.id as string,
      ...normalize((await request.json()) as SchemePayload),
    };
    logAction(request, 'base', `ویرایش طرح: ${scheme.name}`, {
      entity: 'scheme',
      id: scheme.id,
      before: db.schemes[index] ?? {},
    });
    db.schemes[index] = scheme;
    return json(scheme);
  }),

  http.delete(api(ENDPOINTS.BASE_INFO.SCHEME(':id')), async ({ params, request }) => {
    await delay(250);
    const removed = db.schemes.find((item) => item.id === params.id);
    if (!removed) return notFound();
    if (db.schemes.length === 1) {
      return json({ message: 'حداقل یک طرح باید در سامانه باقی بماند.' }, { status: 422 });
    }
    logAction(request, 'base', `حذف طرح: ${removed.name}`);
    db.schemes = db.schemes.filter((item) => item.id !== params.id);
    return json(null);
  }),
];

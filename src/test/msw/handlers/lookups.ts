import { delay, http } from 'msw';

import { ENDPOINTS, FACILITY } from '@/constant/endpoints';
import { MOCK_ENUMS } from '@/constant/mock/enums';
import { type SchemeTextList } from '@/features/base-info/types';

import { buildPlanOptions, db, lookupItems, schemeOf } from '../db';
import { api, json } from '../utils';

/** لیست ساده‌ای که از اطلاعات پایه طرح خوانده می‌شود */
const lookupList = (path: string, name: SchemeTextList) =>
  http.get(api(path), async () => {
    await delay(150);
    return json(lookupItems(name));
  });

export const lookupHandlers = [
  // عنوان enumها با داده واقعی‌تر از ماک تولیدشده (تصادفی)
  http.get(api(`${FACILITY}/Lookups/Enums`), async () => {
    await delay(150);
    return json(MOCK_ENUMS);
  }),

  lookupList(ENDPOINTS.LOOKUPS.CANCEL_REASONS, 'cancelReasons'),
  lookupList(ENDPOINTS.LOOKUPS.REJECT_REASONS, 'rejectReasons'),
  lookupList(ENDPOINTS.LOOKUPS.NO_GRANT_REASONS, 'noGrantReasons'),
  lookupList(ENDPOINTS.LOOKUPS.AVG_DOC_TYPES, 'avgDocTypes'),

  /** طرح‌های قابل انتخاب یک طرح کلان + سقف تعداد طرح هر شرکت */
  http.get(api(ENDPOINTS.LOOKUPS.PLANS), async ({ request }) => {
    await delay(200);
    const scheme = schemeOf(new URL(request.url).searchParams.get('schemeId') ?? undefined);
    return json({ maxPlans: scheme.maxPlans, items: buildPlanOptions(scheme) });
  }),

  /** کشویی طرح‌های کلان برای فرم شرکت */
  http.get(api(ENDPOINTS.LOOKUPS.SCHEMES), async () => {
    await delay(150);
    return json(db.schemes.map((scheme) => ({ id: scheme.id, title: scheme.name })));
  }),

  http.get(api(ENDPOINTS.LOOKUPS.COMPANIES), async ({ request }) => {
    await delay(150);
    const includeInactive = new URL(request.url).searchParams.get('includeInactive') === 'true';
    const list = db.companies.filter(
      (item) => !item.deleted && (includeInactive || item.status === 'active'),
    );
    return json(list.map((item) => ({ id: item.id, title: item.name })));
  }),

  http.get(api(ENDPOINTS.LOOKUPS.POST_APPROVAL_STAGES), async () => {
    await delay(150);
    return json(db.postApprovalStages);
  }),
];

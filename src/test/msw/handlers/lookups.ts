import { delay, http } from 'msw';

import { ENDPOINTS } from '@/constant/endpoints';
import { type SchemeTextList } from '@/features/base-info/types';

import { buildPlanOptions, db, lookupItems, primaryScheme } from '../db';
import { api, json } from '../utils';

/** لیست ساده‌ای که از اطلاعات پایه طرح خوانده می‌شود */
const lookupList = (path: string, name: SchemeTextList) =>
  http.get(api(path), async () => {
    await delay(150);
    return json(lookupItems(name));
  });

export const lookupHandlers = [
  lookupList(ENDPOINTS.LOOKUPS.CANCEL_REASONS, 'cancelReasons'),
  lookupList(ENDPOINTS.LOOKUPS.REJECT_REASONS, 'rejectReasons'),
  lookupList(ENDPOINTS.LOOKUPS.NO_GRANT_REASONS, 'noGrantReasons'),
  lookupList(ENDPOINTS.LOOKUPS.AVG_DOC_TYPES, 'avgDocTypes'),

  http.get(api(ENDPOINTS.LOOKUPS.PLANS), async () => {
    await delay(200);
    return json({ maxPlans: primaryScheme().maxPlans, items: buildPlanOptions() });
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

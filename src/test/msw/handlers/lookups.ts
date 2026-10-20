import { delay, http } from 'msw';

import { FACILITY } from '@/constant/endpoints';
import { MOCK_ENUMS } from '@/constant/mock/enums';

import { api, json } from '../utils';

export const lookupHandlers = [
  // عنوان enumها با داده واقعی‌تر از ماک تولیدشده (تصادفی)
  http.get(api(`${FACILITY}/Lookups/Enums`), async () => {
    await delay(150);
    return json(MOCK_ENUMS);
  }),
];

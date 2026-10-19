import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { buildMenu } from '@/constant/menu';
import { QUERY_KEYS } from '@/constant/queryKeys';

import { getMainMenu } from './api';

/** منوی کاربر (یک بار بعد از ورود گرفته می‌شود و تا خروج در کش می‌ماند) */
export const useMainMenu = () => {
  const { data, isPending } = useQuery({
    queryKey: QUERY_KEYS.MAIN_MENU,
    queryFn: getMainMenu,
    staleTime: Infinity,
  });
  const groups = useMemo(() => buildMenu(data ?? []), [data]);
  return { groups, isPending };
};

import { queryClient } from '@/app/providers/queryClient';

import { resetSession } from './session';
import { useAuthStore } from './useAuthStore';
import { useProfileStore } from './useProfileStore';
import { useThemeStore } from './useThemeStore';

describe('resetSession', () => {
  it('resets every user store and the query cache but keeps the theme', () => {
    useAuthStore.setState({ token: 'abc', sessionExpired: true });
    useProfileStore.getState().setProfile({ panelUserId: 1, userName: 'admin', fullName: 'مدیر' });
    useThemeStore.getState().setMode('dark');
    queryClient.setQueryData(['main-menu'], []);

    resetSession();

    expect(useAuthStore.getState()).toMatchObject({ token: null, sessionExpired: false });
    expect(useProfileStore.getState()).toMatchObject({ profile: null });
    expect(useThemeStore.getState().mode).toBe('dark');
    expect(queryClient.getQueryCache().getAll()).toHaveLength(0);
  });
});

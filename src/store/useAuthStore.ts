import Cookies from 'js-cookie';
import { create } from 'zustand';

import { registerReset } from './resettable';

const TOKEN_COOKIE = 'sana_token';

interface AuthState {
  token: string | null;
  /** نشست با ۴۰۱ تمام شده و مودال «پایان نشست» باز است */
  sessionExpired: boolean;
  /** با ۴۰۱ صدا زده می‌شود؛ ریست بعد از تأیید کاربر در مودال انجام می‌شود */
  expireSession: () => void;
  /** فقط موقع لاگین صدا زده می‌شود؛ کوکی را یک بار ست می‌کند */
  login: (token: string, options?: { expiresInDays?: number }) => void;
  /** موقع لاگ‌اوت یا ۴۰۱؛ کوکی را حذف می‌کند */
  logout: () => void;
  /** برگشت به حالت اولیه (خروج و ۴۰۱) */
  reset: () => void;
}

/**
 * تنها جای پروژه که با کوکی کار می‌کند.
 * بقیه بخش‌ها (از جمله interceptor) فقط از این استور می‌خوانند.
 */
export const useAuthStore = create<AuthState>()((set) => ({
  token: Cookies.get(TOKEN_COOKIE) ?? null,
  sessionExpired: false,
  expireSession: () => set({ sessionExpired: true }),
  login: (token, options) => {
    Cookies.set(TOKEN_COOKIE, token, {
      // HTTPS فعلاً غیرفعال است؛ هنگام دیپلوی واقعی روی https دوباره `secure: true` شود
      // secure: true,
      secure: window.location.protocol === 'https:',
      sameSite: 'strict',
      expires: options?.expiresInDays,
    });
    set({ token });
  },
  logout: () => {
    Cookies.remove(TOKEN_COOKIE);
    set({ token: null });
  },
  reset: () => {
    Cookies.remove(TOKEN_COOKIE);
    set({ token: null, sessionExpired: false });
  },
}));

registerReset(() => useAuthStore.getState().reset());

export const selectIsAuthenticated = (state: AuthState) => Boolean(state.token);

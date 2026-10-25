import { create } from 'zustand';

import { type PanelProfileDto } from '@/api/generated/admin/adminApi.schemas';

import { registerReset } from './resettable';

interface ProfileState {
  /** کل پاسخ Panel/Profile بک‌اند */
  profile: PanelProfileDto | null;
  setProfile: (profile: PanelProfileDto) => void;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileState>()((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  // خالی کردن پروفایل = برگشت به حالت اولیه (در خروج و ۴۰۱ از resetSession صدا زده می‌شود)
  clearProfile: () => set({ profile: null }),
}));

registerReset(() => useProfileStore.getState().clearProfile());

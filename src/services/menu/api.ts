import { ENDPOINTS } from '@/constant/endpoints';

import { http } from '../http';

import { type MenuItemDto } from './types';

export const getMainMenu = () => http.get<MenuItemDto[]>(ENDPOINTS.AUTH.MAIN_MENU);

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// Типизированные хуки для использования во всем приложении
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Специализированные селекторы для пользовательских данных
export const useUserData = () => useAppSelector(state => state.user.data);
export const useUserLoading = () => useAppSelector(state => state.user.loading);
export const useUserError = () => useAppSelector(state => state.user.error);
export const usePuffRecords = () => useAppSelector(state => state.user.data?.records || []);
export const useTotalPuffCount = () => useAppSelector(state => state.user.data?.totalCount || 0);
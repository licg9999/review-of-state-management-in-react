import { TypedUseSelectorHook, useDispatch, useSelector, useStore } from 'react-redux';
import type { AppAction, AppDispatch, AppState } from './reduxStore';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
export const useAppStore = () => useStore<AppState, AppAction>();

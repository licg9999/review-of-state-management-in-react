import { AnyAction, configureStore } from '@reduxjs/toolkit';
import {
  analogueReducer,
  AnalogueState,
  digitalReducer,
  DigitalState,
  timeReducer,
  TimeState,
} from './CompositeClock';

export interface AppState {
  timeOfClock: TimeState;
  analogueClock: AnalogueState;
  digitalClock: DigitalState;
}

export function createAppStore(initialState: Partial<AppState> = {}) {
  const store = configureStore<AppState, AnyAction>({
    reducer: {
      timeOfClock: timeReducer,
      analogueClock: analogueReducer,
      digitalClock: digitalReducer,
    },
    preloadedState: initialState,
  });
  return store;
}

export type AppStore = ReturnType<typeof createAppStore>;

export type AppDispatch = AppStore['dispatch'];

export type AppThunk = (dispatch: AppDispatch, getState: () => AppState) => void;

import { combineReducers, createStore, Store } from 'redux';
import {
  AnalogueAction,
  analogueReducer,
  AnalogueState,
  DigitalAction,
  digitalReducer,
  DigitalState,
  TimeAction,
  timeReducer,
  TimeState,
} from './CompositeClock';

export type AppAction = TimeAction | AnalogueAction | DigitalAction;

export interface AppState {
  timeOfClock: TimeState;
  analogueClock: AnalogueState;
  digitalClock: DigitalState;
}

export type AppStore = Store<AppState, AppAction>;

export type AppDispatch = AppStore['dispatch'];

export function createAppStore(initialState: Partial<AppState> = {}): AppStore {
  const store = createStore(
    combineReducers({
      timeOfClock: timeReducer,
      analogueClock: analogueReducer,
      digitalClock: digitalReducer,
    }),
    initialState
  );
  return store;
}

import { useReducer } from 'react';
import { contextualizeUseReducer } from '../reducerHelpers';
import { ActionTypes, TimeAction } from './TimeActions';

export interface TimeState {
  timestamp: number;
}

const initialState: TimeState = {
  timestamp: 0,
};

function timeReducer(state: TimeState, action: TimeAction): TimeState {
  switch (action.type) {
    case ActionTypes.CHANGE_TIMESTAMP:
      return { ...state, timestamp: action.timestamp };
  }
  return state;
}

const useRawTimeReducer = (initialStateOverride?: TimeState) =>
  useReducer(timeReducer, initialStateOverride ?? initialState);

export const {
  TheStateProvider: TimeStateProvider,
  useTheReducer: useTimeReducer,
  useTheStateGetter: useTimeStateGetter,
} = contextualizeUseReducer(useRawTimeReducer);

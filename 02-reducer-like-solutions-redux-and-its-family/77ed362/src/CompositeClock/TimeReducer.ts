import { ActionTypes, TimeAction } from './TimeActions';

export interface TimeState {
  timestamp: number;
}

export function timeReducer(
  state: TimeState = {
    timestamp: 0,
  },
  action: TimeAction
): TimeState {
  switch (action.type) {
    case ActionTypes.CHANGE_TIMESTAMP:
      return { ...state, timestamp: action.timestamp };
  }
  return state;
}

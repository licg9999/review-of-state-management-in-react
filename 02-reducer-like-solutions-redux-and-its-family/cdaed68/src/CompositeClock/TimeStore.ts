import { ReduceStore } from 'flux/utils';
import { ClockAction, clockDispatcher, getInitialClockState } from './ClockDispatcher';
import { ActionTypes } from './TimeActions';

export interface TimeState {
  timestamp: number;
}

class TimeStore extends ReduceStore<TimeState, ClockAction> {
  constructor() {
    super(clockDispatcher);
  }

  getInitialState(): TimeState {
    return (
      getInitialClockState().time ?? {
        timestamp: 0,
      }
    );
  }

  reduce(state: TimeState, action: ClockAction): TimeState {
    switch (action.type) {
      case ActionTypes.CHANGE_TIMESTAMP:
        return { ...state, timestamp: action.timestamp };
    }
    return state;
  }
}

export const timeStore = new TimeStore();

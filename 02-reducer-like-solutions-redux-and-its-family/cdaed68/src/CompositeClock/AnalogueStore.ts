import { ReduceStore } from 'flux/utils';
import { ActionTypes } from './AnalogueActions';
import { ClockAction, clockDispatcher, getInitialClockState } from './ClockDispatcher';
import { ActionTypes as TimeActionTypes } from './TimeActions';
import { timeStore } from './TimeStore';

const TWO_PI = 2 * Math.PI;

export interface AnalogueAngles {
  hour: number;
  minute: number;
  second: number;
}

export interface AnalogueState {
  displayAngles: AnalogueAngles;
  isEditMode: boolean;
  editModeAngles: AnalogueAngles;
}

class AnalogueStore extends ReduceStore<AnalogueState, ClockAction> {
  constructor() {
    super(clockDispatcher);
  }

  getInitialState(): AnalogueState {
    const displayAngles = this.calcDisplayAngles();
    return (
      getInitialClockState().analogue ?? {
        displayAngles,
        isEditMode: false,
        editModeAngles: displayAngles,
      }
    );
  }

  reduce(state: AnalogueState, action: ClockAction): AnalogueState {
    switch (action.type) {
      case TimeActionTypes.CHANGE_TIMESTAMP:
        clockDispatcher.waitFor([timeStore.getDispatchToken()]);
        return { ...state, displayAngles: this.calcDisplayAngles() };

      case ActionTypes.ENTER_EDIT_MODE:
        return { ...state, isEditMode: true, editModeAngles: state.displayAngles };
      case ActionTypes.EXIT_EDIT_MODE:
        return { ...state, isEditMode: false };
      case ActionTypes.CHANGE_EDIT_MODE_MINUTE_ANGLE:
        return {
          ...state,
          editModeAngles: {
            ...state.editModeAngles,
            minute: (action.minuteAngle + TWO_PI) % TWO_PI,
            hour:
              (Math.floor((state.editModeAngles.hour / TWO_PI) * 12) +
                action.minuteAngle / TWO_PI) *
              (TWO_PI / 12),
          },
        };
    }
    return state;
  }

  calcDisplayAngles(): AnalogueAngles {
    const d = new Date(timeStore.getState().timestamp);
    return {
      hour: ((d.getHours() % 12) / 12) * TWO_PI + (d.getMinutes() / 60) * (TWO_PI / 12),
      minute: (d.getMinutes() / 60) * TWO_PI + (d.getSeconds() / 60) * (TWO_PI / 60),
      second: (d.getSeconds() / 60) * TWO_PI,
    };
  }
}

export const analogueStore = new AnalogueStore();

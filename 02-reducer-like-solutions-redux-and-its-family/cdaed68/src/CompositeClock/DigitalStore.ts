import { format, isMatch } from 'date-fns';
import { ReduceStore } from 'flux/utils';
import { ClockAction, clockDispatcher, initialClockState } from './ClockDispatcher';
import { ActionTypes } from './DigitalActions';
import { ActionTypes as TimeActionTypes } from './TimeActions';
import { timeStore } from './TimeStore';

export interface DigitalState {
  displayText: string;
  isEditMode: boolean;
  editModeText: string;
}

export class DigitalStore extends ReduceStore<DigitalState, ClockAction> {
  static readonly FORMAT = 'HH:mm:ss';

  constructor() {
    super(clockDispatcher);
  }

  getInitialState(): DigitalState {
    const displayText = this.calcDisplayText();
    return (
      initialClockState.digital ?? {
        displayText,
        isEditMode: false,
        editModeText: displayText,
      }
    );
  }

  reduce(state: DigitalState, action: ClockAction): DigitalState {
    switch (action.type) {
      case TimeActionTypes.CHANGE_TIMESTAMP:
        clockDispatcher.waitFor([timeStore.getDispatchToken()]);
        return { ...state, displayText: this.calcDisplayText() };

      case ActionTypes.ENTER_EDIT_MODE:
        return { ...state, isEditMode: true, editModeText: state.displayText };
      case ActionTypes.EXIT_EDIT_MODE:
        return { ...state, isEditMode: false };
      case ActionTypes.CHANGE_EDIT_MODE_TEXT:
        return { ...state, editModeText: action.editModeText };
    }
    return state;
  }

  calcDisplayText(): string {
    return format(timeStore.getState().timestamp, DigitalStore.FORMAT);
  }

  isEditModelTextValid(): boolean {
    return isMatch(this.getState().editModeText, DigitalStore.FORMAT);
  }
}

export const digitalStore = new DigitalStore();

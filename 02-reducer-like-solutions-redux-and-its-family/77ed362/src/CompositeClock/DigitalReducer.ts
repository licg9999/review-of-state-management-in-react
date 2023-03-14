import { format, isMatch } from 'date-fns';
import { ActionTypes, DigitalAction } from './DigitalActions';
import type { TimeState } from './TimeReducer';

export interface DigitalState {
  isEditMode: boolean;
  editModeText: string;
}

export const DIGITAL_TEXT_FORMAT = 'HH:mm:ss';

export function digitalReducer(
  state: DigitalState = {
    isEditMode: false,
    editModeText: '',
  },
  action: DigitalAction
): DigitalState {
  switch (action.type) {
    case ActionTypes.ENTER_EDIT_MODE:
      return { ...state, isEditMode: true, editModeText: action.editModeText };
    case ActionTypes.EXIT_EDIT_MODE:
      return { ...state, isEditMode: false };
    case ActionTypes.CHANGE_EDIT_MODE_TEXT:
      return { ...state, editModeText: action.editModeText };
  }
  return state;
}

export function isEditModeTextValid(state: DigitalState): boolean {
  return isMatch(state.editModeText, DIGITAL_TEXT_FORMAT);
}

export function getDisplayText(timeState: TimeState): string {
  return format(timeState.timestamp, DIGITAL_TEXT_FORMAT);
}

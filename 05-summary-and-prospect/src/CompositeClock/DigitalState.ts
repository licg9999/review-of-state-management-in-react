import { format, isMatch, parse } from 'date-fns';
import { changeTimestamp, TimeState } from './TimeState';

export const DIGITAL_TEXT_FORMAT = 'HH:mm:ss';

export interface DigitalState {
  isEditMode: boolean;
  editModeText: string;
}

export const $digitalState: DigitalState = {
  isEditMode: false,
  editModeText: '',
};

export function getDisplayText(timeState: TimeState): string {
  return format(timeState.timestamp, DIGITAL_TEXT_FORMAT);
}

export function isEditModeTextValid(state: DigitalState): boolean {
  return isMatch(state.editModeText, DIGITAL_TEXT_FORMAT);
}

export function enterEditMode([state, timeState]: [DigitalState, TimeState]): [
  DigitalState,
  TimeState
] {
  if (state.isEditMode) return [state, timeState];
  return [{ ...state, isEditMode: true, editModeText: getDisplayText(timeState) }, timeState];
}

export function exitEditMode(
  [state, timeState]: [DigitalState, TimeState],
  submit: boolean = true
): [DigitalState, TimeState] {
  if (!state.isEditMode) return [state, timeState];
  if (submit && isEditModeTextValid(state)) {
    timeState = changeTimestamp(
      timeState,
      parse(state.editModeText, DIGITAL_TEXT_FORMAT, timeState.timestamp).getTime()
    );
  }
  return [{ ...state, isEditMode: false }, timeState];
}

export function changeEditModeText(state: DigitalState, editModeText: string): DigitalState {
  return { ...state, editModeText };
}

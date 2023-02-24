import { parse } from 'date-fns';
import { Dispatch } from 'react';
import {
  DigitalState,
  DIGITAL_TEXT_FORMAT,
  getDigitalDisplayText,
  isEditModelTextValid,
} from './DigitalReducer';
import { changeTimestamp, TimeAction } from './TimeActions';
import type { TimeState } from './TimeReducer';

export const ActionTypes = {
  ENTER_EDIT_MODE: 'ENTER_EDIT_MODE',
  EXIT_EDIT_MODE: 'EXIT_EDIT_MODE',
  CHANGE_EDIT_MODE_TEXT: 'CHANGE_EDIT_MODE_TEXT',
} as const;

export type DigitalAction =
  | { type: typeof ActionTypes['ENTER_EDIT_MODE']; editModeText: string }
  | { type: typeof ActionTypes['EXIT_EDIT_MODE'] }
  | { type: typeof ActionTypes['CHANGE_EDIT_MODE_TEXT']; editModeText: string };

export function dispatchEnterEditMode(
  getState: () => DigitalState,
  dispatch: Dispatch<DigitalAction>,
  getTimeState: () => TimeState
): void {
  if (getState().isEditMode) return;
  const editModeText = getDigitalDisplayText(getTimeState());
  dispatch({
    type: ActionTypes.ENTER_EDIT_MODE,
    editModeText,
  });
}

export function dispatchExitEditMode(
  getState: () => DigitalState,
  dispatch: Dispatch<DigitalAction>,
  getTimeState: () => TimeState,
  dispatchTime: Dispatch<TimeAction>,
  submit: boolean = true
): void {
  if (!getState().isEditMode) return;
  if (submit && isEditModelTextValid(getState())) {
    dispatchTime(
      changeTimestamp(
        parse(getState().editModeText, DIGITAL_TEXT_FORMAT, getTimeState().timestamp).getTime()
      )
    );
  }
  dispatch({ type: ActionTypes.EXIT_EDIT_MODE });
}

export function changeEditModeText(editModeText: string): DigitalAction {
  return { type: ActionTypes.CHANGE_EDIT_MODE_TEXT, editModeText };
}

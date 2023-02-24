import { Dispatch } from 'react';
import { AnalogueAngles, AnalogueState, getAnalogueDisplayAngles } from './AnalogueReducer';
import { changeTimestamp, TimeAction } from './TimeActions';
import type { TimeState } from './TimeReducer';

const TWO_PI = 2 * Math.PI;

export const ActionTypes = {
  ENTER_EDIT_MODE: 'ENTER_EDIT_MODE',
  EXIT_EDIT_MODE: 'EXIT_EDIT_MODE',
  CHANGE_EDIT_MODE_MINUTE_ANGLE: 'CHANGE_EDIT_MODE_MINUTE_ANGLE',
} as const;

export type AnalogueAction =
  | {
      type: typeof ActionTypes['ENTER_EDIT_MODE'];
      editModeAngles: AnalogueAngles;
    }
  | { type: typeof ActionTypes['EXIT_EDIT_MODE'] }
  | {
      type: typeof ActionTypes['CHANGE_EDIT_MODE_MINUTE_ANGLE'];
      minuteAngle: number;
    };

export function dispatchEnterEditMode(
  getState: () => AnalogueState,
  dispatch: Dispatch<AnalogueAction>,
  getTimeState: () => TimeState
): void {
  if (getState().isEditMode) return;
  const editModeAngles = getAnalogueDisplayAngles(getTimeState());
  dispatch({
    type: ActionTypes.ENTER_EDIT_MODE,
    editModeAngles,
  });
}

export function dispatchExitEditMode(
  getState: () => AnalogueState,
  dispatch: Dispatch<AnalogueAction>,
  getTimeState: () => TimeState,
  dispatchTime: Dispatch<TimeAction>,
  submit: boolean = true
): void {
  if (!getState().isEditMode) return;
  if (submit) {
    const d = new Date(getTimeState().timestamp);
    d.setHours(
      Math.floor((getState().editModeAngles.hour / TWO_PI) * 12) +
        12 * Math.floor(d.getHours() / 12)
    );
    d.setMinutes((getState().editModeAngles.minute / TWO_PI) * 60);
    d.setSeconds((getState().editModeAngles.second / TWO_PI) * 60);
    dispatchTime(changeTimestamp(d.getTime()));
  }
  dispatch({ type: ActionTypes.EXIT_EDIT_MODE });
}

export function changeEditModeMinuteAngle(minuteAngle: number): AnalogueAction {
  return { type: ActionTypes.CHANGE_EDIT_MODE_MINUTE_ANGLE, minuteAngle };
}

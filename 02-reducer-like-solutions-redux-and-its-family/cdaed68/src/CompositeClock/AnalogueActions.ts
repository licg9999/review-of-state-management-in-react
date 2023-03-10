import { analogueStore } from './AnalogueStore';
import { clockDispatcher } from './ClockDispatcher';
import { changeTimestamp } from './TimeActions';
import { timeStore } from './TimeStore';

const TWO_PI = 2 * Math.PI;

const NS = 'ANALOGUE';

export const ActionTypes = {
  ENTER_EDIT_MODE: `${NS}-ENTER_EDIT_MODE`,
  EXIT_EDIT_MODE: `${NS}-EXIT_EDIT_MODE`,
  CHANGE_EDIT_MODE_MINUTE_ANGLE: `${NS}-CHANGE_EDIT_MODE_MINUTE_ANGLE`,
} as const;

export type AnalogueAction =
  | { type: typeof ActionTypes['ENTER_EDIT_MODE'] }
  | { type: typeof ActionTypes['EXIT_EDIT_MODE'] }
  | { type: typeof ActionTypes['CHANGE_EDIT_MODE_MINUTE_ANGLE']; minuteAngle: number };

export function dispatchEnterEditMode(): void {
  if (analogueStore.getState().isEditMode) return;
  clockDispatcher.dispatch({ type: ActionTypes.ENTER_EDIT_MODE });
}

export function dispatchExitEditMode(submit: boolean = true): void {
  const analogueState = analogueStore.getState();
  if (!analogueState.isEditMode) return;
  if (submit) {
    const d = new Date(timeStore.getState().timestamp);
    d.setHours(
      Math.floor((analogueState.editModeAngles.hour / TWO_PI) * 12) +
        12 * Math.floor(d.getHours() / 12)
    );
    d.setMinutes((analogueState.editModeAngles.minute / TWO_PI) * 60);
    d.setSeconds((analogueState.editModeAngles.second / TWO_PI) * 60);
    clockDispatcher.dispatch(changeTimestamp(d.getTime()));
  }
  clockDispatcher.dispatch({ type: ActionTypes.EXIT_EDIT_MODE });
}

export function changeEditModeMinuteAngle(minuteAngle: number): AnalogueAction {
  return { type: ActionTypes.CHANGE_EDIT_MODE_MINUTE_ANGLE, minuteAngle };
}

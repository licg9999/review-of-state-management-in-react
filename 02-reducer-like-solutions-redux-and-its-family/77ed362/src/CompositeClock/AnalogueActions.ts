import type { AppStore } from '../reduxStore';
import { AnalogueAngles, getAnalogueDisplayAngles } from './AnalogueReducer';
import { changeTimestamp } from './TimeActions';

const TWO_PI = 2 * Math.PI;

const NS = 'COMPOSITE_CLOCK-ANALOGUE';

export const ActionTypes = {
  ENTER_EDIT_MODE: `${NS}-ENTER_EDIT_MODE`,
  EXIT_EDIT_MODE: `${NS}-EXIT_EDIT_MODE`,
  CHANGE_EDIT_MODE_MINUTE_ANGLE: `${NS}-CHANGE_EDIT_MODE_MINUTE_ANGLE`,
} as const;

export type AnalogueAction =
  | { type: typeof ActionTypes['ENTER_EDIT_MODE']; editModeAngles: AnalogueAngles }
  | { type: typeof ActionTypes['EXIT_EDIT_MODE'] }
  | { type: typeof ActionTypes['CHANGE_EDIT_MODE_MINUTE_ANGLE']; minuteAngle: number };

export function dispatchEnterEditMode(store: AppStore): void {
  const { timeOfClock, analogueClock } = store.getState();
  if (analogueClock.isEditMode) return;
  const editModeAngles = getAnalogueDisplayAngles(timeOfClock);
  store.dispatch({
    type: ActionTypes.ENTER_EDIT_MODE,
    editModeAngles,
  });
}

export function dispatchExitEditMode(store: AppStore, submit: boolean = true): void {
  const { timeOfClock, analogueClock } = store.getState();
  if (!analogueClock.isEditMode) return;
  if (submit) {
    const d = new Date(timeOfClock.timestamp);
    d.setHours(
      Math.floor((analogueClock.editModeAngles.hour / TWO_PI) * 12) +
        12 * Math.floor(d.getHours() / 12)
    );
    d.setMinutes((analogueClock.editModeAngles.minute / TWO_PI) * 60);
    d.setSeconds((analogueClock.editModeAngles.second / TWO_PI) * 60);
    store.dispatch(changeTimestamp(d.getTime()));
  }
  store.dispatch({ type: ActionTypes.EXIT_EDIT_MODE });
}

export function changeEditModeMinuteAngle(minuteAngle: number): AnalogueAction {
  return { type: ActionTypes.CHANGE_EDIT_MODE_MINUTE_ANGLE, minuteAngle };
}

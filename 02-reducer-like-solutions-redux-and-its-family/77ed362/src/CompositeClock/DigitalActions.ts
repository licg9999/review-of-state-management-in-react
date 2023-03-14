import { parse } from 'date-fns';
import type { AppStore } from '../reduxStore';
import { DIGITAL_TEXT_FORMAT, getDisplayText, isEditModeTextValid } from './DigitalReducer';
import { changeTimestamp } from './TimeActions';

const NS = 'COMPOSITE_CLOCK-DIGITAL';

export const ActionTypes = {
  ENTER_EDIT_MODE: `${NS}-ENTER_EDIT_MODE`,
  EXIT_EDIT_MODE: `${NS}-EXIT_EDIT_MODE`,
  CHANGE_EDIT_MODE_TEXT: `${NS}-CHANGE_EDIT_MODE_TEXT`,
} as const;

export type DigitalAction =
  | { type: typeof ActionTypes['ENTER_EDIT_MODE']; editModeText: string }
  | { type: typeof ActionTypes['EXIT_EDIT_MODE'] }
  | { type: typeof ActionTypes['CHANGE_EDIT_MODE_TEXT']; editModeText: string };

export function dispatchEnterEditMode(store: AppStore): void {
  const { timeOfClock, digitalClock } = store.getState();
  if (digitalClock.isEditMode) return;
  const editModeText = getDisplayText(timeOfClock);
  store.dispatch({
    type: ActionTypes.ENTER_EDIT_MODE,
    editModeText,
  });
}

export function dispatchExitEditMode(store: AppStore, submit: boolean = true): void {
  const { timeOfClock, digitalClock } = store.getState();
  if (!digitalClock.isEditMode) return;
  if (submit && isEditModeTextValid(digitalClock)) {
    store.dispatch(
      changeTimestamp(
        parse(digitalClock.editModeText, DIGITAL_TEXT_FORMAT, timeOfClock.timestamp).getTime()
      )
    );
  }
  store.dispatch({ type: ActionTypes.EXIT_EDIT_MODE });
}

export function changeEditModeText(editModeText: string): DigitalAction {
  return { type: ActionTypes.CHANGE_EDIT_MODE_TEXT, editModeText };
}

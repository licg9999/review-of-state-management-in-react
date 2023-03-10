import { parse } from 'date-fns';
import { clockDispatcher } from './ClockDispatcher';
import { DigitalStore, digitalStore } from './DigitalStore';
import { changeTimestamp } from './TimeActions';
import { timeStore } from './TimeStore';

const NS = 'DIGITAL';

export const ActionTypes = {
  ENTER_EDIT_MODE: `${NS}-ENTER_EDIT_MODE`,
  EXIT_EDIT_MODE: `${NS}-EXIT_EDIT_MODE`,
  CHANGE_EDIT_MODE_TEXT: `${NS}-CHANGE_EDIT_MODE_TEXT`,
} as const;

export type DigitalAction =
  | { type: typeof ActionTypes['ENTER_EDIT_MODE'] }
  | { type: typeof ActionTypes['EXIT_EDIT_MODE'] }
  | { type: typeof ActionTypes['CHANGE_EDIT_MODE_TEXT']; editModeText: string };

export function dispatchEnterEditMode(): void {
  if (digitalStore.getState().isEditMode) return;
  clockDispatcher.dispatch({ type: ActionTypes.ENTER_EDIT_MODE });
}

export function dispatchExitEditMode(submit: boolean = true): void {
  const digitalState = digitalStore.getState();
  if (!digitalState.isEditMode) return;
  if (submit && digitalStore.isEditModelTextValid()) {
    clockDispatcher.dispatch(
      changeTimestamp(
        parse(
          digitalState.editModeText,
          DigitalStore.FORMAT,
          timeStore.getState().timestamp
        ).getTime()
      )
    );
  }
  clockDispatcher.dispatch({ type: ActionTypes.EXIT_EDIT_MODE });
}

export function changeEditModeText(editModeText: string): DigitalAction {
  return { type: ActionTypes.CHANGE_EDIT_MODE_TEXT, editModeText };
}

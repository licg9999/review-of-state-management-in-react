import { format, isMatch, parse } from 'date-fns';
import { proxy } from 'valtio';
import { derive } from 'valtio/utils';
import { changeTimestamp, timeState } from './TimeState';

export const DIGITAL_TEXT_FORMAT = 'HH:mm:ss';

export const digitalState = proxy({
  isEditMode: false,
  editModeText: '',
  get isEditModeTextValid() {
    return isMatch(this.editModeText, DIGITAL_TEXT_FORMAT);
  },
});

export const digitalDerived = derive({
  displayText: (get) => format(get(timeState).timestamp, DIGITAL_TEXT_FORMAT),
});

export function enterEditMode(): void {
  if (digitalState.isEditMode) return;
  digitalState.isEditMode = true;
  digitalState.editModeText = digitalDerived.displayText;
}

export function exitEditMode(submit: boolean = true): void {
  if (!digitalState.isEditMode) return;
  digitalState.isEditMode = false;
  if (submit && digitalState.isEditModeTextValid) {
    changeTimestamp(
      parse(digitalState.editModeText, DIGITAL_TEXT_FORMAT, timeState.timestamp).getTime()
    );
  }
}

export function changeEditModeText(editModeText: string): void {
  digitalState.editModeText = editModeText;
}

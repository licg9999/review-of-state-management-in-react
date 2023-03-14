import { format, isMatch, parse } from 'date-fns';
import { atom, selector, useRecoilCallback } from 'recoil';
import { timeState, useChangeTimestamp } from './TimeState';

export interface DigitalStateValue {
  isEditMode: boolean;
  editModeText: string;
}

export const DIGITAL_TEXT_FORMAT = 'HH:mm:ss';

export const digitalState = atom<DigitalStateValue>({
  key: 'composite_clock-digital',
  default: {
    isEditMode: false,
    editModeText: '',
  },
});

export const displayTextState = selector<string>({
  key: 'composite_clock-digital_display_text',
  get: ({ get }) => format(get(timeState).timestamp, DIGITAL_TEXT_FORMAT),
});

export const isEditModeTextValidState = selector<boolean>({
  key: 'composite_clock-digital_is_edit_mode_text_valid',
  get: ({ get }) => isMatch(get(digitalState).editModeText, DIGITAL_TEXT_FORMAT),
});

export function useEnterEditMode(): () => void {
  return useRecoilCallback(
    ({ snapshot, set }) =>
      () => {
        const { state: stateOfDigital, contents: digital } = snapshot.getLoadable(digitalState);
        if (stateOfDigital !== 'hasValue') throw new Error('State of digital not ready');

        if (digital.isEditMode) return;

        const { state: stateOfDisplayText, contents: displayText } =
          snapshot.getLoadable(displayTextState);
        if (stateOfDisplayText !== 'hasValue') throw new Error('State of displayText not ready');

        set(digitalState, (state) => ({ ...state, isEditMode: true, editModeText: displayText }));
      },
    []
  );
}

export function useExitEditMode(): (submit?: boolean) => void {
  const changeTimestamp = useChangeTimestamp();

  return useRecoilCallback(
    ({ snapshot, set }) =>
      (submit = true) => {
        const { state: stateOfDigital, contents: digital } = snapshot.getLoadable(digitalState);
        if (stateOfDigital !== 'hasValue') throw new Error('State of digital not ready');

        if (!digital.isEditMode) return;

        const { state: stateOfIsEditModeTextValid, contents: isEditModeTextValid } =
          snapshot.getLoadable(isEditModeTextValidState);
        if (stateOfIsEditModeTextValid !== 'hasValue')
          throw new Error('State of isEditModeTextValid not ready');

        if (submit && isEditModeTextValid) {
          const { state: stateOfTime, contents: time } = snapshot.getLoadable(timeState);
          if (stateOfTime !== 'hasValue') throw new Error('State of time not ready');

          changeTimestamp(
            parse(digital.editModeText, DIGITAL_TEXT_FORMAT, time.timestamp).getTime()
          );
        }
        set(digitalState, (state) => ({ ...state, isEditMode: false }));
      },
    [changeTimestamp]
  );
}

export function useChangeEditModeText(): (editModeText: string) => void {
  return useRecoilCallback(
    ({ set }) =>
      (editModeText) => {
        set(digitalState, (state) => ({ ...state, editModeText }));
      },
    []
  );
}

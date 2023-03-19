import { format, isMatch, parse } from 'date-fns';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback } from 'react';
import { timeAtom, useChangeTimestamp } from './TimeAtom';

export interface DigitalState {
  isEditMode: boolean;
  editModeText: string;
}

export const DIGITAL_TEXT_FORMAT = 'HH:mm:ss';

export const digitalAtom = atom<DigitalState>({
  isEditMode: false,
  editModeText: '',
});

export const displayTextAtom = atom<string>((get) =>
  format(get(timeAtom).timestamp, DIGITAL_TEXT_FORMAT)
);

export const isEditModeTextValidAtom = atom<boolean>((get) =>
  isMatch(get(digitalAtom).editModeText, DIGITAL_TEXT_FORMAT)
);

export function useEnterEditMode(): () => void {
  const [digital, setDigital] = useAtom(digitalAtom);
  const displayText = useAtomValue(displayTextAtom);
  return useCallback(() => {
    if (digital.isEditMode) return;
    setDigital((state) => ({ ...state, isEditMode: true, editModeText: displayText }));
  }, [digital, displayText, setDigital]);
}

export function useExitEditMode(): (submit?: boolean) => void {
  const [digital, setDigital] = useAtom(digitalAtom);
  const isEditModeTextValid = useAtom(isEditModeTextValidAtom);
  const time = useAtomValue(timeAtom);
  const changeTimestamp = useChangeTimestamp();

  return useCallback(
    (submit = true) => {
      if (!digital.isEditMode) return;
      if (submit && isEditModeTextValid) {
        changeTimestamp(parse(digital.editModeText, DIGITAL_TEXT_FORMAT, time.timestamp).getTime());
      }
      setDigital((state) => ({ ...state, isEditMode: false }));
    },
    [changeTimestamp, digital, isEditModeTextValid, setDigital, time]
  );
}

export function useChangeEditModeText(): (editModeText: string) => void {
  const setDigital = useSetAtom(digitalAtom);

  return useCallback(
    (editModeText) => {
      setDigital((state) => ({ ...state, editModeText }));
    },
    [setDigital]
  );
}

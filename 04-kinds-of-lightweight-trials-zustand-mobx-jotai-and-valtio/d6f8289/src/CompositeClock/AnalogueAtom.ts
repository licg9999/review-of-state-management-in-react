import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback } from 'react';
import { timeAtom, useChangeTimestamp } from './TimeAtom';

const TWO_PI = 2 * Math.PI;

export interface AnalogueAngles {
  hour: number;
  minute: number;
  second: number;
}

export interface AnalogueState {
  isEditMode: boolean;
  editModeAngles: AnalogueAngles;
}

export const analogueAtom = atom<AnalogueState>({
  isEditMode: false,
  editModeAngles: { hour: 0, minute: 0, second: 0 },
});

export const displayAnglesAtom = atom<AnalogueAngles>((get) => {
  const d = new Date(get(timeAtom).timestamp);
  return {
    hour: ((d.getHours() % 12) / 12) * TWO_PI + (d.getMinutes() / 60) * (TWO_PI / 12),
    minute: (d.getMinutes() / 60) * TWO_PI + (d.getSeconds() / 60) * (TWO_PI / 60),
    second: (d.getSeconds() / 60) * TWO_PI,
  };
});

export function useEnterEditMode(): () => void {
  const [analogue, setAnalogue] = useAtom(analogueAtom);
  const displayAngles = useAtomValue(displayAnglesAtom);

  return useCallback(() => {
    if (analogue.isEditMode) return;
    setAnalogue((state) => ({ ...state, isEditMode: true, editModeAngles: displayAngles }));
  }, [analogue, displayAngles, setAnalogue]);
}

export function useExitEditMode(): (submit?: boolean) => void {
  const [analogue, setAnalogue] = useAtom(analogueAtom);
  const time = useAtomValue(timeAtom);
  const changeTimestamp = useChangeTimestamp();

  return useCallback(
    (submit = true) => {
      if (!analogue.isEditMode) return;
      if (submit) {
        const d = new Date(time.timestamp);
        d.setHours(
          Math.floor((analogue.editModeAngles.hour / TWO_PI) * 12) +
            12 * Math.floor(d.getHours() / 12)
        );
        d.setMinutes((analogue.editModeAngles.minute / TWO_PI) * 60);
        d.setSeconds((analogue.editModeAngles.second / TWO_PI) * 60);
        changeTimestamp(d.getTime());
      }
      setAnalogue((state) => ({ ...state, isEditMode: false }));
    },
    [analogue, changeTimestamp, setAnalogue, time]
  );
}

export function useChangeEditModeMinuteAngle(): (minuteAngle: number) => void {
  const setAnalogue = useSetAtom(analogueAtom);

  return useCallback(
    (minuteAngle) => {
      setAnalogue((state) => ({
        ...state,
        editModeAngles: {
          ...state.editModeAngles,
          minute: (minuteAngle + TWO_PI) % TWO_PI,
          hour:
            (Math.floor((state.editModeAngles.hour / TWO_PI) * 12) + minuteAngle / TWO_PI) *
            (TWO_PI / 12),
        },
      }));
    },
    [setAnalogue]
  );
}

import { atom, selector, useRecoilCallback } from 'recoil';
import { timeState, useChangeTimestamp } from './TimeState';

const TWO_PI = 2 * Math.PI;

export interface AnalogueAngles {
  hour: number;
  minute: number;
  second: number;
}

export interface AnalogueStateValue {
  isEditMode: boolean;
  editModeAngles: AnalogueAngles;
}

export const analogueState = atom<AnalogueStateValue>({
  key: 'composite_clock-analogue',
  default: {
    isEditMode: false,
    editModeAngles: { hour: 0, minute: 0, second: 0 },
  },
});

export const displayAnglesState = selector<AnalogueAngles>({
  key: 'composite_clock-analogue_display_angles',
  get: ({ get }) => {
    const d = new Date(get(timeState).timestamp);
    return {
      hour: ((d.getHours() % 12) / 12) * TWO_PI + (d.getMinutes() / 60) * (TWO_PI / 12),
      minute: (d.getMinutes() / 60) * TWO_PI + (d.getSeconds() / 60) * (TWO_PI / 60),
      second: (d.getSeconds() / 60) * TWO_PI,
    };
  },
});

export function useEnterEditMode(): () => void {
  return useRecoilCallback(
    ({ snapshot, set }) =>
      () => {
        const { state: stateOfAnalogue, contents: analogue } = snapshot.getLoadable(analogueState);
        if (stateOfAnalogue !== 'hasValue') throw new Error('State of analogue not ready');

        if (analogue.isEditMode) return;

        const { state: stateOfDisplayAngles, contents: displayAngles } =
          snapshot.getLoadable(displayAnglesState);
        if (stateOfDisplayAngles !== 'hasValue')
          throw new Error('State of displayAngles not ready');

        set(analogueState, (state) => ({
          ...state,
          isEditMode: true,
          editModeAngles: displayAngles,
        }));
      },
    []
  );
}

export function useExitEditMode(): (submit?: boolean) => void {
  const changeTimestamp = useChangeTimestamp();

  return useRecoilCallback(
    ({ snapshot, set }) =>
      (submit = true) => {
        const { state: stateOfAnalogue, contents: analogue } = snapshot.getLoadable(analogueState);
        if (stateOfAnalogue !== 'hasValue') throw new Error('State of analogue not ready');

        if (!analogue.isEditMode) return;

        if (submit) {
          const { state: stateOfTime, contents: time } = snapshot.getLoadable(timeState);
          if (stateOfTime !== 'hasValue') throw new Error('State of time not ready');

          const d = new Date(time.timestamp);
          d.setHours(
            Math.floor((analogue.editModeAngles.hour / TWO_PI) * 12) +
              12 * Math.floor(d.getHours() / 12)
          );
          d.setMinutes((analogue.editModeAngles.minute / TWO_PI) * 60);
          d.setSeconds((analogue.editModeAngles.second / TWO_PI) * 60);
          changeTimestamp(d.getTime());
        }

        set(analogueState, (state) => ({ ...state, isEditMode: false }));
      },
    []
  );
}

export function useChangeEditModeMinuteAngle(): (minuteAngle: number) => void {
  return useRecoilCallback(({ set }) => (minuteAngle) => {
    set(analogueState, (state) => ({
      ...state,
      editModeAngles: {
        ...state.editModeAngles,
        minute: (minuteAngle + TWO_PI) % TWO_PI,
        hour:
          (Math.floor((state.editModeAngles.hour / TWO_PI) * 12) + minuteAngle / TWO_PI) *
          (TWO_PI / 12),
      },
    }));
  });
}

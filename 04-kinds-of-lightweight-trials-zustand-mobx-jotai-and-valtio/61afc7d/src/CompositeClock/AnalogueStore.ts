import { useCallback } from 'react';
import { create } from 'zustand';
import { TimeState, useTimeStore } from './TimeStore';

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

export interface AnalogueBasicActions {
  _enterEditMode(editModeAngles: AnalogueAngles): void;
  _exitEditMode(): void;
  changeEditModeMinuteAngle(minuteAngle: number): void;
}

export const useAnalogueStore = create<AnalogueState & AnalogueBasicActions>((set, get) => ({
  isEditMode: false,
  editModeAngles: { hour: 0, minute: 0, second: 0 },

  _enterEditMode(editModeAngles) {
    set({ isEditMode: true, editModeAngles });
  },

  _exitEditMode() {
    set({ isEditMode: false });
  },

  changeEditModeMinuteAngle(minuteAngle) {
    const { editModeAngles } = get();
    set({
      editModeAngles: {
        ...editModeAngles,
        minute: (minuteAngle + TWO_PI) % TWO_PI,
        hour:
          (Math.floor((editModeAngles.hour / TWO_PI) * 12) + minuteAngle / TWO_PI) * (TWO_PI / 12),
      },
    });
  },
}));

export function useEnterEditMode(): () => void {
  const state = useAnalogueStore();
  const timeState = useTimeStore();

  return useCallback(() => {
    const { isEditMode, _enterEditMode } = state;
    const displayAngles = getDisplayAngles(timeState);
    if (isEditMode) return;
    _enterEditMode(displayAngles);
  }, [state, timeState]);
}

export function useExitEditMode(): (submit?: boolean) => void {
  const state = useAnalogueStore();
  const timeState = useTimeStore();

  return useCallback(
    (submit = true) => {
      const { isEditMode, editModeAngles, _exitEditMode } = state;
      const { timestamp, changeTimestamp } = timeState;
      if (!isEditMode) return;
      if (submit) {
        const d = new Date(timestamp);
        d.setHours(
          Math.floor((editModeAngles.hour / TWO_PI) * 12) + 12 * Math.floor(d.getHours() / 12)
        );
        d.setMinutes((editModeAngles.minute / TWO_PI) * 60);
        d.setSeconds((editModeAngles.second / TWO_PI) * 60);
        changeTimestamp(d.getTime());
      }
      _exitEditMode();
    },
    [state, timeState]
  );
}

export function getDisplayAngles(timeState: TimeState): AnalogueAngles {
  const d = new Date(timeState.timestamp);
  return {
    hour: ((d.getHours() % 12) / 12) * TWO_PI + (d.getMinutes() / 60) * (TWO_PI / 12),
    minute: (d.getMinutes() / 60) * TWO_PI + (d.getSeconds() / 60) * (TWO_PI / 60),
    second: (d.getSeconds() / 60) * TWO_PI,
  };
}

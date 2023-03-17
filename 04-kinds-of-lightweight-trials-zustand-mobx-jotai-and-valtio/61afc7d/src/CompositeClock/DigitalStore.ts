import { format, isMatch, parse } from 'date-fns';
import { useCallback } from 'react';
import { create } from 'zustand';
import { TimeState, useTimeStore } from './TimeStore';

export interface DigitalState {
  isEditMode: boolean;
  editModeText: string;
}

export interface DigitalBasicActions {
  _enterEditMode(editModeText: string): void;
  _exitEditMode(): void;
  changeEditModeText(editModeText: string): void;
}

export const DIGITAL_TEXT_FORMAT = 'HH:mm:ss';

export const useDigitalStore = create<DigitalState & DigitalBasicActions>((set) => ({
  isEditMode: false,
  editModeText: '',

  _enterEditMode(editModeText) {
    set({ isEditMode: true, editModeText });
  },

  _exitEditMode() {
    set({ isEditMode: false });
  },

  changeEditModeText(editModeText) {
    set({ editModeText });
  },
}));

export function useEnterEditMode(): () => void {
  const state = useDigitalStore();
  const timeState = useTimeStore();

  return useCallback(() => {
    const { isEditMode, _enterEditMode } = state;
    if (isEditMode) return;
    _enterEditMode(getDisplayText(timeState));
  }, [state, timeState]);
}

export function useExitEditMode(): (submit?: boolean) => void {
  const state = useDigitalStore();
  const timeState = useTimeStore();

  return useCallback(
    (submit = true) => {
      const { isEditMode, editModeText, _exitEditMode } = state;
      const { timestamp, changeTimestamp } = timeState;
      if (!isEditMode) return;
      if (submit && isEditModeTextValid(state)) {
        changeTimestamp(parse(editModeText, DIGITAL_TEXT_FORMAT, timestamp).getTime());
      }
      _exitEditMode();
    },
    [state, timeState]
  );
}

export function isEditModeTextValid(state: DigitalState): boolean {
  return isMatch(state.editModeText, DIGITAL_TEXT_FORMAT);
}

export function getDisplayText(timeState: TimeState): string {
  return format(timeState.timestamp, DIGITAL_TEXT_FORMAT);
}

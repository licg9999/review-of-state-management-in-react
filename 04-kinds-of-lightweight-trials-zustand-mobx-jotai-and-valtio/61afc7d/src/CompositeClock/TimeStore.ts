import { create } from 'zustand';

export interface TimeState {
  timestamp: number;
}

export interface TimeActions {
  changeTimestamp(timestamp: number): void;
}

export const useTimeStore = create<TimeState & TimeActions>((set) => ({
  timestamp: 0,
  changeTimestamp(timestamp) {
    set({ timestamp });
  },
}));

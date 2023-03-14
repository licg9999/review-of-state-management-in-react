import { atom, useRecoilCallback } from 'recoil';

export interface TimeStateValue {
  timestamp: number;
}

export const timeState = atom<TimeStateValue>({
  key: 'composite_clock-time',
  default: {
    timestamp: 0,
  },
});

export function useChangeTimestamp(): (timestamp: number) => void {
  return useRecoilCallback(
    ({ set }) =>
      (timestamp) => {
        set(timeState, (state) => ({ ...state, timestamp }));
      },
    []
  );
}

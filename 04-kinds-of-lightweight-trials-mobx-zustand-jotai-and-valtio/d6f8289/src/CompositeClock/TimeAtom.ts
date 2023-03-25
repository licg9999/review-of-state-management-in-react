import { atom, useSetAtom } from 'jotai';
import { useCallback } from 'react';

export interface TimeState {
  timestamp: number;
}

export const timeAtom = atom<TimeState>({
  timestamp: 0,
});

export function useChangeTimestamp(): (timestamp: number) => void {
  const setTime = useSetAtom(timeAtom);

  return useCallback(
    (timestamp) => {
      setTime((state) => ({ ...state, timestamp }));
    },
    [setTime]
  );
}

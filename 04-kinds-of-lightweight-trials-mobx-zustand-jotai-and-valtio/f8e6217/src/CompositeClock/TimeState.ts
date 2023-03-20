import { useInsertionEffect } from 'react';
import { proxy } from 'valtio';

export const timeState = proxy({
  timestamp: 0,
});

export function changeTimestamp(timestamp: number): void {
  timeState.timestamp = timestamp;
}

export function useHydrateTimeState(initialState: Partial<typeof timeState> = {}): void {
  useInsertionEffect(() => {
    Object.assign(timeState, initialState);
  }, []);
}

import { createContext, FC, PropsWithChildren, useContext, useMemo } from 'react';
import { createStore, useStore } from 'zustand';

export interface TimeState {
  timestamp: number;
}

export interface TimeActions {
  changeTimestamp(timestamp: number): void;
}

function createTimeStore(initialState: Partial<TimeState> = {}) {
  return createStore<TimeState & TimeActions>((set) => ({
    timestamp: 0,
    ...initialState,
    changeTimestamp(timestamp) {
      set({ timestamp });
    },
  }));
}

const TimeStoreContext = createContext<ReturnType<typeof createTimeStore> | null>(null);

export const TimeStoreProvider: FC<PropsWithChildren & Partial<TimeState>> = ({
  children,
  ...initialState
}) => {
  const timeStore = useMemo(() => createTimeStore(initialState), [initialState]);
  return <TimeStoreContext.Provider value={timeStore}>{children}</TimeStoreContext.Provider>;
};

export function useTimeStore(): TimeState & TimeActions;
export function useTimeStore<T>(selector: (state: TimeState & TimeActions) => T): T;
export function useTimeStore<T>(
  selector?: (state: TimeState & TimeActions) => T
): (TimeState & TimeActions) | T {
  const timeStore = useContext(TimeStoreContext);
  if (!timeStore) throw new Error('TimeStoreContext not found');
  return useStore(timeStore, (state) => (selector ? selector(state) : state));
}

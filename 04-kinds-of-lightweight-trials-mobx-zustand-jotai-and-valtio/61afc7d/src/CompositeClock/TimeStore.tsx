import { createContext, FC, PropsWithChildren, useContext, useRef } from 'react';
import { createStore, useStore } from 'zustand';

export interface TimeState {
  timestamp: number;
}

export interface TimeActions {
  getTimestamp(): number;
  changeTimestamp(timestamp: number): void;
}

function createTimeStore(initialState: Partial<TimeState> = {}) {
  return createStore<TimeState & TimeActions>((set, get) => ({
    timestamp: 0,
    ...initialState,

    getTimestamp() {
      return get().timestamp;
    },

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
  const refTimeStore = useRef<ReturnType<typeof createTimeStore>>();
  if (!refTimeStore.current) {
    refTimeStore.current = createTimeStore(initialState);
  }
  return (
    <TimeStoreContext.Provider value={refTimeStore.current}>{children}</TimeStoreContext.Provider>
  );
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

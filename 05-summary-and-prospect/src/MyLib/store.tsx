import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AnyFn, MyBaseState } from './types';

export interface MyStore {
  getState<TState extends MyBaseState>($state: TState): TState;

  setState<TState extends MyBaseState>(
    $state: TState,
    stateOrGetState: TState | ((oldState: TState) => TState)
  ): TState;

  subscribe<TState extends MyBaseState>(
    $state: TState,
    onChange: (newState: TState, oldState: TState) => void
  ): () => void;

  unsubscribe<TState extends MyBaseState>(
    $state: TState,
    onChange: (newState: TState, oldState: TState) => void
  ): void;

  clear(): void;
}

class MyStoreImpl implements MyStore {
  stateMap: Map<unknown, unknown> = new Map();
  stateOnChangesMap: Map<unknown, Set<AnyFn>> = new Map();

  getState<TState extends MyBaseState>($state: TState): TState {
    if (!this.stateMap.has($state)) {
      this.stateMap.set($state, $state);
    }
    return this.stateMap.get($state) as TState;
  }

  setState<TState extends MyBaseState>(
    $state: TState,
    stateOrGetState: TState | ((oldState: TState) => TState)
  ): TState {
    const oldState = this.getState($state);
    const newState =
      typeof stateOrGetState === 'function' ? stateOrGetState(oldState) : stateOrGetState;

    if (newState !== oldState) {
      this.stateMap.set($state, newState);
      for (const onChange of this.stateOnChangesMap.get($state) ?? []) {
        onChange(newState, oldState);
      }
    }

    return newState;
  }

  subscribe<TState extends MyBaseState>(
    $state: TState,
    onChange: (newState: TState, oldState: TState) => void
  ): () => void {
    if (!this.stateOnChangesMap.has($state)) {
      this.stateOnChangesMap.set($state, new Set());
    }
    this.stateOnChangesMap.get($state)!.add(onChange);
    return () => this.unsubscribe($state, onChange);
  }

  unsubscribe<TState extends MyBaseState>(
    $state: TState,
    onChange: (newState: TState, oldState: TState) => void
  ): void {
    this.stateOnChangesMap.get($state)?.delete(onChange);
  }

  clear(): void {
    this.stateMap.clear();
    for (const onChangeSet of this.stateOnChangesMap.values()) {
      onChangeSet.clear();
    }
    this.stateOnChangesMap.clear();
  }
}

const MyStoreContext = createContext<MyStore | null>(null);

export interface MyStoreProviderProps extends PropsWithChildren {
  initialize?(store: MyStore): void;
}

export const MyStoreProvider: FC<MyStoreProviderProps> = ({ initialize, children }) => {
  const refInitialize = useRef(initialize);

  useEffect(() => {
    refInitialize.current = initialize;
  }, [initialize]);

  const createMyStore = useCallback(() => {
    const myStore = new MyStoreImpl();
    refInitialize.current?.(myStore);
    return myStore;
  }, []);

  const [myStore, setMyStore] = useState(createMyStore);

  const refMyStore = useRef<MyStore | undefined>(myStore);

  useEffect(() => {
    if (!refMyStore.current) {
      const myStore = createMyStore();
      refMyStore.current = myStore;
      setMyStore(myStore);
    }

    return () => {
      if (refMyStore.current) {
        refMyStore.current.clear();
        delete refMyStore.current;
      }
    };
  }, [createMyStore]);

  return <MyStoreContext.Provider value={myStore}>{children}</MyStoreContext.Provider>;
};

export function useMyStore(): MyStore {
  const myStore = useContext(MyStoreContext);
  if (!myStore) throw new Error('MyStoreContext not found');
  return myStore;
}

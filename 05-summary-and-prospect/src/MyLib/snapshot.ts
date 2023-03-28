import { useEffect, useRef, useState } from 'react';
import { useMyStore } from './store';
import { MyBaseState } from './types';

export function useMySnapshot<TState extends MyBaseState>($state: TState): TState;
export function useMySnapshot<TState extends MyBaseState, TValue = TState>(
  $state: TState,
  select: (state: TState) => TValue
): TValue;
export function useMySnapshot<TState extends MyBaseState, TValue = TState>(
  $state: TState,
  select?: (state: TState) => TValue
): TState | TValue {
  const myStore = useMyStore();

  const [value, setValue] = useState(() => {
    const state = myStore.getState($state);
    return select ? select(state) : state;
  });

  const refValue = useRef(value);
  const refSelect = useRef(select);

  useEffect(() => {
    refSelect.current = select;
  }, [select]);

  useEffect(() => {
    const unsubscribe = myStore.subscribe($state, (state) => {
      const newValue = refSelect.current ? refSelect.current(state) : state;
      if (newValue !== refValue.current) {
        refValue.current = newValue;
        setValue(newValue);
      }
    });
    return unsubscribe;
  }, [$state, myStore]);

  return value;
}

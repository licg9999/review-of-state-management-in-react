import { useCallback } from 'react';
import { useMyStore } from './store';
import { AnyFn, Parameter0, ParametersExcept0 } from './types';

export interface MyOperate {
  <TFn extends AnyFn>(
    $oneOrMoreStates: Parameter0<TFn>,
    fn: TFn,
    ...payloads: ParametersExcept0<TFn>
  ): ReturnType<typeof fn>;
}

export function useMyOperate(): MyOperate {
  const myStore = useMyStore();

  return useCallback(
    ($oneOrMoreStates, fn, ...payloads) => {
      if (Array.isArray($oneOrMoreStates)) {
        const states = fn(
          $oneOrMoreStates.map(($state: {}) => myStore.getState($state)),
          ...payloads
        );
        for (let i = 0, n = $oneOrMoreStates.length; i < n; i++) {
          myStore.setState($oneOrMoreStates[i], states[i]);
        }
        return states;
      } else {
        return myStore.setState(
          $oneOrMoreStates,
          fn(myStore.getState($oneOrMoreStates), ...payloads)
        );
      }
    },
    [myStore]
  );
}

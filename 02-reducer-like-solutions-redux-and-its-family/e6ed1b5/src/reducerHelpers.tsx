import {
  createContext,
  Dispatch,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
} from 'react';

export interface ReturnOfContextualizeUseReducer<TState, TAction> {
  TheStateProvider: FC<TheStateProviderProps<TState>>;
  useTheReducer: () => [TState, Dispatch<TAction>];
  useTheStateGetter: () => () => TState;
}

export interface TheStateProviderProps<TState> extends PropsWithChildren {
  initialStateOverride?: TState;
}

export function contextualizeUseReducer<TState, TAction>(
  useRawReducer: (initialState?: TState) => [TState, Dispatch<TAction>]
): ReturnOfContextualizeUseReducer<TState, TAction> {
  const ReducerContext = createContext<[state: TState, dispatch: Dispatch<TAction>] | null>(null);

  const StateGetterContext = createContext<(() => TState) | null>(null);

  const TheStateProvider: FC<TheStateProviderProps<TState>> = ({
    children,
    initialStateOverride,
  }) => {
    const retRawReducer = useRawReducer(initialStateOverride);
    const [state] = retRawReducer;

    const refState = useRef(state);

    const getState = useCallback(() => refState.current, []);

    useLayoutEffect(() => {
      refState.current = state;
    }, [state]);

    return (
      <ReducerContext.Provider value={retRawReducer}>
        <StateGetterContext.Provider value={getState}>{children}</StateGetterContext.Provider>
      </ReducerContext.Provider>
    );
  };

  const useTheReducer = () => {
    const value = useContext(ReducerContext);
    if (!value) {
      throw new Error('ReducerContext not found');
    }
    return value;
  };

  const useTheStateGetter = () => {
    const value = useContext(StateGetterContext);
    if (!value) {
      throw new Error('StateGetterContext not found');
    }
    return value;
  };

  return {
    TheStateProvider,
    useTheReducer,
    useTheStateGetter,
  };
}

import type { Container } from 'flux/utils';
import React, { FC, useEffect, useState } from 'react';

export function createFunctional<TProps extends React.Attributes, TState>(
  TheFC: FC<TProps & TState>,
  getStores: () => Container.StoresList,
  getState: () => TState
): FC<TProps> {
  return (props) => {
    const [state, setState] = useState(getState());

    useEffect(() => {
      getStores().forEach((s) => s.addListener(() => setState(getState())));
    }, []);

    return <TheFC {...{ ...props, ...state }} />;
  };
}

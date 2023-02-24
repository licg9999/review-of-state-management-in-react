import { useCallback, useEffect, useRef } from 'react';
import { createFunctional } from '../fluxHelpers';
import { analogueStore } from './AnalogueStore';
import { AnalogueView } from './AnalogueView';
import { clockDispatcher, ClockState } from './ClockDispatcher';
import styles from './CompositeView.module.css';
import { digitalStore } from './DigitalStore';
import { DigitalView } from './DigitalView';
import { changeTimestamp } from './TimeActions';
import { timeStore } from './TimeStore';

interface Props {}

export const CompositeView = createFunctional<Props, ClockState>(
  ({ analogue, digital }) => {
    const calcTimestampCorrection = useCallback(
      () => timeStore.getState().timestamp - Date.now(),
      []
    );

    const refTimeCorrection = useRef<number>(calcTimestampCorrection());

    useEffect(() => {
      if (!analogue.isEditMode || !digital.isEditMode) {
        refTimeCorrection.current = calcTimestampCorrection();
      }
    }, [calcTimestampCorrection, analogue.isEditMode, digital.isEditMode]);

    useEffect(() => {
      const tickHandler = setInterval(
        () => clockDispatcher.dispatch(changeTimestamp(Date.now() + refTimeCorrection.current)),
        100
      );
      return () => clearInterval(tickHandler);
    }, []);

    return (
      <div className={styles.root}>
        <AnalogueView {...analogue} />
        <DigitalView {...digital} />
      </div>
    );
  },
  () => [timeStore, analogueStore, digitalStore],
  () => ({
    time: timeStore.getState(),
    analogue: analogueStore.getState(),
    digital: digitalStore.getState(),
  })
);

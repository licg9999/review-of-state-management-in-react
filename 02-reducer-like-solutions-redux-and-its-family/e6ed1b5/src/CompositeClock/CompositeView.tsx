import { FC, useCallback, useEffect, useRef } from 'react';
import { AnalogueStateProvider, useAnalogueReducer } from './AnalogueReducer';
import { AnalogueView } from './AnalogueView';
import styles from './CompositeView.module.css';
import { DigitalStateProvider, useDigitalReducer } from './DigitalReducer';
import { DigitalView } from './DigitalView';
import { changeTimestamp } from './TimeActions';
import { TimeStateProvider, useTimeReducer, useTimeStateGetter } from './TimeReducer';

export const CompositeView: FC = () => {
  const [, dispatchTime] = useTimeReducer();
  const getTimeState = useTimeStateGetter();
  const [analogueState] = useAnalogueReducer();
  const [digitalState] = useDigitalReducer();

  const calcTimestampCorrection = useCallback(
    () => getTimeState().timestamp - Date.now(),
    [getTimeState]
  );

  const refTimeCorrection = useRef<number>(calcTimestampCorrection());

  useEffect(() => {
    if (!analogueState.isEditMode || !digitalState.isEditMode) {
      refTimeCorrection.current = calcTimestampCorrection();
    }
  }, [analogueState.isEditMode, calcTimestampCorrection, digitalState.isEditMode]);

  useEffect(() => {
    const tickHandler = setInterval(
      () => dispatchTime(changeTimestamp(Date.now() + refTimeCorrection.current)),
      100
    );
    return () => clearInterval(tickHandler);
  }, [dispatchTime]);

  return (
    <div className={styles.root}>
      <AnalogueView />
      <DigitalView />
    </div>
  );
};

export const CompositeClock: FC = () => {
  return (
    <TimeStateProvider
      initialStateOverride={{
        timestamp: Date.now(),
      }}
    >
      <AnalogueStateProvider>
        <DigitalStateProvider>
          <CompositeView />
        </DigitalStateProvider>
      </AnalogueStateProvider>
    </TimeStateProvider>
  );
};

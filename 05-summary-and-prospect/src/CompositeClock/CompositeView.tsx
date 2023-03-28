import { FC, useCallback, useEffect, useRef } from 'react';
import { MyStoreProvider, useMyOperate, useMySnapshot, useMyStore } from '../MyLib';
import { $analogueState } from './AnalogueState';
import { AnalogueView } from './AnalogueView';
import styles from './CompositeView.module.css';
import { $digitalState } from './DigitalState';
import { DigitalView } from './DigitalView';
import { $timeState, changeTimestamp } from './TimeState';

export const CompositeView: FC = () => {
  const operate = useMyOperate();
  const store = useMyStore();
  const isEditModeInAnalogueClock = useMySnapshot(
    $analogueState,
    (analogueState) => analogueState.isEditMode
  );
  const isEditModeInDigitalClock = useMySnapshot(
    $digitalState,
    (digitalState) => digitalState.isEditMode
  );

  const calcTimestampCorrection = useCallback(
    () => store.getState($timeState).timestamp - Date.now(),
    [store]
  );

  const refTimeCorrection = useRef<number>(calcTimestampCorrection());

  useEffect(() => {
    if (!isEditModeInAnalogueClock || !isEditModeInDigitalClock) {
      refTimeCorrection.current = calcTimestampCorrection();
    }
  }, [calcTimestampCorrection, isEditModeInAnalogueClock, isEditModeInDigitalClock]);

  useEffect(() => {
    const tickHandler = setInterval(
      () => operate($timeState, changeTimestamp, Date.now() + refTimeCorrection.current),
      100
    );
    return () => clearInterval(tickHandler);
  }, [operate]);

  return (
    <div className={styles.root}>
      <AnalogueView />
      <DigitalView />
    </div>
  );
};

export const CompositeClock: FC = () => {
  return (
    <MyStoreProvider
      initialize={(store) => {
        store.setState($timeState, { timestamp: Date.now() });
      }}
    >
      <CompositeView />
    </MyStoreProvider>
  );
};

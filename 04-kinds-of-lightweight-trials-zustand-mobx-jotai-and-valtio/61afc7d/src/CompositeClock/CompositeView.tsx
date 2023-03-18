import { FC, useCallback, useEffect, useRef } from 'react';
import { useAnalogueStore } from './AnalogueStore';
import { AnalogueView } from './AnalogueView';
import styles from './CompositeView.module.css';
import { useDigitalStore } from './DigitalStore';
import { DigitalView } from './DigitalView';
import { TimeStoreProvider, useTimeStore } from './TimeStore';

export const CompositeView: FC = () => {
  const { timestamp, changeTimestamp } = useTimeStore();
  const isEditModeInAnalogueClock = useAnalogueStore(({ isEditMode }) => isEditMode);
  const isEditModeInDigitalClock = useDigitalStore(({ isEditMode }) => isEditMode);

  const calcTimestampCorrection = useCallback(() => timestamp - Date.now(), [timestamp]);

  const refTimeCorrection = useRef<number>(calcTimestampCorrection());

  useEffect(() => {
    if (!isEditModeInAnalogueClock || !isEditModeInDigitalClock) {
      refTimeCorrection.current = calcTimestampCorrection();
    }
  }, [calcTimestampCorrection, isEditModeInAnalogueClock, isEditModeInDigitalClock]);

  useEffect(() => {
    const tickHandler = setInterval(
      () => changeTimestamp(Date.now() + refTimeCorrection.current),
      100
    );
    return () => clearInterval(tickHandler);
  }, [changeTimestamp]);

  return (
    <div className={styles.root}>
      <AnalogueView />
      <DigitalView />
    </div>
  );
};

export const CompositeClock: FC = () => {
  return (
    <TimeStoreProvider timestamp={Date.now()}>
      <CompositeView />
    </TimeStoreProvider>
  );
};

import { FC, useCallback, useEffect, useRef } from 'react';
import { useSnapshot } from 'valtio';
import { analogueState } from './AnalogueState';
import { AnalogueView } from './AnalogueView';
import styles from './CompositeView.module.css';
import { digitalState } from './DigitalState';
import { DigitalView } from './DigitalView';
import { changeTimestamp, timeState, useHydrateTimeState } from './TimeState';

export const CompositeView: FC = () => {
  useHydrateTimeState({ timestamp: Date.now() });

  const { isEditMode: isEditModeInAnalogueClock } = useSnapshot(analogueState);
  const { isEditMode: isEditModeInDigitalClock } = useSnapshot(digitalState);

  const calcTimestampCorrection = useCallback(() => timeState.timestamp - Date.now(), []);

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
  }, []);

  return (
    <div className={styles.root}>
      <AnalogueView />
      <DigitalView />
    </div>
  );
};

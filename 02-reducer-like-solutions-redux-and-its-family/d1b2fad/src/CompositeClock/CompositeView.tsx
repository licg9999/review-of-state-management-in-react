import { FC, useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector, useAppStore } from '../reduxHooks';
import { AnalogueView } from './AnalogueView';
import styles from './CompositeView.module.css';
import { DigitalView } from './DigitalView';
import { changeTimestamp } from './TimeSlice';

export const CompositeView: FC = () => {
  const dispatch = useAppDispatch();
  const store = useAppStore();
  const isEditModeInAnalogueClock = useAppSelector((appState) => appState.analogueClock.isEditMode);
  const isEditModeInDigitalClock = useAppSelector((appState) => appState.digitalClock.isEditMode);

  const calcTimestampCorrection = useCallback(
    () => store.getState().timeOfClock.timestamp - Date.now(),
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
      () => dispatch(changeTimestamp(Date.now() + refTimeCorrection.current)),
      100
    );
    return () => clearInterval(tickHandler);
  }, [dispatch]);

  return (
    <div className={styles.root}>
      <AnalogueView />
      <DigitalView />
    </div>
  );
};

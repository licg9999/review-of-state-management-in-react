import { Provider, useAtomValue } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { FC, useCallback, useEffect, useRef } from 'react';
import { analogueAtom } from './AnalogueAtom';
import { AnalogueView } from './AnalogueView';
import styles from './CompositeView.module.css';
import { digitalAtom } from './DigitalAtom';
import { DigitalView } from './DigitalView';
import { timeAtom, useChangeTimestamp } from './TimeAtom';

export const CompositeView: FC = () => {
  useHydrateAtoms([[timeAtom, { timestamp: Date.now() }] as const]);

  const { isEditMode: isEditModeInAnalogueClock } = useAtomValue(analogueAtom);
  const { isEditMode: isEditModeInDigitalClock } = useAtomValue(digitalAtom);
  const { timestamp } = useAtomValue(timeAtom);

  const changeTimestamp = useChangeTimestamp();

  const calcTimestampCorrection = useCallback(() => {
    return timestamp - Date.now();
  }, [timestamp]);

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
    <Provider>
      <CompositeView />
    </Provider>
  );
};

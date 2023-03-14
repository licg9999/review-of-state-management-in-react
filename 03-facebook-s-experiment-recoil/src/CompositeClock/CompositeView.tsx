import { FC, useEffect, useRef } from 'react';
import { RecoilRoot, useRecoilCallback, useRecoilValue } from 'recoil';
import { analogueState } from './AnalogueState';
import { AnalogueView } from './AnalogueView';
import styles from './CompositeView.module.css';
import { digitalState } from './DigitalState';
import { DigitalView } from './DigitalView';
import { timeState, useChangeTimestamp } from './TimeState';

export const CompositeView: FC = () => {
  const { isEditMode: isEditModeInAnalogueClock } = useRecoilValue(analogueState);
  const { isEditMode: isEditModeInDigitalClock } = useRecoilValue(digitalState);

  const changeTimestamp = useChangeTimestamp();

  const calcTimestampCorrection = useRecoilCallback(
    ({ snapshot }) =>
      () => {
        const { state: stateOfTime, contents: time } = snapshot.getLoadable(timeState);
        if (stateOfTime !== 'hasValue') throw new Error('State of time not ready');

        return time.timestamp - Date.now();
      },
    []
  );

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
    <RecoilRoot
      initializeState={(snapshot) => {
        snapshot.set(timeState, { timestamp: Date.now() });
      }}
    >
      <CompositeView />
    </RecoilRoot>
  );
};

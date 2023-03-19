import { observer } from 'mobx-react-lite';
import { FC, useCallback, useEffect, useRef } from 'react';
import { AnalogueView } from './AnalogueView';
import styles from './CompositeView.module.css';
import { DigitalView } from './DigitalView';
import { StoresProvider, useStores } from './StoresContext';

export const CompositeView: FC = observer(() => {
  const {
    time: { timestamp, changeTimestamp },
    analogue: { isEditMode: isEditModeInAnalogueClock },
    digital: { isEditMode: isEditModeInDigitalClock },
  } = useStores();

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
});

export const CompositeClock: FC = () => {
  return (
    <StoresProvider>
      <CompositeView />
    </StoresProvider>
  );
};

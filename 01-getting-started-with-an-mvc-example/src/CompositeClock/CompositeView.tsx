import { FC, useEffect, useMemo } from 'react';
import { AnalogueController } from './AnalogueController';
import { AnalogueModel } from './AnalogueModel';
import { AnalogueView } from './AnalogueView';
import { CompositeController } from './CompositeController';
import styles from './CompositeView.module.css';
import { DigitalController } from './DigitalController';
import { DigitalModel } from './DigitalModel';
import { DigitalView } from './DigitalView';
import { TimeModel } from './TimeModel';

export const CompositeView: FC = () => {
  const timeModel = useMemo(() => new TimeModel(), []);
  const analogueModel = useMemo(() => new AnalogueModel(timeModel), [timeModel]);
  const analogueController = useMemo(() => new AnalogueController(analogueModel), [analogueModel]);
  const digitalModel = useMemo(() => new DigitalModel(timeModel), [timeModel]);
  const digitalController = useMemo(() => new DigitalController(digitalModel), [digitalModel]);
  const compositeController = useMemo(
    () => new CompositeController({ analogueModel, digitalModel, timeModel }),
    [analogueModel, digitalModel, timeModel]
  );

  useEffect(() => {
    const tickHandler = setInterval(() => {
      compositeController.tick();
    }, 100);
    return () => clearInterval(tickHandler);
  }, [compositeController]);

  return (
    <div className={styles.root}>
      <AnalogueView model={analogueModel} controller={analogueController} />
      <DigitalView model={digitalModel} controller={digitalController} />
    </div>
  );
};

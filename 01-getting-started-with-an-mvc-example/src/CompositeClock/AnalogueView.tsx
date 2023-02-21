import { FC, useEffect, useState } from 'react';
import { AnalogueController } from './AnalogueController';
import { AnalogueModel } from './AnalogueModel';
import styles from './AnalogueView.module.css';

interface Props {
  className?: string;
  model: AnalogueModel;
  controller: AnalogueController;
}

export const AnalogueView: FC<Props> = ({ className, model, controller }) => {
  const [{ displayAngles, isEditMode, editModeAngles }, setState] = useState(model.getState());

  const angles = isEditMode ? editModeAngles : displayAngles;

  useEffect(() => {
    [
      AnalogueModel.EVENTS.DISPLAY_ANGLES_CHANGED,
      AnalogueModel.EVENTS.IS_EDIT_MODE_CHANGED,
      AnalogueModel.EVENTS.EDIT_MODE_ANGLES_CHANGED,
    ].forEach((event) => {
      model.addListener(event, () => setState(model.getState()));
    });
  }, [model]);

  useEffect(() => {
    window.addEventListener('keydown', controller.onKeyDown);
    return () => window.removeEventListener('keydown', controller.onKeyDown);
  }, [controller]);

  return (
    <div
      className={`${className ?? ''} ${styles.root} ${isEditMode ? styles.editMode : ''}`}
      onMouseLeave={controller.onMouseLeave}
      onMouseUp={controller.onMouseUp}
      onMouseMove={controller.onMouseMove}
    >
      <div className={styles.axis} />
      <div
        className={`${styles.hand} ${styles.hour}`}
        style={{ transform: `rotateZ(${angles.hour}rad)` }}
      />
      <div
        className={`${styles.hand} ${styles.minute}`}
        style={{ transform: `rotateZ(${angles.minute}rad)` }}
        onMouseDown={controller.onMinuteHandMouseDown}
      />
      <div
        className={`${styles.hand} ${styles.second}`}
        style={{ transform: `rotateZ(${angles.second}rad)` }}
      />
    </div>
  );
};

import { FC, useCallback, useEffect, useMemo } from 'react';
import {
  changeEditModeMinuteAngle,
  dispatchEnterEditMode,
  dispatchExitEditMode,
} from './AnalogueActions';
import { getDisplayAngles, useAnalogueReducer, useAnalogueStateGetter } from './AnalogueReducer';
import styles from './AnalogueView.module.css';
import { useTimeReducer, useTimeStateGetter } from './TimeReducer';

const TWO_PI = 2 * Math.PI;

interface Props {
  className?: string;
}

export const AnalogueView: FC<Props> = ({ className }) => {
  const [state, dispatch] = useAnalogueReducer();
  const getState = useAnalogueStateGetter();
  const [timeState, dispatchTime] = useTimeReducer();
  const getTimeState = useTimeStateGetter();

  const { isEditMode, editModeAngles } = state;
  const displayAngles = useMemo(() => getDisplayAngles(timeState), [timeState]);

  const angles = isEditMode ? editModeAngles : displayAngles;

  const calcEditModeMinuteAngle = useCallback(
    (pointX: number, pointY: number): number => {
      const pointLen = Math.sqrt(Math.pow(pointX, 2) + Math.pow(pointY, 2));

      const normalizedX = pointX / pointLen;
      const normalizedY = pointY / pointLen;

      const oldX = Math.sin(editModeAngles.minute);
      const oldY = Math.cos(editModeAngles.minute);

      const rawMinuteAngle = Math.acos(normalizedY);

      const minuteAngle =
        normalizedY > 0 && oldY > 0
          ? normalizedX >= 0
            ? oldX < 0
              ? rawMinuteAngle + TWO_PI
              : rawMinuteAngle
            : oldX >= 0
            ? -rawMinuteAngle
            : -rawMinuteAngle + TWO_PI
          : normalizedX >= 0
          ? rawMinuteAngle
          : -rawMinuteAngle + TWO_PI;

      return minuteAngle;
    },
    [editModeAngles]
  );

  const onMinuteHandMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      dispatchEnterEditMode(getState, dispatch, getTimeState);
    },
    [dispatch, getState, getTimeState]
  );

  const onMouseLeave = useCallback(
    () => dispatchExitEditMode(getState, dispatch, getTimeState, dispatchTime),
    [dispatch, dispatchTime, getState, getTimeState]
  );

  const onMouseUp = useCallback(
    () => dispatchExitEditMode(getState, dispatch, getTimeState, dispatchTime),
    [dispatch, dispatchTime, getState, getTimeState]
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent): void => {
      if (isEditMode && e.key === 'Escape') {
        dispatchExitEditMode(getState, dispatch, getTimeState, dispatchTime, false);
      }
    },
    [dispatch, dispatchTime, getState, getTimeState, isEditMode]
  );

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>): void => {
      if (!isEditMode) return;

      const boundingBox = e.currentTarget.getBoundingClientRect();
      const originX = boundingBox.x + boundingBox.width / 2;
      const originY = boundingBox.y + boundingBox.height / 2;

      const pointX = e.clientX - originX;
      const pointY = originY - e.clientY;

      dispatch(changeEditModeMinuteAngle(calcEditModeMinuteAngle(pointX, pointY)));
    },
    [calcEditModeMinuteAngle, dispatch, isEditMode]
  );

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onKeyDown]);

  return (
    <div
      className={`${className ?? ''} ${styles.root} ${isEditMode ? styles.editMode : ''}`}
      onMouseLeave={onMouseLeave}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
    >
      <div className={styles.axis} />
      <div
        className={`${styles.hand} ${styles.hour}`}
        style={{ transform: `rotateZ(${angles.hour}rad)` }}
      />
      <div
        className={`${styles.hand} ${styles.minute}`}
        style={{ transform: `rotateZ(${angles.minute}rad)` }}
        onMouseDown={onMinuteHandMouseDown}
      />
      <div
        className={`${styles.hand} ${styles.second}`}
        style={{ transform: `rotateZ(${angles.second}rad)` }}
      />
    </div>
  );
};

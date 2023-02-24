import { FC, useCallback, useEffect, useMemo, useRef } from 'react';
import { changeEditModeText, dispatchEnterEditMode, dispatchExitEditMode } from './DigitalActions';
import {
  DIGITAL_TEXT_FORMAT,
  getDigitalDisplayText,
  isEditModelTextValid,
  useDigitalReducer,
  useDigitalStateGetter,
} from './DigitalReducer';
import styles from './DigitalView.module.css';
import { useTimeReducer, useTimeStateGetter } from './TimeReducer';

interface Props {
  className?: string;
}

export const DigitalView: FC<Props> = ({ className }) => {
  const [state, dispatch] = useDigitalReducer();
  const getState = useDigitalStateGetter();
  const [timeState, dispatchTime] = useTimeReducer();
  const getTimeState = useTimeStateGetter();

  const { isEditMode, editModeText } = state;
  const displayText = useMemo(() => getDigitalDisplayText(timeState), [timeState]);

  const refEditor = useRef<HTMLInputElement | null>(null);

  const onDisplayClick = useCallback(
    () => dispatchEnterEditMode(getState, dispatch, getTimeState),
    [dispatch, getState, getTimeState]
  );

  const onEditorBlur = useCallback(
    () => dispatchExitEditMode(getState, dispatch, getTimeState, dispatchTime, false),
    [dispatch, dispatchTime, getState, getTimeState]
  );

  const onEditorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => dispatch(changeEditModeText(e.target.value)),
    [dispatch]
  );

  const onEditorKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        dispatchExitEditMode(getState, dispatch, getTimeState, dispatchTime);
      }
    },
    [dispatch, dispatchTime, getState, getTimeState]
  );

  useEffect(() => {
    if (isEditMode && refEditor.current) {
      refEditor.current.select();
    }
  }, [isEditMode]);

  return (
    <div className={`${className ?? ''} ${styles.root} ${isEditMode ? styles.editMode : ''}`}>
      {isEditMode ? (
        <>
          <input
            className={styles.editor}
            type="text"
            ref={refEditor}
            value={editModeText}
            onBlur={onEditorBlur}
            onChange={onEditorChange}
            onKeyDown={onEditorKeyDown}
          />
          {!isEditModelTextValid(state) && (
            <div className={styles.invalidHint}>
              The input time doesn't match the expected format which is '{DIGITAL_TEXT_FORMAT}'.
            </div>
          )}
        </>
      ) : (
        <div onClick={onDisplayClick}>{displayText}</div>
      )}
    </div>
  );
};

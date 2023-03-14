import { FC, useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../reduxHooks';
import {
  changeEditModeText,
  DIGITAL_TEXT_FORMAT,
  enterEditMode,
  exitEditMode,
  getDisplayText,
  isEditModeTextValid,
} from './DigitalSlice';
import styles from './DigitalView.module.css';

interface Props {
  className?: string;
}

export const DigitalView: FC<Props> = ({ className }) => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((appState) => appState.digitalClock);
  const { isEditMode, editModeText } = state;
  const displayText = useAppSelector((appState) => getDisplayText(appState.timeOfClock));

  const refEditor = useRef<HTMLInputElement | null>(null);

  const onDisplayClick = useCallback(() => dispatch(enterEditMode()), [dispatch]);

  const onEditorBlur = useCallback(() => dispatch(exitEditMode(false)), [dispatch]);

  const onEditorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => dispatch(changeEditModeText(e.target.value)),
    [dispatch]
  );

  const onEditorKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        dispatch(exitEditMode());
      }
    },
    [dispatch]
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
          {!isEditModeTextValid(state) && (
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

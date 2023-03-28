import { FC, useCallback, useEffect, useRef } from 'react';
import { useMyOperate, useMySnapshot } from '../MyLib';
import {
  $digitalState,
  changeEditModeText,
  DIGITAL_TEXT_FORMAT,
  enterEditMode,
  exitEditMode,
  getDisplayText,
  isEditModeTextValid,
} from './DigitalState';
import styles from './DigitalView.module.css';
import { $timeState } from './TimeState';

interface Props {
  className?: string;
}

export const DigitalView: FC<Props> = ({ className }) => {
  const operate = useMyOperate();
  const state = useMySnapshot($digitalState);
  const { isEditMode, editModeText } = state;
  const displayText = useMySnapshot($timeState, getDisplayText);

  const refEditor = useRef<HTMLInputElement | null>(null);

  const onDisplayClick = useCallback(() => {
    operate([$digitalState, $timeState], enterEditMode);
  }, [operate]);

  const onEditorBlur = useCallback(() => {
    operate([$digitalState, $timeState], exitEditMode, false);
  }, [operate]);

  const onEditorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      operate($digitalState, changeEditModeText, e.target.value);
    },
    [operate]
  );

  const onEditorKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        operate([$digitalState, $timeState], exitEditMode);
      }
    },
    [operate]
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

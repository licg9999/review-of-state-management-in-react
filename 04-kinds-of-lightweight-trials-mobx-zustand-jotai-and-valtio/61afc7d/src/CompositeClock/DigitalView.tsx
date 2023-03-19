import { FC, useCallback, useEffect, useRef } from 'react';
import {
  DIGITAL_TEXT_FORMAT,
  getDisplayText,
  isEditModeTextValid,
  useDigitalStore,
  useEnterEditMode,
  useExitEditMode,
} from './DigitalStore';
import styles from './DigitalView.module.css';
import { useTimeStore } from './TimeStore';

interface Props {
  className?: string;
}

export const DigitalView: FC<Props> = ({ className }) => {
  const state = useDigitalStore();
  const { isEditMode, editModeText, changeEditModeText } = state;
  const displayText = useTimeStore(getDisplayText);

  const enterEditMode = useEnterEditMode();
  const exitEditMode = useExitEditMode();

  const refEditor = useRef<HTMLInputElement | null>(null);

  const onDisplayClick = enterEditMode;

  const onEditorBlur = useCallback(() => exitEditMode(false), [exitEditMode]);

  const onEditorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => changeEditModeText(e.target.value),
    [changeEditModeText]
  );

  const onEditorKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        exitEditMode();
      }
    },
    [exitEditMode]
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

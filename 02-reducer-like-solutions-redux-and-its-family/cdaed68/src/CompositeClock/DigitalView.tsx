import { FC, useCallback, useEffect, useRef } from 'react';
import { clockDispatcher } from './ClockDispatcher';
import { changeEditModeText, dispatchEnterEditMode, dispatchExitEditMode } from './DigitalActions';
import { DigitalState, DigitalStore, digitalStore } from './DigitalStore';
import styles from './DigitalView.module.css';

interface Props extends DigitalState {
  className?: string;
}

export const DigitalView: FC<Props> = ({ className, displayText, isEditMode, editModeText }) => {
  const refEditor = useRef<HTMLInputElement | null>(null);

  const onDisplayClick = useCallback(() => dispatchEnterEditMode(), []);

  const onEditorBlur = useCallback(() => dispatchExitEditMode(false), []);

  const onEditorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      clockDispatcher.dispatch(changeEditModeText(e.target.value)),
    []
  );

  const onEditorKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      dispatchExitEditMode();
    }
  }, []);

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
          {!digitalStore.isEditModeTextValid() && (
            <div className={styles.invalidHint}>
              The input time doesn't match the expected format which is '{DigitalStore.FORMAT}'.
            </div>
          )}
        </>
      ) : (
        <div onClick={onDisplayClick}>{displayText}</div>
      )}
    </div>
  );
};

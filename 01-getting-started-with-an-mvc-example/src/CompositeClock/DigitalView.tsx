import { FC, useEffect, useRef, useState } from 'react';
import { DigitalController } from './DigitalController';
import { DigitalModel } from './DigitalModel';
import styles from './DigitalView.module.css';

interface Props {
  className?: string;
  model: DigitalModel;
  controller: DigitalController;
}

export const DigitalView: FC<Props> = ({ className, model, controller }) => {
  const [{ displayText, isEditMode, editModeText }, setState] = useState(model.getState());

  const refEditor = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    [
      DigitalModel.EVENTS.DISPLAY_TEXT_CHANGED,
      DigitalModel.EVENTS.IS_EDIT_MODE_CHANGED,
      DigitalModel.EVENTS.EDIT_MODE_TEXT_CHANGED,
    ].forEach((event) => {
      model.addListener(event, () => setState(model.getState()));
    });
  }, [model]);

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
            onBlur={controller.onEditorBlur}
            onChange={controller.onEditorChange}
            onKeyDown={controller.onEditorKeyDown}
          />
          {!model.isEditModelTextValid() && (
            <div className={styles.invalidHint}>
              The input time doesn't match the expected format which is '{DigitalModel.FORMAT}'.
            </div>
          )}
        </>
      ) : (
        <div onClick={controller.onDisplayClick}>{displayText}</div>
      )}
    </div>
  );
};

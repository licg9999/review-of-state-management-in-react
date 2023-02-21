import type React from 'react';
import { DigitalModel } from './DigitalModel';

export class DigitalController {
  private model: DigitalModel;

  constructor(model: DigitalModel) {
    this.model = model;
  }

  onDisplayClick = (): void => {
    this.model.enterEditMode();
  };

  onEditorBlur = (): void => {
    this.model.exitEditMode(false);
  };

  onEditorChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.model.changeEditModeText(e.target.value);
  };

  onEditorKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      this.model.exitEditMode();
    }
  };
}

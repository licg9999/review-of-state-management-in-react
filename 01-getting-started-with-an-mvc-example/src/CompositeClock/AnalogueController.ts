import type React from 'react';
import { AnalogueModel } from './AnalogueModel';

const TWO_PI = 2 * Math.PI;

export class AnalogueController {
  private model: AnalogueModel;

  constructor(model: AnalogueModel) {
    this.model = model;
  }

  onMinuteHandMouseDown = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.preventDefault();
    this.model.enterEditMode();
  };

  onMouseLeave = (): void => {
    this.model.exitEditMode();
  };

  onMouseUp = (): void => {
    this.model.exitEditMode();
  };

  onKeyDown = (e: KeyboardEvent): void => {
    if (this.model.getState().isEditMode && e.key === 'Escape') {
      this.model.exitEditMode(false);
    }
  };

  onMouseMove = (e: React.MouseEvent<HTMLDivElement>): void => {
    const { isEditMode } = this.model.getState();
    if (!isEditMode) return;

    const boundingBox = e.currentTarget.getBoundingClientRect();
    const originX = boundingBox.x + boundingBox.width / 2;
    const originY = boundingBox.y + boundingBox.height / 2;

    const pointX = e.clientX - originX;
    const pointY = originY - e.clientY;

    this.model.changeEditModeMinuteAngle(this.calcEditModeMinuteAngle(pointX, pointY));
  };

  calcEditModeMinuteAngle(pointX: number, pointY: number): number {
    const pointLen = Math.sqrt(Math.pow(pointX, 2) + Math.pow(pointY, 2));

    const normalizedX = pointX / pointLen;
    const normalizedY = pointY / pointLen;

    const { editModeAngles } = this.model.getState();
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
  }
}

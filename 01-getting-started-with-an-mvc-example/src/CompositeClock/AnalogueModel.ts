import { EventEmitter } from 'events';
import { TimeModel } from './TimeModel';

const TWO_PI = 2 * Math.PI;

export interface AnalogueAngles {
  hour: number;
  minute: number;
  second: number;
}

export interface AnalogueState {
  displayAngles: AnalogueAngles;
  isEditMode: boolean;
  editModeAngles: AnalogueAngles;
}

export class AnalogueModel extends EventEmitter {
  static readonly EVENTS = {
    DISPLAY_ANGLES_CHANGED: 'display-angles-changed',
    IS_EDIT_MODE_CHANGED: 'is-edit-mode-changed',
    EDIT_MODE_ANGLES_CHANGED: 'edit-mode-angles-changed',
  } as const;

  private timeModel: TimeModel;
  private displayAngles: AnalogueAngles;
  private isEditMode: boolean;
  private editModeAngles: AnalogueAngles;

  constructor(timeModel: TimeModel) {
    super();
    this.timeModel = timeModel;
    this.displayAngles = this.calcDisplayAngles();
    this.isEditMode = false;
    this.editModeAngles = { ...this.displayAngles };
    this.timeModel.addListener(TimeModel.EVENTS.TIMESTAMP_CHANGED, () => this.syncDisplayAngles());
  }

  getState(): AnalogueState {
    return {
      displayAngles: this.displayAngles,
      isEditMode: this.isEditMode,
      editModeAngles: this.editModeAngles,
    };
  }

  calcDisplayAngles(): AnalogueAngles {
    const d = new Date(this.timeModel.getState().timestamp);
    return {
      hour: ((d.getHours() % 12) / 12) * TWO_PI + (d.getMinutes() / 60) * (TWO_PI / 12),
      minute: (d.getMinutes() / 60) * TWO_PI + (d.getSeconds() / 60) * (TWO_PI / 60),
      second: (d.getSeconds() / 60) * TWO_PI,
    };
  }

  syncDisplayAngles(): void {
    this.displayAngles = this.calcDisplayAngles();
    this.emit(AnalogueModel.EVENTS.DISPLAY_ANGLES_CHANGED);
  }

  enterEditMode(): void {
    if (this.isEditMode) return;
    this.isEditMode = true;
    this.editModeAngles = { ...this.displayAngles };
    this.emit(AnalogueModel.EVENTS.IS_EDIT_MODE_CHANGED);
  }

  exitEditMode(submit: boolean = true): void {
    if (!this.isEditMode) return;
    this.isEditMode = false;
    if (submit) {
      const d = new Date(this.timeModel.getState().timestamp);
      d.setHours(
        Math.floor((this.editModeAngles.hour / TWO_PI) * 12) + 12 * Math.floor(d.getHours() / 12)
      );
      d.setMinutes((this.editModeAngles.minute / TWO_PI) * 60);
      d.setSeconds((this.editModeAngles.second / TWO_PI) * 60);
      this.timeModel.changeTimestamp(d.getTime());
    }
    this.emit(AnalogueModel.EVENTS.IS_EDIT_MODE_CHANGED);
  }

  changeEditModeMinuteAngle(minuteAngle: number): void {
    this.editModeAngles.minute = (minuteAngle + TWO_PI) % TWO_PI;
    this.editModeAngles.hour =
      (Math.floor((this.editModeAngles.hour / TWO_PI) * 12) + minuteAngle / TWO_PI) * (TWO_PI / 12);
    this.emit(AnalogueModel.EVENTS.EDIT_MODE_ANGLES_CHANGED);
  }
}

import { format, isMatch, parse } from 'date-fns';
import { EventEmitter } from 'events';
import { TimeModel } from './TimeModel';

export interface DigitalState {
  displayText: string;
  isEditMode: boolean;
  editModeText: string;
}

export class DigitalModel extends EventEmitter {
  static readonly EVENTS = {
    DISPLAY_TEXT_CHANGED: 'display-text-changed',
    IS_EDIT_MODE_CHANGED: 'is-edit-mode-changed',
    EDIT_MODE_TEXT_CHANGED: 'edit-mode-text-changed',
  } as const;

  static readonly FORMAT = 'HH:mm:ss';

  private timeModel: TimeModel;
  private displayText: string;
  private isEditMode: boolean;
  private editModeText: string;

  constructor(timeModel: TimeModel) {
    super();

    this.timeModel = timeModel;
    this.displayText = this.calcDisplayText();
    this.isEditMode = false;
    this.editModeText = this.displayText;

    this.timeModel.addListener(TimeModel.EVENTS.TIMESTAMP_CHANGED, () => this.syncDisplayText());
  }

  getState(): DigitalState {
    return {
      displayText: this.displayText,
      isEditMode: this.isEditMode,
      editModeText: this.editModeText,
    };
  }

  calcDisplayText(): string {
    return format(this.timeModel.getState().timestamp, DigitalModel.FORMAT);
  }

  syncDisplayText(): void {
    this.displayText = this.calcDisplayText();
    this.emit(DigitalModel.EVENTS.DISPLAY_TEXT_CHANGED);
  }

  enterEditMode(): void {
    if (this.isEditMode) return;
    this.isEditMode = true;
    this.editModeText = this.displayText;
    this.emit(DigitalModel.EVENTS.IS_EDIT_MODE_CHANGED);
  }

  exitEditMode(submit: boolean = true): void {
    if (!this.isEditMode) return;
    this.isEditMode = false;
    if (submit && this.isEditModeTextValid()) {
      this.timeModel.changeTimestamp(
        parse(this.editModeText, DigitalModel.FORMAT, this.timeModel.getState().timestamp).getTime()
      );
    }
    this.emit(DigitalModel.EVENTS.IS_EDIT_MODE_CHANGED);
  }

  changeEditModeText(editModeText: string): void {
    this.editModeText = editModeText;
    this.emit(DigitalModel.EVENTS.EDIT_MODE_TEXT_CHANGED);
  }

  isEditModeTextValid(): boolean {
    return isMatch(this.editModeText, DigitalModel.FORMAT);
  }
}

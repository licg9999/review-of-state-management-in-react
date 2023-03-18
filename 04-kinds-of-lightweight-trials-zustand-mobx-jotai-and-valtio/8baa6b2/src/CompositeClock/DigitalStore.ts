import { format, isMatch, parse } from 'date-fns';
import { makeAutoObservable } from 'mobx';
import { TimeStore } from './TimeStore';

export class DigitalStore {
  static readonly FORMAT = 'HH:mm:ss';

  private timeStore: TimeStore;

  isEditMode: boolean;
  editModeText: string;

  get displayText(): string {
    return format(this.timeStore.timestamp, DigitalStore.FORMAT);
  }

  get isEditModeTextValid(): boolean {
    return isMatch(this.editModeText, DigitalStore.FORMAT);
  }

  constructor(timeStore: TimeStore) {
    makeAutoObservable(this);
    this.timeStore = timeStore;
    this.isEditMode = false;
    this.editModeText = this.displayText;
  }

  enterEditMode = (): void => {
    if (this.isEditMode) return;
    this.isEditMode = true;
    this.editModeText = this.displayText;
  };

  exitEditMode = (submit: boolean = true): void => {
    if (!this.isEditMode) return;
    this.isEditMode = false;
    if (submit && this.isEditModeTextValid) {
      this.timeStore.changeTimestamp(
        parse(this.editModeText, DigitalStore.FORMAT, this.timeStore.timestamp).getTime()
      );
    }
  };

  changeEditModeText = (editModeText: string): void => {
    this.editModeText = editModeText;
  };
}

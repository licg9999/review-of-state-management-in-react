import { makeAutoObservable } from 'mobx';
import { TimeStore } from './TimeStore';

const TWO_PI = 2 * Math.PI;

export interface AnalogueAngles {
  hour: number;
  minute: number;
  second: number;
}

export class AnalogueStore {
  private timeStore: TimeStore;

  isEditMode: boolean;
  editModeAngles: AnalogueAngles;

  get displayAngles(): AnalogueAngles {
    const d = new Date(this.timeStore.timestamp);
    return {
      hour: ((d.getHours() % 12) / 12) * TWO_PI + (d.getMinutes() / 60) * (TWO_PI / 12),
      minute: (d.getMinutes() / 60) * TWO_PI + (d.getSeconds() / 60) * (TWO_PI / 60),
      second: (d.getSeconds() / 60) * TWO_PI,
    };
  }

  constructor(timeStore: TimeStore) {
    makeAutoObservable(this);
    this.timeStore = timeStore;
    this.isEditMode = false;
    this.editModeAngles = this.displayAngles;
  }

  enterEditMode = (): void => {
    if (this.isEditMode) return;
    this.isEditMode = true;
    this.editModeAngles = this.displayAngles;
  };

  exitEditMode = (submit: boolean = true): void => {
    if (!this.isEditMode) return;
    this.isEditMode = false;
    if (submit) {
      const d = new Date(this.timeStore.timestamp);
      d.setHours(
        Math.floor((this.editModeAngles.hour / TWO_PI) * 12) + 12 * Math.floor(d.getHours() / 12)
      );
      d.setMinutes((this.editModeAngles.minute / TWO_PI) * 60);
      d.setSeconds((this.editModeAngles.second / TWO_PI) * 60);
      this.timeStore.changeTimestamp(d.getTime());
    }
  };

  changeEditModeMinuteAngle = (minuteAngle: number): void => {
    this.editModeAngles.minute = (minuteAngle + TWO_PI) % TWO_PI;
    this.editModeAngles.hour =
      (Math.floor((this.editModeAngles.hour / TWO_PI) * 12) + minuteAngle / TWO_PI) * (TWO_PI / 12);
  };
}

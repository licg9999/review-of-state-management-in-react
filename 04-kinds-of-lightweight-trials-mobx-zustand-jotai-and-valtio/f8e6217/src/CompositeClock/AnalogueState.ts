import { proxy } from 'valtio';
import { derive } from 'valtio/utils';
import { changeTimestamp, timeState } from './TimeState';

const TWO_PI = 2 * Math.PI;

export interface AnalogueAngles {
  hour: number;
  minute: number;
  second: number;
}

export const analogueState = proxy({
  isEditMode: false,
  editModeAngles: { hour: 0, minute: 0, second: 0 } as AnalogueAngles,
});

export const analogueDerived = derive({
  displayAngles: (get) => {
    const d = new Date(get(timeState).timestamp);
    return {
      hour: ((d.getHours() % 12) / 12) * TWO_PI + (d.getMinutes() / 60) * (TWO_PI / 12),
      minute: (d.getMinutes() / 60) * TWO_PI + (d.getSeconds() / 60) * (TWO_PI / 60),
      second: (d.getSeconds() / 60) * TWO_PI,
    };
  },
});

export function enterEditMode(): void {
  if (analogueState.isEditMode) return;
  analogueState.isEditMode = true;
  analogueState.editModeAngles = analogueDerived.displayAngles;
}

export function exitEditMode(submit: boolean = true): void {
  if (!analogueState.isEditMode) return;
  analogueState.isEditMode = false;
  if (submit) {
    const d = new Date(timeState.timestamp);
    d.setHours(
      Math.floor((analogueState.editModeAngles.hour / TWO_PI) * 12) +
        12 * Math.floor(d.getHours() / 12)
    );
    d.setMinutes((analogueState.editModeAngles.minute / TWO_PI) * 60);
    d.setSeconds((analogueState.editModeAngles.second / TWO_PI) * 60);
    changeTimestamp(d.getTime());
  }
}

export function changeEditModeMinuteAngle(minuteAngle: number): void {
  analogueState.editModeAngles.minute = (minuteAngle + TWO_PI) % TWO_PI;
  analogueState.editModeAngles.hour =
    (Math.floor((analogueState.editModeAngles.hour / TWO_PI) * 12) + minuteAngle / TWO_PI) *
    (TWO_PI / 12);
}

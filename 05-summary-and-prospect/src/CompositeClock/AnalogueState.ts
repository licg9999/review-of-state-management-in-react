import { changeTimestamp, TimeState } from './TimeState';

const TWO_PI = 2 * Math.PI;

export interface AnalogueAngles {
  hour: number;
  minute: number;
  second: number;
}

export interface AnalogueState {
  isEditMode: boolean;
  editModeAngles: AnalogueAngles;
}

export const $analogueState: AnalogueState = {
  isEditMode: false,
  editModeAngles: { hour: 0, minute: 0, second: 0 },
};

export function getDisplayAngles(timeState: TimeState): AnalogueAngles {
  const d = new Date(timeState.timestamp);
  return {
    hour: ((d.getHours() % 12) / 12) * TWO_PI + (d.getMinutes() / 60) * (TWO_PI / 12),
    minute: (d.getMinutes() / 60) * TWO_PI + (d.getSeconds() / 60) * (TWO_PI / 60),
    second: (d.getSeconds() / 60) * TWO_PI,
  };
}

export function enterEditMode([state, timeState]: [AnalogueState, TimeState]): [
  AnalogueState,
  TimeState
] {
  if (state.isEditMode) return [state, timeState];
  return [{ ...state, isEditMode: true, editModeAngles: getDisplayAngles(timeState) }, timeState];
}

export function exitEditMode(
  [state, timeState]: [AnalogueState, TimeState],
  submit: boolean = true
): [AnalogueState, TimeState] {
  if (!state.isEditMode) return [state, timeState];
  if (submit) {
    const d = new Date(timeState.timestamp);
    d.setHours(
      Math.floor((state.editModeAngles.hour / TWO_PI) * 12) + 12 * Math.floor(d.getHours() / 12)
    );
    d.setMinutes((state.editModeAngles.minute / TWO_PI) * 60);
    d.setSeconds((state.editModeAngles.second / TWO_PI) * 60);
    timeState = changeTimestamp(timeState, d.getTime());
  }
  return [{ ...state, isEditMode: false }, timeState];
}

export function changeEditModeMinuteAngle(
  state: AnalogueState,
  minuteAngle: number
): AnalogueState {
  return {
    ...state,
    editModeAngles: {
      ...state.editModeAngles,
      minute: (minuteAngle + TWO_PI) % TWO_PI,
      hour:
        (Math.floor((state.editModeAngles.hour / TWO_PI) * 12) + minuteAngle / TWO_PI) *
        (TWO_PI / 12),
    },
  };
}

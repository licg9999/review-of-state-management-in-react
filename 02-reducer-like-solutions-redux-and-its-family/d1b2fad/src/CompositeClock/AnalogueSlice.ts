import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppThunk } from '../reduxStore';
import { changeTimestamp, TimeState } from './TimeSlice';

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

const initialState: AnalogueState = {
  isEditMode: false,
  editModeAngles: { hour: 0, minute: 0, second: 0 },
};

const analogueSlice = createSlice({
  name: 'COMPOSITE_CLOCK-ANALOGUE',
  initialState,
  reducers: {
    _enterEditMode(state, action: PayloadAction<AnalogueAngles>) {
      state.isEditMode = true;
      state.editModeAngles = action.payload;
    },

    _exitEditMode(state) {
      state.isEditMode = false;
    },

    changeEditModeMinuteAngle(state, action: PayloadAction<number>) {
      const minuteAngle = action.payload;
      state.editModeAngles.minute = (minuteAngle + TWO_PI) % TWO_PI;
      state.editModeAngles.hour =
        (Math.floor((state.editModeAngles.hour / TWO_PI) * 12) + minuteAngle / TWO_PI) *
        (TWO_PI / 12);
    },
  },
});

const { _enterEditMode, _exitEditMode } = analogueSlice.actions;

export const { changeEditModeMinuteAngle } = analogueSlice.actions;

export const analogueReducer = analogueSlice.reducer;

export function enterEditMode(): AppThunk {
  return (dispatch, getState) => {
    const { timeOfClock, analogueClock } = getState();
    if (analogueClock.isEditMode) return;
    const editModeAngles = getDisplayAngles(timeOfClock);
    dispatch(_enterEditMode(editModeAngles));
  };
}

export function exitEditMode(submit: boolean = true): AppThunk {
  return (dispatch, getState) => {
    const { timeOfClock, analogueClock } = getState();
    if (!analogueClock.isEditMode) return;
    if (submit) {
      const d = new Date(timeOfClock.timestamp);
      d.setHours(
        Math.floor((analogueClock.editModeAngles.hour / TWO_PI) * 12) +
          12 * Math.floor(d.getHours() / 12)
      );
      d.setMinutes((analogueClock.editModeAngles.minute / TWO_PI) * 60);
      d.setSeconds((analogueClock.editModeAngles.second / TWO_PI) * 60);
      dispatch(changeTimestamp(d.getTime()));
    }
    dispatch(_exitEditMode());
  };
}

export function getDisplayAngles(timeState: TimeState): AnalogueAngles {
  const d = new Date(timeState.timestamp);
  return {
    hour: ((d.getHours() % 12) / 12) * TWO_PI + (d.getMinutes() / 60) * (TWO_PI / 12),
    minute: (d.getMinutes() / 60) * TWO_PI + (d.getSeconds() / 60) * (TWO_PI / 60),
    second: (d.getSeconds() / 60) * TWO_PI,
  };
}

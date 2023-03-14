import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { format, isMatch, parse } from 'date-fns';
import type { AppThunk } from '../reduxStore';
import { changeTimestamp, TimeState } from './TimeSlice';

export const DIGITAL_TEXT_FORMAT = 'HH:mm:ss';

export interface DigitalState {
  isEditMode: boolean;
  editModeText: string;
}

const initialState: DigitalState = {
  isEditMode: false,
  editModeText: '',
};

const digitalSlice = createSlice({
  name: 'COMPOSITE_CLOCK-DIGITAL',
  initialState,
  reducers: {
    _enterEditMode(state, action: PayloadAction<string>) {
      state.isEditMode = true;
      state.editModeText = action.payload;
    },

    _exitEditMode(state) {
      state.isEditMode = false;
    },

    changeEditModeText(state, action: PayloadAction<string>) {
      state.editModeText = action.payload;
    },
  },
});

const { _enterEditMode, _exitEditMode } = digitalSlice.actions;

export const { changeEditModeText } = digitalSlice.actions;

export const digitalReducer = digitalSlice.reducer;

export function enterEditMode(): AppThunk {
  return (dispatch, getState) => {
    const { timeOfClock, digitalClock } = getState();
    if (digitalClock.isEditMode) return;
    const editModeText = getDisplayText(timeOfClock);
    dispatch(_enterEditMode(editModeText));
  };
}

export function exitEditMode(submit: boolean = true): AppThunk {
  return (dispatch, getState) => {
    const { timeOfClock, digitalClock } = getState();
    if (!digitalClock.isEditMode) return;
    if (submit && isEditModeTextValid(digitalClock)) {
      dispatch(
        changeTimestamp(
          parse(digitalClock.editModeText, DIGITAL_TEXT_FORMAT, timeOfClock.timestamp).getTime()
        )
      );
    }
    dispatch(_exitEditMode());
  };
}

export function isEditModeTextValid(state: DigitalState): boolean {
  return isMatch(state.editModeText, DIGITAL_TEXT_FORMAT);
}

export function getDisplayText(timeState: TimeState): string {
  return format(timeState.timestamp, DIGITAL_TEXT_FORMAT);
}

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TimeState {
  timestamp: number;
}

const initialState: TimeState = {
  timestamp: 0,
};

const timeSlice = createSlice({
  name: 'COMPOSITE_CLOCK-TIME',
  initialState,
  reducers: {
    changeTimestamp(state, action: PayloadAction<number>) {
      state.timestamp = action.payload;
    },
  },
});

export const { changeTimestamp } = timeSlice.actions;

export const timeReducer = timeSlice.reducer;

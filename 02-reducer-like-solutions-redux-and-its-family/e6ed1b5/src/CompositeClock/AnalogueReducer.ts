import { useReducer } from 'react';
import { contextualizeUseReducer } from '../reducerHelpers';
import { ActionTypes, AnalogueAction } from './AnalogueActions';
import type { TimeState } from './TimeReducer';

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

function reducer(state: AnalogueState, action: AnalogueAction): AnalogueState {
  switch (action.type) {
    case ActionTypes.ENTER_EDIT_MODE:
      return { ...state, isEditMode: true, editModeAngles: action.editModeAngles };
    case ActionTypes.EXIT_EDIT_MODE:
      return { ...state, isEditMode: false };
    case ActionTypes.CHANGE_EDIT_MODE_MINUTE_ANGLE:
      return {
        ...state,
        editModeAngles: {
          ...state.editModeAngles,
          minute: (action.minuteAngle + TWO_PI) % TWO_PI,
          hour:
            (Math.floor((state.editModeAngles.hour / TWO_PI) * 12) + action.minuteAngle / TWO_PI) *
            (TWO_PI / 12),
        },
      };
  }
  return state;
}

const useRawReducer = () => useReducer(reducer, initialState);

export const {
  TheStateProvider: AnalogueStateProvider,
  useTheReducer: useAnalogueReducer,
  useTheStateGetter: useAnalogueStateGetter,
} = contextualizeUseReducer(useRawReducer);

export function getDisplayAngles(timeState: TimeState): AnalogueAngles {
  const d = new Date(timeState.timestamp);
  return {
    hour: ((d.getHours() % 12) / 12) * TWO_PI + (d.getMinutes() / 60) * (TWO_PI / 12),
    minute: (d.getMinutes() / 60) * TWO_PI + (d.getSeconds() / 60) * (TWO_PI / 60),
    second: (d.getSeconds() / 60) * TWO_PI,
  };
}

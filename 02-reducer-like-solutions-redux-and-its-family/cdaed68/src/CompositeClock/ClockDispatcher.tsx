import { Dispatcher } from 'flux';
import type { AnalogueAction } from './AnalogueActions';
import type { AnalogueState } from './AnalogueStore';
import type { DigitalAction } from './DigitalActions';
import type { DigitalState } from './DigitalStore';
import type { TimeAction } from './TimeActions';
import type { TimeState } from './TimeStore';

export type ClockAction = TimeAction | AnalogueAction | DigitalAction;

export interface ClockState {
  time: TimeState;
  analogue: AnalogueState;
  digital: DigitalState;
}

export const initialClockState: Partial<ClockState> = {
  time: {
    timestamp: Date.now(),
  },
};

export const clockDispatcher = new Dispatcher<ClockAction>();

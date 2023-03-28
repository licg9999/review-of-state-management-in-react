export interface TimeState {
  timestamp: number;
}

export const $timeState: TimeState = {
  timestamp: 0,
};

export function changeTimestamp(timeState: TimeState, timestamp: number): TimeState {
  return { ...timeState, timestamp };
}

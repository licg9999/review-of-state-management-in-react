const NS = 'TIME';

export const ActionTypes = {
  CHANGE_TIMESTAMP: `${NS}-CHANGE_TIMESTAMP`,
} as const;

export type TimeAction = {
  type: typeof ActionTypes['CHANGE_TIMESTAMP'];
  timestamp: number;
};

export function changeTimestamp(timestamp: number): TimeAction {
  return {
    type: ActionTypes.CHANGE_TIMESTAMP,
    timestamp,
  };
}

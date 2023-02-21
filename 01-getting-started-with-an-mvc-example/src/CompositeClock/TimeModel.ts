import { EventEmitter } from 'events';

export interface TimeState {
  timestamp: number;
}

export class TimeModel extends EventEmitter {
  static readonly EVENTS = {
    TIMESTAMP_CHANGED: 'timestamp-changed',
  } as const;

  private timestamp: number;

  constructor(timestamp?: number) {
    super();
    this.timestamp = timestamp ?? Date.now();
  }

  getState(): TimeState {
    return {
      timestamp: this.timestamp,
    };
  }

  changeTimestamp(timestamp: number) {
    this.timestamp = timestamp;
    this.emit(TimeModel.EVENTS.TIMESTAMP_CHANGED);
  }
}

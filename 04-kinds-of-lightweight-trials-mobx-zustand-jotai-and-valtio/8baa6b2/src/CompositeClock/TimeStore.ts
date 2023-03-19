import { makeAutoObservable } from 'mobx';

export class TimeStore {
  timestamp: number;

  constructor(timestamp?: number) {
    makeAutoObservable(this);
    this.timestamp = timestamp ?? Date.now();
  }

  changeTimestamp = (timestamp: number): void => {
    this.timestamp = timestamp;
  };
}

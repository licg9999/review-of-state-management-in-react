import { AnalogueModel } from './AnalogueModel';
import { DigitalModel } from './DigitalModel';
import { TimeModel } from './TimeModel';

export class CompositeController {
  private analogueModel: AnalogueModel;
  private digitalModel: DigitalModel;
  private timeModel: TimeModel;
  private timestampCorrection: number;

  constructor(models: {
    analogueModel: AnalogueModel;
    digitalModel: DigitalModel;
    timeModel: TimeModel;
  }) {
    this.analogueModel = models.analogueModel;
    this.digitalModel = models.digitalModel;
    this.timeModel = models.timeModel;
    this.timestampCorrection = this.calcTimestampCorrection();

    this.analogueModel.addListener(AnalogueModel.EVENTS.IS_EDIT_MODE_CHANGED, () => {
      if (!this.analogueModel.getState().isEditMode) {
        this.timestampCorrection = this.calcTimestampCorrection();
      }
    });

    this.digitalModel.addListener(DigitalModel.EVENTS.IS_EDIT_MODE_CHANGED, () => {
      if (!this.digitalModel.getState().isEditMode) {
        this.timestampCorrection = this.calcTimestampCorrection();
      }
    });
  }

  calcTimestampCorrection(): number {
    return this.timeModel.getState().timestamp - Date.now();
  }

  tick(): void {
    this.timeModel.changeTimestamp(Date.now() + this.timestampCorrection);
  }
}

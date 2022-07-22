import {FastEvent} from "index-common";
// @ts-ignore
import {ScheduleAuthoritiesChangeEvent} from "../../../../types";

export class ScheduleAuthoritiesChangeStorage {

  private readonly event: FastEvent;

  constructor(event: FastEvent) {
    this.event = event;
  }

  public async store() {
    const data = this.event.data;

    const _event = new ScheduleAuthoritiesChangeEvent(this.event.id);
    _event.atBlockNumber = this.event.blockNumber;
    _event.message = data[0].toString();

    _event.timestamp = this.event.timestamp;
    await _event.save();
  }
}

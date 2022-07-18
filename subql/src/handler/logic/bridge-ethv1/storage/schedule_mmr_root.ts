import {FastEvent} from "../../../../common";
import {ScheduleMMRRootEvent} from "../../../../types";

export class ScheduleMMRRootStorage {
  private readonly event: FastEvent;

  constructor(event: FastEvent) {
    this.event = event;
  }

  public async store() {
    const data = this.event.data;
    const eventBlockNumber = data[0].toString();

    const _event = new ScheduleMMRRootEvent(eventBlockNumber);
    _event.atBlockNumber = this.event.blockNumber;
    _event.eventBlockNumber = Number(eventBlockNumber);
    _event.emitted = 0;
    _event.outdated = 0;

    _event.timestamp = this.event.timestamp;
    await _event.save();
  }


}

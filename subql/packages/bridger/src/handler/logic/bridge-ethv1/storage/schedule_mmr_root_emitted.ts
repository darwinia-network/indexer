import {FastEvent} from "@darwinia/index-common";
// @ts-ignore
import {ScheduleMMRRootEvent} from "../../../../types";

export class ScheduleMMRRootEmittedStorage {
  private readonly event: FastEvent;

  constructor(event: FastEvent) {
    this.event = event;
  }

  public async store() {
    const atBlock = this.event.blockNumber;
    const scheduleMMRRootBlock = atBlock - 30;
    const schedule_mmr_root_event = await ScheduleMMRRootEvent.get(scheduleMMRRootBlock.toString());
    if (schedule_mmr_root_event.emitted == 1) {
      return;
    }
    schedule_mmr_root_event.outdated = 1;
    await schedule_mmr_root_event.save();
  }
}

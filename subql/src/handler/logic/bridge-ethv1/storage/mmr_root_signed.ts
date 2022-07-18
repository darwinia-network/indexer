import {FastEvent} from "../../../../common";
import {MMRRootSignedEvent, ScheduleMMRRootEvent} from "../../../../types";
import {SignatureStorage} from "./signature";

export class MMRRootSignedStorage {
  private readonly event: FastEvent;

  constructor(event: FastEvent) {
    this.event = event;
  }

  public async store() {

    /*
    [
      1407130,
      "0x75f1445ed127d880b5c93984f177ae0102e1d3a36a94e6e343eaa8b6df565a65",
      [
        [
          "2sy7imEZs1Y9GgYrR5Vqkb8EZTmpv2BKr5QNRzB9gkzdAEU2",
          "0x2cf3dc0e5fc6d81ac5e1b9931c09d3fa47c2c00f72e7ba082f3f057d045fd9352703bb7035281ec9e523b16f1834c108d175a6bb57b44606559b5d743815951c1c"
        ]
      ]
    ]
     */

    const data = this.event.data;
    const eventBlockNumber = data[0].toString();
    const mmrRoot = data[1].toString();

    logger.info(`EVENT BLOCK NUMBER: ${eventBlockNumber}`);
    logger.info(`MMRROOT: ${mmrRoot}`);

    const _event = new MMRRootSignedEvent(this.event.id);
    _event.atBlockNumber = this.event.blockNumber;
    _event.eventBlockNumber = Number(eventBlockNumber);
    _event.mmrRoot = mmrRoot;
    _event.timestamp = this.event.timestamp;
    await _event.save();

    const _signatures = data[2].toJSON() as [string, string][];
    let ix = 0;

    for (const item of _signatures) {
      const account = item[0];
      const relayAuthoritySignature = item[1];
      const id = `${this.event.id}-${ix}`;
      await new SignatureStorage(this.event, {id, account, relayAuthoritySignature}).store();
      ix += 1;
    }

    const schedule_mmr_root_event = await ScheduleMMRRootEvent.get(eventBlockNumber);
    schedule_mmr_root_event.emitted = 1;
    await schedule_mmr_root_event.save();
  }

}

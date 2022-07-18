import {FastEvent} from "../../../../common";
import {AuthoritiesChangeSignedEvent} from "../../../../types";
import {SignatureStorage} from "./signature";


export class AuthoritiesChangeSignedStorage {

  private readonly event: FastEvent;

  constructor(event: FastEvent) {
    this.event = event;
  }

  public async store() {
    const data = this.event.data;

    const term = Number(data[0].toString());
    const newAuthorities = data[1].toJSON() as Array<string>;
    const _signatures = data[2].toJSON() as [string, string][];


    const _event = new AuthoritiesChangeSignedEvent(this.event.id);
    _event.atBlockNumber = this.event.blockNumber;
    _event.term = term;
    _event.newAuthorities = newAuthorities;

    _event.timestamp = this.event.timestamp;
    await _event.save();

    let ix = 0;
    for (const item of _signatures) {
      const account = item[0];
      const relayAuthoritySignature = item[1];
      const id = `${this.event.id}-${ix}`;

      await new SignatureStorage(this.event, {id, account, relayAuthoritySignature}).store();
      ix += 1;
    }
  }
}

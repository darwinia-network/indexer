import {FastEvent} from "@darwinia/index-common";
// @ts-ignore
import {CollectingNewMessageRootSignaturesEvent} from "../../../../types";


export class CollectingNewMessageRootSignaturesStorage {

  private readonly event: FastEvent;

  constructor(event: FastEvent) {
    this.event = event;
  }

  public async store() {
    const data = this.event.data;
    const message = data[0].toString();

    const _event = new CollectingNewMessageRootSignaturesEvent(this.event.id);
    _event.blockNumber = this.event.blockNumber;
    _event.blockHash = this.event.blockHash;
    _event.message = message;
    _event.timestamp = this.event.timestamp;
    await _event.save();
  }

}

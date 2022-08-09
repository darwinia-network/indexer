import {FastEvent} from "@darwinia/index-common";
// @ts-ignore
import {CollectedEnoughAuthoritiesChangeSignaturesEvent, XEcdsaSignature} from "../../../../types";


export class CollectedEnoughAuthoritiesChangeSignaturesStorage {

  private readonly event: FastEvent;

  constructor(event: FastEvent) {
    this.event = event;
  }

  public async store() {
    const data = this.event.data;
    const operation = data[0].toString();
    const message = data[1].toString();
    const signatures = data[2].toJSON() as unknown as Array<Array<string>>;

    for (let i = 0; i < signatures.length; i++) {
      const item = signatures[i];
      const id = `ac-${this.event.id}-${i}`;
      const [address, signature] = item;
      const xecdsaSignature = new XEcdsaSignature(id);
      xecdsaSignature.blockNumber = this.event.blockNumber;
      xecdsaSignature.blockHash = this.event.blockHash;
      xecdsaSignature.address = address;
      xecdsaSignature.signature = signature;
      xecdsaSignature.newMessageRootSignaturesId = this.event.id;
      await xecdsaSignature.save();
    }

    const _event = new CollectedEnoughAuthoritiesChangeSignaturesEvent(this.event.id);
    _event.blockNumber = this.event.blockNumber;
    _event.blockHash = this.event.blockHash;
    _event.operation = operation;
    _event.message = message;
    await _event.save();
  }

}

import {FastEvent} from "@darwinia/index-common";
// @ts-ignore
import {CollectedEnoughNewMessageRootSignaturesEvent, XEcdsaSignature} from "../../../../types";


export class CollectedEnoughNewMessageRootSignaturesStorage {

  private readonly event: FastEvent;

  constructor(event: FastEvent) {
    this.event = event;
  }

  public async store() {
    const data = this.event.data;
    const commitment = data[0].toJSON() as unknown as Commitment;
    const message = data[1].toString();
    const signatures = data[2].toJSON() as unknown as Array<Array<string>>;

    for (let i = 0; i < signatures.length; i++) {
      const item = signatures[i];
      const id = `ms-${this.event.id}-${i}`;
      const [address, signature] = item;
      const xecdsaSignature = new XEcdsaSignature(id);
      xecdsaSignature.blockNumber = this.event.blockNumber;
      xecdsaSignature.blockHash = this.event.blockHash;
      xecdsaSignature.address = address;
      xecdsaSignature.signature = signature;
      xecdsaSignature.newMessageRootSignaturesId = this.event.id;
      await xecdsaSignature.save();
    }

    const _event = new CollectedEnoughNewMessageRootSignaturesEvent(this.event.id);
    _event.blockNumber = this.event.blockNumber;
    _event.blockHash = this.event.blockHash;
    _event.message = message;
    _event.commitmentBlockNumber = commitment.blockNumber;
    _event.commitmentMessageRoot = commitment.messageRoot;
    _event.commitmentNonce = commitment.nonce;
    await _event.save();

  }


}

import {FastEvent} from "@darwinia/index-common";
// @ts-ignore
import {CollectedEnoughNewMessageRootSignaturesEvent, XEcdsaSignature} from "../../../../types";


export class CollectedEnoughNewMessageRootSignaturesStorage {

  private readonly event: FastEvent;

  constructor(event: FastEvent) {
    this.event = event;
  }

  public async store() {

    /*
    [
      {
        "blockNumber": 3711780,
        "messageRoot": "0x16102e5bf1f33924650782ab750bc8aa9e72d2798a842697450cc2bb725ff874",
        "nonce": 0
      },
      "0x331a5c39bad492d36b8306eb45792c3198c374eb0dc188bc704729f9330093f3", [
        [
         "0x68898db1012808808c903f390909c52d9f706749",
         "0x9d534608bb6a55ebf900e4835e90d0355aa4e30830ba3e3f6f3fdf913b59fec138412bc5957975f23370ea2a035e9b4d6a69a9effc4a32de0789490b4a0947d701"
        ]
      ]
    ]
     */

    const data = this.event.data;
    const commitment = data[0].toJSON() as unknown as Commitment;
    const message = data[1].toString();
    const signatures = data[2].toJSON() as unknown as Array<Array<string>>;

    const _event = new CollectedEnoughNewMessageRootSignaturesEvent(this.event.id);
    _event.blockNumber = this.event.blockNumber;
    _event.blockHash = this.event.blockHash;
    _event.message = message;
    _event.commitmentBlockNumber = commitment.blockNumber;
    _event.commitmentMessageRoot = commitment.messageRoot;
    _event.commitmentNonce = commitment.nonce;
    await _event.save();

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

  }


}

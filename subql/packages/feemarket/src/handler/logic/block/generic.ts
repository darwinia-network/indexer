import {Chain, FastBlock, FastEvent, FastExtrinsic, IndexHandler} from "@darwinia/index-common";
// @ts-ignore
import {Block} from "../../../types";

export class GenericBlockHandler implements IndexHandler {

  private readonly chain: Chain;

  constructor(chain: Chain) {
    this.chain = chain;
  }

  static async ensureBlock(id: string): Promise<void> {
    const block = await Block.get(id);

    if (!block) {
      await new Block(id).save();
    }
  }

  name(): string {
    return `${this.chain}-block`;
  }

  async handleBlock(block: FastBlock): Promise<void> {
    const id = block.hash;
    const record = await Block.get(id) || new Block(id);

    record.number = block.number;
    record.timestamp = block.raw.timestamp;
    record.specVersion = block.specVersion;
    record.parentHash = block.parentHash;

    await record.save();
  }

  async handleCall(call: FastExtrinsic): Promise<void> {
  }

  async handleEvent(event: FastEvent): Promise<void> {
  }

}

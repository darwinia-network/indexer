import {Chain, FastBlock, FastEvent, FastExtrinsic, IndexHandler} from "index-common";
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
    const savedBlock = await Block.get(id);
    if (!savedBlock) {
      await new Block(id).save();
    }
  }

  async handleCall(call: FastExtrinsic): Promise<void> {
  }

  async handleEvent(event: FastEvent): Promise<void> {
  }

}

import {Chain, FastBlock, FastEvent, FastExtrinsic, IndexHandler} from "../../../common";
import {MMRNodeEntity} from "../../../types";

export class MMRHandler implements IndexHandler {

  private readonly chain: Chain;

  constructor(chain: Chain) {
    this.chain = chain;
  }

  name(): string {
    return `${this.chain}-mmr`;
  }

  async handleBlock(block: FastBlock): Promise<void> {
  }

  async handleCall(call: FastExtrinsic): Promise<void> {
  }

  async handleEvent(event: FastEvent): Promise<void> {
    await MMRNodeEntity.get(event.id);
  }

}

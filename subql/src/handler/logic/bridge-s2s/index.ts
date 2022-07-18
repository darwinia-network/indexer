import {Chain, FastBlock, FastEvent, FastExtrinsic, IndexHandler} from "../../../common";

export class BridgeS2SHandler implements IndexHandler {

  private readonly chain: Chain;

  constructor(chain: Chain) {
    this.chain = chain;
  }

  name(): string {
    return `${this.chain}-bridge-s2s`;
  }

  async handleBlock(block: FastBlock): Promise<void> {
  }

  async handleCall(call: FastExtrinsic): Promise<void> {
  }

  async handleEvent(event: FastEvent): Promise<void> {
    const eventId = event.id;
    const eventSection = event.section;
    const eventMethod = event.method;
    const blockNumber = event.blockNumber;
    const eventKey = `${eventSection}:${eventMethod}`;
    logger.info(`[${this.chain}] [event] Received event: [${eventKey}] [${eventId}] in block ${blockNumber}`);

  }

}

import {FastBlock, FastEvent, FastExtrinsic, IndexHandler} from "index-common";


export abstract class BasicChainHandler implements IndexHandler {

  private readonly _name: string;

  protected constructor(name?: string) {
    this._name = name ?? 'basic';
  }

  name(): string {
    return this._name;
  }

  abstract handlers(): Array<IndexHandler>;

  async handleBlock(block: FastBlock): Promise<void> {
    for (const handler of this.handlers()) {
      try {
        await handler.handleBlock(block);
      } catch (e) {
        logger.error(`Failed to handle block when call ${handler.name()} handler`, e);
      }
    }
  }

  async handleEvent(event: FastEvent): Promise<void> {
    for (const handler of this.handlers()) {
      try {
        await handler.handleEvent(event);
      } catch (e) {
        logger.error(`Failed to handle event when call ${handler.name()} handler`, e);
      }
    }
  }

  async handleCall(call: FastExtrinsic): Promise<void> {
    for (const handler of this.handlers()) {
      try {
        await handler.handleCall(call);
      } catch (e) {
        logger.error(`Failed to handle call when call ${handler.name()} handler`, e);
      }
    }
  }

}

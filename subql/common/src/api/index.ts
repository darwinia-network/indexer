import {FastBlock, FastEvent, FastExtrinsic} from "../types";

/**
 * index handler
 */
export interface IndexHandler {
  /**
   * handler name
   */
  name(): string;
  /**
   * handle event
   */
  handleEvent(event: FastEvent): Promise<void>;

  /**
   * handle block
   */
  handleBlock(block: FastBlock): Promise<void>;

  /**
   * handle call
   */
  handleCall(call: FastExtrinsic): Promise<void>;
}

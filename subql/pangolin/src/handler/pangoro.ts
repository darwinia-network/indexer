import {FastBlock, FastEvent, FastExtrinsic, IndexHandler} from "index-common";


export class PangoroHandler implements IndexHandler {
  async handleBlock(block: FastBlock): Promise<void> {
  }

  async handleCall(call: FastExtrinsic): Promise<void> {
  }

  async handleEvent(event: FastEvent): Promise<void> {
  }
}

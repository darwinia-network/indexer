import {Chain, FastBlock, FastEvent, FastExtrinsic, IndexHandler} from "../../../common";
import {CandidateIncludedStorage} from "./storage";

export class CandidateIncludedHandler implements IndexHandler {

  private readonly chain: Chain;

  constructor(chain: Chain) {
    this.chain = chain;
  }

  name(): string {
    return `${this.chain}-candidate-included`;
  }

  async handleBlock(block: FastBlock): Promise<void> {
  }

  async handleCall(call: FastExtrinsic): Promise<void> {
  }

  async handleEvent(event: FastEvent): Promise<void> {
    const eventSection = event.section;
    const eventMethod = event.method;
    const eventKey = `${eventSection}:${eventMethod}`;

    switch (eventKey) {
      case 'paraInclusion:CandidateIncluded': {
        await new CandidateIncludedStorage(this.chain, event).store();
        return;
      }
    }
  }

}

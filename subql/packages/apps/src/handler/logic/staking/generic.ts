import {
  Chain,
  FastBlock,
  FastEvent,
  FastExtrinsic,
  IndexHandler,
} from "@darwinia/index-common";

import {handlerStakingReward, handlerStakingRewarded} from "./handlers";

export class GenericStakingHandler implements IndexHandler {
  private readonly chain: Chain;

  constructor(chain: Chain) {
    this.chain = chain;
  }

  name(): string {
    return `${this.chain}-block`;
  }

  async handleBlock(block: FastBlock): Promise<void> {}

  async handleCall(call: FastExtrinsic): Promise<void> {}

  async handleEvent(event: FastEvent): Promise<void> {
    const { section, method } = event;

    if (
      section === "staking" &&
      (method === "Reward" || method === "Rewarded")
    ) {
      await handlerStakingRewarded(event.raw);
    } else if(section === "staking" && method === "Payout") {
      await handlerStakingReward(event);
    }
  }
}

import {
  Chain,
  FastBlock,
  FastEvent,
  FastExtrinsic,
  IndexHandler,
} from "@darwinia/index-common";

import {handleClaim, handleDeposit, handlerStakingRewarded} from "./handlers";

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
    } else if(section === "deposit" && method === "DepositCreated") {
      await handleDeposit(event);
    } else if(section === "deposit" && method === "DepositClaimed") {
      await handleClaim(event, false);
    } else if(section === "deposit" && method === "DepositClaimedWithPenalty") {
      await handleClaim(event, true);
    }
  }
}

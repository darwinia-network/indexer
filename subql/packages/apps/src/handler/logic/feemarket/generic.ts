import {
  Chain,
  FastBlock,
  FastEvent,
  FastExtrinsic,
  IndexHandler,
} from "@darwinia/index-common";

import {
  handleOrderCreateEvent,
  handleOrderRewardEvent,
  handleOrderSlashEvent,
  handleFeeUpdateEvent,
  handleEnrollEvent,
  handleFeeHistory,
  handleCheckOutOfSlot,
} from "./handlers";
import { dispatch, getDestinations } from "./utils";

export class GenericFeeMarketHandler implements IndexHandler {
  private readonly chain: Chain;

  constructor(chain: Chain) {
    this.chain = chain;
  }

  name(): string {
    return `${this.chain}-block`;
  }

  async handleBlock(block: FastBlock): Promise<void> {
    const destinations = getDestinations();

    for (const destination of destinations) {
      // @ts-ignore
      await handleCheckOutOfSlot(block.raw, destination);
      // @ts-ignore
      await handleFeeHistory(block.raw, destination);
    }
  }

  async handleCall(call: FastExtrinsic): Promise<void> {}

  async handleEvent(event: FastEvent): Promise<void> {
    switch (event.method) {
      case "OrderCreated":
        return await dispatch(event.section, event, handleOrderCreateEvent);
      case "OrderReward":
        return await dispatch(event.section, event, handleOrderRewardEvent);
      case "FeeMarketSlash":
        return await dispatch(event.section, event, handleOrderSlashEvent);
      case "UpdateRelayFee":
        return await dispatch(event.section, event, handleFeeUpdateEvent);
      case "Enroll":
        return await dispatch(event.section, event, handleEnrollEvent);
    }
  }
}

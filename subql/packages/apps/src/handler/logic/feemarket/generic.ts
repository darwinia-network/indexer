
import {Chain, FastBlock, FastEvent, FastExtrinsic, IndexHandler} from "@darwinia/index-common";

import {
  handleOrderCreateEvent,
  handleOrderFinishEvent,
  handleOrderRewardEvent,
  handleOrderSlashEvent,
  handleFeeUpdateEvent,
  handleFeeInitEvent,
} from './handlers';
import { Destination } from "../../../types";
import { dispatch, updateOutOfSlot } from './utils';

export class GenericFeeMarketHandler implements IndexHandler {

  private readonly chain: Chain;

  constructor(chain: Chain) {
    this.chain = chain;
  }

  name(): string {
    return `${this.chain}-block`;
  }

  async handleBlock(block: FastBlock): Promise<void> {
    const destinations = Object.values(Destination);
    const current = block.number;

    for (const destination of destinations) {
      await updateOutOfSlot(current, destination);
    }
  }

  async handleCall(call: FastExtrinsic): Promise<void> {
  }

  async handleEvent(event: FastEvent): Promise<void> {
    switch(event.method) {
      case 'OrderCreated': // Order Create
        return await dispatch(event.section, event, handleOrderCreateEvent);
      case 'MessagesDelivered': // Order Finish
        return await dispatch(event.section, event, handleOrderFinishEvent);
      case 'OrderReward': // Order Reward
        return await dispatch(event.section, event, handleOrderRewardEvent);
      case 'FeeMarketSlash': // Order Slash
        return await dispatch(event.section, event, handleOrderSlashEvent);
      case 'UpdateRelayFee': // Fee Update
        return await dispatch(event.section, event, handleFeeUpdateEvent);
      case 'Enroll': // Fee Init
        return await dispatch(event.section, event, handleFeeInitEvent);
    }
  }

}

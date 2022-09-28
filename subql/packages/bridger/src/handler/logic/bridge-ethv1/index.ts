// @ts-ignore
import {Chain, FastBlock, FastEvent, FastExtrinsic, IndexHandler} from "@darwinia/index-common";
import {
  AuthoritiesChangeSignedStorage,
  MMRRootSignedStorage,
  ScheduleAuthoritiesChangeStorage,
  ScheduleMMRRootEmittedStorage,
  ScheduleMMRRootStorage
} from "./storage";

export class BridgeEthV1Handler implements IndexHandler {

  private readonly chain: Chain;

  constructor(chain: Chain) {
    this.chain = chain;
  }

  name(): string {
    return `${this.chain}-bridge-ethv1`;
  }

  async handleBlock(block: FastBlock): Promise<void> {
  }

  async handleCall(call: FastExtrinsic): Promise<void> {
  }

  async handleEvent(event: FastEvent): Promise<void> {
    const blockNumber = event.blockNumber;

    const eventId = event.id;
    const eventSection = event.section;
    const eventMethod = event.method;
    if (['ecdsaRelayAuthority', 'ethereumRelayAuthorities'].indexOf(eventSection) === -1) {
      return;
    }
    logger.info(`[event] Received event: [${eventSection}:${eventMethod}] [${eventId}] in block ${blockNumber}`);

    switch (eventMethod) {
      case 'SlashOnMisbehavior':
        await new ScheduleMMRRootEmittedStorage(event).store();
        return;
      case 'MMRRootSigned':
      case 'MmrRootSigned':
        await new MMRRootSignedStorage(event).store();
        return;
      case 'ScheduleMMRRoot':
      case 'ScheduleMmrRoot':
        await new ScheduleMMRRootStorage(event).store();
        return;
      case 'ScheduleAuthoritiesChange':
        await new ScheduleAuthoritiesChangeStorage(event).store();
        return;
      case 'AuthoritiesChangeSigned':
        await new AuthoritiesChangeSignedStorage(event).store();
        return;
    }

  }

}

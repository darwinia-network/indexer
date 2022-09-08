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
    const eventKey = `${eventSection}:${eventMethod}`;
    logger.info(`[event] Received event: [${eventKey}] [${eventId}] in block ${blockNumber}`);
    switch (eventKey) {
      case 'ecdsaRelayAuthorities:SlashOnMisbehavior':
      case 'ethereumRelayAuthorities:SlashOnMisbehavior': {
        await new ScheduleMMRRootEmittedStorage(event).store();
        return;
      }
      case 'ecdsaRelayAuthorities:MMRRootSigned':
      case 'ethereumRelayAuthorities:MMRRootSigned': {
        await new MMRRootSignedStorage(event).store();
        return;
      }
      case 'ecdsaRelayAuthorities:ScheduleMMRRoot':
      case 'ethereumRelayAuthorities:ScheduleMMRRoot': {
        await new ScheduleMMRRootStorage(event).store();
        return;
      }
      case 'ecdsaRelayAuthorities:ScheduleAuthoritiesChange':
      case 'ethereumRelayAuthorities:ScheduleAuthoritiesChange': {
        await new ScheduleAuthoritiesChangeStorage(event).store();
        return;
      }
      case 'ecdsaRelayAuthorities:AuthoritiesChangeSigned':
      case 'ethereumRelayAuthorities:AuthoritiesChangeSigned': {
        await new AuthoritiesChangeSignedStorage(event).store();
        return;
      }
      default: {
        // logger.info(`[event] Discard event: ${eventMethod} in block ${blockNumber}`);
      }
    }
  }

}

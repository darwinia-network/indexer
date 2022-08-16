import {Chain, FastBlock, FastEvent, FastExtrinsic, IndexHandler} from "@darwinia/index-common";
import {CollectingNewMessageRootSignaturesStorage} from "./storage/collecting_new_message_root_signatures";
import {CollectingAuthoritiesChangeSignaturesStorage} from "./storage/collecting_authorities_change_signatures";
import {
  CollectedEnoughAuthoritiesChangeSignaturesStorage
} from "./storage/collected_enough_authorities_change_signatures";
import {CollectedEnoughNewMessageRootSignaturesStorage} from "./storage/collected_enough_new_message_root_signatures";


export class BridgeEthV2Handler implements IndexHandler {

  private readonly chain: Chain;

  constructor(chain: Chain) {
    this.chain = chain;
  }

  name(): string {
    return `${this.chain}-bridge-ethv2`;
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
      case 'ecdsaAuthority:CollectingNewMessageRootSignatures': {
        await new CollectingNewMessageRootSignaturesStorage(event).store();
        return;
      }
      case 'ecdsaAuthority:CollectedEnoughNewMessageRootSignatures': {
        await new CollectedEnoughNewMessageRootSignaturesStorage(event).store();
        return;
      }
      case 'ecdsaAuthority:CollectingAuthoritiesChangeSignatures': {
        await new CollectingAuthoritiesChangeSignaturesStorage(event).store();
        return;
      }
      case 'ecdsaAuthority:CollectedEnoughAuthoritiesChangeSignatures': {
        await new CollectedEnoughAuthoritiesChangeSignaturesStorage(event).store();
        return;
      }
      default: {
      }
    }

  }


}

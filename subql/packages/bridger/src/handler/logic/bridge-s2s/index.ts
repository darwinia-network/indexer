import {BRIDGE_START_BLOCK, Chain, FastBlock, FastEvent, FastExtrinsic, IndexHandler} from "index-common";
import {BridgeS2SEventHandler} from "./types";
import {ChainCrabEventHandler} from "./chain/crab";
import {ChainDarwiniaEventHandler} from "./chain/darwinia";
import {ChainPangolinEventHandler} from "./chain/pangolin";
import {ChainPangoroEventHandler} from "./chain/pangoro";
import {ChainPangolinParachainEventHandler} from "./chain/pangolin_parachain";
import {ChainCrabParachainEventHandler} from "./chain/crab_parachain";
import {ChainKusamaEventHandler} from "./chain/kusama";
import {ChainRococoEventHandler} from "./chain/rococo";
import {JustificationStorage} from "./storage";

export class BridgeS2SHandler implements IndexHandler {

  private readonly chain: Chain;

  constructor(chain: Chain) {
    this.chain = chain;
  }

  name(): string {
    return `${this.chain}-bridge-s2s`;
  }

  async handleBlock(block: FastBlock): Promise<void> {
    await new JustificationStorage(block).store();
  }

  async handleCall(call: FastExtrinsic): Promise<void> {
  }

  async handleEvent(event: FastEvent): Promise<void> {
    const blockNumber = event.blockNumber;

    const eventId = event.id;
    const eventSection = event.section;
    const eventMethod = event.method;
    const eventKey = `${eventSection}:${eventMethod}`;
    logger.info(`[${this.chain}] [event] Received event: [${eventKey}] [${eventId}] in block ${blockNumber}`);
    let handler: BridgeS2SEventHandler;
    switch (this.chain) {
      case Chain.Crab:
        if (blockNumber < BRIDGE_START_BLOCK.crab) {
          return;
        }
        handler = new ChainCrabEventHandler();
        break;
      case Chain.Darwinia:
        if (blockNumber < BRIDGE_START_BLOCK.darwinia) {
          return;
        }
        handler = new ChainDarwiniaEventHandler();
        break;
      case Chain.Pangolin:
        if (blockNumber < BRIDGE_START_BLOCK.pangolin) {
          return;
        }
        handler = new ChainPangolinEventHandler();
        break;
      case Chain.Pangoro:
        if (blockNumber < BRIDGE_START_BLOCK.pangoro) {
          return;
        }
        handler = new ChainPangoroEventHandler();
        break;
      case Chain.PangolinParachain:
        handler = new ChainPangolinParachainEventHandler();
        break;
      case Chain.CrabParachain:
        handler = new ChainCrabParachainEventHandler();
        break;
      case Chain.Kusama:
        handler = new ChainKusamaEventHandler();
        break;
      case Chain.Rococo:
        handler = new ChainRococoEventHandler();
        break;
      default:
        logger.warn('Unsupported bridge s2s chain:', this.chain);
        return;
    }
    await handler.handle(event, eventSection, eventMethod);
  }
}

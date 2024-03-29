import {Chain, FastBlock, FastEvent, FastExtrinsic, IndexHandler} from "@darwinia/index-common";
import {BridgeS2SEventHandler} from "./types";
import {JustificationStorage} from "./storage";
import {ChainCrabEventHandler} from "./chain/crab";
import {ChainDarwiniaEventHandler} from "./chain/darwinia";
import {ChainPangolinEventHandler} from "./chain/pangolin";
import {ChainPangoroEventHandler} from "./chain/pangoro";
import {ChainKusamaEventHandler} from "./chain/kusama";
import {ChainRococoEventHandler} from "./chain/rococo";
import {ChainMoonbaseEventHandler} from "./chain/moonbase";
import {ChainPolkadotEventHandler} from "./chain/polkadot";

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
    const eventSection = event.section;
    const eventMethod = event.method;
    let handler: BridgeS2SEventHandler;
    switch (this.chain) {
      case Chain.Crab:
        handler = new ChainCrabEventHandler();
        break;
      case Chain.Darwinia:
        handler = new ChainDarwiniaEventHandler();
        break;
      case Chain.Pangolin:
        handler = new ChainPangolinEventHandler();
        break;
      case Chain.Pangoro:
        handler = new ChainPangoroEventHandler();
        break;
      case Chain.Kusama:
        handler = new ChainKusamaEventHandler();
        break;
      case Chain.Rococo:
        handler = new ChainRococoEventHandler();
        break;
      case Chain.Moonbase:
        handler = new ChainMoonbaseEventHandler();
        break;
      case Chain.Polkadot:
        handler = new ChainPolkadotEventHandler();
        break;
      default:
        logger.warn('Unsupported bridge s2s chain:', this.chain);
        return;
    }
    await handler.handle(event, eventSection, eventMethod);
  }
}

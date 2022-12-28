import {SubstrateBlock, SubstrateEvent, SubstrateExtrinsic} from '@subql/types';
import {activeChain, Chain, FastBlock, FastEvent, FastExtrinsic, IndexHandler} from "@darwinia/index-common";
import {
  CrabHandler,
  CrabParachainHandler,
  DarwiniaHandler,
  KusamaHandler,
  PangolinHandler,
  PangolinParachainHandler,
  PangoroHandler,
  RococoHandler,
} from "../handler/chain"
import * as _env from "../_env"


function _activeChain(): Chain | undefined {
  try {
    return activeChain(_env.default.CHAIN);
  } catch (e) {
    logger.error(`Can not read active chain: ${e.message || 'No message'}`, e);
  }
}

function indexHandler(): IndexHandler | undefined {
  const chain = _activeChain();
  if (!chain) {
    return;
  }
  switch (chain) {
    case Chain.Crab:
      return new CrabHandler();
    case Chain.Darwinia:
      return new DarwiniaHandler();
    case Chain.Pangolin:
      return new PangolinHandler();
    case Chain.Pangoro:
      return new PangoroHandler();
    case Chain.PangolinParachain:
      return new PangolinParachainHandler();
    case Chain.CrabParachain:
      return new CrabParachainHandler();
    case Chain.Kusama:
      return new KusamaHandler();
    case Chain.Rococo:
      return new RococoHandler();
    default:
      logger.warn(`Can not support current chain: ${chain}`);
      return;
  }
}

export async function handleBlock(block: SubstrateBlock): Promise<void> {
  /*const fastBlock = new FastBlock(block);
  const handler = indexHandler();
  if (!handler) {
    return;
  }
  await handler.handleBlock(fastBlock);*/
}

export async function handleEvent(event: SubstrateEvent): Promise<void> {
  const fastEvent = new FastEvent(event);
  const handler = indexHandler();
  if (!handler) {
    return;
  }
  await handler.handleEvent(fastEvent);
}

export async function handleCall(extrinsic: SubstrateExtrinsic): Promise<void> {
  /*const fastExtrinsic = new FastExtrinsic(extrinsic);
  const handler = indexHandler();
  if (!handler) {
    return;
  }
  await handler.handleCall(fastExtrinsic);*/
}



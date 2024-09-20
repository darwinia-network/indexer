import {SubstrateBlock, SubstrateEvent, SubstrateExtrinsic} from '@subql/types';
import {activeChain, Chain, FastBlock, FastEvent, FastExtrinsic, IndexHandler} from "@darwinia/index-common";
import {
  CrabHandler,
  DarwiniaHandler,
  KoiHandler,
  KusamaHandler,
  PangolinHandler,
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
    case Chain.Kusama:
      return new KusamaHandler();
    case Chain.Rococo:
      return new RococoHandler();
    case Chain.Koi:
      return new KoiHandler();
    default:
      logger.warn(`Can not support current chain: ${chain}`);
      return;
  }
}

export async function handleBlock(block: SubstrateBlock): Promise<void> {
  // @ts-ignore
  const fastBlock = new FastBlock(block);
  const handler = indexHandler();
  if (!handler) {
    return;
  }
  await handler.handleBlock(fastBlock);
}

export async function handleEvent(event: SubstrateEvent): Promise<void> {
  // @ts-ignore
  const fastEvent = new FastEvent(event);
  const handler = indexHandler();
  if (!handler) {
    return;
  }
  await handler.handleEvent(fastEvent);
}

export async function handleCall(extrinsic: SubstrateExtrinsic): Promise<void> {
  // @ts-ignore
  const fastExtrinsic = new FastExtrinsic(extrinsic);
  const handler = indexHandler();
  if (!handler) {
    return;
  }
  await handler.handleCall(fastExtrinsic);
}



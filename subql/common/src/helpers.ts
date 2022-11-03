import {Block} from '@polkadot/types/interfaces/runtime';
import {Chain} from "./types";

/**
 * extract timestamp of block
 * @param block block
 */
export function extractTimestamp(block: Block): Date {
  const extrinsicForSetTimestamp = block.extrinsics.find((item) => {
    return item.method.method === 'set' && item.method.section === 'timestamp';
  });

  if (extrinsicForSetTimestamp) {
    return new Date(Number(extrinsicForSetTimestamp?.args?.[0].toString()));
  }

  return new Date();
}

/**
 * Query active chain
 */
export function activeChain(envChain): Chain {
  // const envChain = _env.default.CHAIN;
  if (!envChain) {
    throw new Error('Can not detect active chain, please set an environment with key by CHAIN')
  }
  const lowercaseChainName = envChain.toLowerCase();
  switch (lowercaseChainName) {
    case 'pangolin':
      return Chain.Pangolin;
    case 'pangoro':
      return Chain.Pangoro;
    case 'darwinia':
      return Chain.Darwinia;
    case 'darwinia-parachain':
    case 'darwiniaparachain':
      return Chain.DarwiniaParachain;
    case 'crab':
      return Chain.Crab;
    case 'pangolin-parachain':
    case 'pangolinparachain':
      return Chain.PangolinParachain;
    case 'crab-parachain':
    case 'crabparachain':
      return Chain.CrabParachain;
    case 'kusama':
      return Chain.Kusama;
    case 'rococo':
      return Chain.Rococo;
    case 'polkadot':
      return Chain.Polkadot;
    case 'dev-pangolin':
      return Chain.DevPangolin;
    case 'dev-pangolin-parachain':
      return Chain.DevPangolinParachain;
    case 'dev-rococo':
      return Chain.DevRococo;
    case 'pangolin-parachainalpha':
      return Chain.PangolinParachainAlpha;
    case 'moonbase':
      return Chain.Moonbase;
    default:
      throw new Error(`Unsupported chain: ${envChain}`)
  }
}

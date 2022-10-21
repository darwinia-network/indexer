import { Market as MarketEntity, Relayer as RelayerEntity } from "../generated/schema";
import { BIG_ZEZO } from "./config";

export function ensureMarket(id: string, contract: string): MarketEntity {
  let entity = MarketEntity.load(id);

  if (!entity) {
    entity = new MarketEntity(id);
    entity.totalOrders = 0;
    entity.totalSlash = BIG_ZEZO;
    entity.totalReward = BIG_ZEZO;
    entity.averageSpeed = BIG_ZEZO;
    entity.feeHistoryLastTime = BIG_ZEZO;
    entity.contractAddress = contract;
    entity.finishedOrders = 0;
    entity.unfinishedInSlotOrders = 0;
    entity.unfinishedOutOfSlotOrders = 0;
    entity.unfinishedInSlotOrderIds = [];
  }

  return entity;
}

export function ensureRelayer(relayerAddress: string, marketEntityId: string): RelayerEntity {
  const id = `${marketEntityId}-${relayerAddress}`;
  let entity = RelayerEntity.load(id);

  if (!entity) {
    entity = new RelayerEntity(id);
    entity.market = marketEntityId;
    entity.address = relayerAddress;
    entity.totalOrders = 0;
    entity.totalSlashes = BIG_ZEZO;
    entity.totalRewards = BIG_ZEZO;
    entity.totalOrdersId = [];
  }

  return entity;
}

export function filter(array: string[], elemant: string): string[] {
  const result: string[] = [];

  for (let i = 0; i < array.length; i++) {
    // Special reminder: don't use '!==' here
    if (array[i] != elemant) {
      result.push(array[i]);
    }
  }

  return result;
}

export function isExist(array: string[], elemant: string): bool {
  for (let i = 0; i < array.length; i++) {
    // Special reminder: don't use '===' here
    if (array[i] == elemant) {
      return true;
    }
  }

  return false;
}

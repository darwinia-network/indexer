import { BigInt } from "@graphprotocol/graph-ts";

export const LANE_ID = "eth";

export const FEEHISTORY_INTERVAL = BigInt.fromI32(1800); // every 30 minutes (in second)

export const BIG_ZEZO = BigInt.fromI32(0);
export const BIG_TWO = BigInt.fromI32(2);
export const BIG_TEN = BigInt.fromI32(10);
export const BIG_HUNDRED = BigInt.fromI32(100);
export const BIG_THOUSAND = BigInt.fromI32(1000);
export const BIG_MILLION = BigInt.fromI32(1000000);

export const CHAIN_GOERLI = "Goerli";
export const CHAIN_ETHEREUM = "Ethereum";
export const CHAIN_SMART_CHAIN_CRAB = "Crab Smart Chain";
export const CHAIN_SMART_CHAIN_DARWINIA = "Darwinia Smart Chain";
export const CHAIN_SMART_CHAIN_PANGOLIN = "Pangolin Smart Chain";
export const CHAIN_SMART_CHAIN_PANGORO = "Pangoro Smart Chain";

export const STATUS_FINISHED = "Finished";
export const STATUS_INPROGRESS = "InProgress";

export const ROLE_ASSIGNED = "Assigned";
export const ROLE_DELIVERY = "Delivery";
export const ROLE_CONFIRMATION = "Confirmation";

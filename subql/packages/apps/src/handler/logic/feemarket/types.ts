import type {
  AccountId,
  Balance,
  BlockNumber,
  LaneId,
} from "@polkadot/types/interfaces";
import type { Option, BTreeMap, u64 } from "@polkadot/types";
import type { Struct } from "@polkadot/types-codec";
import type { ITuple } from "@polkadot/types-codec/types";

// The value is the specName
export enum DarwiniaChain {
  Crab = "Crab",
  Darwinia = "Darwinia",
  Pangolin = "Pangolin",
  Pangoro = "Pangoro",
  CrabParachain = "Crab Parachain",
  DarwiniaParachain = "Darwinia Parachain",
  PangolinParachain = "Pangolin Parachain",
}

export type FeeMarketApiSection =
  | "feeMarket"
  | "crabFeeMarket"
  | "darwiniaFeeMarket"
  | "pangolinFeeMarket"
  | "pangoroFeeMarket"
  | "crabParachainFeeMarket"
  | "pangolinParachainFeeMarket";

export type MessageNonce = u64;

export interface PalletFeeMarketRelayer extends Struct {
  id: AccountId;
  collateral: Balance;
  fee: Balance;
}

export interface SlashReport {
  lane: LaneId;
  message: MessageNonce;
  sentTime: BlockNumber;
  confirmTime: Option<BlockNumber>;
  delayTime: Option<BlockNumber>;
  accountId: AccountId;
  amount: Balance;
}

export interface RewardItem {
  toSlotRelayer?: Option<ITuple<[AccountId, Balance]>>;
  toAssignedRelayers?: BTreeMap<AccountId, Balance>;
  toMessageRelayer: Option<ITuple<[AccountId, Balance]>>;
  toConfirmRelayer: Option<ITuple<[AccountId, Balance]>>;
  toTreasury: Option<Balance>;
}

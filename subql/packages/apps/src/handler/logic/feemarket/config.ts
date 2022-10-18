import type { FeeMarketApiSection, DarwiniaChain } from "./types";

export const marketApiSections = {
  Crab: {
    Darwinia: ["feeMarket", "darwiniaFeeMarket"],
    "Crab Parachain": ["crabParachainFeeMarket"],
  },
  Darwinia: {
    Crab: ["feeMarket", "crabFeeMarket"],
  },
  Pangolin: {
    Pangoro: ["feeMarket", "pangoroFeeMarket"],
    "Pangolin Parachain": ["pangolinParachainFeeMarket"],
  },
  Pangoro: {
    Pangolin: ["feeMarket", "pangolinFeeMarket"],
  },
  "Crab Parachain": {
    Crab: ["crabFeeMarket"]
  },
  "Pangolin Parachain": {
    Pangolin: ["pangolinFeeMarket"]
  },
} as Record<DarwiniaChain, Record<DarwiniaChain, FeeMarketApiSection[]>>;

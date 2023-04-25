import type { FeeMarketApiSection, DarwiniaChain } from "./types";

export const marketApiSections = {
  Crab: {
    Darwinia: ["feeMarket", "darwiniaFeeMarket"],
  },
  Darwinia: {
    Crab: ["feeMarket", "crabFeeMarket"],
  },
  Pangolin: {
    Pangoro: ["feeMarket", "pangoroFeeMarket"],
  },
  Pangoro: {
    Pangolin: ["feeMarket", "pangolinFeeMarket"],
  },
} as Record<DarwiniaChain, Record<DarwiniaChain, FeeMarketApiSection[]>>;

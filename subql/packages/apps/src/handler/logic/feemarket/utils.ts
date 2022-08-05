import { SubstrateEvent } from "@subql/types";
import { FastEvent } from "@darwinia/index-common";

import { Destination } from "../../../types";

export const dispatch = async (section: string, event: FastEvent, handler: (event: SubstrateEvent, dest: Destination) => Promise<void>) => {
  switch (section) {
    case 'feeMarket':
    case 'bridgeCrabMessages':
      return handler(event.raw, Destination.Default);
    case 'darwiniaFeeMarket':
    case 'bridgeDarwiniaMessages':
      return handler(event.raw, Destination.Darwinia);
    case 'pangoroFeeMarket':
    case 'bridgePangoroMessages':
      return handler(event.raw, Destination.Pangoro);
    case 'crabParachainFeeMarket':
    case 'bridgeCrabParachainMessages':
      return handler(event.raw, Destination.CrabParachain);
    case 'pangolinParachainFeeMarket':
    case 'bridgePangolinParachainMessages':
      return handler(event.raw, Destination.PangolinParachain);
    case 'pangolinFeeMarket':
    case 'bridgePangolinMessages':
      return handler(event.raw, Destination.Pangolin);
  }
}

export const getFeeMarketModule = (dest: Destination): string => {
  switch (dest) {
    case Destination.Darwinia:
      return "darwiniaFeeMarket";
    case Destination.Pangolin:
      return 'pangolinFeeMarket';
    case Destination.Pangoro:
      return "pangoroFeeMarket";
    case Destination.CrabParachain:
      return "crabParachainFeeMarket";
    case Destination.PangolinParachain:
      return "pangolinParachainFeeMarket";
    default:
      return "feeMarket";
  }
};

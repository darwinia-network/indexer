import { SubstrateEvent } from "@subql/types";
import { FastEvent } from "index-common";

import { Destination, FeeMarketEntity, OrderEntity, OrderStatus } from "../../../types";

export const dispatch = async (section: string, event: FastEvent, handler: (event: SubstrateEvent, dest: Destination) => Promise<void>) => {
  switch (section) {
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
  }
}

export const getFeeMarketModule = (dest: Destination): string => {
  switch (dest) {
    case Destination.Darwinia:
      return "darwiniaFeeMarket";
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

export const updateOutOfSlot = async (current: number, dest: Destination) => {
  const feeMarket = await FeeMarketEntity.get(dest);

  if (feeMarket) {
    const msgs = feeMarket.unfinishOrders || [];

    for (let msg of msgs) {
      if (current >= msg.outOfSlot) {
        const order = await OrderEntity.get(`${dest}-${msg.nonce}`);
        if (order && order.status === OrderStatus.InProgress) {
          order.status = OrderStatus.OutOfSlot;
          await order.save();

          feeMarket.totalOutOfSlot = (feeMarket.totalOutOfSlot || 0) + 1;
          feeMarket.totalInProgress = (feeMarket.totalInProgress || 0) - 1;
        }
      }
    }

    await feeMarket.save();
  }
};

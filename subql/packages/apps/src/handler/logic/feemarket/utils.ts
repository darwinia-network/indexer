import { SubstrateEvent } from "@subql/types";
import { FastEvent } from "@darwinia/index-common";
import type { Option, Vec } from '@polkadot/types';

import { PalletFeeMarketRelayer } from './types';
import { Destination, FeeMarketEntity, OrderEntity, OrderStatus, FeeHistory } from "../../../types";

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

const THRESHOLD_FEEHISTORY = 300; // number of blocks, about every 30 minutes

export const updateFeeHistory = async (blockNumber: number, timestamp: Date, dest: Destination) => {
  const record = await FeeHistory.get(dest) || new FeeHistory(dest);

  if ((record.lastTime || 0) + THRESHOLD_FEEHISTORY <= blockNumber && api.query[getFeeMarketModule(dest)]?.assignedRelayers) {
    const assignedRelayers = await api.query[getFeeMarketModule(dest)].assignedRelayers<Option<Vec<PalletFeeMarketRelayer>>>();

    if (assignedRelayers.isSome) {
      const fee = assignedRelayers.unwrap().pop().fee.toString();
      record.lastTime = blockNumber;
      record.data = (record.data || []).concat({ fee, timestamp, blockNumber });
      await record.save();
    }
  }
}

import { SubstrateEvent } from "@subql/types";
import { Option, Vec, u128, u64, u32, U8aFixed } from "@polkadot/types";
import { AccountId, AccountId32, Balance, BlockNumber, H256 } from "@polkadot/types/interfaces";
import { ITuple } from "@polkadot/types-codec/types";

import {
  Destination,
  OrderPhase,
  SlashEntity,
  RewardEntity,
  FeeMarketEntity,
  RelayerEntity,
  OrderEntity,
  NewFeeEntity,
  OrderStatus,
} from "../../../types";

const getFeeMarketModule = (dest: Destination): string => {
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

/**
 * Order Create
 * https://github.com/darwinia-network/darwinia-bridges-substrate/pull/89
 */
export const handleOrderCreateEvent = async (event: SubstrateEvent, dest: Destination): Promise<void> => {
  const {
    event: {
      data: [laneId, messageNonce, fee, assignedRelayers, outOfSlot],
    },
  } = event;

  const nonce = messageNonce.toString();
  const outOfSlotBlock = (outOfSlot as Option<BlockNumber>).unwrap().toNumber();

  // 1. save fee market record
  const feeMarketRecord = (await FeeMarketEntity.get(dest)) || new FeeMarketEntity(dest);
  const { totalOrders, totalInProgress } = feeMarketRecord;
  feeMarketRecord.totalOrders = (totalOrders || 0) + 1;
  feeMarketRecord.totalInProgress = (totalInProgress || 0) + 1;
  feeMarketRecord.unfinishOrders = (feeMarketRecord.unfinishOrders || []).concat([
    {
      nonce,
      outOfSlot: outOfSlotBlock,
    },
  ]);
  await feeMarketRecord.save();

  // 2. save relayer record
  for (let relayer of assignedRelayers as Vec<AccountId>) {
    const id = `${dest}-${relayer.toString()}`;
    if (!(await RelayerEntity.get(id))) {
      await new RelayerEntity(id).save();
    }
  }

  let sourceTxHash = event.extrinsic?.extrinsic.hash.toHex();
  event.extrinsic?.events.forEach((event) => {
    if (event.event.section === "ethereum" && event.event.method === "Executed") {
      const {
        event: {
          data: [_1, _2, hash],
        },
      } = event;

      sourceTxHash = (hash as H256).toHex();
    }
  });

  // 3. save order record
  const orderRecordId = `${dest}-${nonce}`;
  const orderRecord = new OrderEntity(orderRecordId);
  orderRecord.fee = (fee as Balance).toBigInt();
  orderRecord.sender = event.extrinsic?.extrinsic.signer.toString();
  orderRecord.sourceTxHash = sourceTxHash;
  orderRecord.slotTime = (api.consts[getFeeMarketModule(dest)].slot as u32).toNumber();
  orderRecord.outOfSlot = outOfSlotBlock;
  orderRecord.phase = OrderPhase.Created;
  orderRecord.status = OrderStatus.InProgress;
  orderRecord.createTime = event.block.timestamp;
  orderRecord.createBlock = event.block.block.header.number.toNumber();
  orderRecord.createExtrinsic = event.extrinsic?.idx;
  orderRecord.createEvent = event.idx;
  orderRecord.createLaneId = laneId.toString();
  orderRecord.assignedRelayers = (assignedRelayers as Vec<AccountId>).map((relayer) => relayer.toString());
  await orderRecord.save();
};

/**
 * Order Finish
 */
export const handleOrderFinishEvent = async (event: SubstrateEvent, dest: Destination): Promise<void> => {
  const {
    event: {
      data: [laneId, message],
    },
  } = event;
  const { begin, end } = message as unknown as { begin: u64; end: u64 };

  const finishTime = event.block.timestamp;
  const finishBlock = event.block.block.header.number.toNumber();

  for (let nonce = begin.toNumber(); nonce <= end.toNumber(); nonce++) {
    const orderRecordId = `${dest}-${nonce}`;

    const orderRecord = await OrderEntity.get(orderRecordId);
    const feeMarketRecord = await FeeMarketEntity.get(dest);

    if (!orderRecord || !feeMarketRecord) {
      continue;
    }

    const { slotTime, outOfSlot, createTime, createBlock, status } = orderRecord;

    orderRecord.phase = OrderPhase.Delivered;
    orderRecord.status = OrderStatus.Finished;
    orderRecord.finishTime = finishTime;
    orderRecord.finishBlock = finishBlock;
    orderRecord.finishExtrinsic = event.extrinsic?.idx;
    orderRecord.finishEvent = event.idx;
    orderRecord.finishLaneId = laneId.toString();

    const speed = finishTime.getTime() - new Date(createTime).getTime();
    const { totalFinished, totalInProgress, totalOutOfSlot, averageSpeed } = feeMarketRecord;

    if (finishBlock >= outOfSlot) {
      orderRecord.confirmedSlotIndex = -1;
    } else {
      for (let i = 0; i < 20; i++) {
        // suppose there are at most 20 slots
        if (finishBlock <= createBlock + slotTime * (i + 1)) {
          orderRecord.confirmedSlotIndex = i;
          break;
        }
      }
    }

    feeMarketRecord.unfinishOrders = (feeMarketRecord.unfinishOrders || []).filter((o) => o.nonce !== nonce.toString());
    if (status === OrderStatus.InProgress) {
      feeMarketRecord.totalInProgress = (totalInProgress || 0) - 1;
    } else if (status === OrderStatus.OutOfSlot) {
      feeMarketRecord.totalOutOfSlot = (totalOutOfSlot || 0) - 1;
    }
    feeMarketRecord.totalFinished = (totalFinished || 0) + 1;
    feeMarketRecord.averageSpeed = averageSpeed ? parseInt(((averageSpeed + speed) / 2).toFixed(0)) : speed;

    await orderRecord.save();
    await feeMarketRecord.save();
  }
};

/**
 * Order Reward
 * https://github.com/darwinia-network/darwinia-bridges-substrate/pull/89
 */
export const handleOrderRewardEvent = async (event: SubstrateEvent, dest: Destination): Promise<void> => {
  const {
    event: {
      data: [laneId, messageNonce, rewards],
    },
  } = event;

  const { toSlotRelayer, toMessageRelayer, toConfirmRelayer, toTreasury } = rewards as unknown as {
    toSlotRelayer: Option<ITuple<[AccountId, Balance]>>;
    toMessageRelayer: Option<ITuple<[AccountId, Balance]>>;
    toConfirmRelayer: Option<ITuple<[AccountId, Balance]>>;
    toTreasury: Option<Balance>;
  };

  const orderRecordId = `${dest}-${messageNonce.toString()}`;
  const orderRecord = await OrderEntity.get(orderRecordId);

  if (orderRecord) {
    const rewardRecord = new RewardEntity(`${dest}-${messageNonce.toString()}`);
    const feeMarketRecord = await FeeMarketEntity.get(dest);

    // 1. save relayers record

    if (toSlotRelayer.isSome) {
      const [assigned, assignedReward] = toSlotRelayer.unwrap();
      const assignedAmount = assignedReward.toBigInt();

      const assignedRelayerRecordId = `${dest}-${assigned.toString()}`;
      const assignedRelayerRecord =
        (await RelayerEntity.get(assignedRelayerRecordId)) || new RelayerEntity(assignedRelayerRecordId);

      assignedRelayerRecord.totalOrders = (assignedRelayerRecord.totalOrders || 0) + 1;
      assignedRelayerRecord.totalRewards = (assignedRelayerRecord.totalRewards || BigInt(0)) + assignedAmount;
      await assignedRelayerRecord.save();

      rewardRecord.assignedAmount = assignedAmount;
      rewardRecord.assignedRelayerId = assignedRelayerRecordId;
      orderRecord.assignedRelayerId = assignedRelayerRecordId;
      feeMarketRecord.totalRewards = (feeMarketRecord.totalRewards || BigInt(0)) + assignedAmount;
    }

    if (toMessageRelayer.isSome) {
      const [delivered, deliveredReward] = toMessageRelayer.unwrap();
      const deliveredAmount = deliveredReward.toBigInt();

      const deliveredRelayerRecordId = `${dest}-${delivered.toString()}`;
      const deliveredRelayerRecord =
        (await RelayerEntity.get(deliveredRelayerRecordId)) || new RelayerEntity(deliveredRelayerRecordId);

      deliveredRelayerRecord.totalOrders = (deliveredRelayerRecord.totalOrders || 0) + 1;
      deliveredRelayerRecord.totalRewards = (deliveredRelayerRecord.totalRewards || BigInt(0)) + deliveredAmount;
      await deliveredRelayerRecord.save();

      rewardRecord.deliveredAmount = deliveredAmount;
      rewardRecord.deliveredRelayerId = deliveredRelayerRecordId;
      orderRecord.deliveredRelayerId = deliveredRelayerRecordId;
      feeMarketRecord.totalRewards = (feeMarketRecord.totalRewards || BigInt(0)) + deliveredAmount;
    }

    if (toConfirmRelayer.isSome) {
      const [confirmed, confirmedReward] = toConfirmRelayer.unwrap();
      const confirmedAmount = confirmedReward.toBigInt();

      const confirmedRelayerRecordId = `${dest}-${confirmed.toString()}`;
      const confirmedRelayerRecord =
        (await RelayerEntity.get(confirmedRelayerRecordId)) || new RelayerEntity(confirmedRelayerRecordId);

      confirmedRelayerRecord.totalOrders = (confirmedRelayerRecord.totalOrders || 0) + 1;
      confirmedRelayerRecord.totalRewards = (confirmedRelayerRecord.totalRewards || BigInt(0)) + confirmedAmount;
      await confirmedRelayerRecord.save();

      rewardRecord.confirmedAmount = confirmedAmount;
      rewardRecord.confirmedRelayerId = confirmedRelayerRecordId;
      orderRecord.confirmedRelayerId = confirmedRelayerRecordId;
      feeMarketRecord.totalRewards = (feeMarketRecord.totalRewards || BigInt(0)) + confirmedAmount;
    }

    // 2. save reward record
    rewardRecord.orderId = orderRecordId;
    if (toTreasury.isSome) {
      rewardRecord.treasuryAmount = toTreasury.unwrap().toBigInt();
    }
    rewardRecord.rewardTime = event.block.timestamp;
    rewardRecord.rewardBlock = event.block.block.header.number.toNumber();
    rewardRecord.rewardExtrinsic = event.extrinsic?.idx;
    rewardRecord.rewardEvent = event.idx;
    rewardRecord.rewardLaneId = laneId.toString();
    await rewardRecord.save();

    // 3. save order record
    await orderRecord.save();

    // 4. save fee market record
    await feeMarketRecord.save();
  }
};

/**
 * Order Slash
 */
export const handleOrderSlashEvent = async (event: SubstrateEvent, dest: Destination): Promise<void> => {
  const {
    event: {
      data: [report],
    },
  } = event;

  const { accountId, amount, confirmTime, delayTime, lane, message, sentTime } = report as unknown as {
    accountId: AccountId32;
    amount: u128;
    confirmTime: Option<u32>;
    delayTime: Option<u32>;
    lane: U8aFixed;
    message: u64;
    sentTime: u32;
  };

  const nonce = message.toString();
  const slashAmount = amount.toBigInt();

  const orderRecordId = `${dest}-${nonce}`;
  const relayerRecordId = `${dest}-${accountId.toString()}`;

  const orderRecord = await OrderEntity.get(orderRecordId);
  const relayerRecord = await RelayerEntity.get(relayerRecordId);

  if (orderRecord && relayerRecord) {
    // 1. save relayer record
    relayerRecord.totalSlashs = (relayerRecord.totalSlashs || BigInt(0)) + slashAmount;
    await relayerRecord.save();

    // 2. save slash record
    const slashRecordId = `${dest}-${nonce}-${event.idx}`;
    const slashRecord = new SlashEntity(slashRecordId);
    slashRecord.orderId = orderRecordId;
    slashRecord.slashTime = event.block.timestamp;
    slashRecord.slashBlock = event.block.block.header.number.toNumber();
    slashRecord.slashExtrinsic = event.extrinsic?.idx;
    slashRecord.slashEvent = event.idx;
    slashRecord.slashLaneId = lane.toString();
    if (confirmTime.isSome) {
      slashRecord.confirmTime = confirmTime.unwrap().toNumber();
    }
    slashRecord.sentTime = sentTime.toNumber();
    if (delayTime.isSome) {
      slashRecord.delayTime = delayTime.unwrap().toNumber();
    }
    slashRecord.amount = slashAmount;
    slashRecord.relayerId = relayerRecordId;
    await slashRecord.save();

    // 3. save fee market record
    const feeMarketRecord = (await FeeMarketEntity.get(dest)) || new FeeMarketEntity(dest);
    feeMarketRecord.totalSlashs = (feeMarketRecord.totalSlashs || BigInt(0)) + slashAmount;
    await feeMarketRecord.save();
  }
};

/**
 * Fee Update
 */
export const handleFeeUpdateEvent = async (event: SubstrateEvent, dest: Destination): Promise<void> => {
  const {
    event: {
      data: [accountId, newFee],
    },
  } = event;

  const newfeeBlock = event.block.block.header.number.toNumber();
  const newfeeEvent = event.idx;

  const relayerRecordId = `${dest}-${accountId.toString()}`;
  const newFeeRecordId = `${dest}-${newfeeBlock}-${newfeeEvent}`;

  // 1. save relayer record
  if (!(await RelayerEntity.get(relayerRecordId))) {
    await new RelayerEntity(relayerRecordId).save();
  }

  // 2. save new fee record
  const newFeeRecord = new NewFeeEntity(newFeeRecordId);
  newFeeRecord.fee = (newFee as Balance).toBigInt();
  newFeeRecord.relayerId = relayerRecordId;
  newFeeRecord.newfeeTime = event.block.timestamp;
  newFeeRecord.newfeeBlock = newfeeBlock;
  newFeeRecord.newfeeExtrinsic = event.extrinsic?.idx;
  newFeeRecord.newfeeEvent = newfeeEvent;
  await newFeeRecord.save();
};

/**
 * Init Fee
 */
export const handleFeeInitEvent = async (event: SubstrateEvent, dest: Destination): Promise<void> => {
  const {
    event: {
      data: [paramAccount, _, paramFee],
    },
  } = event;

  const blockNumber = event.block.block.header.number.toNumber();
  const eventIndex = event.idx;

  const relayerRecordId = `${dest}-${(paramAccount as AccountId).toString()}`;
  const newFeeRecordId = `${dest}-${blockNumber}-${eventIndex}`;

  // 1. save relayer record
  if (!(await RelayerEntity.get(relayerRecordId))) {
    await new RelayerEntity(relayerRecordId).save();
  }

  // 2. save new fee record
  const newFeeRecord = new NewFeeEntity(newFeeRecordId);
  newFeeRecord.fee = (paramFee as Balance).toBigInt();
  newFeeRecord.relayerId = relayerRecordId;
  newFeeRecord.newfeeTime = event.block.timestamp;
  newFeeRecord.newfeeBlock = blockNumber;
  newFeeRecord.newfeeExtrinsic = event.extrinsic?.idx;
  newFeeRecord.newfeeEvent = eventIndex;
  await newFeeRecord.save();
};

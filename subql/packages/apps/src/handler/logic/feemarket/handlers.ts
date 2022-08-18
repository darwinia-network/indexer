import { SubstrateEvent, SubstrateBlock } from "@subql/types";
import { Option, Vec, u32 } from "@polkadot/types";
import {
  AccountId,
  Balance,
  BlockNumber,
  H256,
  LaneId,
} from "@polkadot/types/interfaces";

import {
  Relayer,
  RelayerQuote,
  Market,
  MarketFee,
  Order,
  OrderStatus,
  Reward,
  Slash,
} from "../../../types";
import { getApiSection } from "./utils";
import type {
  PalletFeeMarketRelayer,
  MessageNonce,
  DarwiniaChain,
  RewardItem,
  SlashReport,
} from "./types";

/**
 * Order Create
 * https://github.com/darwinia-network/darwinia-bridges-substrate/pull/89
 */
export const handleOrderCreateEvent = async (
  event: SubstrateEvent,
  destination: DarwiniaChain
): Promise<void> => {
  const {
    event: {
      data: [
        paramLaneId,
        paramNonce,
        paramFee,
        paramAssignedRelayers,
        paramOutOfSlotBlock,
      ],
    },
  } = event;

  const laneId = (paramLaneId as LaneId).toString();
  const nonce = (paramNonce as MessageNonce).toString();
  const fee = (paramFee as Balance).toBigInt();
  const assignedRelayersId: string[] = [];
  for (const relayer of paramAssignedRelayers as Vec<AccountId>) {
    assignedRelayersId.push(`${destination}-${relayer.toString()}`);
  }
  const outOfSlotBlock = (paramOutOfSlotBlock as Option<BlockNumber>).isSome
    ? (paramOutOfSlotBlock as Option<BlockNumber>).unwrap().toNumber()
    : 0;

  const blockTime = event.block.timestamp;
  const blockNumber = event.block.block.header.number.toNumber();
  const extrinsicIndex = event.extrinsic?.idx;
  const eventIndex = event.idx;

  const marketId = destination;
  const orderId = `${destination}-${laneId}-${nonce}`;

  const apiSection = getApiSection(destination);
  let sourceTxHash = event.extrinsic?.extrinsic.hash.toHex();
  event.extrinsic?.events.forEach((event) => {
    if (
      event.event.section === "ethereum" &&
      event.event.method === "Executed"
    ) {
      const {
        event: {
          data: [_1, _2, hash],
        },
      } = event;

      sourceTxHash = (hash as H256).toHex();
    }
  });

  // 1. save relayer

  for (const relayerId of assignedRelayersId) {
    if (!(await Relayer.get(relayerId))) {
      await new Relayer(relayerId).save();
    }
  }

  // 2. save order

  const orderRecord = new Order(orderId);
  orderRecord.sender = event.extrinsic?.extrinsic.signer.toString();
  orderRecord.sourceTxHash = sourceTxHash;
  orderRecord.fee = fee;
  orderRecord.status = OrderStatus.InProgress;
  orderRecord.slotTime = apiSection
    ? (api.consts[getApiSection(destination)].slot as u32).toNumber()
    : 0;
  orderRecord.outOfSlotBlock = outOfSlotBlock;
  orderRecord.createBlockTime = blockTime;
  orderRecord.createBlockNumber = blockNumber;
  orderRecord.createExtrinsicIndex = extrinsicIndex;
  orderRecord.createEventIndex = eventIndex;
  orderRecord.assignedRelayersId = assignedRelayersId;
  await orderRecord.save();

  // 3. update market

  const marketRecord = (await Market.get(marketId)) || new Market(marketId);
  marketRecord.inProgressInSlotOrders =
    (marketRecord.inProgressInSlotOrders || 0) + 1;
  marketRecord.inProgressOrders = (marketRecord.inProgressOrders || []).concat({
    orderId,
    outOfSlotBlock,
  });
  await marketRecord.save();
};

/**
 * Order Reward
 * https://github.com/darwinia-network/darwinia-bridges-substrate/pull/89
 */
export const handleOrderRewardEvent = async (
  event: SubstrateEvent,
  destination: DarwiniaChain
): Promise<void> => {
  const {
    event: {
      data: [paramLaneId, paramNonce, paramRewards],
    },
  } = event;

  // Remove RewardBook: https://github.com/darwinia-network/darwinia-messages-substrate/pull/169

  const laneId = (paramLaneId as LaneId).toString();
  const nonce = (paramNonce as MessageNonce).toString();
  const {
    toSlotRelayer,
    toAssignedRelayers,
    toMessageRelayer,
    toConfirmRelayer,
    toTreasury,
  } = paramRewards as unknown as RewardItem;

  const assignedRelayersId: string[] = [];
  const deliveredRelayersId: string[] = [];
  const confirmedRelayersId: string[] = [];

  const assignedAmounts: bigint[] = [];
  const deliveredAmounts: bigint[] = [];
  const confirmedAmounts: bigint[] = [];
  let treasuryAmount: bigint | null = null;

  if (toSlotRelayer?.isSome) {
    const [relayer, amount] = toSlotRelayer.unwrap();
    assignedAmounts.push(amount.toBigInt());
    assignedRelayersId.push(`${destination}-${relayer.toString()}`);
  } else if (toAssignedRelayers?.size) {
    for (const [relayer, amount] of toAssignedRelayers.entries()) {
      assignedAmounts.push(amount.toBigInt());
      assignedRelayersId.push(`${destination}-${relayer.toString()}`);
    }
  }

  if (toMessageRelayer.isSome) {
    const [relayer, amount] = toMessageRelayer.unwrap();
    deliveredAmounts.push(amount.toBigInt());
    deliveredRelayersId.push(`${destination}-${relayer.toString()}`);
  }

  if (toConfirmRelayer.isSome) {
    const [relayer, amount] = toConfirmRelayer.unwrap();
    confirmedAmounts.push(amount.toBigInt());
    confirmedRelayersId.push(`${destination}-${relayer.toString()}`);
  }

  if (toTreasury.isSome) {
    treasuryAmount = toTreasury.unwrap().toBigInt();
  }

  const blockTime = event.block.timestamp;
  const blockNumber = event.block.block.header.number.toNumber();
  const extrinsicIndex = event.extrinsic?.idx;
  const eventIndex = event.idx;

  const marketId = destination;
  const orderId = `${destination}-${laneId}-${nonce}`;
  const rewardId = `${orderId}-${eventIndex}`;

  const orderRecord = await Order.get(orderId);
  const marketRecord = await Market.get(marketId);

  if (orderRecord && marketRecord) {
    // 1. save reward

    const rewardRecord = new Reward(rewardId);
    rewardRecord.orderId = orderId;
    rewardRecord.blockTime = blockTime;
    rewardRecord.blockNumber = blockNumber;
    rewardRecord.extrinsicIndex = extrinsicIndex;
    rewardRecord.eventIndex = eventIndex;
    rewardRecord.assignedRelayersId = assignedRelayersId;
    rewardRecord.deliveredRelayersId = deliveredRelayersId;
    rewardRecord.confirmedRelayersId = confirmedRelayersId;
    rewardRecord.assignedAmounts = assignedAmounts;
    rewardRecord.deliveredAmounts = deliveredAmounts;
    rewardRecord.confirmedAmounts = confirmedAmounts;
    rewardRecord.treasuryAmount = treasuryAmount;
    await rewardRecord.save();

    // 2. update relayer

    for (let i = 0; i < assignedRelayersId.length; i++) {
      const amount = assignedAmounts[i];
      const relayerId = assignedRelayersId[i];
      const relayerRecord =
        (await Relayer.get(relayerId)) || new Relayer(relayerId);
      relayerRecord.totalOrders = (relayerRecord.totalOrders || 0) + 1;
      relayerRecord.totalRewards =
        (relayerRecord.totalRewards || BigInt(0)) + amount;
      relayerRecord.assignedRelayerOrdersId = (
        relayerRecord.assignedRelayerOrdersId || []
      ).concat(orderId);
      relayerRecord.assignedRelayerRewardsId = (
        relayerRecord.assignedRelayerRewardsId || []
      ).concat(rewardId);
      await relayerRecord.save();
    }

    for (let i = 0; i < deliveredRelayersId.length; i++) {
      const amount = deliveredAmounts[i];
      const relayerId = deliveredRelayersId[i];
      const relayerRecord = await Relayer.get(relayerId);
      relayerRecord.totalOrders = (relayerRecord.totalOrders || 0) + 1;
      relayerRecord.totalRewards =
        (relayerRecord.totalRewards || BigInt(0)) + amount;
      relayerRecord.deliveredRelayerOrdersId = (
        relayerRecord.deliveredRelayerOrdersId || []
      ).concat(orderId);
      relayerRecord.deliveredRelayerRewardsId = (
        relayerRecord.deliveredRelayerRewardsId || []
      ).concat(rewardId);
      await relayerRecord.save();
    }

    for (let i = 0; i < confirmedRelayersId.length; i++) {
      const amount = confirmedAmounts[i];
      const relayerId = confirmedRelayersId[i];
      const relayerRecord = await Relayer.get(relayerId);
      relayerRecord.totalOrders = (relayerRecord.totalOrders || 0) + 1;
      relayerRecord.totalRewards =
        (relayerRecord.totalRewards || BigInt(0)) + amount;
      relayerRecord.confirmedRelayerOrdersId = (
        relayerRecord.confirmedRelayerOrdersId || []
      ).concat(orderId);
      relayerRecord.confirmedRelayerRewardsId = (
        relayerRecord.confirmedRelayerRewardsId || []
      ).concat(rewardId);
      await relayerRecord.save();
    }

    const confirmedSlotIndex = orderRecord.confirmedSlotIndex;

    // 4. update order

    orderRecord.status = OrderStatus.Finished;
    if (blockNumber < orderRecord.outOfSlotBlock) {
      for (let i; i < 20; i++) {
        // suppose there are at most 20 slots
        if (
          blockNumber <=
          orderRecord.createBlockNumber + orderRecord.slotTime * (i + 1)
        ) {
          orderRecord.confirmedSlotIndex = i;
          break;
        }
      }
    } else {
      orderRecord.confirmedSlotIndex = -1;
    }
    orderRecord.finishBlockTime = blockTime;
    orderRecord.finishBlockNumber = blockNumber;
    orderRecord.finishExtrinsicIndex = extrinsicIndex;
    orderRecord.finishEventIndex = eventIndex;
    orderRecord.assignedRelayersId = assignedRelayersId;
    orderRecord.deliveredRelayersId = deliveredRelayersId;
    orderRecord.confirmedRelayersId = confirmedRelayersId;
    await orderRecord.save();

    const speed =
      blockTime.getTime() - new Date(orderRecord.createBlockTime).getTime();

    // 5. update market

    marketRecord.totalReward =
      (marketRecord.totalReward || BigInt(0)) +
      assignedAmounts
        .concat(deliveredAmounts)
        .concat(confirmedAmounts)
        .reduce((acc, amount) => acc + amount, BigInt(0));
    marketRecord.averageSpeed = marketRecord.averageSpeed
      ? parseInt(((marketRecord.averageSpeed + speed) / 2).toFixed(0))
      : speed;
    marketRecord.inProgressOrders = (
      marketRecord.inProgressOrders || []
    ).filter((o) => o.orderId !== orderId);
    marketRecord.finishedOrders = (marketRecord.finishedOrders || 0) + 1;
    if (confirmedSlotIndex === -1) {
      marketRecord.inProgressOutOfSlotOrders =
        (marketRecord.inProgressOutOfSlotOrders || 0) - 1;
    } else {
      marketRecord.inProgressInSlotOrders =
        (marketRecord.inProgressInSlotOrders || 0) - 1;
    }
    await marketRecord.save();
  }
};

/**
 * Order Slash
 */
export const handleOrderSlashEvent = async (
  event: SubstrateEvent,
  destination: DarwiniaChain
): Promise<void> => {
  const {
    event: {
      data: [paramSlash],
    },
  } = event;

  const { accountId, amount, confirmTime, delayTime, lane, message, sentTime } =
    paramSlash as unknown as SlashReport;

  const blockTime = event.block.timestamp;
  const blockNumber = event.block.block.header.number.toNumber();
  const extrinsicIndex = event.extrinsic?.idx;
  const eventIndex = event.idx;

  const orderId = `${destination}-${lane.toString()}-${message.toString()}`;
  const slashId = `${orderId}-${eventIndex}`;
  const relayerId = `${destination}-${accountId.toString()}`;
  const marketId = destination;

  const slashAmount = amount.toBigInt();
  const orderRecord = await Order.get(orderId);

  if (orderRecord) {
    // 1. update relayer

    const relayerRecord =
      (await Relayer.get(relayerId)) || new Relayer(relayerId);
    relayerRecord.totalSlashs =
      (relayerRecord.totalSlashs || BigInt(0)) + slashAmount;
    await relayerRecord.save();

    // 2. save slash
    const slashRecord = new Slash(slashId);
    slashRecord.orderId = orderId;
    slashRecord.blockTime = blockTime;
    slashRecord.blockNumber = blockNumber;
    slashRecord.extrinsicIndex = extrinsicIndex;
    slashRecord.eventIndex = eventIndex;
    slashRecord.amount = slashAmount;
    slashRecord.relayerId = relayerId;
    slashRecord.sentTime = sentTime.toNumber();
    if (confirmTime.isSome) {
      slashRecord.confirmTime = confirmTime.unwrap().toNumber();
    }
    if (delayTime.isSome) {
      slashRecord.delayTime = delayTime.unwrap().toNumber();
    }
    await slashRecord.save();

    // 3. update market
    const marketRecord = (await Market.get(marketId)) || new Market(marketId);
    marketRecord.totalSlash =
      (marketRecord.totalSlash || BigInt(0)) + slashAmount;
    await marketRecord.save();
  }
};

const updateRelayerQuote = async (
  event: SubstrateEvent,
  destination: DarwiniaChain,
  paramFee: Balance,
  paramRelayer: AccountId
) => {
  const fee = paramFee.toBigInt();
  const relayer = paramRelayer.toString();

  const blockTime = event.block.timestamp;
  const blockNumber = event.block.block.header.number.toNumber();
  const extrinsicIndex = event.extrinsic?.idx;
  const eventIndex = event.idx;

  const marketId = destination;
  const relayerId = `${destination}-${relayer}`;
  const relayerQuoteId = `${destination}-${blockNumber}-${eventIndex}`;

  // 1. save market
  if (!(await Market.get(marketId))) {
    await new Market(marketId).save();
  }

  // 2. save relayer
  if (!(await Relayer.get(relayerId))) {
    await new Relayer(relayerId).save();
  }

  // 3. save relayer quote
  const relayerQuoteRecord = new RelayerQuote(relayerQuoteId);
  relayerQuoteRecord.blockTime = blockTime;
  relayerQuoteRecord.blockNumber = blockNumber;
  relayerQuoteRecord.extrinsicIndex = extrinsicIndex;
  relayerQuoteRecord.eventIndex = eventIndex;
  relayerQuoteRecord.amount = fee;
  relayerQuoteRecord.relayerId = relayerId;
  await relayerQuoteRecord.save();
};

/**
 * Quote Init
 */
export const handleEnrollEvent = async (
  event: SubstrateEvent,
  destination: DarwiniaChain
): Promise<void> => {
  const {
    event: {
      data: [paramRelayer, _, paramFee],
    },
  } = event;

  await updateRelayerQuote(
    event,
    destination,
    paramFee as Balance,
    paramRelayer as AccountId
  );
};

/**
 * Quote Update
 */
export const handleFeeUpdateEvent = async (
  event: SubstrateEvent,
  destination: DarwiniaChain
): Promise<void> => {
  const {
    event: {
      data: [paramRelayer, paramFee],
    },
  } = event;

  await updateRelayerQuote(
    event,
    destination,
    paramFee as Balance,
    paramRelayer as AccountId
  );
};

/**
 * Check Order Out-of-Slot  (real time)
 */
export const handleCheckOutOfSlot = async (
  block: SubstrateBlock,
  destination: DarwiniaChain
): Promise<void> => {
  const marketRecord = await Market.get(destination);
  const blockNumber = block.block.header.number.toNumber();

  if (marketRecord) {
    const orders = marketRecord.inProgressOrders || [];

    for (const order of orders) {
      if (blockNumber >= order.outOfSlotBlock) {
        const orderRecord = await Order.get(order.orderId);
        if (orderRecord && orderRecord.confirmedSlotIndex === null) {
          orderRecord.confirmedSlotIndex = -1;
          await orderRecord.save();

          marketRecord.inProgressOutOfSlotOrders =
            (marketRecord.inProgressOutOfSlotOrders || 0) + 1;
          marketRecord.inProgressInSlotOrders =
            (marketRecord.inProgressInSlotOrders || 0) - 1;
        }
      }
    }

    await marketRecord.save();
  }
};

const THRESHOLD_FEEHISTORY = 300; // number of blocks, about every 30 minutes

/**
 * Market Fee History
 */
export const handleMarketFeeHistory = async (
  block: SubstrateBlock,
  destination: DarwiniaChain
): Promise<void> => {
  const timestamp = block.timestamp;
  const blockNumber = block.block.header.number.toNumber();

  const marketId = destination;
  const marketFeeId = `${destination}-${blockNumber}`;

  const apiSection = getApiSection(destination);
  const marketRecord = await Market.get(marketId);

  if (
    marketRecord &&
    (marketRecord.feeHistoryLastTime || 0) + THRESHOLD_FEEHISTORY <=
      blockNumber &&
    apiSection
  ) {
    const assignedRelayers = await api.query[apiSection].assignedRelayers<
      Option<Vec<PalletFeeMarketRelayer>>
    >();

    if (assignedRelayers.isSome) {
      marketRecord.feeHistoryLastTime = blockNumber;
      await marketRecord.save();

      const marketFeeRecord = new MarketFee(marketFeeId);
      marketFeeRecord.fee = assignedRelayers.unwrap().pop().fee.toBigInt();
      marketFeeRecord.timestamp = timestamp;
      marketFeeRecord.marketId = marketId;
      await marketFeeRecord.save();
    }
  }
};

import { SubstrateEvent, SubstrateBlock } from "@subql/types";
import { Option, Vec, u32 } from "@polkadot/types";
import { BN_ZERO } from "@polkadot/util";
import {
  AccountId,
  Balance,
  BlockNumber,
  H256,
  LaneId,
} from "@polkadot/types/interfaces";

import {
  Relayer,
  Market,
  Order,
  OrderStatus,
  Reward,
  Slash,
  RelayerRole,
  FeeHistory,
  QuoteHistory,
} from "../../../types";
import { getApiSection } from "./utils";
import type {
  PalletFeeMarketRelayer,
  MessageNonce,
  DarwiniaChain,
  RewardItem,
  SlashReport,
  RewardData,
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
        paramLane,
        paramNonce,
        paramFee,
        paramAssignedRelayers,
        paramOutOfSlotBlock,
      ],
    },
  } = event;

  const lane = (paramLane as LaneId).toString();
  const nonce = (paramNonce as MessageNonce).toString();
  const fee = (paramFee as Balance).toBigInt();
  const assignedRelayers: string[] = [];
  for (const relayer of paramAssignedRelayers as Vec<AccountId>) {
    assignedRelayers.push(relayer.toString());
  }
  const outOfSlotBlock = (paramOutOfSlotBlock as Option<BlockNumber>).isSome
    ? (paramOutOfSlotBlock as Option<BlockNumber>).unwrap().toNumber()
    : 0;

  const blockTime = event.block.timestamp;
  const blockNumber = event.block.block.header.number.toNumber();
  const extrinsicIndex = event.extrinsic?.idx;
  const eventIndex = event.idx;

  const marketId = destination;
  const orderId = `${destination}-${lane}-${nonce}`;

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

  // 1. update market

  const marketRecord = (await Market.get(marketId)) || new Market(marketId);
  marketRecord.unfinishedInSlotOrders =
    (marketRecord.unfinishedInSlotOrders || 0) + 1;
  marketRecord.unfinishedOrders = (marketRecord.unfinishedOrders || []).concat({
    orderId,
    outOfSlotBlock,
  });
  marketRecord.totalOrders = (marketRecord.totalOrders || 0) + 1;
  await marketRecord.save();

  // 2. save relayer

  for (const relayer of assignedRelayers) {
    const relayerId = `${destination}-${relayer}`;
    const relayerRecord =
      (await Relayer.get(relayerId)) || new Relayer(relayerId);
    relayerRecord.address = relayer;
    relayerRecord.marketId = marketId;
    await relayerRecord.save();
  }

  // 3. save order

  const orderRecord = new Order(orderId);
  orderRecord.lane = lane;
  orderRecord.nonce = nonce;
  orderRecord.marketId = marketId;
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
  orderRecord.assignedRelayers = assignedRelayers;
  await orderRecord.save();
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
      data: [paramLane, paramNonce, paramRewards],
    },
  } = event;

  // Remove RewardBook: https://github.com/darwinia-network/darwinia-messages-substrate/pull/169

  const lane = (paramLane as LaneId).toString();
  const nonce = (paramNonce as MessageNonce).toString();
  const {
    toSlotRelayer,
    toAssignedRelayers,
    toMessageRelayer,
    toConfirmRelayer,
    toTreasury,
  } = paramRewards as unknown as RewardItem;

  let totalReward = BN_ZERO;
  let treasuryAmount: bigint | null = null;
  const assignedRelayersReward: RewardData[] = [];
  const deliveryRelayersReward: RewardData[] = [];
  const confirmationRelayersReward: RewardData[] = [];

  if (toSlotRelayer?.isSome) {
    const [relayer, amount] = toSlotRelayer.unwrap();
    totalReward = totalReward.add(amount);
    assignedRelayersReward.push({ amount, relayer });
  } else if (toAssignedRelayers?.size) {
    for (const [relayer, amount] of toAssignedRelayers.entries()) {
      totalReward = totalReward.add(amount);
      assignedRelayersReward.push({ amount, relayer });
    }
  }

  if (toMessageRelayer.isSome) {
    const [relayer, amount] = toMessageRelayer.unwrap();
    totalReward = totalReward.add(amount);
    deliveryRelayersReward.push({ amount, relayer });
  }

  if (toConfirmRelayer.isSome) {
    const [relayer, amount] = toConfirmRelayer.unwrap();
    totalReward = totalReward.add(amount);
    confirmationRelayersReward.push({ amount, relayer });
  }

  if (toTreasury.isSome) {
    treasuryAmount = toTreasury.unwrap().toBigInt();
  }

  const blockTime = event.block.timestamp;
  const blockNumber = event.block.block.header.number.toNumber();
  const extrinsicIndex = event.extrinsic?.idx;
  const eventIndex = event.idx;

  const marketId = destination;
  const orderId = `${destination}-${lane}-${nonce}`;

  const orderRecord = await Order.get(orderId);
  const marketRecord = await Market.get(marketId);

  if (orderRecord && marketRecord) {
    // 1. update relayer

    const rewards = assignedRelayersReward
      .concat(deliveryRelayersReward)
      .concat(confirmationRelayersReward);
    for (const reward of rewards) {
      const relayer = reward.relayer.toString();
      const relayerId = `${destination}-${relayer}`;
      const relayerRecord =
        (await Relayer.get(relayerId)) || new Relayer(relayerId);
      relayerRecord.address = relayer;
      relayerRecord.marketId = marketId;
      relayerRecord.totalRewards =
        (relayerRecord.totalRewards || BigInt(0)) + reward.amount.toBigInt();
      relayerRecord.totalOrdersId = Array.from(
        new Set<string>(relayerRecord.totalOrdersId || []).add(orderId)
      );
      relayerRecord.totalOrders = relayerRecord.totalOrdersId.length;
      await relayerRecord.save();
    }

    // 2. save reward

    let customIndex = 0;

    const recordReward = async (
      role: RelayerRole,
      rewardData: RewardData[]
    ) => {
      for (const reward of rewardData) {
        const relayerId = `${destination}-${reward.relayer.toString()}`;
        const rewardId = `${blockNumber}-${eventIndex}-${customIndex++}`;
        const rewardRecord = new Reward(rewardId);
        rewardRecord.orderId = orderId;
        rewardRecord.marketId = marketId;
        rewardRecord.relayerId = relayerId;
        rewardRecord.blockTime = blockTime;
        rewardRecord.blockNumber = blockNumber;
        rewardRecord.extrinsicIndex = extrinsicIndex;
        rewardRecord.eventIndex = eventIndex;
        rewardRecord.amount = reward.amount.toBigInt();
        rewardRecord.relayerRole = role;
        await rewardRecord.save();
      }
    };

    await recordReward(RelayerRole.Assigned, assignedRelayersReward);
    await recordReward(RelayerRole.Delivery, deliveryRelayersReward);
    await recordReward(RelayerRole.Confirmation, confirmationRelayersReward);

    // 3. update order

    const slotIndex = orderRecord.slotIndex;

    orderRecord.status = OrderStatus.Finished;
    if (blockNumber < orderRecord.outOfSlotBlock) {
      for (let i = 0; i < 20; i++) {
        // suppose there are at most 20 slots
        if (
          blockNumber <=
          orderRecord.createBlockNumber + orderRecord.slotTime * (i + 1)
        ) {
          orderRecord.slotIndex = i;
          break;
        }
      }
    } else {
      orderRecord.slotIndex = -1;
    }
    orderRecord.finishBlockTime = blockTime;
    orderRecord.finishBlockNumber = blockNumber;
    orderRecord.finishExtrinsicIndex = extrinsicIndex;
    orderRecord.finishEventIndex = eventIndex;
    orderRecord.treasuryAmount = treasuryAmount;
    for (let i = 0; i < assignedRelayersReward.length; i++) {
      const reward = assignedRelayersReward[i];
      const relayerId = `${destination}-${reward.relayer.toString()}`;

      if (i === 0) {
        orderRecord.assignedRelayer1Id = relayerId;
      } else if (i === 1) {
        orderRecord.assignedRelayer2Id = relayerId;
      } else if (i === 2) {
        orderRecord.assignedRelayer3Id = relayerId;
      }
    }
    for (const reward of deliveryRelayersReward) {
      const relayerId = `${destination}-${reward.relayer.toString()}`;
      orderRecord.deliveryRelayerId = relayerId;
      break;
    }
    for (const reward of confirmationRelayersReward) {
      const relayerId = `${destination}-${reward.relayer.toString()}`;
      orderRecord.confirmationRelayerId = relayerId;
      break;
    }
    await orderRecord.save();

    // 4. update market

    const speed =
      blockTime.getTime() - new Date(orderRecord.createBlockTime).getTime();

    marketRecord.totalReward =
      (marketRecord.totalReward || BigInt(0)) + BigInt(totalReward.toString());
    marketRecord.averageSpeed = marketRecord.averageSpeed
      ? parseInt(((marketRecord.averageSpeed + speed) / 2).toFixed(0))
      : speed;
    marketRecord.unfinishedOrders = (
      marketRecord.unfinishedOrders || []
    ).filter((o) => o.orderId !== orderId);
    marketRecord.finishedOrders = (marketRecord.finishedOrders || 0) + 1;
    if (slotIndex === -1) {
      marketRecord.unfinishedOutOfSlotOrders =
        (marketRecord.unfinishedOutOfSlotOrders || 0) - 1;
    } else {
      marketRecord.unfinishedInSlotOrders =
        (marketRecord.unfinishedInSlotOrders || 0) - 1;
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
  const slashId = `${blockNumber}-${eventIndex}-0`;
  const relayerId = `${destination}-${accountId.toString()}`;
  const marketId = destination;

  const slashAmount = amount.toBigInt();
  const orderRecord = await Order.get(orderId);

  if (orderRecord) {
    // 1. update relayer

    const relayerRecord =
      (await Relayer.get(relayerId)) || new Relayer(relayerId);
    relayerRecord.totalSlashes =
      (relayerRecord.totalSlashes || BigInt(0)) + slashAmount;
    relayerRecord.totalOrdersId = Array.from(
      new Set<string>(relayerRecord.totalOrdersId || []).add(orderId)
    );
    relayerRecord.totalOrders = relayerRecord.totalOrdersId.length;
    await relayerRecord.save();

    // 2. update market

    const marketRecord = (await Market.get(marketId)) || new Market(marketId);
    marketRecord.totalSlash =
      (marketRecord.totalSlash || BigInt(0)) + slashAmount;
    await marketRecord.save();

    // 3. save slash

    const slashRecord = new Slash(slashId);
    slashRecord.orderId = orderId;
    slashRecord.marketId = marketId;
    slashRecord.relayerId = relayerId;
    slashRecord.blockTime = blockTime;
    slashRecord.blockNumber = blockNumber;
    slashRecord.extrinsicIndex = extrinsicIndex;
    slashRecord.eventIndex = eventIndex;
    slashRecord.amount = slashAmount;
    slashRecord.relayerRole = RelayerRole.Assigned;
    slashRecord.sentTime = sentTime.toNumber();
    if (confirmTime.isSome) {
      slashRecord.confirmTime = confirmTime.unwrap().toNumber();
    }
    if (delayTime.isSome) {
      slashRecord.delayTime = delayTime.unwrap().toNumber();
    }
    await slashRecord.save();
  }
};

const updateQuote = async (
  event: SubstrateEvent,
  destination: DarwiniaChain,
  paramFee: Balance,
  paramRelayer: AccountId
) => {
  const amount = paramFee.toString();
  const relayer = paramRelayer.toString();

  const blockTime = event.block.timestamp;
  const blockNumber = event.block.block.header.number.toNumber();
  const extrinsicIndex = event.extrinsic?.idx;
  const eventIndex = event.idx;

  const marketId = destination;
  const relayerId = `${destination}-${relayer}`;
  const quoteId = relayerId;

  // 1. save market

  if (!(await Market.get(marketId))) {
    await new Market(marketId).save();
  }

  // 2. save relayer

  if (!(await Relayer.get(relayerId))) {
    const orderRecord = new Relayer(relayerId);
    orderRecord.marketId = marketId;
    orderRecord.address = relayer;
    await orderRecord.save();
  }

  // 3. save quote

  const quoteRecord =
    (await QuoteHistory.get(quoteId)) || new QuoteHistory(quoteId);
  quoteRecord.relayerId = relayerId;
  quoteRecord.data = (quoteRecord.data || []).concat({
    amount,
    blockTime,
    blockNumber,
    extrinsicIndex,
    eventIndex,
  });
  await quoteRecord.save();
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

  await updateQuote(
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

  await updateQuote(
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
    const orders = marketRecord.unfinishedOrders || [];

    for (const order of orders) {
      if (order.outOfSlotBlock <= blockNumber) {
        const orderRecord = await Order.get(order.orderId);
        if (orderRecord && orderRecord.slotIndex === null) {
          orderRecord.slotIndex = -1;
          await orderRecord.save();

          marketRecord.unfinishedOutOfSlotOrders =
            (marketRecord.unfinishedOutOfSlotOrders || 0) + 1;
          marketRecord.unfinishedInSlotOrders =
            (marketRecord.unfinishedInSlotOrders || 0) - 1;
        }
      }
    }

    await marketRecord.save();
  }
};

const FEEHISTORY_INTERVAL = 300; // number of blocks, about every 30 minutes

/**
 * Fee History
 */
export const handleFeeHistory = async (
  block: SubstrateBlock,
  destination: DarwiniaChain
): Promise<void> => {
  const blockTime = block.timestamp;
  const blockNumber = block.block.header.number.toNumber();

  const apiSection = getApiSection(destination);
  const record =
    (await FeeHistory.get(destination)) || new FeeHistory(destination);

  if (
    apiSection &&
    (await Market.get(destination)) &&
    (record.lastTime || 0) + FEEHISTORY_INTERVAL <= blockNumber
  ) {
    const assignedRelayers = await api.query[apiSection].assignedRelayers<
      Option<Vec<PalletFeeMarketRelayer>>
    >();

    if (assignedRelayers.isSome) {
      record.marketId = destination;
      record.data = (record.data || []).concat({
        blockTime,
        blockNumber,
        amount: assignedRelayers.unwrap().pop().fee.toString(),
      });
      record.lastTime = blockNumber;
      await record.save();
    }
  }
};

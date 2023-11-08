import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import {
  Ethereum as Contract,
  Assigned,
  Delist,
  Deposit,
  Enrol,
  Initialized,
  Locked,
  Reward,
  SetOutbound,
  Settled,
  Slash,
  UnLocked,
  Withdrawal
} from "../generated/Ethereum/Ethereum";
import {
  Market as MarketEntity,
  Order as OrderEntity,
  Relayer as RelayerEntity,
  Reward as RewardEntity,
  Slash as SlashEntity,
  OrderRelayer as OrderRelayerEntity,
  QuoteHistory as QuoteHistoryEntity,
  FeeHistory as FeeHistoryEntity
} from "../generated/schema";
import { filter, isExist, ensureRelayer, ensureMarket } from "./utils";
import {
  LANE_ID,
  FEEHISTORY_INTERVAL,
  CHAIN_DARWINIA,
  STATUS_FINISHED,
  STATUS_INPROGRESS,
  ROLE_ASSIGNED,
  ROLE_DELIVERY,
  ROLE_CONFIRMATION,
  BIG_ZEZO,
  BIG_HUNDRED,
  BIG_MILLION,
  BIG_TWO
} from "./config";

const lane = LANE_ID;
const destination = CHAIN_DARWINIA; // marketEntityId

export function handleAssigned(event: Assigned): void {
  // params

  const orderKey = event.params.key;
  const assignedTime = event.params.timestamp;
  const orderFee = event.params.fee;
  const orderCollateral = event.params.collateral;
  const relayerAddress = event.params.relayer;

  // event

  const logIndex = event.logIndex;
  const txHash = event.transaction.hash;
  const blockNumber = event.block.number;
  const sender = event.transaction.from;

  // contract

  const contract = Contract.bind(event.address);
  const slotTime = contract.RELAY_TIME();

  const outOfSlotTime = assignedTime.plus(slotTime);

  // some ids

  const orderEntityId = `${lane}-${orderKey.toHexString()}`;
  const relayerEntityId = `${destination}-${relayerAddress.toHexString()}`;

  // entities

  const orderEntity = new OrderEntity(orderEntityId);
  const marketEntity = MarketEntity.load(destination);
  const relayerEntity = RelayerEntity.load(relayerEntityId);

  if (marketEntity && relayerEntity) {
    marketEntity.totalOrders = marketEntity.totalOrders + 1;
    marketEntity.unfinishedInSlotOrderIds = marketEntity.unfinishedInSlotOrderIds.concat(
      [orderEntityId]
    );
    marketEntity.unfinishedInSlotOrders =
      marketEntity.unfinishedInSlotOrders + 1;
    marketEntity.save();

    if (!isExist(relayerEntity.totalOrdersId, orderEntityId)) {
      relayerEntity.totalOrdersId = relayerEntity.totalOrdersId.concat([
        orderEntityId
      ]);
      relayerEntity.totalOrders = relayerEntity.totalOrders + 1;
      relayerEntity.save();
    }

    orderEntity.lane = lane;
    orderEntity.nonce = orderKey.toHexString();
    orderEntity.market = destination;
    orderEntity.sender = sender.toHexString();
    orderEntity.sourceTxHash = txHash.toHex();
    orderEntity.fee = orderFee;
    orderEntity.collateral = orderCollateral;
    orderEntity.status = STATUS_INPROGRESS;
    orderEntity.slotTime = slotTime;
    orderEntity.outOfSlotTime = outOfSlotTime;
    orderEntity.slotIndex = 0;
    orderEntity.createTxHash = txHash.toHex();
    orderEntity.createBlockTime = assignedTime;
    orderEntity.createBlockNumber = blockNumber;
    orderEntity.createEventIndex = logIndex;
    orderEntity.assignedRelayersFee = [orderFee];
    orderEntity.assignedRelayersAddress = [relayerAddress.toHexString()];
    orderEntity.save();

    const orderRelayerEntity = new OrderRelayerEntity(
      `${orderEntityId}-${relayerEntityId}-${ROLE_ASSIGNED}`
    );
    orderRelayerEntity.assignedOrder = orderEntityId;
    orderRelayerEntity.assignedRelayer = relayerEntityId;
    orderRelayerEntity.save();
  }
}

export function handleDelist(event: Delist): void {}

export function handleDeposit(event: Deposit): void {}

export function handleEnrol(event: Enrol): void {
  // params

  const fee = event.params.fee;
  const relayerAddress = event.params.cur;

  // event

  const logIndex = event.logIndex;
  const txHash = event.transaction.hash;
  const blockTime = event.block.timestamp;
  const blockNumber = event.block.number;
  const contractAddress = event.address;

  // some ids

  const relayerEntityId = `${destination}-${relayerAddress.toHexString()}`;
  const quoteHistoryEntityId = `${txHash.toHex()}-${logIndex.toString()}`;

  // market

  const marketEntity = ensureMarket(destination, contractAddress.toHexString());
  marketEntity.save();

  // relayer

  const relayerEntity = ensureRelayer(
    relayerAddress.toHexString(),
    destination
  );
  relayerEntity.save();

  // quote history

  const quoteHistoryEntity = new QuoteHistoryEntity(quoteHistoryEntityId);
  quoteHistoryEntity.relayer = relayerEntityId;
  quoteHistoryEntity.amount = fee;
  quoteHistoryEntity.blockTime = blockTime;
  quoteHistoryEntity.blockNumber = blockNumber;
  quoteHistoryEntity.txHash = txHash.toHex();
  quoteHistoryEntity.eventIndex = logIndex;
  quoteHistoryEntity.save();
}

export function handleInitialized(event: Initialized): void {}

export function handleLocked(event: Locked): void {}

export function handleReward(event: Reward): void {}

export function handleSetOutbound(event: SetOutbound): void {}

export function handleSettled(event: Settled): void {
  // params

  const orderKey = event.params.key;
  const confirmTime = event.params.timestamp;
  const deliveryRelayerAddress = event.params.delivery;
  const confirmationRelayerAddress = event.params.confirm;

  // event

  const logIndex = event.logIndex;
  const txHash = event.transaction.hash;
  const blockNumber = event.block.number;

  // contract

  const contract = Contract.bind(event.address);
  const SLASH_TIME = contract.SLASH_TIME();
  const DUTY_REWARD_RATIO = contract.DUTY_REWARD_RATIO();
  const PRICE_RATIO_NUMERATOR = contract.PRICE_RATIO_NUMERATOR();

  // some ids

  const orderEntityId = `${lane}-${orderKey.toHexString()}`;

  // entities

  const marketEntity = MarketEntity.load(destination);
  const orderEntity = OrderEntity.load(orderEntityId);

  if (marketEntity && orderEntity) {
    const spendTime = confirmTime.minus(orderEntity.createBlockTime);

    // market

    marketEntity.averageSpeed = marketEntity.averageSpeed.isZero()
      ? spendTime
      : marketEntity.averageSpeed.plus(spendTime).div(BIG_TWO);
    if (orderEntity.slotIndex == -1) {
      marketEntity.unfinishedOutOfSlotOrders =
        marketEntity.unfinishedOutOfSlotOrders - 1;
    } else {
      marketEntity.unfinishedInSlotOrders =
        marketEntity.unfinishedInSlotOrders - 1;
    }
    marketEntity.unfinishedInSlotOrderIds = filter(
      marketEntity.unfinishedInSlotOrderIds,
      orderEntityId
    );
    marketEntity.finishedOrders = marketEntity.finishedOrders + 1;

    // order

    orderEntity.status = STATUS_FINISHED;
    orderEntity.finishTxHash = txHash.toHex();
    orderEntity.finishBlockTime = confirmTime;
    orderEntity.finishBlockNumber = blockNumber;
    orderEntity.finishEventIndex = logIndex;
    orderEntity.slotIndex = confirmTime.ge(orderEntity.outOfSlotTime) ? -1 : 1;

    // reward && slash

    const orderFee = orderEntity.fee;
    const orderCollateral = orderEntity.collateral;
    const assignedRelayerAddress = orderEntity.assignedRelayersAddress[0];
    const assignedRelayerEntity = ensureRelayer(
      assignedRelayerAddress,
      destination
    );

    let slashFee = BIG_ZEZO;
    let rewardAssigned = BIG_ZEZO;
    let rewardDelivery = BIG_ZEZO;
    let rewardConfirmation = BIG_ZEZO;

    if (confirmTime.lt(orderEntity.outOfSlotTime)) {
      // on time
      if (orderFee.gt(BIG_ZEZO)) {
        rewardAssigned = orderFee.times(DUTY_REWARD_RATIO).div(BIG_HUNDRED);
        const rewardOthers = orderFee.minus(rewardAssigned);
        rewardDelivery = rewardOthers
          .times(PRICE_RATIO_NUMERATOR)
          .div(BIG_MILLION);
        rewardConfirmation = rewardOthers.minus(rewardDelivery);
      }
    } else {
      // time out
      const timeOutTime = confirmTime.minus(orderEntity.outOfSlotTime);
      slashFee = timeOutTime.ge(SLASH_TIME)
        ? orderCollateral
        : orderCollateral.times(timeOutTime).div(SLASH_TIME);
      const totalReward = orderFee.plus(slashFee);
      rewardDelivery = totalReward
        .times(PRICE_RATIO_NUMERATOR)
        .div(BIG_MILLION);
      rewardConfirmation = totalReward.minus(rewardDelivery);
    }

    if (slashFee.gt(BIG_ZEZO)) {
      marketEntity.totalSlash = marketEntity.totalSlash.plus(slashFee);
      assignedRelayerEntity.totalSlashes = assignedRelayerEntity.totalSlashes.plus(
        slashFee
      );
      assignedRelayerEntity.save();

      const assignedRelayerEntityId = `${destination}-${assignedRelayerAddress}`;
      const slashEntity = new SlashEntity(
        `${txHash.toHex()}-${logIndex.toString()}-${assignedRelayerAddress}`
      );
      slashEntity.order = orderEntityId;
      slashEntity.market = destination;
      slashEntity.relayer = assignedRelayerEntityId;
      slashEntity.txHash = txHash.toHex();
      slashEntity.blockTime = confirmTime;
      slashEntity.blockNumber = blockNumber;
      slashEntity.amount = slashFee;
      slashEntity.relayerRole = ROLE_ASSIGNED;
      slashEntity.sentTime = orderEntity.createBlockNumber;
      slashEntity.confirmTime = orderEntity.finishBlockNumber;
      slashEntity.delayTime = blockNumber
        .minus(orderEntity.createBlockNumber)
        .toI32();
      slashEntity.save();
    }

    const roles = [ROLE_ASSIGNED, ROLE_DELIVERY, ROLE_CONFIRMATION];
    const rewards = [rewardAssigned, rewardDelivery, rewardConfirmation];
    const addreses = [
      assignedRelayerAddress,
      deliveryRelayerAddress.toHexString(),
      confirmationRelayerAddress.toHexString()
    ];

    for (let i = 0; i < rewards.length; i++) {
      const role = roles[i];
      const amount = rewards[i];
      const address = addreses[i];

      if (amount.gt(BIG_ZEZO)) {
        marketEntity.totalReward = marketEntity.totalReward.plus(amount);

        const relayerEntity = ensureRelayer(address, destination);
        relayerEntity.totalRewards = relayerEntity.totalRewards.plus(amount);
        if (!isExist(relayerEntity.totalOrdersId, orderEntityId)) {
          relayerEntity.totalOrdersId = relayerEntity.totalOrdersId.concat([
            orderEntityId
          ]);
          relayerEntity.totalOrders = relayerEntity.totalOrders + 1;
        }
        relayerEntity.save();

        const relayerEntityId = `${destination}-${address}`;
        const rewardEntity = new RewardEntity(
          `${txHash.toHex()}-${logIndex.toString()}-${role}-${address}`
        );
        rewardEntity.order = orderEntityId;
        rewardEntity.market = destination;
        rewardEntity.relayer = relayerEntityId;
        rewardEntity.txHash = txHash.toHex();
        rewardEntity.blockTime = confirmTime;
        rewardEntity.blockNumber = blockNumber;
        rewardEntity.eventIndex = logIndex;
        rewardEntity.amount = amount;
        rewardEntity.relayerRole = role;
        rewardEntity.save();

        const orderRelayerEntity = new OrderRelayerEntity(
          `${orderEntityId}-${relayerEntityId}-${role}`
        );
        if (role == ROLE_ASSIGNED) {
          orderRelayerEntity.assignedOrder = orderEntityId;
          orderRelayerEntity.assignedRelayer = relayerEntityId;
        } else if (role == ROLE_DELIVERY) {
          orderRelayerEntity.deliveryOrder = orderEntityId;
          orderRelayerEntity.deliveryRelayer = relayerEntityId;
        } else if (role == ROLE_CONFIRMATION) {
          orderRelayerEntity.confirmationOrder = orderEntityId;
          orderRelayerEntity.confirmationRelayer = relayerEntityId;
        }
        orderRelayerEntity.save();
      }
    }

    orderEntity.save();
    marketEntity.save();
  }
}

export function handleSlash(event: Slash): void {}

export function handleUnLocked(event: UnLocked): void {}

export function handleWithdrawal(event: Withdrawal): void {}

export function handleBlock(block: ethereum.Block): void {
  updateFeeHistory(block);
  updateUnfinishedOrders(block);
}

function updateFeeHistory(block: ethereum.Block): void {
  // block

  const blockTime = block.timestamp;
  const blockNumber = block.number;

  // entities

  const marketEntity = MarketEntity.load(destination);
  if (
    marketEntity &&
    marketEntity.contractAddress &&
    marketEntity.feeHistoryLastTime.plus(FEEHISTORY_INTERVAL).lt(blockTime)
  ) {
    const contract = Contract.bind(
      Address.fromString(marketEntity.contractAddress)
    );

    if (contract.relayerCount().gt(BIG_ZEZO)) {
      marketEntity.feeHistoryLastTime = blockTime;
      marketEntity.save();

      const feesOf = contract
        .getOrderBook(BigInt.fromI32(1), false)
        .getValue2();

      const feeHistoryEntity = new FeeHistoryEntity(
        `${destination}-${blockNumber.toString()}`
      );
      feeHistoryEntity.market = destination;
      feeHistoryEntity.blockTime = blockTime;
      feeHistoryEntity.blockNumber = blockNumber;
      feeHistoryEntity.amount = BigInt.fromI32(0);
      if (feesOf.length) {
        feeHistoryEntity.amount = feesOf[0];
      }
      feeHistoryEntity.save();
    }
  }
}

function updateUnfinishedOrders(block: ethereum.Block): void {
  // block

  const blockTime = block.timestamp;

  // entities

  const marketEntity = MarketEntity.load(destination);
  if (marketEntity) {
    const orderIds = marketEntity.unfinishedInSlotOrderIds;

    for (let i = 0; i < orderIds.length; i++) {
      const orderEntityId = orderIds[i];
      const orderEntity = OrderEntity.load(orderEntityId);
      if (
        orderEntity &&
        orderEntity.slotIndex == 0 &&
        blockTime.ge(orderEntity.outOfSlotTime)
      ) {
        orderEntity.slotIndex = -1;
        orderEntity.save();

        marketEntity.unfinishedInSlotOrders =
          marketEntity.unfinishedInSlotOrders - 1;
        marketEntity.unfinishedOutOfSlotOrders =
          marketEntity.unfinishedOutOfSlotOrders + 1;
        marketEntity.unfinishedInSlotOrderIds = filter(
          marketEntity.unfinishedInSlotOrderIds,
          orderEntityId
        );
      }
    }

    marketEntity.save();
  }
}

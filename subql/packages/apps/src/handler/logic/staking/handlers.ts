import type { SubstrateEvent } from "@subql/types";
import type { Balance, AccountId } from "@polkadot/types/interfaces";

import {StakingStash, StakingRewarded, Deposit, DepositRecord} from "../../../types";
import {FastEvent} from "@darwinia/index-common";

export const handlerStakingRewarded = async (
  event: SubstrateEvent
): Promise<void> => {
  const {
    event: {
      data: [paramStash, paramAmount],
    },
  } = event;

  const amount = (paramAmount as Balance).toBigInt();
  const stashId = (paramStash as AccountId).toString();

  const blockTime = event.block.timestamp;
  const blockNumber = event.block.block.header.number.toNumber();
  const extrinsicIndex = event.extrinsic?.idx;
  const eventIndex = event.idx;

  const stashRecord =
    (await StakingStash.get(stashId)) || new StakingStash(stashId);
  stashRecord.totalRewarded = (stashRecord.totalRewarded || BigInt(0)) + amount;
  await stashRecord.save();

  const rewardedRecord = new StakingRewarded(`${blockNumber}-${eventIndex}`);
  rewardedRecord.blockNumber = blockNumber;
  rewardedRecord.extrinsicIndex = extrinsicIndex;
  rewardedRecord.blockTime = blockTime;
  rewardedRecord.eventIndex = eventIndex;
  rewardedRecord.stashId = stashId;
  rewardedRecord.amount = amount;
  await rewardedRecord.save();
};


export const handleDeposit = async (fastEvent: FastEvent): Promise<void> => {

  /* const [owner, depositId, amount, startTime, endTime, reward] = ['0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac',1,9926903553299999,1672144632027,1680050232027,326903553299492 ] */

  const [owner, depositId, amount, startTime, expireTime, reward] = fastEvent.data;
  // logger.info(`handle new Deposit======🚒 ${owner} ${depositId} ${amount.toString()} ${startTime} ${expireTime} ${reward}`);

  const accountAddress = (owner as AccountId).toString();
  const deposit = new Deposit(accountAddress);
  await deposit.save();

  const depositRecord = new DepositRecord(`${accountAddress}-${fastEvent.blockNumber}-${depositId}`);

  depositRecord.depositId = parseInt(depositId.toString());
  depositRecord.amount = (amount as Balance).toBigInt();
  depositRecord.startTime = new Date(parseInt(startTime.toString()));
  depositRecord.expireTime = new Date(parseInt(expireTime.toString()));
  depositRecord.reward = (reward as Balance).toBigInt();
  depositRecord.accountId = accountAddress;
  depositRecord.penalty = undefined;
  depositRecord.isEarlyClaimed = false;
  depositRecord.createdTime = fastEvent.timestamp;

  return await depositRecord.save();
}

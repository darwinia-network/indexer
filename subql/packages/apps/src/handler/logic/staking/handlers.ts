import type { SubstrateEvent } from "@subql/types";
import type { Balance, AccountId } from "@polkadot/types/interfaces";

import {StakingStash, StakingRewarded, StakingRecord, StakingReward} from "../../../types";
import {FastEvent} from "@darwinia/index-common";

// TODO old method, needs to be removed in the future
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


export const handlerStakingReward = async (
  fastEvent: FastEvent
): Promise<void> => {

  const [paramStakerAccount, paramAmount] = fastEvent.data;

  const amount = (paramAmount as unknown as Balance).toBigInt();
  const accountAddress = (paramStakerAccount as unknown as AccountId).toString();

  const blockTime = fastEvent.block.timestamp;
  const blockNumber = fastEvent.blockNumber;

  const eventIndex = fastEvent.index;

  const stakingRecord =
    (await StakingRecord.get(accountAddress)) || new StakingRecord(accountAddress);
  stakingRecord.totalReward = (stakingRecord.totalReward || BigInt(0)) + amount;
  await stakingRecord.save();

  const stakingReward = new StakingReward(`${blockNumber}-${eventIndex}`);
  stakingReward.blockNumber = blockNumber;
  stakingReward.blockTime = blockTime;
  stakingReward.stakerId = accountAddress;
  stakingReward.amount = amount;
  return await stakingReward.save();
};

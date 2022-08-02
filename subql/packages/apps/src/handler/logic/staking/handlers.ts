import type { SubstrateEvent } from "@subql/types";
import type { Balance, AccountId } from "@polkadot/types/interfaces";

import { StakingStash, StakingRewarded } from "../../../types";

export const handlerStakingRewarded = async (event: SubstrateEvent): Promise<void> => {
  const {
    event: {
      data: [paramStash, paramAmount],
    },
  } = event;

  const blockTime = event.block.timestamp;
  const blockNumber = event.block.block.header.number.toNumber();
  const extrinsicIndex = event.extrinsic?.idx;
  const eventIndex = event.idx;

  const stash = (paramStash as AccountId).toString();
  const amount = (paramAmount as Balance).toBigInt();

  const stashRecord = (await StakingStash.get(stash)) || new StakingStash(stash);
  stashRecord.totalRewarded = (stashRecord.totalRewarded || BigInt(0)) + amount;
  await stashRecord.save();

  const rewardedRecord = new StakingRewarded(`${blockNumber - eventIndex}`);
  rewardedRecord.blockNumber = blockNumber;
  rewardedRecord.extrinsicIndex = extrinsicIndex;
  rewardedRecord.blockTime = blockTime;
  rewardedRecord.eventIndex = eventIndex;
  rewardedRecord.stashId = stash;
  rewardedRecord.amount = amount;
  await rewardedRecord.save();
};

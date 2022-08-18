import type { SubstrateEvent } from "@subql/types";
import type { Balance, AccountId } from "@polkadot/types/interfaces";

import { StakingStash, StakingRewarded } from "../../../types";

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

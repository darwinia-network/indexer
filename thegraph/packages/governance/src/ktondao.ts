import {
  EIP712DomainChanged as EIP712DomainChangedEvent,
  Initialized as InitializedEvent,
  ProposalCanceled as ProposalCanceledEvent,
  ProposalCreated as ProposalCreatedEvent,
  ProposalExecuted as ProposalExecutedEvent,
  ProposalQueued as ProposalQueuedEvent,
  ProposalThresholdSet as ProposalThresholdSetEvent,
  TimelockChange as TimelockChangeEvent,
  VoteCast as VoteCastEvent,
  VoteCastWithParams as VoteCastWithParamsEvent,
  VotingDelaySet as VotingDelaySetEvent,
  VotingPeriodSet as VotingPeriodSetEvent
} from "../generated/Ktondao/Ktondao";
import {
  EIP712DomainChanged,
  Initialized,
  ProposalCanceled,
  ProposalCreated,
  ProposalExecuted,
  ProposalQueued,
  ProposalThresholdSet,
  TimelockChange,
  VoteCast,
  VoteCastWithParams,
  VotingDelaySet,
  VotingPeriodSet
} from "../generated/schema";

export function handleEIP712DomainChanged(
  event: EIP712DomainChangedEvent
): void {
  let entity = new EIP712DomainChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
  );

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.save();
}

export function handleInitialized(event: InitializedEvent): void {
  let entity = new Initialized(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
  );
  entity.version = event.params.version;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.save();
}

export function handleProposalCanceled(event: ProposalCanceledEvent): void {
  let entity = new ProposalCanceled(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
  );
  entity.proposalId = event.params.proposalId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.save();
}

export function handleProposalCreated(event: ProposalCreatedEvent): void {
  let entity = new ProposalCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
  );
  entity.proposalId = event.params.proposalId;
  entity.proposer = event.params.proposer.toHexString();
  entity.targets = event.params.targets.map<string>(value =>
    value.toHexString()
  );
  entity.values = event.params.values;
  entity.signatures = event.params.signatures;
  entity.calldatas = event.params.calldatas.map<string>(value =>
    value.toHexString()
  );
  entity.voteStart = event.params.voteStart;
  entity.voteEnd = event.params.voteEnd;
  entity.description = event.params.description;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.save();
}

export function handleProposalExecuted(event: ProposalExecutedEvent): void {
  let entity = new ProposalExecuted(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
  );
  entity.proposalId = event.params.proposalId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.save();
}

export function handleProposalQueued(event: ProposalQueuedEvent): void {
  let entity = new ProposalQueued(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
  );
  entity.proposalId = event.params.proposalId;
  entity.etaSeconds = event.params.etaSeconds;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.save();
}

export function handleProposalThresholdSet(
  event: ProposalThresholdSetEvent
): void {
  let entity = new ProposalThresholdSet(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
  );
  entity.oldProposalThreshold = event.params.oldProposalThreshold;
  entity.newProposalThreshold = event.params.newProposalThreshold;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.save();
}

export function handleTimelockChange(event: TimelockChangeEvent): void {
  let entity = new TimelockChange(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
  );
  entity.oldTimelock = event.params.oldTimelock.toHexString();
  entity.newTimelock = event.params.newTimelock.toHexString();

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.save();
}

export function handleVoteCast(event: VoteCastEvent): void {
  let entity = new VoteCast(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
  );
  entity.voter = event.params.voter.toHexString();
  entity.proposalId = event.params.proposalId;
  entity.support = event.params.support;
  entity.weight = event.params.weight;
  entity.reason = event.params.reason;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.save();
}

export function handleVoteCastWithParams(event: VoteCastWithParamsEvent): void {
  let entity = new VoteCastWithParams(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
  );
  entity.voter = event.params.voter.toHexString();
  entity.proposalId = event.params.proposalId;
  entity.support = event.params.support;
  entity.weight = event.params.weight;
  entity.reason = event.params.reason;
  entity.params = event.params.params.toHexString();

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.save();
}

export function handleVotingDelaySet(event: VotingDelaySetEvent): void {
  let entity = new VotingDelaySet(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
  );
  entity.oldVotingDelay = event.params.oldVotingDelay;
  entity.newVotingDelay = event.params.newVotingDelay;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.save();
}

export function handleVotingPeriodSet(event: VotingPeriodSetEvent): void {
  let entity = new VotingPeriodSet(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
  );
  entity.oldVotingPeriod = event.params.oldVotingPeriod;
  entity.newVotingPeriod = event.params.newVotingPeriod;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.save();
}

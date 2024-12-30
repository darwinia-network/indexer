import { ProposalCreated as ProposalCreatedEvent } from "../generated/Ktondao/Ktondao";
import { ProposalCreated } from "../generated/schema";

export function handleProposalCreated(event: ProposalCreatedEvent): void {
  let entity = new ProposalCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
  );
  entity.origin = "RingDAO";
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

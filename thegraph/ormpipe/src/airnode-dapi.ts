import {
  AggregatedMessageRoot as AggregatedMessageRootEvent,
  AirnodeRrpCompleted as AirnodeRrpCompletedEvent,
  AirnodeRrpRequested as AirnodeRrpRequestedEvent,
} from "../generated/AirnodeDapi/AirnodeDapi"
import {
  AggregatedMessageRoot,
  AirnodeRrpCompleted,
  AirnodeRrpRequested,
} from "../generated/schema"

export function handleAggregatedMessageRoot(
  event: AggregatedMessageRootEvent
): void {
  let entity = new AggregatedMessageRoot(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.msgRoot = event.params.msgRoot

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleAirnodeRrpCompleted(
  event: AirnodeRrpCompletedEvent
): void {
  let entity = new AirnodeRrpCompleted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.beaconId = event.params.beaconId
  entity.requestId = event.params.requestId
  entity.data = event.params.data

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleAirnodeRrpRequested(
  event: AirnodeRrpRequestedEvent
): void {
  let entity = new AirnodeRrpRequested(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.beaconId = event.params.beaconId
  entity.requestId = event.params.requestId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}


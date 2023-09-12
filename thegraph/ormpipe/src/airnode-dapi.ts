import {
  AddBeacon as AddBeaconEvent,
  AggregatedMessageRoot as AggregatedMessageRootEvent,
  AirnodeRrpCompleted as AirnodeRrpCompletedEvent,
  AirnodeRrpRequested as AirnodeRrpRequestedEvent,
  RemoveBeacon as RemoveBeaconEvent
} from "../generated/AirnodeDapi/AirnodeDapi"
import {
  AirnodeDapiAddBeacon,
  AirnodeDapiAggregatedMessageRoot,
  AirnodeDapiAirnodeRrpCompleted,
  AirnodeDapiAirnodeRrpRequested,
  AirnodeDapiRemoveBeacon
} from "../generated/schema"

export function handleAddBeacon(event: AddBeaconEvent): void {
  let entity = new AirnodeDapiAddBeacon(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.beaconId = event.params.beaconId
  entity.beacon_airnode = event.params.beacon.airnode
  entity.beacon_endpointId = event.params.beacon.endpointId
  entity.beacon_sponsor = event.params.beacon.sponsor
  entity.beacon_sponsorWallet = event.params.beacon.sponsorWallet

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleAggregatedMessageRoot(
  event: AggregatedMessageRootEvent
): void {
  let entity = new AirnodeDapiAggregatedMessageRoot(
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
  let entity = new AirnodeDapiAirnodeRrpCompleted(
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
  let entity = new AirnodeDapiAirnodeRrpRequested(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.beaconId = event.params.beaconId
  entity.requestId = event.params.requestId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRemoveBeacon(event: RemoveBeaconEvent): void {
  let entity = new AirnodeDapiRemoveBeacon(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.beaconId = event.params.beaconId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

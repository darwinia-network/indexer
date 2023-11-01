import {
  AddBeacon as AddBeaconEvent,
  AggregatedORMPData as AggregatedORMPDataEvent,
  AirnodeRrpCompleted as AirnodeRrpCompletedEvent,
  AirnodeRrpRequested as AirnodeRrpRequestedEvent,
  OwnershipTransferStarted as OwnershipTransferStartedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  RemoveBeacon as RemoveBeaconEvent,
  SubAPIFeedUpdated as SubAPIFeedUpdatedEvent
} from "../generated/Subapi/Subapi"
import {
  SubapiAddBeacon,
  SubapiAggregatedORMPData,
  SubapiAirnodeRrpCompleted,
  SubapiAirnodeRrpRequested,
  SubapiOwnershipTransferStarted,
  SubapiOwnershipTransferred,
  SubapiRemoveBeacon,
  SubapiSubAPIFeedUpdated
} from "../generated/schema"

export function handleAddBeacon(event: AddBeaconEvent): void {
  let entity = new SubapiAddBeacon(
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

export function handleAggregatedORMPData(event: AggregatedORMPDataEvent): void {
  let entity = new SubapiAggregatedORMPData(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.ormpData_count = event.params.ormpData.count
  entity.ormpData_root = event.params.ormpData.root

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleAirnodeRrpCompleted(
  event: AirnodeRrpCompletedEvent
): void {
  let entity = new SubapiAirnodeRrpCompleted(
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
  let entity = new SubapiAirnodeRrpRequested(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.beaconId = event.params.beaconId
  entity.requestId = event.params.requestId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferStarted(
  event: OwnershipTransferStartedEvent
): void {
  let entity = new SubapiOwnershipTransferStarted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new SubapiOwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRemoveBeacon(event: RemoveBeaconEvent): void {
  let entity = new SubapiRemoveBeacon(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.beaconId = event.params.beaconId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSubAPIFeedUpdated(event: SubAPIFeedUpdatedEvent): void {
  let entity = new SubapiSubAPIFeedUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.beaconId = event.params.beaconId
  entity.msgRoot_count = event.params.msgRoot.count
  entity.msgRoot_root = event.params.msgRoot.root

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
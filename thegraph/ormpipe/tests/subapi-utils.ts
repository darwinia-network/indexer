import { newMockEvent } from "matchstick-as"
import { ethereum, Bytes, Address } from "@graphprotocol/graph-ts"
import {
  AddBeacon,
  AggregatedORMPData,
  AirnodeRrpCompleted,
  AirnodeRrpRequested,
  OwnershipTransferStarted,
  OwnershipTransferred,
  RemoveBeacon,
  SubAPIFeedUpdated
} from "../generated/Subapi/Subapi"

export function createAddBeaconEvent(
  beaconId: Bytes,
  beacon: ethereum.Tuple
): AddBeacon {
  let addBeaconEvent = changetype<AddBeacon>(newMockEvent())

  addBeaconEvent.parameters = new Array()

  addBeaconEvent.parameters.push(
    new ethereum.EventParam("beaconId", ethereum.Value.fromFixedBytes(beaconId))
  )
  addBeaconEvent.parameters.push(
    new ethereum.EventParam("beacon", ethereum.Value.fromTuple(beacon))
  )

  return addBeaconEvent
}

export function createAggregatedORMPDataEvent(
  ormpData: ethereum.Tuple
): AggregatedORMPData {
  let aggregatedOrmpDataEvent = changetype<AggregatedORMPData>(newMockEvent())

  aggregatedOrmpDataEvent.parameters = new Array()

  aggregatedOrmpDataEvent.parameters.push(
    new ethereum.EventParam("ormpData", ethereum.Value.fromTuple(ormpData))
  )

  return aggregatedOrmpDataEvent
}

export function createAirnodeRrpCompletedEvent(
  beaconId: Bytes,
  requestId: Bytes,
  data: Bytes
): AirnodeRrpCompleted {
  let airnodeRrpCompletedEvent = changetype<AirnodeRrpCompleted>(newMockEvent())

  airnodeRrpCompletedEvent.parameters = new Array()

  airnodeRrpCompletedEvent.parameters.push(
    new ethereum.EventParam("beaconId", ethereum.Value.fromFixedBytes(beaconId))
  )
  airnodeRrpCompletedEvent.parameters.push(
    new ethereum.EventParam(
      "requestId",
      ethereum.Value.fromFixedBytes(requestId)
    )
  )
  airnodeRrpCompletedEvent.parameters.push(
    new ethereum.EventParam("data", ethereum.Value.fromBytes(data))
  )

  return airnodeRrpCompletedEvent
}

export function createAirnodeRrpRequestedEvent(
  beaconId: Bytes,
  requestId: Bytes
): AirnodeRrpRequested {
  let airnodeRrpRequestedEvent = changetype<AirnodeRrpRequested>(newMockEvent())

  airnodeRrpRequestedEvent.parameters = new Array()

  airnodeRrpRequestedEvent.parameters.push(
    new ethereum.EventParam("beaconId", ethereum.Value.fromFixedBytes(beaconId))
  )
  airnodeRrpRequestedEvent.parameters.push(
    new ethereum.EventParam(
      "requestId",
      ethereum.Value.fromFixedBytes(requestId)
    )
  )

  return airnodeRrpRequestedEvent
}

export function createOwnershipTransferStartedEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferStarted {
  let ownershipTransferStartedEvent = changetype<OwnershipTransferStarted>(
    newMockEvent()
  )

  ownershipTransferStartedEvent.parameters = new Array()

  ownershipTransferStartedEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferStartedEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferStartedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createRemoveBeaconEvent(beaconId: Bytes): RemoveBeacon {
  let removeBeaconEvent = changetype<RemoveBeacon>(newMockEvent())

  removeBeaconEvent.parameters = new Array()

  removeBeaconEvent.parameters.push(
    new ethereum.EventParam("beaconId", ethereum.Value.fromFixedBytes(beaconId))
  )

  return removeBeaconEvent
}

export function createSubAPIFeedUpdatedEvent(
  beaconId: Bytes,
  msgRoot: ethereum.Tuple
): SubAPIFeedUpdated {
  let subApiFeedUpdatedEvent = changetype<SubAPIFeedUpdated>(newMockEvent())

  subApiFeedUpdatedEvent.parameters = new Array()

  subApiFeedUpdatedEvent.parameters.push(
    new ethereum.EventParam("beaconId", ethereum.Value.fromFixedBytes(beaconId))
  )
  subApiFeedUpdatedEvent.parameters.push(
    new ethereum.EventParam("msgRoot", ethereum.Value.fromTuple(msgRoot))
  )

  return subApiFeedUpdatedEvent
}

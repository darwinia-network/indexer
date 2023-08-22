import { newMockEvent } from "matchstick-as"
import { ethereum, Bytes, Address } from "@graphprotocol/graph-ts"
import {
  AddBeacon,
  AggregatedMessageRoot,
  AirnodeMessageRootFeedUpdated,
  AirnodeRrpCompleted,
  AirnodeRrpRequested,
  OwnershipTransferStarted,
  OwnershipTransferred,
  RemoveBeacon
} from "../generated/AirnodeDpi/AirnodeDpi"

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

export function createAggregatedMessageRootEvent(
  msgRoot: Bytes
): AggregatedMessageRoot {
  let aggregatedMessageRootEvent = changetype<AggregatedMessageRoot>(
    newMockEvent()
  )

  aggregatedMessageRootEvent.parameters = new Array()

  aggregatedMessageRootEvent.parameters.push(
    new ethereum.EventParam("msgRoot", ethereum.Value.fromFixedBytes(msgRoot))
  )

  return aggregatedMessageRootEvent
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

export function createRemoveBeaconEvent(beaconId: Bytes): RemoveBeacon {
  let removeBeaconEvent = changetype<RemoveBeacon>(newMockEvent())

  removeBeaconEvent.parameters = new Array()

  removeBeaconEvent.parameters.push(
    new ethereum.EventParam("beaconId", ethereum.Value.fromFixedBytes(beaconId))
  )

  return removeBeaconEvent
}

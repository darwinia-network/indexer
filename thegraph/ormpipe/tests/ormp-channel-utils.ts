import { newMockEvent } from "matchstick-as"
import { ethereum, Bytes } from "@graphprotocol/graph-ts"
import {
  MessageAccepted,
  MessageDispatched
} from "../generated/OrmpChannel/OrmpChannel"

export function createMessageAcceptedEvent(
  msgHash: Bytes,
  root: Bytes,
  message: ethereum.Tuple
): MessageAccepted {
  let messageAcceptedEvent = changetype<MessageAccepted>(newMockEvent())

  messageAcceptedEvent.parameters = new Array()

  messageAcceptedEvent.parameters.push(
    new ethereum.EventParam("msgHash", ethereum.Value.fromFixedBytes(msgHash))
  )
  messageAcceptedEvent.parameters.push(
    new ethereum.EventParam("root", ethereum.Value.fromFixedBytes(root))
  )
  messageAcceptedEvent.parameters.push(
    new ethereum.EventParam("message", ethereum.Value.fromTuple(message))
  )

  return messageAcceptedEvent
}

export function createMessageDispatchedEvent(
  msgHash: Bytes,
  dispatchResult: boolean
): MessageDispatched {
  let messageDispatchedEvent = changetype<MessageDispatched>(newMockEvent())

  messageDispatchedEvent.parameters = new Array()

  messageDispatchedEvent.parameters.push(
    new ethereum.EventParam("msgHash", ethereum.Value.fromFixedBytes(msgHash))
  )
  messageDispatchedEvent.parameters.push(
    new ethereum.EventParam(
      "dispatchResult",
      ethereum.Value.fromBoolean(dispatchResult)
    )
  )

  return messageDispatchedEvent
}

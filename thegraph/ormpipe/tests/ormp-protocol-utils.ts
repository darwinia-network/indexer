import { newMockEvent } from "matchstick-as"
import { ethereum, Address, Bytes } from "@graphprotocol/graph-ts"
import {
  AppConfigUpdated,
  MessageAccepted,
  MessageDispatched,
  SetDefaultConfig
} from "../generated/OrmpProtocol/OrmpProtocol"

export function createAppConfigUpdatedEvent(
  ua: Address,
  oracle: Address,
  relayer: Address
): AppConfigUpdated {
  let appConfigUpdatedEvent = changetype<AppConfigUpdated>(newMockEvent())

  appConfigUpdatedEvent.parameters = new Array()

  appConfigUpdatedEvent.parameters.push(
    new ethereum.EventParam("ua", ethereum.Value.fromAddress(ua))
  )
  appConfigUpdatedEvent.parameters.push(
    new ethereum.EventParam("oracle", ethereum.Value.fromAddress(oracle))
  )
  appConfigUpdatedEvent.parameters.push(
    new ethereum.EventParam("relayer", ethereum.Value.fromAddress(relayer))
  )

  return appConfigUpdatedEvent
}

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

export function createSetDefaultConfigEvent(
  oracle: Address,
  relayer: Address
): SetDefaultConfig {
  let setDefaultConfigEvent = changetype<SetDefaultConfig>(newMockEvent())

  setDefaultConfigEvent.parameters = new Array()

  setDefaultConfigEvent.parameters.push(
    new ethereum.EventParam("oracle", ethereum.Value.fromAddress(oracle))
  )
  setDefaultConfigEvent.parameters.push(
    new ethereum.EventParam("relayer", ethereum.Value.fromAddress(relayer))
  )

  return setDefaultConfigEvent
}

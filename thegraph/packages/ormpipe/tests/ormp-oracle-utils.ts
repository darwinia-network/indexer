import { newMockEvent } from "matchstick-as"
import { ethereum, Bytes, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  Assigned,
  SetApproved,
  SetDapi,
  SetFee
} from "../generated/OrmpOracle/OrmpOracle"

export function createAssignedEvent(msgHash: Bytes, fee: BigInt): Assigned {
  let assignedEvent = changetype<Assigned>(newMockEvent())

  assignedEvent.parameters = new Array()

  assignedEvent.parameters.push(
    new ethereum.EventParam("msgHash", ethereum.Value.fromFixedBytes(msgHash))
  )
  assignedEvent.parameters.push(
    new ethereum.EventParam("fee", ethereum.Value.fromUnsignedBigInt(fee))
  )

  return assignedEvent
}

export function createSetApprovedEvent(
  operator: Address,
  approve: boolean
): SetApproved {
  let setApprovedEvent = changetype<SetApproved>(newMockEvent())

  setApprovedEvent.parameters = new Array()

  setApprovedEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  setApprovedEvent.parameters.push(
    new ethereum.EventParam("approve", ethereum.Value.fromBoolean(approve))
  )

  return setApprovedEvent
}

export function createSetDapiEvent(chainId: BigInt, dapi: Address): SetDapi {
  let setDapiEvent = changetype<SetDapi>(newMockEvent())

  setDapiEvent.parameters = new Array()

  setDapiEvent.parameters.push(
    new ethereum.EventParam(
      "chainId",
      ethereum.Value.fromUnsignedBigInt(chainId)
    )
  )
  setDapiEvent.parameters.push(
    new ethereum.EventParam("dapi", ethereum.Value.fromAddress(dapi))
  )

  return setDapiEvent
}

export function createSetFeeEvent(chainId: BigInt, fee: BigInt): SetFee {
  let setFeeEvent = changetype<SetFee>(newMockEvent())

  setFeeEvent.parameters = new Array()

  setFeeEvent.parameters.push(
    new ethereum.EventParam(
      "chainId",
      ethereum.Value.fromUnsignedBigInt(chainId)
    )
  )
  setFeeEvent.parameters.push(
    new ethereum.EventParam("fee", ethereum.Value.fromUnsignedBigInt(fee))
  )

  return setFeeEvent
}

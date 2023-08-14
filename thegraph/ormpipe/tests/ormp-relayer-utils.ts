import { newMockEvent } from "matchstick-as"
import { ethereum, Bytes, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  Assigned,
  SetApproved,
  SetDstConfig,
  SetDstPrice
} from "../generated/OrmpRelayer/OrmpRelayer"

export function createAssignedEvent(
  msgHash: Bytes,
  fee: BigInt,
  parmas: Bytes
): Assigned {
  let assignedEvent = changetype<Assigned>(newMockEvent())

  assignedEvent.parameters = new Array()

  assignedEvent.parameters.push(
    new ethereum.EventParam("msgHash", ethereum.Value.fromFixedBytes(msgHash))
  )
  assignedEvent.parameters.push(
    new ethereum.EventParam("fee", ethereum.Value.fromUnsignedBigInt(fee))
  )
  assignedEvent.parameters.push(
    new ethereum.EventParam("parmas", ethereum.Value.fromBytes(parmas))
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

export function createSetDstConfigEvent(
  chainId: BigInt,
  baseGas: BigInt,
  gasPerByte: BigInt
): SetDstConfig {
  let setDstConfigEvent = changetype<SetDstConfig>(newMockEvent())

  setDstConfigEvent.parameters = new Array()

  setDstConfigEvent.parameters.push(
    new ethereum.EventParam(
      "chainId",
      ethereum.Value.fromUnsignedBigInt(chainId)
    )
  )
  setDstConfigEvent.parameters.push(
    new ethereum.EventParam(
      "baseGas",
      ethereum.Value.fromUnsignedBigInt(baseGas)
    )
  )
  setDstConfigEvent.parameters.push(
    new ethereum.EventParam(
      "gasPerByte",
      ethereum.Value.fromUnsignedBigInt(gasPerByte)
    )
  )

  return setDstConfigEvent
}

export function createSetDstPriceEvent(
  chainId: BigInt,
  dstPriceRatio: BigInt,
  dstGasPriceInWei: BigInt
): SetDstPrice {
  let setDstPriceEvent = changetype<SetDstPrice>(newMockEvent())

  setDstPriceEvent.parameters = new Array()

  setDstPriceEvent.parameters.push(
    new ethereum.EventParam(
      "chainId",
      ethereum.Value.fromUnsignedBigInt(chainId)
    )
  )
  setDstPriceEvent.parameters.push(
    new ethereum.EventParam(
      "dstPriceRatio",
      ethereum.Value.fromUnsignedBigInt(dstPriceRatio)
    )
  )
  setDstPriceEvent.parameters.push(
    new ethereum.EventParam(
      "dstGasPriceInWei",
      ethereum.Value.fromUnsignedBigInt(dstGasPriceInWei)
    )
  )

  return setDstPriceEvent
}

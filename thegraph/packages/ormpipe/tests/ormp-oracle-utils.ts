import { newMockEvent } from "matchstick-as"
import { ethereum, Bytes, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  Assigned,
  ImportedMessageRoot,
  OwnershipTransferred,
  SetApproved,
  SetFee,
  Withdrawal
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

export function createImportedMessageRootEvent(
  chainId: BigInt,
  blockHeight: BigInt,
  messageRoot: Bytes
): ImportedMessageRoot {
  let importedMessageRootEvent = changetype<ImportedMessageRoot>(newMockEvent())

  importedMessageRootEvent.parameters = new Array()

  importedMessageRootEvent.parameters.push(
    new ethereum.EventParam(
      "chainId",
      ethereum.Value.fromUnsignedBigInt(chainId)
    )
  )
  importedMessageRootEvent.parameters.push(
    new ethereum.EventParam(
      "blockHeight",
      ethereum.Value.fromUnsignedBigInt(blockHeight)
    )
  )
  importedMessageRootEvent.parameters.push(
    new ethereum.EventParam(
      "messageRoot",
      ethereum.Value.fromFixedBytes(messageRoot)
    )
  )

  return importedMessageRootEvent
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

export function createWithdrawalEvent(to: Address, amt: BigInt): Withdrawal {
  let withdrawalEvent = changetype<Withdrawal>(newMockEvent())

  withdrawalEvent.parameters = new Array()

  withdrawalEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  withdrawalEvent.parameters.push(
    new ethereum.EventParam("amt", ethereum.Value.fromUnsignedBigInt(amt))
  )

  return withdrawalEvent
}

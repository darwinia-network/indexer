import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  DarwiniaAssigned,
  AssignedExt,
  DarwiniaDelist,
  DarwiniaDeposit,
  DarwiniaEnrol,
  DarwiniaInitialized,
  DarwiniaLocked,
  DarwiniaReward,
  DarwiniaSetOutbound,
  DarwiniaSettled,
  DarwiniaSlash,
  DarwiniaUnLocked,
  DarwiniaWithdrawal
} from "../generated/Darwinia/Darwinia"

export function createDarwiniaAssignedEvent(
  key: BigInt,
  timestamp: BigInt,
  assigned_relayers_number: BigInt,
  collateral: BigInt
): DarwiniaAssigned {
  let darwiniaAssignedEvent = changetype<DarwiniaAssigned>(newMockEvent())

  darwiniaAssignedEvent.parameters = new Array()

  darwiniaAssignedEvent.parameters.push(
    new ethereum.EventParam("key", ethereum.Value.fromUnsignedBigInt(key))
  )
  darwiniaAssignedEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )
  darwiniaAssignedEvent.parameters.push(
    new ethereum.EventParam(
      "assigned_relayers_number",
      ethereum.Value.fromUnsignedBigInt(assigned_relayers_number)
    )
  )
  darwiniaAssignedEvent.parameters.push(
    new ethereum.EventParam(
      "collateral",
      ethereum.Value.fromUnsignedBigInt(collateral)
    )
  )

  return darwiniaAssignedEvent
}

export function createAssignedExtEvent(
  key: BigInt,
  slot: BigInt,
  assigned_relayer: Address,
  fee: BigInt
): AssignedExt {
  let assignedExtEvent = changetype<AssignedExt>(newMockEvent())

  assignedExtEvent.parameters = new Array()

  assignedExtEvent.parameters.push(
    new ethereum.EventParam("key", ethereum.Value.fromUnsignedBigInt(key))
  )
  assignedExtEvent.parameters.push(
    new ethereum.EventParam("slot", ethereum.Value.fromUnsignedBigInt(slot))
  )
  assignedExtEvent.parameters.push(
    new ethereum.EventParam(
      "assigned_relayer",
      ethereum.Value.fromAddress(assigned_relayer)
    )
  )
  assignedExtEvent.parameters.push(
    new ethereum.EventParam("fee", ethereum.Value.fromUnsignedBigInt(fee))
  )

  return assignedExtEvent
}

export function createDarwiniaDelistEvent(
  prev: Address,
  cur: Address
): DarwiniaDelist {
  let darwiniaDelistEvent = changetype<DarwiniaDelist>(newMockEvent())

  darwiniaDelistEvent.parameters = new Array()

  darwiniaDelistEvent.parameters.push(
    new ethereum.EventParam("prev", ethereum.Value.fromAddress(prev))
  )
  darwiniaDelistEvent.parameters.push(
    new ethereum.EventParam("cur", ethereum.Value.fromAddress(cur))
  )

  return darwiniaDelistEvent
}

export function createDarwiniaDepositEvent(
  dst: Address,
  wad: BigInt
): DarwiniaDeposit {
  let darwiniaDepositEvent = changetype<DarwiniaDeposit>(newMockEvent())

  darwiniaDepositEvent.parameters = new Array()

  darwiniaDepositEvent.parameters.push(
    new ethereum.EventParam("dst", ethereum.Value.fromAddress(dst))
  )
  darwiniaDepositEvent.parameters.push(
    new ethereum.EventParam("wad", ethereum.Value.fromUnsignedBigInt(wad))
  )

  return darwiniaDepositEvent
}

export function createDarwiniaEnrolEvent(
  prev: Address,
  cur: Address,
  fee: BigInt
): DarwiniaEnrol {
  let darwiniaEnrolEvent = changetype<DarwiniaEnrol>(newMockEvent())

  darwiniaEnrolEvent.parameters = new Array()

  darwiniaEnrolEvent.parameters.push(
    new ethereum.EventParam("prev", ethereum.Value.fromAddress(prev))
  )
  darwiniaEnrolEvent.parameters.push(
    new ethereum.EventParam("cur", ethereum.Value.fromAddress(cur))
  )
  darwiniaEnrolEvent.parameters.push(
    new ethereum.EventParam("fee", ethereum.Value.fromUnsignedBigInt(fee))
  )

  return darwiniaEnrolEvent
}

export function createDarwiniaInitializedEvent(
  version: i32
): DarwiniaInitialized {
  let darwiniaInitializedEvent = changetype<DarwiniaInitialized>(newMockEvent())

  darwiniaInitializedEvent.parameters = new Array()

  darwiniaInitializedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(version))
    )
  )

  return darwiniaInitializedEvent
}

export function createDarwiniaLockedEvent(
  src: Address,
  wad: BigInt
): DarwiniaLocked {
  let darwiniaLockedEvent = changetype<DarwiniaLocked>(newMockEvent())

  darwiniaLockedEvent.parameters = new Array()

  darwiniaLockedEvent.parameters.push(
    new ethereum.EventParam("src", ethereum.Value.fromAddress(src))
  )
  darwiniaLockedEvent.parameters.push(
    new ethereum.EventParam("wad", ethereum.Value.fromUnsignedBigInt(wad))
  )

  return darwiniaLockedEvent
}

export function createDarwiniaRewardEvent(
  dst: Address,
  wad: BigInt
): DarwiniaReward {
  let darwiniaRewardEvent = changetype<DarwiniaReward>(newMockEvent())

  darwiniaRewardEvent.parameters = new Array()

  darwiniaRewardEvent.parameters.push(
    new ethereum.EventParam("dst", ethereum.Value.fromAddress(dst))
  )
  darwiniaRewardEvent.parameters.push(
    new ethereum.EventParam("wad", ethereum.Value.fromUnsignedBigInt(wad))
  )

  return darwiniaRewardEvent
}

export function createDarwiniaSetOutboundEvent(
  out: Address,
  flag: BigInt
): DarwiniaSetOutbound {
  let darwiniaSetOutboundEvent = changetype<DarwiniaSetOutbound>(newMockEvent())

  darwiniaSetOutboundEvent.parameters = new Array()

  darwiniaSetOutboundEvent.parameters.push(
    new ethereum.EventParam("out", ethereum.Value.fromAddress(out))
  )
  darwiniaSetOutboundEvent.parameters.push(
    new ethereum.EventParam("flag", ethereum.Value.fromUnsignedBigInt(flag))
  )

  return darwiniaSetOutboundEvent
}

export function createDarwiniaSettledEvent(
  key: BigInt,
  timestamp: BigInt,
  delivery: Address,
  confirm: Address
): DarwiniaSettled {
  let darwiniaSettledEvent = changetype<DarwiniaSettled>(newMockEvent())

  darwiniaSettledEvent.parameters = new Array()

  darwiniaSettledEvent.parameters.push(
    new ethereum.EventParam("key", ethereum.Value.fromUnsignedBigInt(key))
  )
  darwiniaSettledEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )
  darwiniaSettledEvent.parameters.push(
    new ethereum.EventParam("delivery", ethereum.Value.fromAddress(delivery))
  )
  darwiniaSettledEvent.parameters.push(
    new ethereum.EventParam("confirm", ethereum.Value.fromAddress(confirm))
  )

  return darwiniaSettledEvent
}

export function createDarwiniaSlashEvent(
  src: Address,
  wad: BigInt
): DarwiniaSlash {
  let darwiniaSlashEvent = changetype<DarwiniaSlash>(newMockEvent())

  darwiniaSlashEvent.parameters = new Array()

  darwiniaSlashEvent.parameters.push(
    new ethereum.EventParam("src", ethereum.Value.fromAddress(src))
  )
  darwiniaSlashEvent.parameters.push(
    new ethereum.EventParam("wad", ethereum.Value.fromUnsignedBigInt(wad))
  )

  return darwiniaSlashEvent
}

export function createDarwiniaUnLockedEvent(
  src: Address,
  wad: BigInt
): DarwiniaUnLocked {
  let darwiniaUnLockedEvent = changetype<DarwiniaUnLocked>(newMockEvent())

  darwiniaUnLockedEvent.parameters = new Array()

  darwiniaUnLockedEvent.parameters.push(
    new ethereum.EventParam("src", ethereum.Value.fromAddress(src))
  )
  darwiniaUnLockedEvent.parameters.push(
    new ethereum.EventParam("wad", ethereum.Value.fromUnsignedBigInt(wad))
  )

  return darwiniaUnLockedEvent
}

export function createDarwiniaWithdrawalEvent(
  src: Address,
  wad: BigInt
): DarwiniaWithdrawal {
  let darwiniaWithdrawalEvent = changetype<DarwiniaWithdrawal>(newMockEvent())

  darwiniaWithdrawalEvent.parameters = new Array()

  darwiniaWithdrawalEvent.parameters.push(
    new ethereum.EventParam("src", ethereum.Value.fromAddress(src))
  )
  darwiniaWithdrawalEvent.parameters.push(
    new ethereum.EventParam("wad", ethereum.Value.fromUnsignedBigInt(wad))
  )

  return darwiniaWithdrawalEvent
}

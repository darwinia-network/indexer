import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  PangoroAssigned,
  PangoroAssignedExt,
  PangoroDelist,
  PangoroDeposit,
  PangoroEnrol,
  PangoroInitialized,
  PangoroLocked,
  PangoroReward,
  PangoroSetOutbound,
  PangoroSettled,
  PangoroSlash,
  PangoroUnLocked,
  PangoroWithdrawal
} from "../generated/Pangoro/Pangoro"

export function createPangoroAssignedEvent(
  key: BigInt,
  timestamp: BigInt,
  assigned_relayers_number: BigInt,
  collateral: BigInt
): PangoroAssigned {
  let pangoroAssignedEvent = changetype<PangoroAssigned>(newMockEvent())

  pangoroAssignedEvent.parameters = new Array()

  pangoroAssignedEvent.parameters.push(
    new ethereum.EventParam("key", ethereum.Value.fromUnsignedBigInt(key))
  )
  pangoroAssignedEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )
  pangoroAssignedEvent.parameters.push(
    new ethereum.EventParam(
      "assigned_relayers_number",
      ethereum.Value.fromUnsignedBigInt(assigned_relayers_number)
    )
  )
  pangoroAssignedEvent.parameters.push(
    new ethereum.EventParam(
      "collateral",
      ethereum.Value.fromUnsignedBigInt(collateral)
    )
  )

  return pangoroAssignedEvent
}

export function createPangoroAssignedExtEvent(
  key: BigInt,
  slot: BigInt,
  assigned_relayer: Address,
  fee: BigInt
): PangoroAssignedExt {
  let pangoroAssignedExtEvent = changetype<PangoroAssignedExt>(newMockEvent())

  pangoroAssignedExtEvent.parameters = new Array()

  pangoroAssignedExtEvent.parameters.push(
    new ethereum.EventParam("key", ethereum.Value.fromUnsignedBigInt(key))
  )
  pangoroAssignedExtEvent.parameters.push(
    new ethereum.EventParam("slot", ethereum.Value.fromUnsignedBigInt(slot))
  )
  pangoroAssignedExtEvent.parameters.push(
    new ethereum.EventParam(
      "assigned_relayer",
      ethereum.Value.fromAddress(assigned_relayer)
    )
  )
  pangoroAssignedExtEvent.parameters.push(
    new ethereum.EventParam("fee", ethereum.Value.fromUnsignedBigInt(fee))
  )

  return pangoroAssignedExtEvent
}

export function createPangoroDelistEvent(
  prev: Address,
  cur: Address
): PangoroDelist {
  let pangoroDelistEvent = changetype<PangoroDelist>(newMockEvent())

  pangoroDelistEvent.parameters = new Array()

  pangoroDelistEvent.parameters.push(
    new ethereum.EventParam("prev", ethereum.Value.fromAddress(prev))
  )
  pangoroDelistEvent.parameters.push(
    new ethereum.EventParam("cur", ethereum.Value.fromAddress(cur))
  )

  return pangoroDelistEvent
}

export function createPangoroDepositEvent(
  dst: Address,
  wad: BigInt
): PangoroDeposit {
  let pangoroDepositEvent = changetype<PangoroDeposit>(newMockEvent())

  pangoroDepositEvent.parameters = new Array()

  pangoroDepositEvent.parameters.push(
    new ethereum.EventParam("dst", ethereum.Value.fromAddress(dst))
  )
  pangoroDepositEvent.parameters.push(
    new ethereum.EventParam("wad", ethereum.Value.fromUnsignedBigInt(wad))
  )

  return pangoroDepositEvent
}

export function createPangoroEnrolEvent(
  prev: Address,
  cur: Address,
  fee: BigInt
): PangoroEnrol {
  let pangoroEnrolEvent = changetype<PangoroEnrol>(newMockEvent())

  pangoroEnrolEvent.parameters = new Array()

  pangoroEnrolEvent.parameters.push(
    new ethereum.EventParam("prev", ethereum.Value.fromAddress(prev))
  )
  pangoroEnrolEvent.parameters.push(
    new ethereum.EventParam("cur", ethereum.Value.fromAddress(cur))
  )
  pangoroEnrolEvent.parameters.push(
    new ethereum.EventParam("fee", ethereum.Value.fromUnsignedBigInt(fee))
  )

  return pangoroEnrolEvent
}

export function createPangoroInitializedEvent(
  version: i32
): PangoroInitialized {
  let pangoroInitializedEvent = changetype<PangoroInitialized>(newMockEvent())

  pangoroInitializedEvent.parameters = new Array()

  pangoroInitializedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(version))
    )
  )

  return pangoroInitializedEvent
}

export function createPangoroLockedEvent(
  src: Address,
  wad: BigInt
): PangoroLocked {
  let pangoroLockedEvent = changetype<PangoroLocked>(newMockEvent())

  pangoroLockedEvent.parameters = new Array()

  pangoroLockedEvent.parameters.push(
    new ethereum.EventParam("src", ethereum.Value.fromAddress(src))
  )
  pangoroLockedEvent.parameters.push(
    new ethereum.EventParam("wad", ethereum.Value.fromUnsignedBigInt(wad))
  )

  return pangoroLockedEvent
}

export function createPangoroRewardEvent(
  dst: Address,
  wad: BigInt
): PangoroReward {
  let pangoroRewardEvent = changetype<PangoroReward>(newMockEvent())

  pangoroRewardEvent.parameters = new Array()

  pangoroRewardEvent.parameters.push(
    new ethereum.EventParam("dst", ethereum.Value.fromAddress(dst))
  )
  pangoroRewardEvent.parameters.push(
    new ethereum.EventParam("wad", ethereum.Value.fromUnsignedBigInt(wad))
  )

  return pangoroRewardEvent
}

export function createPangoroSetOutboundEvent(
  out: Address,
  flag: BigInt
): PangoroSetOutbound {
  let pangoroSetOutboundEvent = changetype<PangoroSetOutbound>(newMockEvent())

  pangoroSetOutboundEvent.parameters = new Array()

  pangoroSetOutboundEvent.parameters.push(
    new ethereum.EventParam("out", ethereum.Value.fromAddress(out))
  )
  pangoroSetOutboundEvent.parameters.push(
    new ethereum.EventParam("flag", ethereum.Value.fromUnsignedBigInt(flag))
  )

  return pangoroSetOutboundEvent
}

export function createPangoroSettledEvent(
  key: BigInt,
  timestamp: BigInt,
  delivery: Address,
  confirm: Address
): PangoroSettled {
  let pangoroSettledEvent = changetype<PangoroSettled>(newMockEvent())

  pangoroSettledEvent.parameters = new Array()

  pangoroSettledEvent.parameters.push(
    new ethereum.EventParam("key", ethereum.Value.fromUnsignedBigInt(key))
  )
  pangoroSettledEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )
  pangoroSettledEvent.parameters.push(
    new ethereum.EventParam("delivery", ethereum.Value.fromAddress(delivery))
  )
  pangoroSettledEvent.parameters.push(
    new ethereum.EventParam("confirm", ethereum.Value.fromAddress(confirm))
  )

  return pangoroSettledEvent
}

export function createPangoroSlashEvent(
  src: Address,
  wad: BigInt
): PangoroSlash {
  let pangoroSlashEvent = changetype<PangoroSlash>(newMockEvent())

  pangoroSlashEvent.parameters = new Array()

  pangoroSlashEvent.parameters.push(
    new ethereum.EventParam("src", ethereum.Value.fromAddress(src))
  )
  pangoroSlashEvent.parameters.push(
    new ethereum.EventParam("wad", ethereum.Value.fromUnsignedBigInt(wad))
  )

  return pangoroSlashEvent
}

export function createPangoroUnLockedEvent(
  src: Address,
  wad: BigInt
): PangoroUnLocked {
  let pangoroUnLockedEvent = changetype<PangoroUnLocked>(newMockEvent())

  pangoroUnLockedEvent.parameters = new Array()

  pangoroUnLockedEvent.parameters.push(
    new ethereum.EventParam("src", ethereum.Value.fromAddress(src))
  )
  pangoroUnLockedEvent.parameters.push(
    new ethereum.EventParam("wad", ethereum.Value.fromUnsignedBigInt(wad))
  )

  return pangoroUnLockedEvent
}

export function createPangoroWithdrawalEvent(
  src: Address,
  wad: BigInt
): PangoroWithdrawal {
  let pangoroWithdrawalEvent = changetype<PangoroWithdrawal>(newMockEvent())

  pangoroWithdrawalEvent.parameters = new Array()

  pangoroWithdrawalEvent.parameters.push(
    new ethereum.EventParam("src", ethereum.Value.fromAddress(src))
  )
  pangoroWithdrawalEvent.parameters.push(
    new ethereum.EventParam("wad", ethereum.Value.fromUnsignedBigInt(wad))
  )

  return pangoroWithdrawalEvent
}

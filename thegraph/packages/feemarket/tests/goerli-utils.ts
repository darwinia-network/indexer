import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  GoerliAssigned,
  GoerliDelist,
  GoerliDeposit,
  GoerliEnrol,
  GoerliInitialized,
  GoerliLocked,
  GoerliReward,
  GoerliSetOutbound,
  GoerliSettled,
  GoerliSlash,
  GoerliUnLocked,
  GoerliWithdrawal
} from "../generated/Goerli/Goerli"

export function createGoerliAssignedEvent(
  key: BigInt,
  timestamp: BigInt,
  relayer: Address,
  collateral: BigInt,
  fee: BigInt
): GoerliAssigned {
  let goerliAssignedEvent = changetype<GoerliAssigned>(newMockEvent())

  goerliAssignedEvent.parameters = new Array()

  goerliAssignedEvent.parameters.push(
    new ethereum.EventParam("key", ethereum.Value.fromUnsignedBigInt(key))
  )
  goerliAssignedEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )
  goerliAssignedEvent.parameters.push(
    new ethereum.EventParam("relayer", ethereum.Value.fromAddress(relayer))
  )
  goerliAssignedEvent.parameters.push(
    new ethereum.EventParam(
      "collateral",
      ethereum.Value.fromUnsignedBigInt(collateral)
    )
  )
  goerliAssignedEvent.parameters.push(
    new ethereum.EventParam("fee", ethereum.Value.fromUnsignedBigInt(fee))
  )

  return goerliAssignedEvent
}

export function createGoerliDelistEvent(
  prev: Address,
  cur: Address
): GoerliDelist {
  let goerliDelistEvent = changetype<GoerliDelist>(newMockEvent())

  goerliDelistEvent.parameters = new Array()

  goerliDelistEvent.parameters.push(
    new ethereum.EventParam("prev", ethereum.Value.fromAddress(prev))
  )
  goerliDelistEvent.parameters.push(
    new ethereum.EventParam("cur", ethereum.Value.fromAddress(cur))
  )

  return goerliDelistEvent
}

export function createGoerliDepositEvent(
  dst: Address,
  wad: BigInt
): GoerliDeposit {
  let goerliDepositEvent = changetype<GoerliDeposit>(newMockEvent())

  goerliDepositEvent.parameters = new Array()

  goerliDepositEvent.parameters.push(
    new ethereum.EventParam("dst", ethereum.Value.fromAddress(dst))
  )
  goerliDepositEvent.parameters.push(
    new ethereum.EventParam("wad", ethereum.Value.fromUnsignedBigInt(wad))
  )

  return goerliDepositEvent
}

export function createGoerliEnrolEvent(
  prev: Address,
  cur: Address,
  fee: BigInt
): GoerliEnrol {
  let goerliEnrolEvent = changetype<GoerliEnrol>(newMockEvent())

  goerliEnrolEvent.parameters = new Array()

  goerliEnrolEvent.parameters.push(
    new ethereum.EventParam("prev", ethereum.Value.fromAddress(prev))
  )
  goerliEnrolEvent.parameters.push(
    new ethereum.EventParam("cur", ethereum.Value.fromAddress(cur))
  )
  goerliEnrolEvent.parameters.push(
    new ethereum.EventParam("fee", ethereum.Value.fromUnsignedBigInt(fee))
  )

  return goerliEnrolEvent
}

export function createGoerliInitializedEvent(version: i32): GoerliInitialized {
  let goerliInitializedEvent = changetype<GoerliInitialized>(newMockEvent())

  goerliInitializedEvent.parameters = new Array()

  goerliInitializedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(version))
    )
  )

  return goerliInitializedEvent
}

export function createGoerliLockedEvent(
  src: Address,
  wad: BigInt
): GoerliLocked {
  let goerliLockedEvent = changetype<GoerliLocked>(newMockEvent())

  goerliLockedEvent.parameters = new Array()

  goerliLockedEvent.parameters.push(
    new ethereum.EventParam("src", ethereum.Value.fromAddress(src))
  )
  goerliLockedEvent.parameters.push(
    new ethereum.EventParam("wad", ethereum.Value.fromUnsignedBigInt(wad))
  )

  return goerliLockedEvent
}

export function createGoerliRewardEvent(
  dst: Address,
  wad: BigInt
): GoerliReward {
  let goerliRewardEvent = changetype<GoerliReward>(newMockEvent())

  goerliRewardEvent.parameters = new Array()

  goerliRewardEvent.parameters.push(
    new ethereum.EventParam("dst", ethereum.Value.fromAddress(dst))
  )
  goerliRewardEvent.parameters.push(
    new ethereum.EventParam("wad", ethereum.Value.fromUnsignedBigInt(wad))
  )

  return goerliRewardEvent
}

export function createGoerliSetOutboundEvent(
  out: Address,
  flag: BigInt
): GoerliSetOutbound {
  let goerliSetOutboundEvent = changetype<GoerliSetOutbound>(newMockEvent())

  goerliSetOutboundEvent.parameters = new Array()

  goerliSetOutboundEvent.parameters.push(
    new ethereum.EventParam("out", ethereum.Value.fromAddress(out))
  )
  goerliSetOutboundEvent.parameters.push(
    new ethereum.EventParam("flag", ethereum.Value.fromUnsignedBigInt(flag))
  )

  return goerliSetOutboundEvent
}

export function createGoerliSettledEvent(
  key: BigInt,
  timestamp: BigInt,
  delivery: Address,
  confirm: Address
): GoerliSettled {
  let goerliSettledEvent = changetype<GoerliSettled>(newMockEvent())

  goerliSettledEvent.parameters = new Array()

  goerliSettledEvent.parameters.push(
    new ethereum.EventParam("key", ethereum.Value.fromUnsignedBigInt(key))
  )
  goerliSettledEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )
  goerliSettledEvent.parameters.push(
    new ethereum.EventParam("delivery", ethereum.Value.fromAddress(delivery))
  )
  goerliSettledEvent.parameters.push(
    new ethereum.EventParam("confirm", ethereum.Value.fromAddress(confirm))
  )

  return goerliSettledEvent
}

export function createGoerliSlashEvent(src: Address, wad: BigInt): GoerliSlash {
  let goerliSlashEvent = changetype<GoerliSlash>(newMockEvent())

  goerliSlashEvent.parameters = new Array()

  goerliSlashEvent.parameters.push(
    new ethereum.EventParam("src", ethereum.Value.fromAddress(src))
  )
  goerliSlashEvent.parameters.push(
    new ethereum.EventParam("wad", ethereum.Value.fromUnsignedBigInt(wad))
  )

  return goerliSlashEvent
}

export function createGoerliUnLockedEvent(
  src: Address,
  wad: BigInt
): GoerliUnLocked {
  let goerliUnLockedEvent = changetype<GoerliUnLocked>(newMockEvent())

  goerliUnLockedEvent.parameters = new Array()

  goerliUnLockedEvent.parameters.push(
    new ethereum.EventParam("src", ethereum.Value.fromAddress(src))
  )
  goerliUnLockedEvent.parameters.push(
    new ethereum.EventParam("wad", ethereum.Value.fromUnsignedBigInt(wad))
  )

  return goerliUnLockedEvent
}

export function createGoerliWithdrawalEvent(
  src: Address,
  wad: BigInt
): GoerliWithdrawal {
  let goerliWithdrawalEvent = changetype<GoerliWithdrawal>(newMockEvent())

  goerliWithdrawalEvent.parameters = new Array()

  goerliWithdrawalEvent.parameters.push(
    new ethereum.EventParam("src", ethereum.Value.fromAddress(src))
  )
  goerliWithdrawalEvent.parameters.push(
    new ethereum.EventParam("wad", ethereum.Value.fromUnsignedBigInt(wad))
  )

  return goerliWithdrawalEvent
}

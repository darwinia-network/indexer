import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  Assigned,
  Delist,
  Deposit,
  Enrol,
  Initialized,
  Locked,
  Reward,
  SetOutbound,
  Settled,
  Slash,
  UnLocked,
  Withdrawal
} from "../generated/Mainnet/Mainnet"

export function createAssignedEvent(
  key: BigInt,
  timestamp: BigInt,
  relayer: Address,
  collateral: BigInt,
  fee: BigInt
): Assigned {
  let assignedEvent = changetype<Assigned>(newMockEvent())

  assignedEvent.parameters = new Array()

  assignedEvent.parameters.push(
    new ethereum.EventParam("key", ethereum.Value.fromUnsignedBigInt(key))
  )
  assignedEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )
  assignedEvent.parameters.push(
    new ethereum.EventParam("relayer", ethereum.Value.fromAddress(relayer))
  )
  assignedEvent.parameters.push(
    new ethereum.EventParam(
      "collateral",
      ethereum.Value.fromUnsignedBigInt(collateral)
    )
  )
  assignedEvent.parameters.push(
    new ethereum.EventParam("fee", ethereum.Value.fromUnsignedBigInt(fee))
  )

  return assignedEvent
}

export function createDelistEvent(prev: Address, cur: Address): Delist {
  let delistEvent = changetype<Delist>(newMockEvent())

  delistEvent.parameters = new Array()

  delistEvent.parameters.push(
    new ethereum.EventParam("prev", ethereum.Value.fromAddress(prev))
  )
  delistEvent.parameters.push(
    new ethereum.EventParam("cur", ethereum.Value.fromAddress(cur))
  )

  return delistEvent
}

export function createDepositEvent(dst: Address, wad: BigInt): Deposit {
  let depositEvent = changetype<Deposit>(newMockEvent())

  depositEvent.parameters = new Array()

  depositEvent.parameters.push(
    new ethereum.EventParam("dst", ethereum.Value.fromAddress(dst))
  )
  depositEvent.parameters.push(
    new ethereum.EventParam("wad", ethereum.Value.fromUnsignedBigInt(wad))
  )

  return depositEvent
}

export function createEnrolEvent(
  prev: Address,
  cur: Address,
  fee: BigInt
): Enrol {
  let enrolEvent = changetype<Enrol>(newMockEvent())

  enrolEvent.parameters = new Array()

  enrolEvent.parameters.push(
    new ethereum.EventParam("prev", ethereum.Value.fromAddress(prev))
  )
  enrolEvent.parameters.push(
    new ethereum.EventParam("cur", ethereum.Value.fromAddress(cur))
  )
  enrolEvent.parameters.push(
    new ethereum.EventParam("fee", ethereum.Value.fromUnsignedBigInt(fee))
  )

  return enrolEvent
}

export function createInitializedEvent(version: i32): Initialized {
  let initializedEvent = changetype<Initialized>(newMockEvent())

  initializedEvent.parameters = new Array()

  initializedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(version))
    )
  )

  return initializedEvent
}

export function createLockedEvent(src: Address, wad: BigInt): Locked {
  let lockedEvent = changetype<Locked>(newMockEvent())

  lockedEvent.parameters = new Array()

  lockedEvent.parameters.push(
    new ethereum.EventParam("src", ethereum.Value.fromAddress(src))
  )
  lockedEvent.parameters.push(
    new ethereum.EventParam("wad", ethereum.Value.fromUnsignedBigInt(wad))
  )

  return lockedEvent
}

export function createRewardEvent(dst: Address, wad: BigInt): Reward {
  let rewardEvent = changetype<Reward>(newMockEvent())

  rewardEvent.parameters = new Array()

  rewardEvent.parameters.push(
    new ethereum.EventParam("dst", ethereum.Value.fromAddress(dst))
  )
  rewardEvent.parameters.push(
    new ethereum.EventParam("wad", ethereum.Value.fromUnsignedBigInt(wad))
  )

  return rewardEvent
}

export function createSetOutboundEvent(
  out: Address,
  flag: BigInt
): SetOutbound {
  let setOutboundEvent = changetype<SetOutbound>(newMockEvent())

  setOutboundEvent.parameters = new Array()

  setOutboundEvent.parameters.push(
    new ethereum.EventParam("out", ethereum.Value.fromAddress(out))
  )
  setOutboundEvent.parameters.push(
    new ethereum.EventParam("flag", ethereum.Value.fromUnsignedBigInt(flag))
  )

  return setOutboundEvent
}

export function createSettledEvent(
  key: BigInt,
  timestamp: BigInt,
  delivery: Address,
  confirm: Address
): Settled {
  let settledEvent = changetype<Settled>(newMockEvent())

  settledEvent.parameters = new Array()

  settledEvent.parameters.push(
    new ethereum.EventParam("key", ethereum.Value.fromUnsignedBigInt(key))
  )
  settledEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )
  settledEvent.parameters.push(
    new ethereum.EventParam("delivery", ethereum.Value.fromAddress(delivery))
  )
  settledEvent.parameters.push(
    new ethereum.EventParam("confirm", ethereum.Value.fromAddress(confirm))
  )

  return settledEvent
}

export function createSlashEvent(src: Address, wad: BigInt): Slash {
  let slashEvent = changetype<Slash>(newMockEvent())

  slashEvent.parameters = new Array()

  slashEvent.parameters.push(
    new ethereum.EventParam("src", ethereum.Value.fromAddress(src))
  )
  slashEvent.parameters.push(
    new ethereum.EventParam("wad", ethereum.Value.fromUnsignedBigInt(wad))
  )

  return slashEvent
}

export function createUnLockedEvent(src: Address, wad: BigInt): UnLocked {
  let unLockedEvent = changetype<UnLocked>(newMockEvent())

  unLockedEvent.parameters = new Array()

  unLockedEvent.parameters.push(
    new ethereum.EventParam("src", ethereum.Value.fromAddress(src))
  )
  unLockedEvent.parameters.push(
    new ethereum.EventParam("wad", ethereum.Value.fromUnsignedBigInt(wad))
  )

  return unLockedEvent
}

export function createWithdrawalEvent(src: Address, wad: BigInt): Withdrawal {
  let withdrawalEvent = changetype<Withdrawal>(newMockEvent())

  withdrawalEvent.parameters = new Array()

  withdrawalEvent.parameters.push(
    new ethereum.EventParam("src", ethereum.Value.fromAddress(src))
  )
  withdrawalEvent.parameters.push(
    new ethereum.EventParam("wad", ethereum.Value.fromUnsignedBigInt(wad))
  )

  return withdrawalEvent
}

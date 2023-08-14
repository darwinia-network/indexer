import {
  Assigned as AssignedEvent,
  SetApproved as SetApprovedEvent,
  SetDapi as SetDapiEvent,
  SetFee as SetFeeEvent
} from "../generated/OrmpOracle/OrmpOracle"
import { Assigned, SetApproved, SetDapi, SetFee } from "../generated/schema"

export function handleAssigned(event: AssignedEvent): void {
  let entity = new Assigned(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.msgHash = event.params.msgHash
  entity.fee = event.params.fee

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSetApproved(event: SetApprovedEvent): void {
  let entity = new SetApproved(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.operator = event.params.operator
  entity.approve = event.params.approve

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSetDapi(event: SetDapiEvent): void {
  let entity = new SetDapi(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.chainId = event.params.chainId
  entity.dapi = event.params.dapi

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSetFee(event: SetFeeEvent): void {
  let entity = new SetFee(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.chainId = event.params.chainId
  entity.fee = event.params.fee

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

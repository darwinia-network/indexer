import {
  Assigned as AssignedEvent,
  SetFee as SetFeeEvent
} from "../generated/OrmpOracle/OrmpOracle"
import {OrmpOracleAssigned, OrmpOracleSetFee} from "../generated/schema"

export function handleAssigned(event: AssignedEvent): void {
  let entity = new OrmpOracleAssigned(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.msgHash = event.params.msgHash
  entity.fee = event.params.fee

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSetFee(event: SetFeeEvent): void {
  let entity = new OrmpOracleSetFee(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.chainId = event.params.chainId
  entity.fee = event.params.fee

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

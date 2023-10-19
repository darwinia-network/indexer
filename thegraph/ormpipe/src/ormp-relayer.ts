import {
  Assigned as AssignedEvent,
  SetApproved as SetApprovedEvent,
  SetDstConfig as SetDstConfigEvent,
  SetDstPrice as SetDstPriceEvent
} from "../generated/OrmpRelayer/OrmpRelayer"
import {
  OrmpRelayerAssigned,
  OrmpRelayerSetApproved,
  OrmpRelayerSetDstConfig,
  OrmpRelayerSetDstPrice
} from "../generated/schema"

export function handleAssigned(event: AssignedEvent): void {
  let entity = new OrmpRelayerAssigned(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.msgHash = event.params.msgHash
  entity.fee = event.params.fee
  entity.params = event.params.params
  entity.proof = event.params.proof

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSetApproved(event: SetApprovedEvent): void {
  let entity = new OrmpRelayerSetApproved(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.operator = event.params.operator
  entity.approve = event.params.approve

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSetDstConfig(event: SetDstConfigEvent): void {
  let entity = new OrmpRelayerSetDstConfig(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.chainId = event.params.chainId
  entity.baseGas = event.params.baseGas
  entity.gasPerByte = event.params.gasPerByte

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSetDstPrice(event: SetDstPriceEvent): void {
  let entity = new OrmpRelayerSetDstPrice(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.chainId = event.params.chainId
  entity.dstPriceRatio = event.params.dstPriceRatio
  entity.dstGasPriceInWei = event.params.dstGasPriceInWei

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

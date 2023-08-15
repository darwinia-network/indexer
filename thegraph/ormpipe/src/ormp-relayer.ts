import {
  Assigned as AssignedEvent,
  SetApproved as SetApprovedEvent,
  SetDstConfig as SetDstConfigEvent,
  SetDstPrice as SetDstPriceEvent
} from "../generated/OrmpRelayer/OrmpRelayer"
import {
  OrmpRelayerAssigned,
  OrmpRelayerSetDstPrice
} from "../generated/schema"

export function handleAssigned(event: AssignedEvent): void {
  let entity = new OrmpRelayerAssigned(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.msgHash = event.params.msgHash
  entity.fee = event.params.fee
  entity.parmas = event.params.parmas

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

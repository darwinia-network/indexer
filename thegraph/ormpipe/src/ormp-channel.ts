import {
  MessageAccepted as MessageAcceptedEvent,
  MessageDispatched as MessageDispatchedEvent
} from "../generated/OrmpChannel/OrmpChannel"
import { MessageAccepted, MessageDispatched } from "../generated/schema"

export function handleMessageAccepted(event: MessageAcceptedEvent): void {
  let entity = new MessageAccepted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.msgHash = event.params.msgHash
  entity.root = event.params.root
  entity.message_channel = event.params.message.channel
  entity.message_index = event.params.message.index
  entity.message_fromChainId = event.params.message.fromChainId
  entity.message_from = event.params.message.from
  entity.message_toChainId = event.params.message.toChainId
  entity.message_to = event.params.message.to
  entity.message_encoded = event.params.message.encoded

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleMessageDispatched(event: MessageDispatchedEvent): void {
  let entity = new MessageDispatched(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.msgHash = event.params.msgHash
  entity.dispatchResult = event.params.dispatchResult

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

import {
  AppConfigUpdated as AppConfigUpdatedEvent,
  ClearFailedMessage as ClearFailedMessageEvent,
  MessageAccepted as MessageAcceptedEvent,
  MessageDispatched as MessageDispatchedEvent,
  RetryFailedMessage as RetryFailedMessageEvent,
  SetDefaultConfig as SetDefaultConfigEvent
} from "../generated/OrmpEndpoint/OrmpEndpoint"
import {
  OrmpEndpointAppConfigUpdated,
  OrmpEndpointClearFailedMessage,
  OrmpEndpointMessageAccepted,
  OrmpEndpointMessageDispatched,
  OrmpEndpointRetryFailedMessage,
  OrmpEndpointSetDefaultConfig
} from "../generated/schema"

export function handleAppConfigUpdated(event: AppConfigUpdatedEvent): void {
  let entity = new OrmpEndpointAppConfigUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.ua = event.params.ua
  entity.oracle = event.params.oracle
  entity.relayer = event.params.relayer

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleClearFailedMessage(event: ClearFailedMessageEvent): void {
  let entity = new OrmpEndpointClearFailedMessage(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.msgHash = event.params.msgHash

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleMessageAccepted(event: MessageAcceptedEvent): void {
  let entity = new OrmpEndpointMessageAccepted(
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
  let entity = new OrmpEndpointMessageDispatched(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.msgHash = event.params.msgHash
  entity.dispatchResult = event.params.dispatchResult

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRetryFailedMessage(event: RetryFailedMessageEvent): void {
  let entity = new OrmpEndpointRetryFailedMessage(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.msgHash = event.params.msgHash
  entity.dispatchResult = event.params.dispatchResult

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSetDefaultConfig(event: SetDefaultConfigEvent): void {
  let entity = new OrmpEndpointSetDefaultConfig(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.oracle = event.params.oracle
  entity.relayer = event.params.relayer

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

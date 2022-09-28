import {
  MessageAccepted, MessagesDelivered
} from "../generated/outbound/outbound"
import { MessageAcceptedEntity, MessagesDeliveredEntity } from "../generated/schema"

export function handleMessageAccepted(event: MessageAccepted): void {
  let id = event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  let message_accpeted = MessageAcceptedEntity.load(id)
  if (!message_accpeted) {
    message_accpeted = new MessageAcceptedEntity(id)
  }
  message_accpeted.source = event.params.source
  message_accpeted.target = event.params.target
  message_accpeted.nonce = event.params.nonce
  message_accpeted.encoded = event.params.encoded
  message_accpeted.block_number = event.block.number
  message_accpeted.save()
}

export function handleMessagesDelivered(event: MessagesDelivered): void {
  let id = event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  let message_delivered = MessagesDeliveredEntity.load(id)
  if (!message_delivered) {
    message_delivered = new MessagesDeliveredEntity(id)
  }
  message_delivered.begin = event.params.begin
  message_delivered.end = event.params.end
  message_delivered.block_number = event.block.number
  message_delivered.save()
}


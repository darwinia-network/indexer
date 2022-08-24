import { Bytes } from "@graphprotocol/graph-ts"
import { MessageDispatched } from "../generated/inbound/inbound"
import { MessageDispatchedEntity } from "../generated/schema"

export function handleMessageDispatched(event: MessageDispatched): void {
  let id = Bytes.fromHexString(event.params.nonce.toHexString())
  let message_dispatched = MessageDispatchedEntity.load(id)
  if (!message_dispatched) {
    message_dispatched = new MessageDispatchedEntity(id)
  }
  message_dispatched.block_number = event.block.number
  message_dispatched.result = event.params.result
  message_dispatched.nonce = event.params.nonce
  message_dispatched.save()
}

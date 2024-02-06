import { SignatureSubmittion as SignatureSubmittionEvent } from "../generated/SubAPISignaturePub/SubAPISignaturePub"
import { SignatureSubmittion } from "../generated/schema"

export function handleSignatureSubmittion(
  event: SignatureSubmittionEvent
): void {
  let entity = new SignatureSubmittion(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.chainId = event.params.chainId
  entity.msgIndex = event.params.msgIndex
  entity.signer = event.params.signer
  entity.signature = event.params.signature
  entity.data = event.params.data

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

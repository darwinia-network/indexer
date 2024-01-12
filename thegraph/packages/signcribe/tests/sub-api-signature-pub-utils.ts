import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address, Bytes } from "@graphprotocol/graph-ts"
import { SignatureSubmittion } from "../generated/SubAPISignaturePub/SubAPISignaturePub"

export function createSignatureSubmittionEvent(
  chainId: BigInt,
  signer: Address,
  signature: Bytes,
  data: Bytes
): SignatureSubmittion {
  let signatureSubmittionEvent = changetype<SignatureSubmittion>(newMockEvent())

  signatureSubmittionEvent.parameters = new Array()

  signatureSubmittionEvent.parameters.push(
    new ethereum.EventParam(
      "chainId",
      ethereum.Value.fromUnsignedBigInt(chainId)
    )
  )
  signatureSubmittionEvent.parameters.push(
    new ethereum.EventParam("signer", ethereum.Value.fromAddress(signer))
  )
  signatureSubmittionEvent.parameters.push(
    new ethereum.EventParam("signature", ethereum.Value.fromBytes(signature))
  )
  signatureSubmittionEvent.parameters.push(
    new ethereum.EventParam("data", ethereum.Value.fromBytes(data))
  )

  return signatureSubmittionEvent
}

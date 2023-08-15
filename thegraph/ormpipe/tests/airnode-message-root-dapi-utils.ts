import { newMockEvent } from "matchstick-as"
import { ethereum, Bytes, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  CreatedTemplate,
  FailedRequest,
  FulfilledRequest,
  FulfilledWithdrawal,
  MadeFullRequest,
  MadeTemplateRequest,
  RequestedWithdrawal,
  SetSponsorshipStatus
} from "../generated/AirnodeMessageRootDapi/AirnodeMessageRootDapi"

export function createCreatedTemplateEvent(
  templateId: Bytes,
  airnode: Address,
  endpointId: Bytes,
  parameters: Bytes
): CreatedTemplate {
  let createdTemplateEvent = changetype<CreatedTemplate>(newMockEvent())

  createdTemplateEvent.parameters = new Array()

  createdTemplateEvent.parameters.push(
    new ethereum.EventParam(
      "templateId",
      ethereum.Value.fromFixedBytes(templateId)
    )
  )
  createdTemplateEvent.parameters.push(
    new ethereum.EventParam("airnode", ethereum.Value.fromAddress(airnode))
  )
  createdTemplateEvent.parameters.push(
    new ethereum.EventParam(
      "endpointId",
      ethereum.Value.fromFixedBytes(endpointId)
    )
  )
  createdTemplateEvent.parameters.push(
    new ethereum.EventParam("parameters", ethereum.Value.fromBytes(parameters))
  )

  return createdTemplateEvent
}

export function createFailedRequestEvent(
  airnode: Address,
  requestId: Bytes,
  errorMessage: string
): FailedRequest {
  let failedRequestEvent = changetype<FailedRequest>(newMockEvent())

  failedRequestEvent.parameters = new Array()

  failedRequestEvent.parameters.push(
    new ethereum.EventParam("airnode", ethereum.Value.fromAddress(airnode))
  )
  failedRequestEvent.parameters.push(
    new ethereum.EventParam(
      "requestId",
      ethereum.Value.fromFixedBytes(requestId)
    )
  )
  failedRequestEvent.parameters.push(
    new ethereum.EventParam(
      "errorMessage",
      ethereum.Value.fromString(errorMessage)
    )
  )

  return failedRequestEvent
}

export function createFulfilledRequestEvent(
  airnode: Address,
  requestId: Bytes,
  data: Bytes
): FulfilledRequest {
  let fulfilledRequestEvent = changetype<FulfilledRequest>(newMockEvent())

  fulfilledRequestEvent.parameters = new Array()

  fulfilledRequestEvent.parameters.push(
    new ethereum.EventParam("airnode", ethereum.Value.fromAddress(airnode))
  )
  fulfilledRequestEvent.parameters.push(
    new ethereum.EventParam(
      "requestId",
      ethereum.Value.fromFixedBytes(requestId)
    )
  )
  fulfilledRequestEvent.parameters.push(
    new ethereum.EventParam("data", ethereum.Value.fromBytes(data))
  )

  return fulfilledRequestEvent
}

export function createFulfilledWithdrawalEvent(
  airnode: Address,
  sponsor: Address,
  withdrawalRequestId: Bytes,
  sponsorWallet: Address,
  amount: BigInt
): FulfilledWithdrawal {
  let fulfilledWithdrawalEvent = changetype<FulfilledWithdrawal>(newMockEvent())

  fulfilledWithdrawalEvent.parameters = new Array()

  fulfilledWithdrawalEvent.parameters.push(
    new ethereum.EventParam("airnode", ethereum.Value.fromAddress(airnode))
  )
  fulfilledWithdrawalEvent.parameters.push(
    new ethereum.EventParam("sponsor", ethereum.Value.fromAddress(sponsor))
  )
  fulfilledWithdrawalEvent.parameters.push(
    new ethereum.EventParam(
      "withdrawalRequestId",
      ethereum.Value.fromFixedBytes(withdrawalRequestId)
    )
  )
  fulfilledWithdrawalEvent.parameters.push(
    new ethereum.EventParam(
      "sponsorWallet",
      ethereum.Value.fromAddress(sponsorWallet)
    )
  )
  fulfilledWithdrawalEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return fulfilledWithdrawalEvent
}

export function createMadeFullRequestEvent(
  airnode: Address,
  requestId: Bytes,
  requesterRequestCount: BigInt,
  chainId: BigInt,
  requester: Address,
  endpointId: Bytes,
  sponsor: Address,
  sponsorWallet: Address,
  fulfillAddress: Address,
  fulfillFunctionId: Bytes,
  parameters: Bytes
): MadeFullRequest {
  let madeFullRequestEvent = changetype<MadeFullRequest>(newMockEvent())

  madeFullRequestEvent.parameters = new Array()

  madeFullRequestEvent.parameters.push(
    new ethereum.EventParam("airnode", ethereum.Value.fromAddress(airnode))
  )
  madeFullRequestEvent.parameters.push(
    new ethereum.EventParam(
      "requestId",
      ethereum.Value.fromFixedBytes(requestId)
    )
  )
  madeFullRequestEvent.parameters.push(
    new ethereum.EventParam(
      "requesterRequestCount",
      ethereum.Value.fromUnsignedBigInt(requesterRequestCount)
    )
  )
  madeFullRequestEvent.parameters.push(
    new ethereum.EventParam(
      "chainId",
      ethereum.Value.fromUnsignedBigInt(chainId)
    )
  )
  madeFullRequestEvent.parameters.push(
    new ethereum.EventParam("requester", ethereum.Value.fromAddress(requester))
  )
  madeFullRequestEvent.parameters.push(
    new ethereum.EventParam(
      "endpointId",
      ethereum.Value.fromFixedBytes(endpointId)
    )
  )
  madeFullRequestEvent.parameters.push(
    new ethereum.EventParam("sponsor", ethereum.Value.fromAddress(sponsor))
  )
  madeFullRequestEvent.parameters.push(
    new ethereum.EventParam(
      "sponsorWallet",
      ethereum.Value.fromAddress(sponsorWallet)
    )
  )
  madeFullRequestEvent.parameters.push(
    new ethereum.EventParam(
      "fulfillAddress",
      ethereum.Value.fromAddress(fulfillAddress)
    )
  )
  madeFullRequestEvent.parameters.push(
    new ethereum.EventParam(
      "fulfillFunctionId",
      ethereum.Value.fromFixedBytes(fulfillFunctionId)
    )
  )
  madeFullRequestEvent.parameters.push(
    new ethereum.EventParam("parameters", ethereum.Value.fromBytes(parameters))
  )

  return madeFullRequestEvent
}

export function createMadeTemplateRequestEvent(
  airnode: Address,
  requestId: Bytes,
  requesterRequestCount: BigInt,
  chainId: BigInt,
  requester: Address,
  templateId: Bytes,
  sponsor: Address,
  sponsorWallet: Address,
  fulfillAddress: Address,
  fulfillFunctionId: Bytes,
  parameters: Bytes
): MadeTemplateRequest {
  let madeTemplateRequestEvent = changetype<MadeTemplateRequest>(newMockEvent())

  madeTemplateRequestEvent.parameters = new Array()

  madeTemplateRequestEvent.parameters.push(
    new ethereum.EventParam("airnode", ethereum.Value.fromAddress(airnode))
  )
  madeTemplateRequestEvent.parameters.push(
    new ethereum.EventParam(
      "requestId",
      ethereum.Value.fromFixedBytes(requestId)
    )
  )
  madeTemplateRequestEvent.parameters.push(
    new ethereum.EventParam(
      "requesterRequestCount",
      ethereum.Value.fromUnsignedBigInt(requesterRequestCount)
    )
  )
  madeTemplateRequestEvent.parameters.push(
    new ethereum.EventParam(
      "chainId",
      ethereum.Value.fromUnsignedBigInt(chainId)
    )
  )
  madeTemplateRequestEvent.parameters.push(
    new ethereum.EventParam("requester", ethereum.Value.fromAddress(requester))
  )
  madeTemplateRequestEvent.parameters.push(
    new ethereum.EventParam(
      "templateId",
      ethereum.Value.fromFixedBytes(templateId)
    )
  )
  madeTemplateRequestEvent.parameters.push(
    new ethereum.EventParam("sponsor", ethereum.Value.fromAddress(sponsor))
  )
  madeTemplateRequestEvent.parameters.push(
    new ethereum.EventParam(
      "sponsorWallet",
      ethereum.Value.fromAddress(sponsorWallet)
    )
  )
  madeTemplateRequestEvent.parameters.push(
    new ethereum.EventParam(
      "fulfillAddress",
      ethereum.Value.fromAddress(fulfillAddress)
    )
  )
  madeTemplateRequestEvent.parameters.push(
    new ethereum.EventParam(
      "fulfillFunctionId",
      ethereum.Value.fromFixedBytes(fulfillFunctionId)
    )
  )
  madeTemplateRequestEvent.parameters.push(
    new ethereum.EventParam("parameters", ethereum.Value.fromBytes(parameters))
  )

  return madeTemplateRequestEvent
}

export function createRequestedWithdrawalEvent(
  airnode: Address,
  sponsor: Address,
  withdrawalRequestId: Bytes,
  sponsorWallet: Address
): RequestedWithdrawal {
  let requestedWithdrawalEvent = changetype<RequestedWithdrawal>(newMockEvent())

  requestedWithdrawalEvent.parameters = new Array()

  requestedWithdrawalEvent.parameters.push(
    new ethereum.EventParam("airnode", ethereum.Value.fromAddress(airnode))
  )
  requestedWithdrawalEvent.parameters.push(
    new ethereum.EventParam("sponsor", ethereum.Value.fromAddress(sponsor))
  )
  requestedWithdrawalEvent.parameters.push(
    new ethereum.EventParam(
      "withdrawalRequestId",
      ethereum.Value.fromFixedBytes(withdrawalRequestId)
    )
  )
  requestedWithdrawalEvent.parameters.push(
    new ethereum.EventParam(
      "sponsorWallet",
      ethereum.Value.fromAddress(sponsorWallet)
    )
  )

  return requestedWithdrawalEvent
}

export function createSetSponsorshipStatusEvent(
  sponsor: Address,
  requester: Address,
  sponsorshipStatus: boolean
): SetSponsorshipStatus {
  let setSponsorshipStatusEvent = changetype<SetSponsorshipStatus>(
    newMockEvent()
  )

  setSponsorshipStatusEvent.parameters = new Array()

  setSponsorshipStatusEvent.parameters.push(
    new ethereum.EventParam("sponsor", ethereum.Value.fromAddress(sponsor))
  )
  setSponsorshipStatusEvent.parameters.push(
    new ethereum.EventParam("requester", ethereum.Value.fromAddress(requester))
  )
  setSponsorshipStatusEvent.parameters.push(
    new ethereum.EventParam(
      "sponsorshipStatus",
      ethereum.Value.fromBoolean(sponsorshipStatus)
    )
  )

  return setSponsorshipStatusEvent
}

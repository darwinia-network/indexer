import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address, Bytes } from "@graphprotocol/graph-ts"
import { SignatureSubmittion } from "../generated/schema"
import { SignatureSubmittion as SignatureSubmittionEvent } from "../generated/SubAPISignaturePub/SubAPISignaturePub"
import { handleSignatureSubmittion } from "../src/sub-api-signature-pub"
import { createSignatureSubmittionEvent } from "./sub-api-signature-pub-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let chainId = BigInt.fromI32(234)
    let msgIndex = BigInt.fromI32(234)
    let signer = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let signature = Bytes.fromI32(1234567890)
    let data = Bytes.fromI32(1234567890)
    let newSignatureSubmittionEvent = createSignatureSubmittionEvent(
      chainId,
      msgIndex,
      signer,
      signature,
      data
    )
    handleSignatureSubmittion(newSignatureSubmittionEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("SignatureSubmittion created and stored", () => {
    assert.entityCount("SignatureSubmittion", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "SignatureSubmittion",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "chainId",
      "234"
    )
    assert.fieldEquals(
      "SignatureSubmittion",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "msgIndex",
      "234"
    )
    assert.fieldEquals(
      "SignatureSubmittion",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "signer",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "SignatureSubmittion",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "signature",
      "1234567890"
    )
    assert.fieldEquals(
      "SignatureSubmittion",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "data",
      "1234567890"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})

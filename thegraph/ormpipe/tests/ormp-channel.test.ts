import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Bytes } from "@graphprotocol/graph-ts"
import { MessageAccepted } from "../generated/schema"
import { MessageAccepted as MessageAcceptedEvent } from "../generated/OrmpChannel/OrmpChannel"
import { handleMessageAccepted } from "../src/ormp-channel"
import { createMessageAcceptedEvent } from "./ormp-channel-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let msgHash = Bytes.fromI32(1234567890)
    let root = Bytes.fromI32(1234567890)
    let message = "ethereum.Tuple Not implemented"
    let newMessageAcceptedEvent = createMessageAcceptedEvent(
      msgHash,
      root,
      message
    )
    handleMessageAccepted(newMessageAcceptedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("MessageAccepted created and stored", () => {
    assert.entityCount("MessageAccepted", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "MessageAccepted",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "msgHash",
      "1234567890"
    )
    assert.fieldEquals(
      "MessageAccepted",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "root",
      "1234567890"
    )
    assert.fieldEquals(
      "MessageAccepted",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "message",
      "ethereum.Tuple Not implemented"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})

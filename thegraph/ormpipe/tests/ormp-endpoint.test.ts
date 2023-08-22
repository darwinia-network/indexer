import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, Bytes } from "@graphprotocol/graph-ts"
import { AppConfigUpdated } from "../generated/schema"
import { AppConfigUpdated as AppConfigUpdatedEvent } from "../generated/OrmpEndpoint/OrmpEndpoint"
import { handleAppConfigUpdated } from "../src/ormp-endpoint"
import { createAppConfigUpdatedEvent } from "./ormp-endpoint-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let ua = Address.fromString("0x0000000000000000000000000000000000000001")
    let oracle = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let relayer = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newAppConfigUpdatedEvent = createAppConfigUpdatedEvent(
      ua,
      oracle,
      relayer
    )
    handleAppConfigUpdated(newAppConfigUpdatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("AppConfigUpdated created and stored", () => {
    assert.entityCount("AppConfigUpdated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "AppConfigUpdated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "ua",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "AppConfigUpdated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "oracle",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "AppConfigUpdated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "relayer",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})

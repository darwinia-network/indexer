import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Bytes, Address } from "@graphprotocol/graph-ts"
import { SubapiAddBeacon } from "../generated/schema"
import { AddBeacon as AddBeaconEvent } from "../generated/Subapi/Subapi"
import { handleAddBeacon } from "../src/subapi"
import { createAddBeaconEvent } from "./subapi-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let chainId = BigInt.fromI32(234)
    let beaconId = Bytes.fromI32(1234567890)
    let beacon = "ethereum.Tuple Not implemented"
    let newAddBeaconEvent = createAddBeaconEvent(chainId, beaconId, beacon)
    handleAddBeacon(newAddBeaconEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("AddBeacon created and stored", () => {
    assert.entityCount("AddBeacon", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "AddBeacon",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "chainId",
      "234"
    )
    assert.fieldEquals(
      "AddBeacon",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "beaconId",
      "1234567890"
    )
    assert.fieldEquals(
      "AddBeacon",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "beacon",
      "ethereum.Tuple Not implemented"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
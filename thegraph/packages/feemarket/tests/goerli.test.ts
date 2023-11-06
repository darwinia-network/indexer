import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { GoerliAssigned } from "../generated/schema"
import { GoerliAssigned as GoerliAssignedEvent } from "../generated/Goerli/Goerli"
import { handleGoerliAssigned } from "../src/goerli"
import { createGoerliAssignedEvent } from "./goerli-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let key = BigInt.fromI32(234)
    let timestamp = BigInt.fromI32(234)
    let relayer = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let collateral = BigInt.fromI32(234)
    let fee = BigInt.fromI32(234)
    let newGoerliAssignedEvent = createGoerliAssignedEvent(
      key,
      timestamp,
      relayer,
      collateral,
      fee
    )
    handleGoerliAssigned(newGoerliAssignedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("GoerliAssigned created and stored", () => {
    assert.entityCount("GoerliAssigned", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "GoerliAssigned",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "key",
      "234"
    )
    assert.fieldEquals(
      "GoerliAssigned",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "timestamp",
      "234"
    )
    assert.fieldEquals(
      "GoerliAssigned",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "relayer",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "GoerliAssigned",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "collateral",
      "234"
    )
    assert.fieldEquals(
      "GoerliAssigned",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "fee",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})

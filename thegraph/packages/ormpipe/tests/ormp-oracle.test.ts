import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Bytes, BigInt, Address } from "@graphprotocol/graph-ts"
import { OrmpOracleAssigned } from "../generated/schema"
import { Assigned as AssignedEvent } from "../generated/OrmpOracle/OrmpOracle"
import { handleAssigned } from "../src/ormp-oracle"
import { createAssignedEvent } from "./ormp-oracle-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let msgHash = Bytes.fromI32(1234567890)
    let fee = BigInt.fromI32(234)
    let newAssignedEvent = createAssignedEvent(msgHash, fee)
    handleAssigned(newAssignedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("Assigned created and stored", () => {
    assert.entityCount("Assigned", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "Assigned",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "msgHash",
      "1234567890"
    )
    assert.fieldEquals(
      "Assigned",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "fee",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})

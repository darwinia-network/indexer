import {Chain, FastEvent} from "@darwinia/index-common";
// @ts-ignore
import {CandidateIncludedEvent} from "../../../types";

export const ALLOW_PARA_IDS_MAP = {
  kusama: [
    // crab parachain
    2105,
  ],
  rococo: [
    // pangolin parachain
    2105,
  ]
};

export class CandidateIncludedStorage {
  private readonly chain: Chain;
  private readonly event: FastEvent;

  constructor(chain: Chain, event: FastEvent) {
    this.chain = chain;
    this.event = event;
  }

  public async store() {

    const data = this.event.data;
    const [candidateReceipt, headData, coreIndex, groupIndex] = data;
    const {descriptor} = candidateReceipt.toJSON() as unknown as CandidateReceipt;
    const chainAllowedParaIds = ALLOW_PARA_IDS_MAP[this.chain.toString()];
    if (chainAllowedParaIds.indexOf(descriptor.paraId) < 0) {
      return;
    }

    const eventId = this.event.id;
    const blockNumber = this.event.blockNumber;

    const _event = new CandidateIncludedEvent(eventId);
    _event.includedRelayBlock = blockNumber;
    _event.paraId = descriptor.paraId;
    _event.paraHead = descriptor.paraHead;
    _event.relayParent = descriptor.relayParent;
    _event.signature = descriptor.signature;

    _event.timestamp = this.event.timestamp;
    await _event.save();
  }
}

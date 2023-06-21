/**
 * store need relay block
 */
import {FastBlock, FastEvent} from "@darwinia/index-common";
import {BridgeS2SOnDemandType, BridgeS2SRelayBlockOrigin, BridgeS2SRelayBlockType} from "./types";
// @ts-ignore
import {JustificationMapping, NeedRelayBlock} from "../../../types";
import {Justifications, FixedU64} from "@polkadot/types/interfaces/runtime/types";

export class NeedRelayBlockStorage {
  private readonly event: FastEvent;
  private readonly origin: BridgeS2SRelayBlockOrigin;
  private readonly onDemandType?: BridgeS2SOnDemandType;
  private readonly additional?: string;

  constructor(event: FastEvent, origin: BridgeS2SRelayBlockOrigin, options?: {
    onDemandType?: BridgeS2SOnDemandType,
    additional?: string,
  }) {
    this.event = event;
    this.origin = origin;
    this.onDemandType = options?.onDemandType;
    this.additional = options?.additional;
  }

  public async store() {
    const _event = new NeedRelayBlock(this.event.id);
    _event.blockNumber = this.event.blockNumber;
    _event.blockHash = this.event.blockHash;
    _event.type = this.origin == BridgeS2SRelayBlockOrigin.Mandatory ? BridgeS2SRelayBlockType.Mandatory : BridgeS2SRelayBlockType.OnDemand;
    _event.origin = this.origin;
    _event.onDemandType = this.onDemandType;
    _event.additional = this.additional;

    const block = new FastBlock(this.event.block);
    const header = block.raw.block.header;
    _event.parentHash = header.parentHash.toString();
    _event.stateRoot = header.stateRoot.toString();
    _event.extrinsicsRoot = header.extrinsicsRoot.toString();
    _event.digest = header.digest.toHex();


    if (_event.type == BridgeS2SRelayBlockType.OnDemand && this.onDemandType == BridgeS2SOnDemandType.SendMessage) {
      const data = this.event.data;
      const [laneId, messageNonce] = data as unknown as [string, FixedU64];
      _event.laneId = laneId.toString().replace('0x', '');
      _event.messageNonce = messageNonce.toNumber();
    }
    if (_event.type == BridgeS2SRelayBlockType.OnDemand && this.onDemandType == BridgeS2SOnDemandType.Dispatch) {
      const data = this.event.data;
      const [chainId, bridgeMessageIdOf] = data as unknown as [string, any];
      const [laneId, messageNonce] = bridgeMessageIdOf as unknown as [string, FixedU64];
      _event.laneId = laneId.toString().replace('0x', '');
      _event.messageNonce = messageNonce.toNumber();
    }
    if (_event.type == BridgeS2SRelayBlockType.Mandatory) {
      let justificationMapping = await JustificationMapping.get(block.number.toString());
      if (!justificationMapping) {
        await new JustificationStorage(block).store();
        justificationMapping = await JustificationMapping.get(block.number.toString());
      }
      justificationMapping.mandatory = true;
      await justificationMapping.save();
    }

    _event.timestamp = this.event.timestamp;
    await _event.save();
  }

}

export class JustificationStorage {
  private block: FastBlock;

  constructor(block: FastBlock) {
    this.block = block;
  }

  public async store() {
    const rawBlock = this.block.raw;
    if (rawBlock.justifications.isNone) {
      return;
    }
    const justifications = rawBlock.justifications.value as unknown as Justifications;

    for (const justification of justifications) {
      const [consensusEngineId, encodedJustification] = justification;
      if (!consensusEngineId.isGrandpa) continue;

      const _justification = new JustificationMapping(this.block.number.toString());
      _justification.blockNumber = this.block.number;
      _justification.blockHash = this.block.hash;
      _justification.mandatory = false;
      _justification.justification = encodedJustification.toString();
      await _justification.save();
      break;
    }

  }
}

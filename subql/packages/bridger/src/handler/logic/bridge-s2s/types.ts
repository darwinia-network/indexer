/**
 * bridge s2s handler
 */
import {FastEvent} from "@darwinia/index-common";

export interface BridgeS2SEventHandler {
  handle(event: FastEvent, section: string, method: string): Promise<void>;
}

/**
 * Bridge s2s relay block type
 */
export enum BridgeS2SRelayBlockType {
  Mandatory = 'mandatory',
  OnDemand = 'on-demand',
}

/**
 * Bridge s2s on-demand type
 */
export enum BridgeS2SOnDemandType {
  SendMessage = 'send-message',
  Dispatch = 'dispatch',
}


/**
 * Bridge s2s relay block origin,
 * the filed means bridged target chain or mandatory
 */
export enum BridgeS2SRelayBlockOrigin {
  Mandatory = 'mandatory',
  BridgeCrabParachain = 'bridge-crab-parachain',
  BridgeDarwinia = 'bridge-darwinia',
  BridgeCrab = 'bridge-crab',
  BridgePangolin = 'bridge-pangolin',
  BridgePangoro = 'bridge-pangoro',
  BridgePangolinParachain = 'bridge-pangolin-parachain',
}

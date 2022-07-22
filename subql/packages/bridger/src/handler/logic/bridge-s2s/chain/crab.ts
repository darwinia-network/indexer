import {BridgeS2SEventHandler, BridgeS2SOnDemandType, BridgeS2SRelayBlockOrigin} from "../types";
import {NeedRelayBlockStorage} from "../storage";
import {FastEvent} from "index-common";

export class ChainCrabEventHandler implements BridgeS2SEventHandler {
  async handle(event: FastEvent, section: string, method: string): Promise<void> {
    const eventKey = `${section}:${method}`;
    switch (eventKey) {
      case 'grandpa:NewAuthorities': {
        await new NeedRelayBlockStorage(event, BridgeS2SRelayBlockOrigin.Mandatory).store();
        return;
      }
      case 'bridgeDarwiniaMessages:MessageAccepted': {
        await new NeedRelayBlockStorage(event, BridgeS2SRelayBlockOrigin.BridgeDarwinia, {
          onDemandType: BridgeS2SOnDemandType.SendMessage,
        }).store();
        return;
      }
      case 'bridgeCrabParachainMessages:MessageAccepted': {
        await new NeedRelayBlockStorage(event, BridgeS2SRelayBlockOrigin.BridgeCrabParachain, {
          onDemandType: BridgeS2SOnDemandType.SendMessage,
        }).store();
        return;
      }
    }

    // dispatch
    if (section === 'bridgeDarwiniaDispatch') {
      await new NeedRelayBlockStorage(event, BridgeS2SRelayBlockOrigin.BridgeDarwinia, {
        onDemandType: BridgeS2SOnDemandType.Dispatch,
        additional: method,
      }).store();
      return;
    }
    if (section === 'bridgeCrabParachainDispatch') {
      await new NeedRelayBlockStorage(event, BridgeS2SRelayBlockOrigin.BridgeCrabParachain, {
        onDemandType: BridgeS2SOnDemandType.Dispatch,
        additional: method,
      }).store();
      return;
    }
  }
}



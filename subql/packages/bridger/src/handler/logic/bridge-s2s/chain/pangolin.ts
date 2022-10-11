import {BridgeS2SEventHandler, BridgeS2SOnDemandType, BridgeS2SRelayBlockOrigin} from "../types";
import {NeedRelayBlockStorage} from "../storage";
import {FastEvent} from "@darwinia/index-common";

export class ChainPangolinEventHandler implements BridgeS2SEventHandler {
  async handle(event: FastEvent, section: string, method: string): Promise<void> {
    const eventKey = `${section}:${method}`;
    switch (eventKey) {
      case 'grandpa:NewAuthorities': {
        await new NeedRelayBlockStorage(event, BridgeS2SRelayBlockOrigin.Mandatory).store();
        return;
      }
      case 'bridgePangoroMessages:MessageAccepted': {
        await new NeedRelayBlockStorage(event, BridgeS2SRelayBlockOrigin.BridgePangoro, {
          onDemandType: BridgeS2SOnDemandType.SendMessage,
        }).store();
        return;
      }
      case 'bridgePangolinParachainMessages:MessageAccepted': {
        await new NeedRelayBlockStorage(event, BridgeS2SRelayBlockOrigin.BridgePangolinParachain, {
          onDemandType: BridgeS2SOnDemandType.SendMessage,
        }).store();
        return;
      }
      case 'bridgePangolinParachainAlphaMessages:MessageAccepted': {
        await new NeedRelayBlockStorage(event, BridgeS2SRelayBlockOrigin.BridgePangolinParachainAlpha, {
          onDemandType: BridgeS2SOnDemandType.SendMessage,
        }).store();
        return;
      }
    }

    // dispatch
    if (section === 'bridgePangoroDispatch') {
      await new NeedRelayBlockStorage(event, BridgeS2SRelayBlockOrigin.BridgePangoro, {
        onDemandType: BridgeS2SOnDemandType.Dispatch,
        additional: method,
      }).store();
      return;
    }
    if (section === 'bridgePangolinParachainDispatch') {
      await new NeedRelayBlockStorage(event, BridgeS2SRelayBlockOrigin.BridgePangolinParachain, {
        onDemandType: BridgeS2SOnDemandType.Dispatch,
        additional: method,
      }).store();
      return;
    }
    if (section === 'bridgePangolinParachainAlphaDispatch') {
      await new NeedRelayBlockStorage(event, BridgeS2SRelayBlockOrigin.BridgePangolinParachainAlpha, {
        onDemandType: BridgeS2SOnDemandType.Dispatch,
        additional: method,
      }).store();
      return;
    }
  }
}



import {BridgeS2SEventHandler, BridgeS2SOnDemandType, BridgeS2SRelayBlockOrigin} from "../types";
import {FastEvent} from "../../../../common";
import {NeedRelayBlockStorage} from "../storage";

export class ChainPangoroEventHandler implements BridgeS2SEventHandler {
  async handle(event: FastEvent, section: string, method: string): Promise<void> {
    const eventKey = `${section}:${method}`;
    switch (eventKey) {
      case 'grandpa:NewAuthorities': {
        await new NeedRelayBlockStorage(event, BridgeS2SRelayBlockOrigin.Mandatory).store();
        return;
      }
      case 'bridgePangolinMessages:MessageAccepted': {
        await new NeedRelayBlockStorage(event, BridgeS2SRelayBlockOrigin.BridgePangolin, {
          onDemandType: BridgeS2SOnDemandType.SendMessage,
        }).store();
        return;
      }
    }

    // dispatch
    if (section === 'bridgePangolinDispatch') {
      await new NeedRelayBlockStorage(event, BridgeS2SRelayBlockOrigin.BridgePangolin, {
        onDemandType: BridgeS2SOnDemandType.Dispatch,
        additional: method,
      }).store();
      return;
    }
  }
}

import {BridgeS2SEventHandler, BridgeS2SOnDemandType, BridgeS2SRelayBlockOrigin} from "../types";
import {FastEvent} from "index-common";
import {NeedRelayBlockStorage} from "../storage";

export class ChainPangolinParachainEventHandler implements BridgeS2SEventHandler {
  async handle(event: FastEvent, section: string, method: string): Promise<void> {
    const eventKey = `${section}:${method}`;
    switch (eventKey) {
      case 'bridgePangolinMessages:MessageAccepted': {
        await new NeedRelayBlockStorage(event, BridgeS2SRelayBlockOrigin.BridgePangolin, {
          onDemandType: BridgeS2SOnDemandType.SendMessage,
          additional: method,
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

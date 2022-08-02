import {BridgeS2SEventHandler, BridgeS2SOnDemandType, BridgeS2SRelayBlockOrigin} from "../types";
import {FastEvent} from "@darwinia/index-common";
import {NeedRelayBlockStorage} from "../storage";

export class ChainCrabParachainEventHandler implements BridgeS2SEventHandler {
  async handle(event: FastEvent, section: string, method: string): Promise<void> {
    const eventKey = `${section}:${method}`;
    switch (eventKey) {
      case 'bridgeCrabMessages:MessageAccepted': {
        await new NeedRelayBlockStorage(event, BridgeS2SRelayBlockOrigin.BridgeCrab, {
          onDemandType: BridgeS2SOnDemandType.SendMessage,
          additional: method,
        }).store();
        return;
      }
    }

    // dispatch
    if (section === 'bridgeCrabDispatch') {
      await new NeedRelayBlockStorage(event, BridgeS2SRelayBlockOrigin.BridgeCrab, {
        onDemandType: BridgeS2SOnDemandType.Dispatch,
        additional: method,
      }).store();
      return;
    }
  }
}

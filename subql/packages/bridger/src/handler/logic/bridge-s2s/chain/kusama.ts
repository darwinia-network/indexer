import {BridgeS2SEventHandler, BridgeS2SOnDemandType, BridgeS2SRelayBlockOrigin} from "../types";
import {FastEvent} from "index-common";
import {NeedRelayBlockStorage} from "../storage";

export class ChainKusamaEventHandler implements BridgeS2SEventHandler {
  async handle(event: FastEvent, section: string, method: string): Promise<void> {
    const eventKey = `${section}:${method}`;
    switch (eventKey) {
      case 'grandpa:NewAuthorities': {
        await new NeedRelayBlockStorage(event, BridgeS2SRelayBlockOrigin.Mandatory).store();
        return;
      }
    }
  }
}

import {BasicChainHandler} from "./basic";
import {Chain, IndexHandler} from "index-common";
import {MMRHandler} from "../logic/mmr";
import {GenericBlockHandler} from "../logic/block";


export class DarwiniaHandler extends BasicChainHandler {
  constructor() {
    super('darwinia');
  }

  handlers(): Array<IndexHandler> {
    return [
      new GenericBlockHandler(Chain.Darwinia),
      new MMRHandler(Chain.Darwinia),
    ];
  }
}

export class PangolinHandler extends BasicChainHandler {
  constructor() {
    super('pangolin');
  }

  handlers(): Array<IndexHandler> {
    return [
      new GenericBlockHandler(Chain.Pangolin),
      new MMRHandler(Chain.Pangolin),
    ];
  }
}

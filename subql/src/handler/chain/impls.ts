import {BasicChainHandler} from "./basic";
import {Chain, IndexHandler} from "../../common";
import {BridgeS2SHandler} from "../logic/bridge-s2s";
import {MMRHandler} from "../logic/mmr";


export class CrabHandler extends BasicChainHandler {
  constructor() {
    super('crab');
  }

  handlers(): Array<IndexHandler> {
    return [
      new BridgeS2SHandler(Chain.Crab),
    ];
  }
}

export class CrabParachainHandler extends BasicChainHandler {
  constructor() {
    super('crab-parachain');
  }

  handlers(): Array<IndexHandler> {
    return [
      new BridgeS2SHandler(Chain.CrabParachain),
    ];
  }
}

export class DarwiniaHandler extends BasicChainHandler {
  constructor() {
    super('darwinia');
  }

  handlers(): Array<IndexHandler> {
    return [
      new BridgeS2SHandler(Chain.Darwinia),
      new MMRHandler(Chain.Darwinia),
    ];
  }
}

export class KusamaHandler extends BasicChainHandler {
  constructor() {
    super('kusama');
  }

  handlers(): Array<IndexHandler> {
    return [
      new BridgeS2SHandler(Chain.Kusama),
    ];
  }
}

export class PangolinHandler extends BasicChainHandler {
  constructor() {
    super('pangolin');
  }

  handlers(): Array<IndexHandler> {
    return [
      new BridgeS2SHandler(Chain.Pangolin),
      new MMRHandler(Chain.Darwinia),
    ];
  }
}

export class PangolinParachainHandler extends BasicChainHandler {
  constructor() {
    super('pangolin-parachain');
  }

  handlers(): Array<IndexHandler> {
    return [
      new BridgeS2SHandler(Chain.PangolinParachain),
    ];
  }
}

export class PangoroHandler extends BasicChainHandler {
  constructor() {
    super('pangoro');
  }

  handlers(): Array<IndexHandler> {
    return [
      new BridgeS2SHandler(Chain.Pangoro),
    ];
  }
}

export class RococoHandler extends BasicChainHandler {
  constructor() {
    super('rococo');
  }

  handlers(): Array<IndexHandler> {
    return [
      new BridgeS2SHandler(Chain.Rococo),
    ];
  }
}

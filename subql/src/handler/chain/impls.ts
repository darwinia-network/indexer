import {BasicChainHandler} from "./basic";
import {Chain, IndexHandler} from "../../common";
import {BridgeS2SHandler} from "../logic/bridge-s2s";
import {MMRHandler} from "../logic/mmr";
import {GenericBlockHandler} from "../logic/block";
import {CandidateIncludedHandler} from "../logic/candidate-included";
import {BridgeEthV1Handler} from "../logic/bridge-ethv1";


export class CrabHandler extends BasicChainHandler {
  constructor() {
    super('crab');
  }

  handlers(): Array<IndexHandler> {
    return [
      new GenericBlockHandler(Chain.Crab),
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
      new GenericBlockHandler(Chain.CrabParachain),
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
      new GenericBlockHandler(Chain.Darwinia),
      new BridgeS2SHandler(Chain.Darwinia),
      new MMRHandler(Chain.Darwinia),
      new BridgeEthV1Handler(Chain.Darwinia),
    ];
  }
}

export class KusamaHandler extends BasicChainHandler {
  constructor() {
    super('kusama');
  }

  handlers(): Array<IndexHandler> {
    return [
      new GenericBlockHandler(Chain.Kusama),
      new BridgeS2SHandler(Chain.Kusama),
      new CandidateIncludedHandler(Chain.Kusama),
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
      new BridgeS2SHandler(Chain.Pangolin),
      new MMRHandler(Chain.Pangolin),
      new BridgeEthV1Handler(Chain.Pangolin),
    ];
  }
}

export class PangolinParachainHandler extends BasicChainHandler {
  constructor() {
    super('pangolin-parachain');
  }

  handlers(): Array<IndexHandler> {
    return [
      new GenericBlockHandler(Chain.PangolinParachain),
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
      new GenericBlockHandler(Chain.Pangoro),
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
      new GenericBlockHandler(Chain.Rococo),
      new BridgeS2SHandler(Chain.Rococo),
      new CandidateIncludedHandler(Chain.Rococo),
    ];
  }
}

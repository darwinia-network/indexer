import {BasicChainHandler} from "./basic";
import {Chain, IndexHandler} from "@darwinia/index-common";
import {BridgeS2SHandler} from "../logic/bridge-s2s";
import {GenericBlockHandler} from "../logic/block";
import {CandidateIncludedHandler} from "../logic/candidate-included";
import {BridgeEthV1Handler} from "../logic/bridge-ethv1";
import {BridgeEthV2Handler} from "../logic/bridge-ethv2";


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
      new BridgeEthV1Handler(Chain.Darwinia),
      new BridgeEthV2Handler(Chain.Darwinia)
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
      new BridgeEthV1Handler(Chain.Pangoro),
      new BridgeEthV2Handler(Chain.Pangoro),
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


// ############ dev


export class DevPangolinHandler extends BasicChainHandler {
  constructor() {
    super('dev-pangolin');
  }

  handlers(): Array<IndexHandler> {
    return [
      new GenericBlockHandler(Chain.DevPangolin),
      new BridgeS2SHandler(Chain.DevPangolin),
      new BridgeEthV1Handler(Chain.DevPangolin),
    ];
  }
}

export class DevPangolinParachainHandler extends BasicChainHandler {
  constructor() {
    super('dev-pangolin-parachain');
  }

  handlers(): Array<IndexHandler> {
    return [
      new GenericBlockHandler(Chain.DevPangolinParachain),
      new BridgeS2SHandler(Chain.DevPangolinParachain),
    ];
  }
}

export class DevRococoHandler extends BasicChainHandler {
  constructor() {
    super('dev-rococo');
  }

  handlers(): Array<IndexHandler> {
    return [
      new GenericBlockHandler(Chain.DevRococo),
      new BridgeS2SHandler(Chain.DevRococo),
      new CandidateIncludedHandler(Chain.DevRococo),
    ];
  }
}

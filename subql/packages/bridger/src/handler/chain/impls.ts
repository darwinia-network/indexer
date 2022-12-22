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

export class MoonbaseHandler extends BasicChainHandler {
  constructor() {
    super('moonbase');
  }

  handlers(): Array<IndexHandler> {
    return [
      new GenericBlockHandler(Chain.Moonbase),
      new BridgeS2SHandler(Chain.Moonbase),
      new CandidateIncludedHandler(Chain.Moonbase),
    ];
  }
}

export class PangolinParachainAlphaHandler extends BasicChainHandler {
  constructor() {
    super('pangolin-parachainalpha');
  }

  handlers(): Array<IndexHandler> {
    return [
      new GenericBlockHandler(Chain.PangolinParachainAlpha),
      new BridgeS2SHandler(Chain.PangolinParachainAlpha),
    ];
  }
}


// ############ dev


export class DevDarwiniaHandler extends BasicChainHandler {
  constructor() {
    super('dev-darwinia');
  }

  handlers(): Array<IndexHandler> {
    return [
      new GenericBlockHandler(Chain.DevDarwinia),
      new BridgeS2SHandler(Chain.DevDarwinia),
      new BridgeEthV1Handler(Chain.DevDarwinia),
    ];
  }
}

export class DevCrabHandler extends BasicChainHandler {
  constructor() {
    super('dev-crab');
  }

  handlers(): Array<IndexHandler> {
    return [
      new GenericBlockHandler(Chain.DevCrab),
      new BridgeS2SHandler(Chain.DevCrab),
    ];
  }
}

export class DevKusamaHandler extends BasicChainHandler {
  constructor() {
    super('dev-kusama');
  }

  handlers(): Array<IndexHandler> {
    return [
      new GenericBlockHandler(Chain.DevKusama),
      new BridgeS2SHandler(Chain.DevKusama),
      new CandidateIncludedHandler(Chain.DevKusama),
    ];
  }
}

export class DevPolkadotHandler extends BasicChainHandler {
  constructor() {
    super('dev-polkadot');
  }

  handlers(): Array<IndexHandler> {
    return [
      new GenericBlockHandler(Chain.DevPolkadot),
      new BridgeS2SHandler(Chain.DevPolkadot),
      new CandidateIncludedHandler(Chain.DevPolkadot),
    ];
  }
}

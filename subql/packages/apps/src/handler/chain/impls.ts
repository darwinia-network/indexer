import {BasicChainHandler} from "./basic";
import {Chain, IndexHandler} from "@darwinia/index-common";
import {GenericBlockHandler} from "../logic/block";


export class CrabHandler extends BasicChainHandler {
  constructor() {
    super('crab');
  }

  handlers(): Array<IndexHandler> {
    return [
      new GenericBlockHandler(Chain.Crab),
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
    ];
  }
}

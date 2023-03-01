import {BasicChainHandler} from "./basic";
import {Chain, IndexHandler} from "@darwinia/index-common";
import {GenericBlockHandler} from "../logic/block";
import {GenericStakingHandler} from "../logic/staking";
import {GenericFeeMarketHandler} from "../logic/feemarket";
import {GenericAccountMigrationHandler} from "../logic/account-migration";


export class CrabHandler extends BasicChainHandler {
  constructor() {
    super('crab');
  }

  handlers(): Array<IndexHandler> {
    return [
      new GenericBlockHandler(Chain.Crab),
      new GenericStakingHandler(Chain.Crab),
      new GenericFeeMarketHandler(Chain.Crab),
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
      new GenericStakingHandler(Chain.CrabParachain),
      new GenericFeeMarketHandler(Chain.CrabParachain),
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
      new GenericStakingHandler(Chain.Darwinia),
      new GenericFeeMarketHandler(Chain.Darwinia),
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
      new GenericStakingHandler(Chain.Pangolin),
      new GenericFeeMarketHandler(Chain.Pangolin),
      new GenericAccountMigrationHandler(Chain.Pangolin),
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
      new GenericStakingHandler(Chain.Pangoro),
      new GenericFeeMarketHandler(Chain.Pangoro),
      new GenericAccountMigrationHandler(Chain.Pangoro),
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

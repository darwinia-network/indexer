import {SubstrateExtrinsic} from "@subql/types";

export class FastExtrinsic {
  private readonly ext: SubstrateExtrinsic;

  constructor(extrinsic: SubstrateExtrinsic) {
    this.ext = extrinsic;
  }

  get block() {
    return this.ext.block
  }

  get idx() {
    return this.ext.idx;
  }

  get extrinsic() {
    return this.ext.extrinsic;
  }

  get events() {
    return this.ext.events;
  }

  get success() {
    return this.ext.success;
  }

}

import {SubstrateBlock} from "@subql/types";

export class FastBlock {
  private readonly block: SubstrateBlock;

  constructor(block: SubstrateBlock) {
    this.block = block;
  }

  get raw() {
    return this.block;
  }

  get number() {
    return this.block.block.header.number.toNumber() || Number(0);
  }

  get hash() {
    return this.block.block.hash.toString();
  }

  get specVersion() {
    return this.block.specVersion;
  }

  get parentHash() {
    return this.block.block.header.parentHash.toString();
  }
}
